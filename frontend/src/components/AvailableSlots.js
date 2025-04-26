import React, { useState, useEffect } from 'react';
import { getAvailableSlots } from '../services/apiService';
import Notification from './Notification';
import BookingForm from './BookingForm';

const AvailableSlots = ({ modality }) => {
  const [slots, setSlots] = useState([]);
  const [notification, setNotification] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        console.log('Buscando horários para modalidade:', modality);
        const response = await getAvailableSlots(modality);
        console.log('Horários recebidos:', response.data);
        setSlots(response.data);
      } catch (error) {
        console.error('Erro ao buscar horários:', error.message);
        setNotification({ message: 'Erro ao carregar horários', type: 'error' });
      }
    };
    if (modality) {
      console.log('Modalidade selecionada, iniciando busca...');
      fetchSlots();
    }
  }, [modality]);

  const openBookingForm = (slot, rowIndex) => {
    console.log('Abrindo formulário para slot:', slot, 'com rowIndex:', rowIndex); // Adicione este log
    setSelectedSlot(slot);
    setSelectedRowIndex(rowIndex);
  };

  const handleBookingSuccess = () => {
    setSelectedSlot(null);
    setSelectedRowIndex(null);
    // Recarregar horários
    const fetchSlots = async () => {
      try {
        const response = await getAvailableSlots(modality);
        setSlots(response.data);
      } catch (error) {
        setNotification({ message: 'Erro ao recarregar horários', type: 'error' });
      }
    };
    fetchSlots();
  };

  return (
    <div>
      <h2>Horários Disponíveis</h2>
      {notification && <Notification message={notification.message} type={notification.type} />}
      {slots.length === 0 ? (
        <p>Nenhum horário disponível para a modalidade selecionada.</p>
      ) : (
        <ul>
          {slots.map((slot, index) => (
            <li key={index}>
              {slot[1]} - {slot[0]} ({slot[2] || 'Online ou Presencial'})
              <button onClick={() => openBookingForm(slot, index)}>Agendar</button>
            </li>
          ))}
        </ul>
      )}
      {selectedSlot && (
        <BookingForm
          slot={selectedSlot}
          rowIndex={selectedRowIndex}
          onBookingSuccess={handleBookingSuccess}
        />
      )}
    </div>
  );
};

export default AvailableSlots;