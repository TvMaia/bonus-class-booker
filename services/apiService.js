import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

export const getAvailableSlots = (modality) => {
  return api.get(`/available?modality=${modality}`);
};

export const bookSlot = (bookingData) => {
  return api.post('/book', bookingData);
};