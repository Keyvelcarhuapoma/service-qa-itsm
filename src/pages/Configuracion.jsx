import React, { useState } from 'react';
import { Settings, Bell, Shield, Webhook, Users, Key, RefreshCw, Smartphone, Globe, Copy, Check } from 'lucide-react';
import './Configuracion.css';

const Configuracion = () => {
  const [activeTab, setActiveTab] = useState('integrations');
  const [copied, setCopied] = useState(false);
  const [toggles, setToggles] = useState({
    slack: true,
    pagerduty: true,
    jira: false,
    emailAlerts: true,
    autoRollback: false
  });

  const handleToggle = (key) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const copyKey = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="config-page">
      <div className="config-header">
        <h1>Configuración de Plataforma</h1>
        <p>Administra las integraciones, notificaciones, seguridad y políticas globales del clúster de QA.</p>
      </div>

      <div className="config-layout">
        <div className="config-sidebar">
          <div className={`config-nav-item ${activeTab === 'general' ? 'active' : ''}`} onClick={() => setActiveTab('general')}>
            <Settings size={18} className="config-icon" /> General
          </div>
          <div className={`config-nav-item ${activeTab === 'integrations' ? 'active' : ''}`} onClick={() => setActiveTab('integrations')}>
            <Webhook size={18} className="config-icon" /> Integraciones (Webhooks)
          </div>
          <div className={`config-nav-item ${activeTab === 'notifications' ? 'active' : ''}`} onClick={() => setActiveTab('notifications')}>
            <Bell size={18} className="config-icon" /> Alertas y Notificaciones
          </div>
          <div className={`config-nav-item ${activeTab === 'security' ? 'active' : ''}`} onClick={() => setActiveTab('security')}>
            <Shield size={18} className="config-icon" /> Seguridad y Tokens
          </div>
          <div className={`config-nav-item ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
            <Users size={18} className="config-icon" /> Gestión de Accesos
          </div>
        </div>

        <div className="config-content">
          {activeTab === 'integrations' && (
            <>
              <div className="config-section-header">
                <h2>Conectores ITSM y DevOps</h2>
                <p>Vincula herramientas de terceros para escalar incidencias y reportar telemetría automáticamente.</p>
              </div>
              
              <div className="config-body">
                <div className="setting-group">
                  <div className="integration-card">
                    <div className="integration-info">
                      <div className="integration-icon slack"><Smartphone size={20} /></div>
                      <div className="integration-details">
                        <h4>Slack Workspace</h4>
                        <p>Notificaciones de despliegues y alertas críticas al canal #qa-alerts</p>
                      </div>
                    </div>
                    <div className="setting-action">
                      <span style={{fontSize: '0.75rem', fontWeight: 600, color: toggles.slack ? 'var(--success)' : 'var(--text-muted)'}}>
                        {toggles.slack ? 'CONECTADO' : 'DESCONECTADO'}
                      </span>
                      <div className={`toggle-switch ${toggles.slack ? 'active' : ''}`} onClick={() => handleToggle('slack')}>
                        <div className="toggle-knob"></div>
                      </div>
                    </div>
                  </div>

                  <div className="integration-card">
                    <div className="integration-info">
                      <div className="integration-icon pager"><Globe size={20} /></div>
                      <div className="integration-details">
                        <h4>PagerDuty Incident Management</h4>
                        <p>Creación automática de incidentes P1 para servicios Tier 1 caídos</p>
                      </div>
                    </div>
                    <div className="setting-action">
                      <span style={{fontSize: '0.75rem', fontWeight: 600, color: toggles.pagerduty ? 'var(--success)' : 'var(--text-muted)'}}>
                        {toggles.pagerduty ? 'CONECTADO' : 'DESCONECTADO'}
                      </span>
                      <div className={`toggle-switch ${toggles.pagerduty ? 'active' : ''}`} onClick={() => handleToggle('pagerduty')}>
                        <div className="toggle-knob"></div>
                      </div>
                    </div>
                  </div>

                  <div className="integration-card">
                    <div className="integration-info">
                      <div className="integration-icon jira"><RefreshCw size={20} /></div>
                      <div className="integration-details">
                        <h4>Jira Software Cloud</h4>
                        <p>Vincular corridas de prueba a tickets de lanzamiento (Release Tickets)</p>
                      </div>
                    </div>
                    <div className="setting-action">
                      <button className="btn btn-secondary" style={{padding: '0.25rem 0.75rem'}}>Configurar</button>
                      <div className={`toggle-switch ${toggles.jira ? 'active' : ''}`} onClick={() => handleToggle('jira')}>
                        <div className="toggle-knob"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="setting-item" style={{borderTop: '1px solid var(--border-color)', paddingTop: '2rem'}}>
                  <div className="setting-info">
                    <h4>Endpoint de Webhook Global (Ingress)</h4>
                    <p>Utiliza esta URL para disparar ejecuciones de prueba desde tu pipeline de CI/CD (Jenkins, GitLab CI, GitHub Actions).</p>
                  </div>
                  <div className="setting-action">
                    <div className="setting-input-wrapper">
                      <input type="text" className="setting-input" value="https://api.serviceqa.internal/v1/webhook/trigger" readOnly />
                      <button className="btn btn-secondary" onClick={copyKey} title="Copiar URL">
                        {copied ? <Check size={16} color="var(--success)" /> : <Copy size={16} />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'notifications' && (
            <>
              <div className="config-section-header">
                <h2>Políticas de Alertas</h2>
                <p>Define cuándo y cómo se alerta a los responsables de los servicios.</p>
              </div>
              <div className="config-body">
                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Alertas por Correo Electrónico</h4>
                    <p>Enviar resumen diario de salud de servicios y notificaciones inmediatas de degradación al Technical Owner.</p>
                  </div>
                  <div className="setting-action">
                    <div className={`toggle-switch ${toggles.emailAlerts ? 'active' : ''}`} onClick={() => handleToggle('emailAlerts')}>
                      <div className="toggle-knob"></div>
                    </div>
                  </div>
                </div>
                
                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Umbral de Latencia Global (Hard Limit)</h4>
                    <p>Latencia máxima permitida antes de marcar una prueba de rendimiento como "Fallida" por defecto, si no se especifica en el servicio.</p>
                  </div>
                  <div className="setting-action">
                    <div className="setting-input-wrapper" style={{width: '120px'}}>
                      <input type="number" className="setting-input" defaultValue={500} />
                      <span style={{alignSelf: 'center', fontSize: '0.875rem', color: 'var(--text-muted)'}}>ms</span>
                    </div>
                  </div>
                </div>
                
                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Auto-Rollback en Fallo Crítico</h4>
                    <p>Invocar webhook de rollback en ArgoCD / Spinnaker si una prueba Tier 1 falla en entorno Staging.</p>
                  </div>
                  <div className="setting-action">
                    <div className={`toggle-switch ${toggles.autoRollback ? 'active' : ''}`} onClick={() => handleToggle('autoRollback')}>
                      <div className="toggle-knob"></div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
          
          {/* Placeholder para otras pestañas */}
          {['general', 'security', 'users'].includes(activeTab) && (
            <div className="config-body" style={{alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem', textAlign: 'center'}}>
              <Settings size={48} color="var(--border-color)" style={{marginBottom: '1rem'}} />
              <h3 style={{fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '0.5rem'}}>Sección en Construcción</h3>
              <p style={{color: 'var(--text-muted)', maxWidth: '400px'}}>Esta área de configuración avanzada está siendo desplegada en la próxima versión de la plataforma ITSM.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Configuracion;
