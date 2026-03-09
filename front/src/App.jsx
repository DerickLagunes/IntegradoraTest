import { useState, useEffect } from 'react';
import MascotasApp from './MascotasApp';
import Login from './Login';

function App() {
  // Estado para controlar qué pantalla mostrar
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Al cargar la app, revisamos si ya hay un token
    const token = localStorage.getItem('access_token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  // Función que le pasamos al Login para que nos avise cuando termine
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  // Función para cerrar sesión (limpiar tokens y devolver al login)
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setIsAuthenticated(false);
  };

  return (
    <div>
      {/* Si está autenticado mostramos la app, si no, mostramos el login */}
      {isAuthenticated ? (
        <MascotasApp onLogout={handleLogout} /> 
      ) : (
        <Login onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}

export default App;
