import React, { useState, useEffect } from 'react';
import { ShieldCheck, CheckCircle2, ChevronRight, Activity, Zap, FileJson, ChevronDown, Check, Circle, AlertCircle, FileText, Download, Lock, CheckCircle, BarChart2, Calendar, Loader } from 'lucide-react';
import { supabase } from '../supabaseClient';
import './RegistroServicio.css'; // Reutilizamos estilos base de form
import './ValidacionPrueba.css';

const ValidacionPrueba = () => {
  const [servicios, setServicios] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [selectedType, setSelectedType] = useState('rendimiento');
  const [selectedDictamen, setSelectedDictamen] = useState('aprobado');
  const [observaciones, setObservaciones] = useState('La optimización en el pool de conexiones de la versión 2.4 mitigó el cuello de botella previo reportado en el incidente INC-9021. La dispersión de latencia se mantiene consistente bajo carga simétrica. Servicio listo para despliegue global sin riesgos operacionales identificados.');
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // 'success' or 'error'

  useEffect(() => {
    const fetchServicios = async () => {
      const { data, error } = await supabase.from('servicios').select('*');
      if (data) {
        setServicios(data);
        if (data.length > 0) setSelectedServiceId(data[0].id);
      }
    };
    fetchServicios();
  }, []);

  const handleSave = async () => {
    if (!selectedServiceId) {
      alert("Debes seleccionar un servicio");
      return;
    }
    setIsSaving(true);
    setSaveStatus(null);
    try {
      const { data, error } = await supabase
        .from('validaciones')
        .insert([
          {
            servicio_id: selectedServiceId,
            tipo_prueba: selectedType,
            dictamen: selectedDictamen,
            observaciones: observaciones,
            latencia_ms: 145 // simulado del resultado
          }
        ]);

      if (error) throw error;
      setSaveStatus('success');
      
      // Limpiar mensaje de exito despues de 3 segundos
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      console.error('Error al guardar:', error);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="validacion-page">
      <div className="registro-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
        <div>
          <div className="eyebrow">
            Operaciones ITSM <ChevronRight size={12} /> Validación de Calidad <ChevronRight size={12} /> <span style={{color: 'var(--primary)'}}>Nueva Prueba</span>
          </div>
          <h1 style={{fontSize: '1.5rem', marginBottom: '0.25rem'}}><ShieldCheck size={24} color="var(--primary)"/> Nueva Validación de Prueba de Servicio</h1>
          <p>Ejecuta y registra los resultados de validación para certificar la estabilidad, resiliencia y calidad en producción.</p>
        </div>
        
        <div style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
          <div className="badge badge-info" style={{fontSize: '0.75rem'}}>RUN-ID: QA-2024-8869</div>
          <div className="validation-mode" style={{padding: '0.5rem 1rem'}}>
            <div className="mode-icon" style={{width: 32, height: 32}}><ShieldCheck size={16} /></div>
            <div>
              <div style={{fontSize: '0.65rem', fontWeight: 600, color: 'var(--text-muted)'}}>MATRIZ DE CUMPLIMIENTO</div>
              <div style={{fontSize: '0.8rem', fontWeight: 700}}>ISO/IEC 25010</div>
            </div>
          </div>
        </div>
      </div>

      <div className="success-banner">
        <div className="banner-content">
          <CheckCircle2 size={24} className="banner-icon" />
          <div className="banner-text">
            <h4>Criterios de aceptación superados</h4>
            <p>Todos los criterios de aceptación técnica fueron superados satisfactoriamente durante la ventana programada.</p>
          </div>
        </div>
        <div className="score-badge">Score QA: 100/100</div>
      </div>

      <div className="form-card">
        <div className="step-header">
          <div className="step-title">
            <span className="step-number">1</span> Selección de Servicio TI
          </div>
          <span style={{fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600}}>CATÁLOGO ACTIVO V3.4</span>
        </div>

        <div className="form-group" style={{marginTop: '1rem', padding: '0 2rem'}}>
          <label className="form-label">Servicio a Validar <span className="req-star">*</span></label>
          <select 
            className="form-input" 
            value={selectedServiceId} 
            onChange={(e) => setSelectedServiceId(e.target.value)}
            style={{fontSize: '1rem', padding: '0.75rem'}}
          >
            {servicios.map(s => (
              <option key={s.id} value={s.id}>{s.id} - {s.nombre} ({s.tipo}) | Resp: {s.responsable}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-card">
        <div className="step-header">
          <div className="step-title">
            <span className="step-number">2</span> Parámetros de la Prueba
          </div>
          <span style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>Configuración de Carga y Protocolo</span>
        </div>

        <div className="form-group" style={{marginBottom: '1.5rem'}}>
          <label className="form-label">Tipo de Prueba Seleccionado <span className="req-star">*</span></label>
          <div className="type-cards">
            <div className={`type-card ${selectedType === 'dispo' ? 'selected' : ''}`} onClick={() => setSelectedType('dispo')}>
              <div className="type-card-header">
                <span style={{fontWeight: 700}}>Disponibilidad</span>
                {selectedType === 'dispo' ? <Check size={16} /> : <Circle size={16} color="var(--border-color)"/>}
              </div>
              <div className="type-card-desc" style={{marginTop: '0.5rem'}}>Healthcheck periódico, uptime global, latencia de ping sintético y SLA de conectividad TCP.</div>
            </div>
            <div className={`type-card ${selectedType === 'rendimiento' ? 'selected' : ''}`} onClick={() => setSelectedType('rendimiento')} style={{position: 'relative'}}>
              <div className="type-card-header">
                <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                  <Zap size={18} />
                  <span style={{fontWeight: 700}}>Rendimiento</span>
                  <span className="badge badge-info" style={{fontSize: '0.6rem'}}>Active</span>
                </div>
                {selectedType === 'rendimiento' ? <CheckCircle size={18} fill="white" color="var(--primary)"/> : <Circle size={16} color="var(--border-color)"/>}
              </div>
              <div className="type-card-desc" style={{marginTop: '0.5rem'}}>Pruebas de estrés, concurrencia de hasta 5,000 req/s, estabilidad y tiempo de respuesta {'<'} 200ms.</div>
            </div>
            <div className={`type-card ${selectedType === 'funcional' ? 'selected' : ''}`} onClick={() => setSelectedType('funcional')}>
              <div className="type-card-header">
                <span style={{fontWeight: 700}}>Funcional</span>
                {selectedType === 'funcional' ? <Check size={16} /> : <Circle size={16} color="var(--border-color)"/>}
              </div>
              <div className="type-card-desc" style={{marginTop: '0.5rem'}}>Pruebas E2E, contratos OpenAPI/Swagger, aserciones de schema payload y códigos HTTP.</div>
            </div>
          </div>
        </div>
      </div>

      <div className="form-card">
        <div className="step-header">
          <div className="step-title">
            <span className="step-number">3</span> Comparativa de Resultados de Calidad
          </div>
          <span style={{fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600}}>↗ Delta de Rendimiento Óptimo (+10.4%)</span>
        </div>

        <div className="compare-grid">
          <div className="compare-box">
            <div className="compare-header">
              <div className="compare-title"><span className="dot" style={{backgroundColor: 'var(--text-muted)'}}></span> Resultado Esperado (Línea Base)</div>
              <span className="badge" style={{backgroundColor: '#f3f4f6', color: 'var(--text-muted)'}}>SLA Acordado</span>
            </div>
            <p className="compare-text">Tiempo de respuesta medio inferior a 180 ms bajo carga sostenida de 2,500 solicitudes/segundo. Tasa de error HTTP 5xx menor al 0.01%. Sin degradación de memoria durante la corrida.</p>
            <h5 style={{fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.75rem'}}>MÉTRICAS OBJETIVO CLAVE</h5>
            <div className="metrics-grid">
              <div className="metric-item">
                <h5>Latencia Límite</h5>
                <p style={{fontSize: '0.875rem'}}>≤ 180 ms</p>
              </div>
              <div className="metric-item">
                <h5>Rendimiento Carga</h5>
                <p style={{fontSize: '0.875rem'}}>≥ 2,500 RPS</p>
              </div>
              <div className="metric-item">
                <h5>Tasa Error Máx.</h5>
                <p style={{fontSize: '0.875rem'}}>{"<"} 0.01%</p>
              </div>
            </div>
          </div>

          <div className="compare-box real">
            <div className="compare-header">
              <div className="compare-title"><span className="dot"></span> Resultado Obtenido (Telemetría Real)</div>
              <span className="badge" style={{backgroundColor: 'white', color: 'var(--primary)', border: '1px solid #bfdbfe'}}>Runner v4.12</span>
            </div>
            <p className="compare-text">Tiempo de respuesta registrado: 145 ms (p95: 168 ms) con 2,500 req/s estables durante 30 minutos. Tasa de error: 0.00%. Consumo de CPU al 42% y RAM estable en 1.2 GB.</p>
            <h5 style={{fontSize: '0.7rem', color: '#3b82f6', marginBottom: '0.75rem'}}>MÉTRICAS REALES VALIDADAS</h5>
            <div className="metrics-grid">
              <div className="metric-item">
                <h5>Latencia p95 <CheckCircle size={10} color="var(--success)"/></h5>
                <p>145 ms</p>
                <span>Cumple (-35ms)</span>
              </div>
              <div className="metric-item">
                <h5>Rendimiento <CheckCircle size={10} color="var(--success)"/></h5>
                <p>2,500 RPS</p>
                <span>Cumple (Estable)</span>
              </div>
              <div className="metric-item">
                <h5>Error 5xx <CheckCircle size={10} color="var(--success)"/></h5>
                <p>0.00%</p>
                <span>Cumple (Zero Defect)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="form-card">
        <div className="step-header" style={{marginBottom: '1rem'}}>
          <div className="step-title">
            <span className="step-number">4</span> Dictamen y Observaciones Finales
          </div>
          <span style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>Firma y Certificación Formal</span>
        </div>

        <div className="dictamen-cards">
          <div className={`dictamen-card aprobado ${selectedDictamen === 'aprobado' ? 'selected' : ''}`} onClick={() => setSelectedDictamen('aprobado')}>
            <div className="dictamen-header">
              <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}><ShieldCheck size={18} /> Aprobado</div>
              {selectedDictamen === 'aprobado' ? <CheckCircle size={18} fill="currentColor" color="white" /> : <Circle size={18} color="var(--border-color)" />}
            </div>
            <div className="dictamen-desc">Listo para pase a producción</div>
          </div>
          <div className={`dictamen-card rechazado ${selectedDictamen === 'rechazado' ? 'selected' : ''}`} onClick={() => setSelectedDictamen('rechazado')}>
            <div className="dictamen-header">
              <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}><AlertCircle size={18} /> Rechazado</div>
              {selectedDictamen === 'rechazado' ? <CheckCircle size={18} fill="currentColor" color="white" /> : <Circle size={18} color="var(--border-color)" />}
            </div>
            <div className="dictamen-desc">Falla crítica o no cumplimiento</div>
          </div>
          <div className={`dictamen-card pendiente ${selectedDictamen === 'pendiente' ? 'selected' : ''}`} onClick={() => setSelectedDictamen('pendiente')}>
            <div className="dictamen-header">
              <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}><Circle size={18} /> Pendiente de Ajustes</div>
              {selectedDictamen === 'pendiente' ? <CheckCircle size={18} fill="currentColor" color="white" /> : <Circle size={18} color="var(--border-color)" />}
            </div>
            <div className="dictamen-desc">Requiere tuning o nueva corrida</div>
          </div>
        </div>

        <div className="form-group" style={{marginBottom: '1.5rem'}}>
          <label className="form-label">Observaciones y Notas Técnicas de Ingeniería <span className="req-star">*</span> <span style={{color: 'var(--text-muted)', fontWeight: 'normal'}}>Formato Markdown Habilitado</span></label>
          <textarea 
            className="form-input" 
            rows="3" 
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
          ></textarea>
        </div>

        <div className="form-row">
          <div className="form-group" style={{flex: 1}}>
            <label className="form-label">Validador / QA Lead Asignado</label>
            <div className="validator-info">
              <div className="val-avatar"><img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Validador" /></div>
              <div className="val-details" style={{flex: 1}}>
                <h4>Alejandro Morales</h4>
                <p>Líder de Calidad TI • ID: QA-USR-441</p>
              </div>
              <span className="badge" style={{backgroundColor: '#e5e7eb', color: 'var(--text-muted)'}}>PRE-LLENADO</span>
            </div>
          </div>
          <div className="form-group" style={{flex: 1}}>
            <label className="form-label">Fecha y Hora de Ejecución</label>
            <div className="validator-info" style={{backgroundColor: 'white'}}>
              <div className="val-avatar" style={{backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--radius-md)'}}>
                <Calendar size={20} />
              </div>
              <div className="val-details" style={{flex: 1}}>
                <h4>18/05/2024 - 15:45:00 UTC-5</h4>
                <p>Sello de tiempo NTP sincronizado</p>
              </div>
              <Lock size={16} color="var(--text-muted)" />
            </div>
          </div>
        </div>

        <div className="attachments">
          <div className="attach-box">
            <div className="attach-left">
              <div style={{backgroundColor: '#e0e7ff', padding: '0.4rem', borderRadius: 'var(--radius-sm)', color: 'var(--primary)'}}><BarChart2 size={16}/></div>
              <div>
                <h5>k6-benchmark-stdout.log</h5>
                <p>3.4 MB • Generado hace 15m</p>
              </div>
            </div>
            <Download size={16} color="var(--text-muted)" />
          </div>
          <div className="attach-box">
            <div className="attach-left">
              <div style={{backgroundColor: '#e0e7ff', padding: '0.4rem', borderRadius: 'var(--radius-sm)', color: 'var(--primary)'}}><Activity size={16}/></div>
              <div>
                <h5>datadog-metrics-export.json</h5>
                <p>890 KB • Trace ID: #88390</p>
              </div>
            </div>
            <Download size={16} color="var(--text-muted)" />
          </div>
          <div className="attach-box">
            <div className="attach-left">
              <div style={{backgroundColor: '#f3f4f6', padding: '0.4rem', borderRadius: 'var(--radius-sm)', color: 'var(--text-muted)'}}><ShieldCheck size={16}/></div>
              <div>
                <h5>owasp-zap-scan-summary...</h5>
                <p>0 Vulnerabilidades detectadas</p>
              </div>
            </div>
            <Download size={16} color="var(--text-muted)" />
          </div>
        </div>
      </div>

      <div className="bottom-actions" style={{padding: '0', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <button className="btn btn-secondary btn-large" style={{border: 'none'}}>Descartar</button>
        
        {saveStatus === 'success' && <div style={{color: 'var(--success)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem'}}><CheckCircle size={18}/> ¡Guardado en Supabase!</div>}
        {saveStatus === 'error' && <div style={{color: 'var(--danger)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem'}}><AlertCircle size={18}/> Error al guardar</div>}

        <div style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
          <button className="btn btn-secondary btn-large" style={{border: 'none'}}>Guardar Borrador</button>
          <span style={{fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem'}}><Lock size={12}/> Firma digital con certificado corporativo SHA-256</span>
          <button 
            className="btn btn-primary btn-large" 
            style={{marginLeft: '1rem'}}
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? <Loader size={18} className="spinner" /> : <CheckCircle size={18}/>}
            {isSaving ? 'Guardando...' : 'Registrar Validación y Notificar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ValidacionPrueba;
