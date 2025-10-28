// api.ts

import axios from 'axios';

// URL base de la API
const API_URL = "http://172.5.20.5:5007/ServiciosSAEM/api/";

// Instancia de Axios con la URL base
const userAPI = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json;charset=utf-8',
    },
});

// // Interceptor para agregar el token a todos los requests
// // userAPI.interceptors.request.use(async (config) => {
//     const token = localStorage.getItem('token');
    
   
    
//     // Para debugging, puedes eliminar el comentario si necesitas ver los requests
//     // console.log('Request:', JSON.stringify(config, null, 2));
    
//     return config;
// });

// Interceptor para manejar respuestas
userAPI.interceptors.response.use(
    (response) => {
        // Para debugging, elimina el comentario si necesitas ver las respuestas
        // console.log('Response:', JSON.stringify(response.data, null, 2));
        
        return { ...response, data: response.data };
    },
    (error) => {
        // Manejo de errores globales
        console.error('Error en la API:', error);
        throw error;
    }
);

export default userAPI;
