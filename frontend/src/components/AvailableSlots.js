import React, { useState, useEffect } from 'react';
import { getAvailableSlots } from '../services/apiService';
import BookingForm from './BookingForm';
import { toast } from 'react-toastify';

const AvailableSlots = ({ modality }) => {
  const [slots, setSlots] = useState([]);
  const [selectedHorario, setSelectedHorario] = useState('');

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const response = await getAvailableSlots(modality);
        setSlots(response.data);
      } catch (error) {
        toast.error('Erro ao carregar horários');
      }
    };
    if (modality) fetchSlots();
  }, [modality]);

  const handleSelectChange = (e) => {
    setSelectedHorario(e.target.value);
  };

  const handleBookingSuccess = () => {
    setSelectedHorario('');
    const fetchSlots = async () => {
      try {
        const response = await getAvailableSlots(modality);
        setSlots(response.data);
      } catch (error) {
        toast.error('Erro ao recarregar horários');
      }
    };
    fetchSlots();
  };

  return (
    <div className="available-slots">
      <h2>Horários Disponíveis ({modality})</h2>
      {slots.length === 0 ? (
        <p>Nenhum horário disponível para a modalidade selecionada.</p>
      ) : (
        <select onChange={handleSelectChange} value={selectedHorario}>
          <option value="" disabled>Escolha um horário</option>
          {slots.map((horario, index) => (
            <option key={index} value={horario}>
              {horario}
            </option>
          ))}
        </select>
      )}
      {selectedHorario && (
        <BookingForm
          horario={selectedHorario}
          modality={modality}
          onBookingSuccess={handleBookingSuccess}
        />
      )}
    </div>
  );
};

export default AvailableSlots;