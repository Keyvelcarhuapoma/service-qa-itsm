import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import RegistroServicio from './pages/RegistroServicio';
import ValidacionPrueba from './pages/ValidacionPrueba';
import HistorialPruebas from './pages/HistorialPruebas';
import Configuracion from './pages/Configuracion';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="registro" element={<RegistroServicio />} />
          <Route path="validacion" element={<ValidacionPrueba />} />
          <Route path="historial" element={<HistorialPruebas />} />
          {/* Optional: config */}
          <Route path="configuracion" element={<Configuracion />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
