import { useState } from 'react';
import { bookSlot } from '../services/apiService';
import { toast } from 'react-toastify';

export default function Booking({ modality, selectedHorario, onBack }) {
  const [step, setStep] = useState(1);
  const [studentName, setStudentName] = useState('');
  const [book, setBook] = useState('');
  const [content, setContent] = useState('');
  const [whatsapp, setWhatsapp] = useState('');

  const next = () => setStep((s) => s + 1);
  const back = () => {
    console.log('Back button clicked, step:', step, 'onBack exists:', !!onBack);
    if (step === 1) {
      if (onBack) {
        onBack(); // Voltar para horários disponíveis
      } else {
        console.error('onBack prop is not provided');
      }
    } else {
      setStep((s) => s - 1);
    }
  };

  const handleConfirm = async () => {
    if (!studentName) {
      toast.error('Por favor, preencha o nome');
      return;
    }
    if (!whatsapp) {
      toast.error('Por favor, preencha o WhatsApp');
      return;
    }
    try {
      await bookSlot({
        modality,
        horario: selectedHorario,
        studentName,
        book,
        content,
        whatsapp,
      });
      setStep(6); // Ir para a tela de sucesso
    } catch {
      toast.error('Erro ao realizar o agendamento');
    }
  };

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

  const getModalityName = (mod) =>
    mod === 'O' ? 'Online' : mod === 'P' ? 'Presencial' : mod;

  const generateConfirmationText = () => {
    let text = `Aula agendada: ${getModalityName(modality)}\n`;
    text += `Horário: ${selectedHorario}\n`;
    text += `Aluno: ${studentName}\n`;
    if (book) text += `Livro: ${book}\n`;
    if (content) text += `Conteúdo: ${content}\n`;
    text += `WhatsApp: ${whatsapp}\n`;
    text += `ATENÇÃO: A agenda fica aberta de sábado até quinta-feira às 20:00. Caso cancele ou falte após esse prazo, será cobrado o valor de R$ 20,00.`;
    return text;
  };

  const generateGoogleCalendarLink = () => {
    const friday = getNextFriday();
    const [start, end] = selectedHorario.includes(' - ')
      ? selectedHorario.split(' - ')
      : ['00:00', '00:00'];
    const [sh, sm] = start.split(':').map(Number);
    const [eh, em] = end.split(':').map(Number);
    const ds = new Date(friday);
    ds.setHours(sh, sm);
    const de = new Date(friday);
    de.setHours(eh, em);
    const dates = `${formatDate(ds)}/${formatDate(de)}`;
    const text = encodeURIComponent(`Bonus Class - inFlux (${getModalityName(modality)})`);
    const details = encodeURIComponent(generateConfirmationText());
    const loc = encodeURIComponent(modality === 'O' ? 'Online' : 'inFlux School');
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${dates}&details=${details}&location=${loc}`;
  };

  return (
    <div className="booking-form">
      {step === 1 && (
        <div className="step step-enter">
          <h3>Nome e sobrenome:</h3>
          <input
            placeholder="Ex: João da Silva"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            className={studentName ? '' : 'error-border'}
          />
          <div className="navigation">
            <button onClick={back} className="nav-button">
              ←
            </button>
            <button
              onClick={() => {
                if (!studentName) {
                  toast.error('Por favor, preencha o nome');
                  return;
                }
                next();
              }}
              className="nav-button"
            >
              →
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="step step-enter">
          <h3>Livro atual:</h3>
          <select value={book} onChange={(e) => setBook(e.target.value)}>
            <option value="" disabled>
              Selecione
            </option>
            <option>Book 1</option>
            <option>Book 2</option>
            <option>Book 3</option>
            <option>Book 4</option>
            <option>Book 5</option>
            <option>Camino 1</option>
            <option>Camino 2</option>
            <option>Camino 3</option>
            <option>Camino 4</option>
            <option>Kids (Fluxie and Friends e Juniors)</option>
          </select>
          <div className="navigation">
            <button onClick={back} className="nav-button">
              ←
            </button>
            <button onClick={next} className="nav-button">
              →
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="step step-enter">
          <h3>Conteúdo:</h3>
          <input
            placeholder="Ex: conversation, revisão…"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="navigation">
            <button onClick={back} className="nav-button">
              ←
            </button>
            <button onClick={next} className="nav-button">
              →
            </button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="step step-enter">
          <h3>WhatsApp:</h3>
          <input
            type="tel"
            placeholder="Digite apenas números"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value.replace(/\D/g, ''))}
            className={whatsapp ? '' : 'error-border'}
          />
          <div className="navigation">
            <button onClick={back} className="nav-button">
              ←
            </button>
            <button
              onClick={() => {
                if (!whatsapp) {
                  toast.error('Por favor, preencha o WhatsApp');
                  return;
                }
                next();
              }}
              className="nav-button"
            >
              →
            </button>
          </div>
        </div>
      )}

      {step === 5 && (
        <div className="step step-enter">
          <h3>Confirme os dados:</h3>
          <p><strong>Modalidade:</strong> {getModalityName(modality)}</p>
          <p><strong>Horário:</strong> {selectedHorario}</p>
          <p><strong>Aluno:</strong> {studentName}</p>
          {book && <p><strong>Livro:</strong> {book}</p>}
          {content && <p><strong>Conteúdo:</strong> {content}</p>}
          <p><strong>WhatsApp:</strong> {whatsapp}</p>
          <p><strong>Atenção:</strong> A agenda fica aberta de sábado até quinta-feira às 20:00.
          Caso cancele ou falte após esse prazo, será cobrado o valor de R$ 20,00.</p>
          <div className="navigation">
            <button onClick={back} className="nav-button">Voltar</button>
            <button onClick={handleConfirm} className="nav-button">Confirmar</button>
          </div>
        </div>
      )}

      {step === 6 && (
        <div className="step step-enter">
          <video autoPlay muted className="check-animation">
            <source src="/check.webm" type="video/webm" />
          </video>
          <p>Agendado com sucesso!</p>
          <div className="warning-card">
            <p className="warning-text">
              ATENÇÃO: A agenda fica aberta de sábado até quinta-feira às 20:00.
              Caso cancele ou falte após esse prazo, será cobrado o valor de R$ 20,00.
            </p>
          </div>
          <p>Cancelamento deverá ser feito através do Whatsapp ou na recepção.</p>
          <p className="calendar-prompt">
            Não queremos que esqueça, clique no botão para marcar a aula na sua
            agenda Google.
          </p>
          <a
            href={generateGoogleCalendarLink()}
            target="_blank"
            rel="noreferrer"
          >
            <button className="calendar-button">Marcar na minha agenda</button>
          </a>
        </div>
      )}
    </div>
  );
}