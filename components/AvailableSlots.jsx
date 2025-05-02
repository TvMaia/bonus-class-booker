import React, { useEffect, useState } from 'react';
import { getAvailableSlots } from '../services/apiService';
import BookingForm from './BookingForm';
import { toast, ToastContainer } from 'react-toastify';

export default function AvailableSlots({ modality }) {
  const [slots, setSlots] = useState([]);             // array de strings
  const [selectedHorario, setSelectedHorario] = useState('');

  useEffect(() => {
    getAvailableSlots(modality)
      .then((resp) => {
        // resp.data vem como [{horario: '10:00'}, ...]
        const horas = resp.data.map((o) => o.horario);
        const uniques = Array.from(new Set(horas));
        setSlots(uniques);
      })
      .catch(() => toast.error('Erro ao carregar horários'));
  }, [modality]);

  if (!slots.length) {
    return <p>Nenhum horário disponível para esta modalidade.</p>;
  }

  return (
    <>
      <div className="step step-enter">
        <label>Horários disponíveis:</label>
        <select
          value={selectedHorario}
          onChange={(e) => setSelectedHorario(e.target.value)}
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
      </div>

      {selectedHorario && (
        <BookingForm
          modality={modality}
          selectedHorario={selectedHorario}
        />
      )}
      <ToastContainer />
    </>
  );
}
