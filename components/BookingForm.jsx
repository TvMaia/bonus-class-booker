import React, { useState } from 'react';
import { bookSlot } from '@/services/apiService';
import { toast, ToastContainer } from 'react-toastify';

export default function BookingForm({ modality, selectedHorario }) {
  const [step, setStep] = useState(3);
  const [studentName, setStudentName] = useState('');
  const [book, setBook] = useState('');
  const [content, setContent] = useState('');
  const [whatsapp, setWhatsapp] = useState('');

  const next = () => setStep((s) => s + 1);
  const back = () => setStep((s) => s - 1);

  const handleSubmit = async () => {
    try {
      await bookSlot({
        modality,
        horario: selectedHorario,
        studentName,
        book,
        content,
        whatsapp,
      });
      setStep(8);
    } catch {
      toast.error('Erro ao realizar o agendamento');
    }
  };

  // gera link Google Calendar
  const getNextFriday = () => {
    const today = new Date();
    const day = today.getDay();
    const add = (5 - day + 7) % 7 || 7;
    const friday = new Date(today);
    friday.setDate(today.getDate() + add);
    return friday;
  };
  const formatDate = (d) =>
    d.toISOString().replace(/-|:|\.\d{3}/g, '').split('.')[0] + 'Z';
  const generateGoogleCalendarLink = () => {
    const friday = getNextFriday();
    const [start, end] = selectedHorario.split(' - ');
    const [sh, sm] = start.split(':').map(Number);
    const [eh, em] = end.split(':').map(Number);
    const ds = new Date(friday); ds.setHours(sh, sm);
    const de = new Date(friday); de.setHours(eh, em);
    const dates = `${formatDate(ds)}/${formatDate(de)}`;
    const text = encodeURIComponent(`Bonus Class - inFlux (${modality})`);
    const details = encodeURIComponent(
      `Aula agendada: ${modality}\nAluno: ${studentName}\nWhatsApp: ${whatsapp}`
    );
    const loc = encodeURIComponent(modality === 'online' ? 'Online' : 'inFlux School');
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${dates}&details=${details}&location=${loc}`;
  };

  return (
    <div className="booking-form">
      {step >= 3 && <button onClick={back} className="nav-button">←</button>}

      {step === 3 && (
        <div className="step step-enter">
          <h3>Nome e sobrenome:</h3>
          <input
            placeholder="Ex: João da Silva"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
          />
          <button onClick={next} className="nav-button">→</button>
        </div>
      )}

      {step === 4 && (
        <div className="step step-enter">
          <h3>Livro atual:</h3>
          <select value={book} onChange={(e) => setBook(e.target.value)}>
            <option value="" disabled>Selecione</option>
            <option>Book 1</option>
            <option>Book 2</option>
            <option>Book 3</option>
            <option>Book 4</option>
            <option>Book 5</option>
            <option>Kids (Fluxie and Friends e Juniors)</option>
          </select>
          <button onClick={next} className="nav-button">→</button>
        </div>
      )}

      {step === 5 && (
        <div className="step step-enter">
          <h3>Conteúdo:</h3>
          <input
            placeholder="Ex: conversation, revisão…"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button onClick={next} className="nav-button">→</button>
        </div>
      )}

      {step === 6 && (
        <div className="step step-enter">
          <h3>WhatsApp:</h3>
          <input
            type="tel"
            placeholder="Digite apenas números"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value.replace(/\D/g, ''))}
          />
          <button onClick={next} className="nav-button">→</button>
        </div>
      )}

      {step === 7 && (
        <div className="step step-enter">
          <h3>Confirmação</h3>
          <p>Modalidade: {modality}</p>
          <p>Horário: {selectedHorario}</p>
          <p>Nome: {studentName}</p>
          <p>Livro: {book}</p>
          <p>Conteúdo: {content}</p>
          <p>WhatsApp: {whatsapp}</p>
          <button onClick={handleSubmit}>Agendar</button>
        </div>
      )}

      {step === 8 && (
        <div className="step step-enter">
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
          <a href={generateGoogleCalendarLink()} target="_blank" rel="noreferrer">
            <button className="calendar-button">Marcar na minha agenda</button>
          </a>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}
