//En este caso es para Mascotas

import axios from 'axios';
const BASE_URL = 'http://localhost:8000/api/mascotas'; 

// 1. LISTAR (GET)
export const read = () => {
    return axios.get(`${BASE_URL}/`);
};

// 2. CREAR (POST)
export const create = (data) => {
    const formData = new FormData();
    for (const key in data) {
        formData.append(key, data[key]);
    }
    return axios.post(`${BASE_URL}/`, formData);
};

// 3. ACTUALIZAR (PUT)
export const update = (id, data) => {
    const formData = new FormData();
    for (const key in data) {
        formData.append(key, data[key]);
    }
    return axios.put(`${BASE_URL}/${id}/`, formData);
};

// 4. ELIMINAR (DELETE)
export const deleteM = (id) => {
    return axios.delete(`${BASE_URL}/${id}/`);
};
