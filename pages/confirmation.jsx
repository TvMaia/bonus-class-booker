import { useRouter } from 'next/router';

export default function Confirmation() {
  const router = useRouter();
  const {
    modality = '',
    horario = '',
    studentName = '',
    book = '',
    content = '',
    whatsapp = '',
  } = router.query;

  const base = 'https://calendar.google.com/calendar/render?action=TEMPLATE';
  const text = `text=Bonus+Class+Booking+(${modality})`;
  const details = `details=Aluno%3A+${encodeURIComponent(studentName)}%0AWhatsApp%3A+${encodeURIComponent(whatsapp)}`;
  const calendarUrl = `${base}&${text}&${details}`;

  return (
    <div className="confirmation">
      <h1>Agendamento Confirmado!</h1>
      <p><strong>Modalidade:</strong> {modality === 'O' ? 'Online' : 'Presencial'}</p>
      <p><strong>Horário:</strong> {horario}</p>
      <p><strong>Aluno:</strong> {studentName}</p>
      {book && <p><strong>Livro:</strong> {book}</p>}
      {content && <p><strong>Conteúdo:</strong> {content}</p>}
      <p><strong>WhatsApp:</strong> {whatsapp}</p>

      <div className="warning-card">
        <p className="warning-text">
          ⚠️ Se desmarcar depois de quinta-feira à noite, será cobrada multa de R$ 20.
        </p>
      </div>

      <a href={calendarUrl} target="_blank" rel="noreferrer">
        <button className="calendar-button">Adicionar ao Google Agenda</button>
      </a>
    </div>
  );
}