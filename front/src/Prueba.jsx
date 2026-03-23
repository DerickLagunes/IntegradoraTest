import React, { useState } from 'react';
import axios from 'axios';

const MovieForm = () => {
  // Estado para los campos del formulario
  const [formData, setFormData] = useState({
    ip: '',
    id: '',
    nombre: '',
    genero: '',
    puntuacion: 0
  });

  // Estado para mostrar los resultados de las peticiones
  const [status, setStatus] = useState('');
  const [movieData, setMovieData] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const getBaseUrl = () => {
    const { ip, id } = formData;
    return `http://${ip}:8000/api/peliculas${id ? `/${id}/` : ''}`;
  };

  const handleRequest = async (method) => {
    setStatus('Cargando...');
    setMovieData(null);
    
    const url = getBaseUrl();
    const payload = {
      nombre: formData.nombre,
      genero: formData.genero,
      puntuacion: Number(formData.puntuacion)
    };

    try {
      let response;
      switch (method) {
        case 'GET':
          response = await axios.get(url);
          setMovieData(response.data);
          setStatus('Get correcto y muestra info');
          break;
        case 'POST':
          response = await axios.post(`http://${formData.ip}:8000/api/peliculas/`, payload);
          setStatus('Post correcto');
          break;
        case 'PUT':
          response = await axios.put(url, payload);
          setStatus('Put correcto');
          break;
        case 'DELETE':
          response = await axios.delete(url);
          setStatus('Delete correcto');
          break;
        default:
          break;
      }
    } catch (error) {
      setStatus(`Error: ${error.message}. Verifica la IP y que el servidor permita CORS.`);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px', fontFamily: 'sans-serif' }}>
      <h2>Gestor de Películas</h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input name="ip" placeholder="Ingrese su IP (ej: 192.168.1.1)" onChange={handleChange} />
        <input name="id" placeholder="ID de la película (Opcional)" onChange={handleChange} />
        <input name="nombre" placeholder="Nombre de la película" onChange={handleChange} />
        <input name="genero" placeholder="Género" onChange={handleChange} />
        
        <label>Puntuación: {formData.puntuacion}</label>
        <input 
          type="range" name="puntuacion" min="0" max="10" 
          value={formData.puntuacion} onChange={handleChange} 
        />

        <div style={{ display: 'flex', gap: '5px', marginTop: '10px' }}>
          <button onClick={() => handleRequest('GET')}>GET</button>
          <button onClick={() => handleRequest('POST')}>POST</button>
          <button onClick={() => handleRequest('PUT')}>PUT</button>
          <button onClick={() => handleRequest('DELETE')} style={{ backgroundColor: '#ff4d4d', color: 'white' }}>DELETE</button>
        </div>
      </div>

      <hr />

      {/* Pantalla de resultados */}
      <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
        <strong>Estado:</strong> {status}
        
        {movieData && (
          <pre style={{ background: '#f4f4f4', padding: '10px', marginTop: '10px' }}>
            {JSON.stringify(movieData, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
};

export default MovieForm;