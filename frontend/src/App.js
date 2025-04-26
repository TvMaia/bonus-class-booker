import React, { useState } from 'react';
import AvailableSlots from './components/AvailableSlots';
import BookingForm from './components/BookingForm';
import Notification from './components/Notification';

function App() {
  const [modality, setModality] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [notification, setNotification] = useState('');

  const handleModalityChange = (event) => {
    setModality(event.target.value);
  };

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
  };

  const handleBookingSubmit = (bookingData) => {
    setNotification('Agendamento realizado com sucesso!');
  };

  return (
    <div>
      <h1>Bonus Class Booker</h1>
      <label>
        Escolha a modalidade:
        <select value={modality} onChange={handleModalityChange}>
          <option value="">Selecione</option>
          <option value="online">Online</option>
          <option value="presencial">Presencial</option>
        </select>
      </label>
      {modality && (
        <AvailableSlots modality={modality} onSlotSelect={handleSlotSelect} />
      )}
      {selectedSlot && (
        <BookingForm slot={selectedSlot} onSubmit={handleBookingSubmit} />
      )}
      {notification && <Notification message={notification} />}
    </div>
  );
}

export default App;