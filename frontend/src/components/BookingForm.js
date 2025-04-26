import React, { useState } from 'react';
import { bookSlot } from '../services/apiService';
import Notification from './Notification';

const BookingForm = ({ slot, rowIndex, onBookingSuccess }) => {
  const [studentName, setStudentName] = useState('');
  const [book, setBook] = useState('');
  const [content, setContent] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [notification, setNotification] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const bookingData = {
      rowIndex,
      studentName,
      book,
      content,
      whatsapp,
    };
    console.log('Enviando dados de agendamento:', JSON.stringify(bookingData, null, 2));
    try {
      const response = await bookSlot(bookingData);
      console.log('Resposta do backend:', response.data);
      setNotification({ message: 'Agendamento realizado com sucesso!', type: 'success' });
      onBookingSuccess();
    } catch (error) {
      const errorMessage = error.response ? error.response.data.error || error.message : error.message;
      console.error('Erro ao agendar:', errorMessage, error);
      setNotification({
        message: `Erro ao realizar o agendamento: ${errorMessage}`,
        type: 'error',
      });
    }
  };

  return (
    <div>
      <h3>Agendar: {slot[1]} - {slot[0]}</h3>
      {notification && <Notification message={notification.message} type={notification.type} />}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nome do aluno"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Livro"
          value={book}
          onChange={(e) => setBook(e.target.value)}
        />
        <input
          type="text"
          placeholder="Conteúdo"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <input
          type="text"
          placeholder="WhatsApp"
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
        />
        <button type="submit">Agendar</button>
      </form>
    </div>
  );
};

export default BookingForm;