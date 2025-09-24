import axios from 'axios';

// Ganti dengan MockAPI Anda
const API_URL = 'https://68d39366214be68f8c66511c.mockapi.io/api/v1/'; // Ganti dengan URL MockAPI Anda

const api = axios.create({
  baseURL: API_URL,
});

export default api;