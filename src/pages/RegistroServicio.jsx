import React, { useState } from 'react';
import { ShieldCheck, Info, Check, Circle, Database, LayoutTemplate, Network, Calendar, Clock, Link, X, Save, FileText, ChevronRight, Lock, CheckCircle, Loader, AlertCircle } from 'lucide-react';
import { supabase } from '../supabaseClient';
import './RegistroServicio.css';

const RegistroServicio = () => {
  const [selectedType, setSelectedType] = useState('api');
  const [selectedTier, setSelectedTier] = useState('t1');
  
  const [nombre, setNombre] = useState('');
  const [responsable, setResponsable] = useState('');
  const [srvId, setSrvId] = useState(`SRV-${Math.floor(Math.random() * 9000) + 1000}`);
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  const handleSaveService = async () => {
    if (!nombre || !responsable) {
      alert("Completa el nombre y responsable");
      return;
    }
    
    setIsSaving(true);
    setSaveStatus(null);
    try {
      const { error } = await supabase
        .from('servicios')
        .insert([
          {
            id: srvId,
            nombre: nombre,
            tipo: selectedType === 'api' ? 'API REST' : selectedType === 'db' ? 'Base de Datos' : 'Aplicación Web',
            responsable: responsable
          }
        ]);

      if (error) throw error;
      setSaveStatus('success');
      
      // Reset form
      setTimeout(() => {
        setSaveStatus(null);
        setNombre('');
        setResponsable('');
        setSrvId(`SRV-${Math.floor(Math.random() * 9000) + 1000}`);
      }, 3000);
    } catch (error) {
      console.error(error);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="registro-page">
      <div className="registro-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
        <div>
          <div className="eyebrow">
            Catálogo de Servicios TI <ChevronRight size={12} /> <span style={{color: 'var(--primary)'}}>Nuevo Registro</span>
          </div>
          <h1>Registro de Nuevo Servicio TI <span className="version-badge">ITSM-STD-v4</span></h1>
          <p>Ingresa los detalles técnicos y organizacionales para incorporar un nuevo servicio al catálogo monitoreado y habilitar el pipeline de pruebas de aseguramiento de calidad.</p>
        </div>
        
        <div className="validation-mode">
          <div className="mode-icon"><ShieldCheck size={20} /></div>
          <div>
            <div style={{fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)'}}>VALIDACIÓN AUTOMÁTICA</div>
            <div style={{fontSize: '0.875rem', fontWeight: 600}}><span className="status-dot-small" style={{backgroundColor: 'var(--success)'}}></span> Modo Estricto QA Activo</div>
          </div>
        </div>
      </div>

      <div className="registro-container">
        {/* Main Form */}
        <div className="form-section">
          <div className="form-card">
            <div className="step-header">
              <div className="step-title">
                <span className="step-number">1</span> Información General del Servicio
              </div>
              <span style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>Los campos con <span className="req-star">*</span> son obligatorios</span>
            </div>

            <div className="form-row">
              <div className="form-group" style={{flex: 2}}>
                <label className="form-label">Nombre del servicio <span className="req-star">*</span> <span style={{color: 'var(--text-muted)', fontWeight: 'normal'}}>Máx. 80 caracteres</span></label>
                <input type="text" className="form-input" placeholder="Ej. API de Autenticación OAuth2, Base de Datos Catálogo, etc." value={nombre} onChange={(e) => setNombre(e.target.value)} />
                <span style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>Identificador único y descriptivo del componente de software o infraestructura.</span>
              </div>
              <div className="form-group" style={{flex: 1}}>
                <label className="form-label">Código o Nemónico <Info size={14} color="var(--text-muted)"/></label>
                <div className="input-with-icon">
                  <FileText size={16} className="input-icon-left" />
                  <input type="text" className="form-input" value={srvId} disabled style={{backgroundColor: '#e0e7ff', color: 'var(--primary)', fontWeight: 700}} />
                </div>
                <span style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>Auto-sugerido secuencial.</span>
              </div>
            </div>

            <div className="form-group" style={{marginBottom: '1.5rem'}}>
              <label className="form-label">Tipo de Servicio <span className="req-star">*</span></label>
              <div className="type-cards">
                <div className={`type-card ${selectedType === 'api' ? 'selected' : ''}`} onClick={() => setSelectedType('api')}>
                  <div className="type-card-header">
                    <Network size={20} />
                    {selectedType === 'api' ? <Check size={16} /> : <Circle size={16} color="var(--border-color)"/>}
                  </div>
                  <div className="type-card-title">API / Microservicio</div>
                  <div className="type-card-desc">Endpoints REST, gRPC, colas de eventos</div>
                </div>
                <div className={`type-card ${selectedType === 'db' ? 'selected' : ''}`} onClick={() => setSelectedType('db')}>
                  <div className="type-card-header">
                    <Database size={20} />
                    {selectedType === 'db' ? <Check size={16} /> : <Circle size={16} color="var(--border-color)"/>}
                  </div>
                  <div className="type-card-title">Base de Datos</div>
                  <div className="type-card-desc">SQL transaccional, NoSQL, caches Redis</div>
                </div>
                <div className={`type-card ${selectedType === 'web' ? 'selected' : ''}`} onClick={() => setSelectedType('web')}>
                  <div className="type-card-header">
                    <LayoutTemplate size={20} />
                    {selectedType === 'web' ? <Check size={16} /> : <Circle size={16} color="var(--border-color)"/>}
                  </div>
                  <div className="type-card-title">Aplicación Web</div>
                  <div className="type-card-desc">Portales SPA, consolas B2B, backoffice</div>
                </div>
              </div>
            </div>

            <div className="form-group" style={{marginBottom: '1.5rem'}}>
              <label className="form-label">Descripción del Servicio <span className="req-star">*</span> <span style={{color: 'var(--text-muted)', fontWeight: 'normal'}}>0 / 500</span></label>
              <textarea className="form-input" rows="3" placeholder="Describe la función principal del servicio, dependencias clave, criticidad para el negocio y alcance..."></textarea>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Responsable Técnico / Product Owner <span className="req-star">*</span></label>
                <input type="text" className="form-input" placeholder="Ej. Carlos Mendez" value={responsable} onChange={(e) => setResponsable(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Email de Alertas Técnicas <span className="req-star">*</span></label>
                <div className="input-with-icon">
                  <span className="input-icon-left" style={{fontWeight: 'bold'}}>@</span>
                  <input type="text" className="form-input" placeholder="tech-squad-core@empresa.internal" />
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Fecha Estimada de Puesta en Marcha <span className="req-star">*</span></label>
                <div className="input-with-icon">
                  <Calendar size={16} className="input-icon-left" />
                  <input type="date" className="form-input" defaultValue={new Date().toISOString().split("T")[0]} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Zona Horaria de Operación</label>
                <div className="input-with-icon">
                  <Clock size={16} className="input-icon-left" />
                  <select className="form-input" style={{paddingLeft: '2.5rem', width: '100%'}}>
                    <option>América/Bogotá (UTC-5)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="form-group" style={{marginBottom: '1.5rem'}}>
              <label className="form-label">Criticidad del Servicio <span className="req-star">*</span> <span style={{color: 'var(--text-muted)', fontWeight: 'normal'}}>Define la política de SLAs y rondas de QA</span></label>
              <div className="tier-cards">
                <div className={`tier-card ${selectedTier === 't1' ? 'selected t1' : ''}`} onClick={() => setSelectedTier('t1')}><span style={{color: 'var(--danger)'}}>●</span> Crítica (Tier 1)</div>
                <div className={`tier-card ${selectedTier === 't2' ? 'selected t2' : ''}`} onClick={() => setSelectedTier('t2')}><span style={{color: 'var(--warning)'}}>●</span> Alta (Tier 2)</div>
                <div className={`tier-card ${selectedTier === 't3' ? 'selected t3' : ''}`} onClick={() => setSelectedTier('t3')}><span style={{color: 'var(--info)'}}>●</span> Media (Tier 3)</div>
                <div className={`tier-card ${selectedTier === 't4' ? 'selected t4' : ''}`} onClick={() => setSelectedTier('t4')}><span style={{color: 'var(--text-muted)'}}>●</span> Baja (Tier 4)</div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">URL / Endpoint de Healthcheck <span style={{color: 'var(--text-muted)', fontWeight: 'normal'}}>(Opcional)</span> <span style={{color: 'var(--text-main)'}}><Network size={12}/> Ping cada 60s</span></label>
              <div className="input-with-icon">
                <Link size={16} className="input-icon-left" />
                <input type="text" className="form-input" placeholder="https://api.empresa.internal/v1/health" />
              </div>
              <span style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>Se configurará una sonda sintética que validará código HTTP 200 cada 60 segundos en pre-producción.</span>
            </div>
          </div>

          <div className="bottom-actions" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <button className="btn btn-secondary btn-large" style={{backgroundColor: '#eef2ff', color: 'var(--text-main)', border: 'none'}}><X size={18}/> Cancelar</button>
            
            {saveStatus === 'success' && <div style={{color: 'var(--success)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem'}}><CheckCircle size={18}/> ¡Servicio Registrado en Supabase!</div>}
            {saveStatus === 'error' && <div style={{color: 'var(--danger)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem'}}><AlertCircle size={18}/> Error al guardar</div>}

            <div style={{display: 'flex', gap: '1rem'}}>
              <button className="btn btn-secondary btn-large" style={{color: 'var(--primary)'}}><Save size={18}/> Guardar como Borrador</button>
              <button 
                className="btn btn-primary btn-large"
                onClick={handleSaveService}
                disabled={isSaving}
              >
                {isSaving ? <Loader size={18} className="spinner" /> : <CheckCircle size={18}/>}
                {isSaving ? 'Registrando...' : 'Registrar Servicio'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="guidelines-section">
          <div className="topology-card">
            <div className="right-card-header">
              TOPOLOGÍA DE APROBACIÓN
              <span className="badge" style={{backgroundColor: 'var(--primary-light)', color: 'var(--primary)'}}>Paso 1 de 3</span>
            </div>
            
            <div className="topology-steps">
              <div className="topo-step active">
                <div className="topo-num">1</div>
                <div className="topo-content">
                  <div>Registro Base <div style={{fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500}}>Generación de Nemónico y Catalogación</div></div>
                  <FileText size={16} color="var(--primary)" />
                </div>
              </div>
              <div className="topo-step">
                <div className="topo-num">2</div>
                <div className="topo-content">
                  Batería de Pruebas QA <Circle size={16} />
                </div>
              </div>
              <div className="topo-step">
                <div className="topo-num">3</div>
                <div className="topo-content">
                  Despliegue a Producción <Lock size={16} />
                </div>
              </div>
            </div>
          </div>

          <div className="tips-card">
            <div className="right-card-header" style={{fontSize: '1rem', color: 'var(--text-main)', marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', alignItems: 'center'}}>
              <Info color="var(--primary)"/> Guía de Buenas Prácticas
            </div>
            <p style={{fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem'}}>Cumplir estas pautas acelera la aprobación por el Comité de Arquitectura y Calidad:</p>
            
            <div className="tips-list">
              <div className="tip-item">
                <CheckCircle size={16} className="tip-icon" />
                <div className="tip-content">
                  <h4>Claridad sin acrónimos ambiguos</h4>
                  <p>Usa nombres legibles para auditorías interdepartamentales. Evita nombres de proyectos temporales.</p>
                </div>
              </div>
              <div className="tip-item">
                <CheckCircle size={16} className="tip-icon" />
                <div className="tip-content">
                  <h4>Responsable técnico activo</h4>
                  <p>El responsable asignado recibirá las notificaciones de caída de pruebas y resolución de incidentes críticos.</p>
                </div>
              </div>
              <div className="tip-item">
                <CheckCircle size={16} className="tip-icon" />
                <div className="tip-content">
                  <h4>Clasificación arquitectónica correcta</h4>
                  <p>Permite planificar las suites de prueba de rendimiento y validación de resiliencia adecuadas.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistroServicio;

