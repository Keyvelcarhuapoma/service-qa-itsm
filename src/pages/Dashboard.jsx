import React, { useState, useEffect } from 'react';
import { Play, Plus, Network, CheckCircle, AlertCircle, Clock, Timer, Search, Download, Activity, Loader } from 'lucide-react';
import { supabase } from '../supabaseClient';
import './Dashboard.css';

const Dashboard = () => {
  const [servicios, setServicios] = useState([]);
  const [validaciones, setValidaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [srvRes, valRes] = await Promise.all([
        supabase.from('servicios').select('*'),
        supabase.from('validaciones').select('*').order('fecha_ejecucion', { ascending: false })
      ]);

      if (srvRes.data) setServicios(srvRes.data);
      if (valRes.data) setValidaciones(valRes.data);
      setLoading(false);
    };
    fetchData();
  }, []);

  // Calcular métricas
  const totalServicios = servicios.length;
  const totalValidaciones = validaciones.length;
  const aprobadas = validaciones.filter(v => v.dictamen.toLowerCase() === 'aprobado').length;
  const fallidas = validaciones.filter(v => v.dictamen.toLowerCase() === 'rechazado').length;
  const pendientes = validaciones.filter(v => v.dictamen.toLowerCase() === 'pendiente').length;
  
  const porcentajeAprobadas = totalValidaciones > 0 ? ((aprobadas / totalValidaciones) * 100).toFixed(1) : 0;
  
  // Calcular latencia media
  const latencias = validaciones.map(v => v.latencia_ms).filter(Boolean);
  const latenciaMedia = latencias.length > 0 
    ? Math.round(latencias.reduce((a, b) => a + b, 0) / latencias.length) 
    : 0;

  // Unir servicio con su última validación para el inventario
  const inventario = servicios.map(srv => {
    const srvVals = validaciones.filter(v => v.servicio_id === srv.id);
    const ultimaVal = srvVals.length > 0 ? srvVals[0] : null;
    return {
      ...srv,
      ultimaVal
    };
  });

  return (
    <div className="dashboard-container">
      {/* Header Area */}
      <div className="dashboard-header">
        <div className="dashboard-title-area">
          <div className="eyebrow">
            CENTRO DE OPERACIONES ITSM
            <span className="status-dot-small"></span>
            <span className="cluster-status">CLUSTER-PROD-01: OK</span>
          </div>
          <h1>Validación y Salud de Servicios</h1>
          <p>Monitorización continua de disponibilidad, transaccionalidad y cumplimiento de SLAs de infraestructura corporativa en tiempo real.</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary">
            <Play size={16} fill="currentColor" /> Ejecutar Validación
          </button>
          <button className="btn btn-primary">
            <Plus size={16} /> Registrar Nuevo Servicio
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="card stat-card">
          <div className="stat-card-header">
            <span className="stat-title">Servicios Activos</span>
            <div className="stat-icon"><Network size={18} /></div>
          </div>
          <div className="stat-value">{loading ? '...' : totalServicios} <span style={{fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '500'}}>registrados</span></div>
          <div className="stat-subtext">
            <span className="status-dot-small"></span> Catálogo TI en Supabase
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-card-header">
            <span className="stat-title">Pruebas Aprobadas</span>
            <div className="stat-icon"><CheckCircle size={18} /></div>
          </div>
          <div className="stat-value">{loading ? '...' : `${porcentajeAprobadas}%`}</div>
          <div className="stat-subtext">
            <span className="status-dot-small"></span> {aprobadas} asserts exitosos
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-card-header">
            <span className="stat-title">Pruebas Fallidas</span>
            <div className="stat-icon danger"><AlertCircle size={18} /></div>
          </div>
          <div className="stat-value" style={{color: 'var(--danger)'}}>{loading ? '...' : fallidas} <span className="badge badge-danger">Críticas</span></div>
          <div className="stat-subtext" style={{color: 'var(--danger)'}}>
            ⚠ {fallidas > 0 ? 'Incidencias detectadas' : 'Sin incidencias'}
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-card-header">
            <span className="stat-title">Pruebas Pendientes</span>
            <div className="stat-icon" style={{backgroundColor: '#f3f4f6', color: '#6b7280'}}><Clock size={18} /></div>
          </div>
          <div className="stat-value">{loading ? '...' : pendientes} <span style={{fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '500'}}>en cola QA</span></div>
          <div className="stat-subtext">
            <span className="status-dot-small" style={{backgroundColor: '#9ca3af'}}></span> Próxima ejecución: manual
          </div>
        </div>

        <div className="card stat-card">
          <div className="stat-card-header">
            <span className="stat-title">Tiempo Medio (SLA)</span>
            <div className="stat-icon"><Timer size={18} /></div>
          </div>
          <div className="stat-value">{loading ? '...' : latenciaMedia}<span style={{fontSize: '1rem', fontWeight: 600}}>ms</span></div>
          <div className="stat-subtext">
            <span className="status-dot-small"></span> Promedio global de respuesta
          </div>
        </div>
      </div>

      {/* Inventory Section */}
      <div className="inventory-section">
        <div className="inventory-toolbar">
          <div className="search-bar" style={{width: '300px', backgroundColor: '#f9fafb', border: '1px solid var(--border-color)'}}>
            <Search size={16} className="search-icon" />
            <input type="text" placeholder="Filtrar por servicio o responsable..." />
          </div>
          <div className="inventory-filters">
            <button className="filter-btn active">Todos ({totalServicios})</button>
          </div>
        </div>

        <div className="inventory-header">
          <h3>Inventario de Servicios y Pruebas <span className="badge badge-info">Sincronizado Supabase</span></h3>
        </div>

        {loading ? (
          <div style={{padding: '3rem', textAlign: 'center', color: 'var(--text-muted)'}}>
            <Loader size={32} className="spinner" style={{marginBottom: '1rem', color: 'var(--primary)'}} />
            <p>Cargando dashboard...</p>
          </div>
        ) : (
          <table className="inventory-table">
            <thead>
              <tr>
                <th>SERVICIO</th>
                <th>TIPO</th>
                <th>RESPONSABLE</th>
                <th>OPERATIVIDAD</th>
                <th>ÚLTIMA PRUEBA</th>
                <th>VEREDICTO QA</th>
              </tr>
            </thead>
            <tbody>
              {inventario.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{textAlign: 'center', padding: '2rem'}}>No hay servicios registrados. Ve a "Registrar Servicio".</td>
                </tr>
              ) : (
                inventario.map(srv => (
                  <tr key={srv.id}>
                    <td>
                      <div className="service-cell">
                        <div className="service-icon-box">{srv.nombre.substring(0, 2).toUpperCase()}</div>
                        <div className="service-info">
                          <h4>{srv.nombre}</h4>
                          <p>id: {srv.id}</p>
                        </div>
                      </div>
                    </td>
                    <td><span className="type-badge">{srv.tipo}</span></td>
                    <td>
                      <div className="user-cell">
                        <div className="user-initials">{srv.responsable.substring(0, 2).toUpperCase()}</div>
                        <div className="user-details">
                          <h5>{srv.responsable}</h5>
                        </div>
                      </div>
                    </td>
                    <td>
                      {srv.ultimaVal ? (
                        srv.ultimaVal.dictamen.toLowerCase() === 'aprobado' 
                          ? <div className="status-indicator status-active"><span className="status-dot"></span> Activo</div>
                          : <div className="status-indicator status-degraded"><span className="status-dot"></span> Degradado</div>
                      ) : (
                        <div className="status-indicator" style={{color: 'var(--text-muted)'}}><span className="status-dot" style={{backgroundColor: 'var(--text-muted)'}}></span> Sin pruebas</div>
                      )}
                    </td>
                    <td>
                      <div className="user-details">
                        {srv.ultimaVal ? (
                          <>
                            <h5 style={{fontWeight: 400}}>{new Date(srv.ultimaVal.fecha_ejecucion).toLocaleDateString()}</h5>
                            <p>{new Date(srv.ultimaVal.fecha_ejecucion).toLocaleTimeString()}</p>
                          </>
                        ) : (
                          <span style={{color: 'var(--text-muted)'}}>Nunca</span>
                        )}
                      </div>
                    </td>
                    <td>
                      {srv.ultimaVal ? (
                        srv.ultimaVal.dictamen.toLowerCase() === 'aprobado' 
                          ? <span className="badge badge-info" style={{backgroundColor: 'transparent', border: '1px solid var(--info)'}}><CheckCircle size={12}/> Aprobado</span>
                          : <span className="badge badge-danger" style={{backgroundColor: 'transparent', border: '1px solid var(--danger)'}}><AlertCircle size={12}/> {srv.ultimaVal.dictamen}</span>
                      ) : (
                        <span className="badge" style={{backgroundColor: '#f3f4f6', color: '#6b7280'}}>Sin veredicto</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
