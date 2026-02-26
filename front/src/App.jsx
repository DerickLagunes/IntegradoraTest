import MascotasApp from './MascotasApp'; // <-- Importamos el componente

function App() {
  return (
    <div>
      {/* Aquí estamos "inyectando" el componente en la pantalla principal */}
      <MascotasApp />
    </div>
  );
}

export default App;
