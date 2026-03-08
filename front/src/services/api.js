// En este caso es para Mascotas
import axios from 'axios';
const BASE_URL = 'http://localhost:8000/api/mascotas'; 

// 1. LISTAR (GET)
export const read = () => {
    return axios.get(`${BASE_URL}/`);
};

// 2. CREAR (POST)
// Recibe el FormData directamente desde el componente y lo envía
export const create = (data) => {
    return axios.post(`${BASE_URL}/`, data);
};

// 3. ACTUALIZAR (PUT)
// Recibe el FormData directamente desde el componente y lo envía
export const update = (id, data) => {
    return axios.put(`${BASE_URL}/${id}/`, data);
};

// 4. ELIMINAR (DELETE)
export const deleteM = (id) => {
    return axios.delete(`${BASE_URL}/${id}/`);
};