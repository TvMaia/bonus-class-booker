import { useEffect, useState } from 'react';
import { getAvailableSlots } from '../services/apiService';
import { toast } from 'react-toastify';

export default function AvailableSlotsGrid({ modality, onHorarioSelect, onBack }) {
  const [slots, setSlots] = useState([]);
  const [selectedHorario, setSelectedHorario] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setSelectedHorario('');
    setIsLoading(true);
    getAvailableSlots(modality)
      .then((resp) => {
        const horas = Array.isArray(resp.data) ? resp.data.map((o) => o.horario) : [];
        const uniques = Array.from(new Set(horas));
        setSlots(uniques);
      })
      .catch(() => toast.error('Erro ao carregar horários'))
      .finally(() => setIsLoading(false));
  }, [modality]);

  const handleSelect = (horario) => {
    setSelectedHorario(horario);
    onHorarioSelect(horario); // Avança para a próxima etapa
  };

  if (isLoading) {
    return <p>Carregando horários disponíveis...</p>;
  }

  if (!slots.length) {
    return (
      <div className="step step-enter">
        <p>Nenhum horário disponível para esta modalidade.</p>
        <div className="navigation">
          <button onClick={onBack} className="nav-button">←</button>
        </div>
      </div>
    );
  }

  return (
    <div className="step step-enter">
      <label>Horários disponíveis:</label>
      <select
        value={selectedHorario}
        onChange={(e) => handleSelect(e.target.value)}
      >
        <option value="" disabled>
          Selecione
        </option>
        {slots.map((h, i) => (
          <option key={i} value={h}>
            {h}
          </option>
        ))}
      </select>
      <div className="navigation">
        <button onClick={onBack} className="nav-button">←</button>
        {selectedHorario && (
          <button onClick={() => onHorarioSelect(selectedHorario)} className="nav-button">→</button>
        )}
      </div>
    </div>
  );
}