import { useState } from 'react';
import AvailableSlotsGrid from '../components/AvailableSlotsGrid';
import Booking from '../pages/booking';
import { LottiePlayer } from 'react-toastify';
import { FloatingWhatsApp } from 'react-floating-whatsapp'
import Avatar from 'public/logo-do-whats.png'



export default function Home() {
  const [step, setStep] = useState(1);
  const [modality, setModality] = useState('');
  const [selectedHorario, setSelectedHorario] = useState('');

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => {
    if (step === 2) setModality(''); // Resetar modalidade ao voltar
    setStep((s) => s - 1);
  };

  const handleHorarioSelect = (horario) => {
    setSelectedHorario(horario);
    nextStep();
  };

  return (
    <div className="app-container">
      <header>
        <img src="/school-logo.png" alt="School Logo" className="school-logo" />
      </header>
      <main>
        <div className="card">
          <h1>AULA BÔNUS</h1>
          {step === 1 && (
            <div className="step step-enter">
              <label>Escolha a modalidade:</label>
              <select
                defaultValue=""
                onChange={(e) => {
                  setModality(e.target.value);
                  nextStep();
                }}
              >
                <option value="" disabled>
                  Selecione
                </option>
                <option value="O">Online</option>
                <option value="P">Presencial</option>
              </select>
              <div className="navigation">
                <button onClick={nextStep} className="nav-button">→</button>
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="step step-enter">
              <AvailableSlotsGrid
                modality={modality}
                onHorarioSelect={handleHorarioSelect}
                onBack={prevStep}
              />
            </div>
          )}
          {step === 3 && (
            <Booking
              modality={modality}
              selectedHorario={selectedHorario}
              onBack={prevStep}
            />
          )}
        </div>
        
        
      </main>

      <FloatingWhatsApp
      
        phoneNumber="+5544984111785"
        accountName="InFlux Maringá"
        avatar="/logo-do-whats.png"
        statusMessage="Responderemos o mais breve possível."
        chatMessage="Olá, como vai? Alguma dúvida quanto à aula bônus?"
        placeholder="Escreva aqui sua dúvida..."
        messageDelay= "2"
      />

      
    
    </div>

  );

  
  
}
