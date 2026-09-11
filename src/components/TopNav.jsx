import React, { useState } from 'react';
import { Search, Bell, HelpCircle } from 'lucide-react';
import './TopNav.css';

const TopNav = () => {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="topnav">
      <div className="breadcrumb">
        {/* Breadcrumb can be dynamic later */}
        <span className="text-muted">ITSM Core</span>
        <span className="breadcrumb-separator">›</span>
        <span className="font-semibold">ServiceQA Control</span>
      </div>

      <div className="search-bar">
        <Search size={16} className="search-icon" />
        <input type="text" placeholder="Buscar servicios, pruebas, tickets..." />
      </div>

      <div className="topnav-actions">
        <div className="environment-pill">
          <div className="env-dot-green"></div>
          <span>Ambiente: Producción</span>
        </div>

        <button className="icon-btn">
          <HelpCircle size={20} />
        </button>
        
        <div style={{ position: 'relative' }}>
          <button className="icon-btn relative" onClick={() => setShowNotifications(!showNotifications)}>
            <Bell size={20} />
            <span className="notification-dot"></span>
          </button>
          
          {showNotifications && (
            <div className="notifications-dropdown">
              <div className="notif-header">
                <h4>Notificaciones</h4>
                <span className="badge-new">3 nuevas</span>
              </div>
              <div className="notif-list">
                <div className="notif-item unread">
                  <div className="notif-icon danger"><Bell size={14} /></div>
                  <div className="notif-content">
                    <p><strong>Incidencia Cr�tica</strong> en Base de Datos Clientes (Timeout detectado)</p>
                    <span>Hace 2 min</span>
                  </div>
                </div>
                <div className="notif-item unread">
                  <div className="notif-icon success"><Bell size={14} /></div>
                  <div className="notif-content">
                    <p><strong>Validaci�n Exitosa</strong>: Portal B2B pas� a producci�n.</p>
                    <span>Hace 1 hora</span>
                  </div>
                </div>
                <div className="notif-item unread">
                  <div className="notif-icon info"><Bell size={14} /></div>
                  <div className="notif-content">
                    <p>Nuevo servicio "API Pagos" en cola QA</p>
                    <span>Hace 2 horas</span>
                  </div>
                </div>
              </div>
              <div className="notif-footer">
                Marcar todas como le�das
              </div>
            </div>
          )}
        </div>

        <div className="user-profile">
          <div className="user-info">
            <span className="user-name">Alejandro Morales</span>
            <span className="user-role">Líder de Calidad TI</span>
          </div>
          <div className="avatar">
            <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="User Avatar" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNav;
