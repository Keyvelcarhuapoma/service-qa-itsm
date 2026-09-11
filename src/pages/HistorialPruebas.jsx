import React, { useState, useEffect } from 'react';
import { ShieldCheck, Download, Printer, Activity, CheckCircle, AlertCircle, Clock, Search, Calendar, Filter, ChevronLeft, ChevronRight, Lock, RefreshCw, Loader } from 'lucide-react';
import { supabase } from '../supabaseClient';
import './HistorialPruebas.css';

const HistorialPruebas = () => {
  const [validaciones, setValidaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchValidaciones = async () => {
    setLoading(true);
    // Fetch validaciones e incluir los datos del servicio relacionado
    const { data, error } = await supabase
      .from('validaciones')
      .select(`
        *,
        servicios (
          nombre,
          tipo
        )
      `)
      .order('fecha_ejecucion', { ascending: false });

    if (error) {
      console.error('Error fetching data:', error);
    } else {
      setValidaciones(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchValidaciones();
  }, []);

  // Calcular KPIs
  const total = validaciones.length;
  const aprobadas = validaciones.filter(v => v.dictamen.toLowerCase() === 'aprobado').length;
  const fallidas = validaciones.filter(v => v.dictamen.toLowerCase() === 'rechazado').length;
  const pendientes = validaciones.filter(v => v.dictamen.toLowerCase() === 'pendiente').length;
  const exitoGlobal = total > 0 ? Math.round((aprobadas / total) * 100) : 0;

  const exportToCSV = () => {
    if (validaciones.length === 0) {
      alert("No hay datos para exportar");
      return;
    }
    
    const headers = ['ID_PRUEBA', 'SERVICIO', 'TIPO_SERVICIO', 'TIPO_PRUEBA', 'DICTAMEN', 'LATENCIA_MS', 'FECHA'];
    const rows = validaciones.map(v => [
      `VAL-${v.id}`,
      `"${v.servicios?.nombre || v.servicio_id}"`,
      v.servicios?.tipo || 'N/A',
      v.tipo_prueba,
      v.dictamen,
      v.latencia_ms || '',
      `"${new Date(v.fecha_ejecucion).toLocaleString()}"`
    ]);
    
    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `auditoria_itsm_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="historial-page">
      <div className="historial-header">
        <div>
          <div className="badge badge-info" style={{marginBottom: '1rem', backgroundColor: 'transparent', border: '1px solid var(--primary)', color: 'var(--primary)', padding: '0.2rem 0.5rem'}}><ShieldCheck size={14}/> AUDITORÍA OPERACIONAL ITIL V4</div>
          <h1 style={{fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem'}}>Historial de Validaciones de Servicios</h1>
          <p style={{color: 'var(--text-muted)', fontSize: '0.875rem', maxWidth: '800px'}}>Registro histórico y auditoría completa de todas las pruebas ejecutadas en el ciclo de vida de los servicios TI. Evidencias forenses, trazabilidad técnica y métricas de cumplimiento de SLA.</p>
        </div>
        <div className="historial-header-actions">
          <button className="btn btn-secondary" onClick={fetchValidaciones}><RefreshCw size={16} /> Refrescar</button>
          <button className="btn btn-secondary" onClick={exportToCSV}><Download size={16} /> Exportar CSV</button>
        </div>
      </div>

      <div className="summary-cards">
        <div className="summary-card">
          <div className="summary-content">
            <span className="summary-title">TOTAL EJECUCIONES</span>
            <span className="summary-value">{loading ? '...' : total}</span>
            <span className="summary-subtext">Histórico Global</span>
          </div>
          <div className="summary-icon-box info"><Activity size={24} /></div>
        </div>
        
        <div className="summary-card">
          <div className="summary-content">
            <span className="summary-title">PRUEBAS APROBADAS</span>
            <span className="summary-value">{loading ? '...' : aprobadas}</span>
            <span className="summary-subtext success">{exitoGlobal}% de éxito global</span>
          </div>
          <div className="summary-icon-box success"><CheckCircle size={24} /></div>
        </div>

        <div className="summary-card">
          <div className="summary-content">
            <span className="summary-title">FALLOS CRÍTICOS</span>
            <span className="summary-value" style={{color: 'var(--danger)'}}>{loading ? '...' : fallidas}</span>
            <span className="summary-subtext danger">Requiere atención</span>
          </div>
          <div className="summary-icon-box danger"><AlertCircle size={24} /></div>
        </div>

        <div className="summary-card">
          <div className="summary-content">
            <span className="summary-title">T. MEDIO VALIDACIÓN</span>
            <span className="summary-value">22 min</span>
            <span className="summary-subtext" style={{color: 'var(--primary)', fontWeight: 600}}>-4 min vs benchmark</span>
          </div>
          <div className="summary-icon-box neutral"><Clock size={24} /></div>
        </div>
      </div>

      <div className="table-container">
        <div className="filters-bar">
          <div className="filter-search">
            <Search size={18} color="var(--text-muted)" />
            <input type="text" placeholder="Buscar por ID de prueba, servicio, validador..." />
          </div>
          <select className="filter-select" style={{width: '200px'}}>
            <option>Todos los servicios</option>
          </select>
          <select className="filter-select" style={{width: '180px'}}>
            <option>Todos los tipos</option>
          </select>
        </div>

        <div className="quick-filters">
          <div className="qf-item active">Todos <span className="qf-count">{total}</span></div>
          <div className="qf-item"><span className="status-dot-small" style={{backgroundColor: 'var(--success)'}}></span> Aprobados <span className="qf-count">{aprobadas}</span></div>
          <div className="qf-item"><span className="status-dot-small" style={{backgroundColor: 'var(--danger)'}}></span> Rechazados <span className="qf-count">{fallidas}</span></div>
          <div className="qf-item"><span className="status-dot-small" style={{backgroundColor: 'var(--warning)'}}></span> Pendientes <span className="qf-count">{pendientes}</span></div>
        </div>

        {loading ? (
          <div style={{padding: '3rem', textAlign: 'center', color: 'var(--text-muted)'}}>
            <Loader size={32} className="spinner" style={{marginBottom: '1rem', color: 'var(--primary)'}} />
            <p>Cargando registros desde Supabase...</p>
          </div>
        ) : (
          <table className="history-data-table">
            <thead>
              <tr>
                <th>ID PRUEBA</th>
                <th>SERVICIO TI</th>
                <th>TIPO</th>
                <th>FECHA DE EJECUCIÓN</th>
                <th>LATENCIA REAL</th>
                <th>ESTADO</th>
                <th>OBSERVACIONES</th>
              </tr>
            </thead>
            <tbody>
              {validaciones.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{textAlign: 'center', padding: '2rem'}}>No hay validaciones registradas aún.</td>
                </tr>
              ) : (
                validaciones.map((val) => (
                  <tr key={val.id}>
                    <td className="id-cell">#VAL-{val.id}</td>
                    <td>{val.servicios?.nombre || val.servicio_id} <span className="type-badge" style={{fontSize: '0.65rem'}}>{val.servicios?.tipo || 'N/A'}</span></td>
                    <td><span className="badge" style={{backgroundColor: '#e0e7ff', color: '#4f46e5'}}>{val.tipo_prueba}</span></td>
                    <td>{new Date(val.fecha_ejecucion).toLocaleString()}</td>
                    <td>
                      <div className="real" style={{color: val.latencia_ms < 200 ? 'var(--success)' : 'var(--danger)'}}>
                        {val.latencia_ms ? `${val.latencia_ms} ms` : 'N/A'}
                      </div>
                    </td>
                    <td>
                      {val.dictamen.toLowerCase() === 'aprobado' && <span className="badge badge-success" style={{backgroundColor: 'transparent', border: '1px solid var(--success)'}}><CheckCircle size={12}/> Aprobado</span>}
                      {val.dictamen.toLowerCase() === 'rechazado' && <span className="badge badge-danger" style={{backgroundColor: 'transparent', border: '1px solid var(--danger)'}}><AlertCircle size={12}/> Rechazado</span>}
                      {val.dictamen.toLowerCase() === 'pendiente' && <span className="badge badge-warning" style={{backgroundColor: 'transparent', border: '1px solid var(--warning)'}}><Clock size={12}/> Pendiente</span>}
                    </td>
                    <td className="obs-text" title={val.observaciones}>{val.observaciones?.substring(0, 40)}...</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}

        <div className="pagination-area">
          <div>Mostrando <b>{validaciones.length}</b> registros <span style={{marginLeft: '1rem'}}>Filas: </span><select style={{padding: '0.2rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', outline: 'none'}}><option>10</option></select></div>
        </div>
      </div>
    </div>
  );
};

export default HistorialPruebas;
