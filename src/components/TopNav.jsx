import React from 'react';
import { Search, Bell, HelpCircle } from 'lucide-react';
import './TopNav.css';

const TopNav = () => {
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
        
        <button className="icon-btn relative">
          <Bell size={20} />
          <span className="notification-dot"></span>
        </button>

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
