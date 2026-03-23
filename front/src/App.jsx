import { useState, useEffect } from 'react';
import MascotasApp from './MascotasApp';
import Login from './Login';
import Register from './Register'; // Importamos el nuevo componente
import Series from './Series'

function App() {
  return (
    <div>
        <Series />
    </div>
  );
}

export default App;