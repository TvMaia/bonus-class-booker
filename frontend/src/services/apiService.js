import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/bonus-class',
});

// Função para buscar horários disponíveis
export const getAvailableSlots = (modality) => {
  return api.get(`/available?modality=${modality}`);
};

// Função para realizar o agendamento
export const bookSlot = (bookingData) => {
  return api.post('/book', bookingData);
};