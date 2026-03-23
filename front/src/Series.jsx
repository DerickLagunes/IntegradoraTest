import React, { useState } from 'react';
import axios from 'axios';

const SeriesForm = () => {
  const [formData, setFormData] = useState({
    ip: '',
    id: '',
    nombre: '',
    plataforma: '',
    idioma: '',
    puntaje: 0
  });

  const [status, setStatus] = useState('');
  const [seriesData, setSeriesData] = useState(null);

  // Nuevo estado para controlar las palomitas verdes
  const [successMarkers, setSuccessMarkers] = useState({
    GET: false,
    POST: false,
    PUT: false,
    DELETE: false
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const getBaseUrl = () => {
    const { ip, id } = formData;
    return `http://${ip}:8000/api/series${id ? `/${id}/` : '/'}`;
  };

  const handleRequest = async (method) => {
    setStatus('Cargando...');
    setSeriesData(null);
    
    const url = getBaseUrl();
    const payload = {
      nombre: formData.nombre,
      plataforma: formData.plataforma,
      idioma: formData.idioma,
      puntaje: Number(formData.puntaje)
    };

    try {
      let response;
      switch (method) {
        case 'GET':
          response = await axios.get(url);
          setSeriesData(response.data);
          setStatus('Get correcto y muestra info');
          break;
        case 'POST':
          response = await axios.post(`http://${formData.ip}:8000/api/series/`, payload);
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
      
      // Si llega aquí es que fue exitoso, marcamos la palomita
      setSuccessMarkers(prev => ({ ...prev, [method]: true }));
      
    } catch (error) {
      setStatus(`Error: ${error.message}. Verifica la conexión.`);
      // Opcional: quitar la palomita si falla
      setSuccessMarkers(prev => ({ ...prev, [method]: false }));
    }
  };

  // Estilo para la palomita
  const CheckMark = () => (
    <span style={{ color: '#28a745', fontWeight: 'bold', marginLeft: '5px' }}>✓</span>
  );

  return (
    <div style={{ padding: '20px', maxWidth: '600px', fontFamily: 'sans-serif' }}>
      <h2>Gestor de Series</h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input name="ip" placeholder="IP (ej: 192.168.1.1)" onChange={handleChange} />
        <input name="id" placeholder="ID de la serie (Opcional)" onChange={handleChange} />
        <input name="nombre" placeholder="Nombre de la serie" onChange={handleChange} />
        <input name="plataforma" placeholder="Plataforma (Netflix, HBO, etc.)" onChange={handleChange} />
        <input name="idioma" placeholder="Idioma" onChange={handleChange} />
        
        <label>Puntaje: {formData.puntaje}</label>
        <input 
          type="range" name="puntaje" min="0" max="10" 
          value={formData.puntaje} onChange={handleChange} 
        />

        <div style={{ display: 'flex', gap: '15px', marginTop: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div>
            <button onClick={() => handleRequest('GET')}>GET</button>
            {successMarkers.GET && <CheckMark />}
          </div>
          <div>
            <button onClick={() => handleRequest('POST')}>POST</button>
            {successMarkers.POST && <CheckMark />}
          </div>
          <div>
            <button onClick={() => handleRequest('PUT')}>PUT</button>
            {successMarkers.PUT && <CheckMark />}
          </div>
          <div>
            <button onClick={() => handleRequest('DELETE')} style={{ backgroundColor: '#ff4d4d', color: 'white' }}>DELETE</button>
            {successMarkers.DELETE && <CheckMark />}
          </div>
        </div>
      </div>

      <hr />

      <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
        <strong>Estado:</strong> {status}
        
        {seriesData && (
          <pre style={{ background: '#f4f4f4', padding: '10px', marginTop: '10px', overflowX: 'auto', fontSize: '12px' }}>
            {JSON.stringify(seriesData, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
};

export default SeriesForm;