import React, { useState, useEffect } from 'react';
import { getAvailableSlots, bookSlot } from '../services/apiService';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BookingForm = ({ modality, step, setStep, onBack }) => {
  const [slots, setSlots] = useState([]);
  const [selectedHorario, setSelectedHorario] = useState('');
  const [studentName, setStudentName] = useState('');
  const [book, setBook] = useState('');
  const [content, setContent] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [errors, setErrors] = useState({});

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

  const validateField = (field, value) => {
    if (!value) {
      return `Por favor, preencher ${field}`;
    }
    if (field === 'WhatsApp' && !/^\d+$/.test(value)) {
      return 'Por favor, insira apenas números';
    }
    return '';
  };

  const handleNext = () => {
    const newErrors = {};
    if (step === 2) {
      newErrors.horario = validateField('Horário', selectedHorario);
    }
    if (step === 3) {
      newErrors.studentName = validateField('Nome do Aluno', studentName);
    }
    if (step === 4) {
      newErrors.book = validateField('Livro', book);
    }
    if (step === 5) {
      newErrors.content = validateField('Conteúdo', content);
    }
    if (step === 6) {
      newErrors.whatsapp = validateField('WhatsApp', whatsapp);
    }

    setErrors(newErrors);
    if (Object.values(newErrors).some((error) => error)) {
      return;
    }

    if (step < 7) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 2) {
      setStep(step - 1);
    } else {
      onBack();
    }
  };

  const handleSubmit = async () => {
    const bookingData = {
      horario: selectedHorario,
      modality,
      studentName,
      book,
      content,
      whatsapp,
    };
    try {
      await bookSlot(bookingData);
      toast.success('Agendamento realizado com sucesso!');
      setStep(8);
    } catch (error) {
      toast.error('Erro ao realizar o agendamento');
    }
  };

  const getNextFriday = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysUntilFriday = (5 - dayOfWeek + 7) % 7 || 7;
    const nextFriday = new Date(today);
    nextFriday.setDate(today.getDate() + daysUntilFriday);
    return nextFriday;
  };

  const generateGoogleCalendarLink = () => {
    const nextFriday = getNextFriday();
    const [startTime, endTime] = selectedHorario.split(' - ');
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);

    const startDateTime = new Date(nextFriday);
    startDateTime.setHours(startHour, startMinute, 0, 0);
    const endDateTime = new Date(nextFriday);
    endDateTime.setHours(endHour, endMinute, 0, 0);

    const formatDate = (date) => {
      return date.toISOString().replace(/-|:|\.\d{3}/g, '').split('.')[0] + 'Z';
    };

    const eventDetails = {
      text: `Bonus Class - inFlux (${modality})`,
      dates: `${formatDate(startDateTime)}/${formatDate(endDateTime)}`,
      details: `Aula agendada com inFlux. Modalidade: ${modality}, Aluno: ${studentName}, Livro: ${book}, Conteúdo: ${content}, WhatsApp: ${whatsapp}`,
      location: modality === 'online' ? 'Online' : 'inFlux School',
    };

    const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventDetails.text)}&dates=${eventDetails.dates}&details=${encodeURIComponent(eventDetails.details)}&location=${encodeURIComponent(eventDetails.location)}`;
    return url;
  };

  return (
    <div className="booking-form">
      {step === 2 && (
        <div className={`step ${step === 2 ? 'step-enter' : 'step-exit'}`}>
          <label>Horários disponíveis:</label>
          <select
            value={selectedHorario}
            onChange={(e) => setSelectedHorario(e.target.value)}
            className={errors.horario ? 'input-error' : ''}
          >
            <option value="" disabled>Selecione</option>
            {slots.map((horario, index) => (
              <option key={index} value={horario}>
                {horario}
              </option>
            ))}
          </select>
          {errors.horario && <p className="error-message">{errors.horario}</p>}
        </div>
      )}
      {step === 3 && (
        <div className={`step ${step === 3 ? 'step-enter' : 'step-exit'}`}>
          <label>Nome e sobrenome:</label>
          <input
            type="text"
            placeholder="Ex: João da Silva"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            className={errors.studentName ? 'input-error' : ''}
          />
          {errors.studentName && <p className="error-message">{errors.studentName}</p>}
        </div>
      )}
      {step === 4 && (
        <div className={`step ${step === 4 ? 'step-enter' : 'step-exit'}`}>
          <label>Livro atual:</label>
          <select
            value={book}
            onChange={(e) => setBook(e.target.value)}
            className={errors.book ? 'input-error' : ''}
          >
            <option value="" disabled>Selecione</option>
            <option value="Book 1">Book 1</option>
            <option value="Book 2">Book 2</option>
            <option value="Book 3">Book 3</option>
            <option value="Book 4">Book 4</option>
            <option value="Book 5">Book 5</option>
            <option value="Camino 1">Camino 1</option>
            <option value="Camino 2">Camino 2</option>
            <option value="Camino 3">Camino 3</option>
            <option value="Camino 4">Camino 4</option>
            <option value="Kids (Fluxie and Friends e Juniors)">Kids (Fluxie and Friends e Juniors)</option>
          </select>
          {errors.book && <p className="error-message">{errors.book}</p>}
        </div>
      )}
      {step === 5 && (
        <div className={`step ${step === 5 ? 'step-enter' : 'step-exit'}`}>
          <label>Conteúdo:</label>
          <input
            type="text"
            placeholder="Ex: conversation, revisão da aula X..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className={errors.content ? 'input-error' : ''}
          />
          {errors.content && <p className="error-message">{errors.content}</p>}
        </div>
      )}
      {step === 6 && (
        <div className={`step ${step === 6 ? 'step-enter' : 'step-exit'}`}>
          <label>WhatsApp:</label>
          <input
            type="tel"
            placeholder="Digite apenas números"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value.replace(/\D/g, ''))}
            className={errors.whatsapp ? 'input-error' : ''}
          />
          {errors.whatsapp && <p className="error-message">{errors.whatsapp}</p>}
        </div>
      )}
      {step === 7 && (
        <div className={`step ${step === 7 ? 'step-enter' : 'step-exit'}`}>
          <h3>Confirmação</h3>
          <p>Horário: {selectedHorario}</p>
          <p>Modalidade: {modality}</p>
          <p>Nome: {studentName}</p>
          <p>Livro: {book}</p>
          <p>Conteúdo: {content}</p>
          <p>WhatsApp: {whatsapp}</p>
          <button onClick={handleSubmit}>Agendar</button>
        </div>
      )}
      {step === 8 && (
        <div className={`step ${step === 8 ? 'step-enter' : 'step-exit'}`}>
          <video autoPlay muted className="check-animation">
            <source src="/check.webm" type="video/webm" />
          </video>
          <p>Agendado com sucesso!</p>
          <div className="warning-card">
            <p className="warning-text">
              ATENÇÃO: A coordenadora fecha a agenda na quinta-feira à noite. Caso queira cancelar a aula, entrar em contato pelo nosso WhatsApp antes do fechamento, caso cancele ou falte após esse prazo, será cobrado o valor de R$ 20,00.
            </p>
          </div>
          <p className="calendar-prompt">
            Não queremos que esqueça, clique no botão para marcar a aula na sua agenda Google.
          </p>
          <a href={generateGoogleCalendarLink()} target="_blank" rel="noopener noreferrer">
            <button className="calendar-button">Marcar na minha agenda</button>
          </a>
        </div>
      )}
      {step < 7 && (
        <div className="navigation-buttons">
          <button onClick={handleBack} className="nav-button">←</button>
          <button onClick={handleNext} className="nav-button">→</button>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default BookingForm;