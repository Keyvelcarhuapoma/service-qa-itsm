import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, PlusSquare, CheckSquare, History, Settings, CheckCircle2 } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-icon">
          <CheckCircle2 size={24} color="#1e3a8a" />
        </div>
        <div className="logo-text">
          <h2>ServiceQA</h2>
          <p>ITSM VALIDATION</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-group-title">OPERACIONES QA</div>
        
        <NavLink to="/" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
          <LayoutDashboard size={20} />
          <span>Dashboard Principal</span>
        </NavLink>
        
        <NavLink to="/registro" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
          <PlusSquare size={20} />
          <span>Registro de Servicios</span>
        </NavLink>
        
        <NavLink to="/validacion" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
          <CheckSquare size={20} />
          <span>Validación / Pruebas</span>
        </NavLink>
        
        <NavLink to="/historial" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
          <History size={20} />
          <span>Historial de Pruebas</span>
        </NavLink>

        <div className="nav-separator"></div>

        <NavLink to="/configuracion" className={({isActive}) => isActive ? "nav-link active" : "nav-link"}>
          <Settings size={20} />
          <span>Configuración</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <div className="environment-badge">
          <div className="env-dot"></div>
          <div>
            <div className="env-label">AMBIENTE</div>
            <div className="env-value">Staging Cluster 04</div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
