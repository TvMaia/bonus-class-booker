import React, { useState } from 'react';
import BookingForm from './components/BookingForm';
import './App.css';

function App() {
  const [modality, setModality] = useState('');
  const [step, setStep] = useState(1);

  const handleModalitySelect = (selectedModality) => {
    setModality(selectedModality);
    setStep(2);
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="app-container">
      <header>
        <img src="/school-logo.png" alt="School Logo" className="school-logo" />
      </header>
      <main>
        <div className="card">
          <h1>BONUS CLASS</h1>
          {step === 1 && (
            <div className="step step-enter">
              <label>Escolha a modalidade:</label>
              <select
                value={modality}
                onChange={(e) => handleModalitySelect(e.target.value)}
              >
                <option value="" disabled>Selecione</option>
                <option value="online">Online</option>
                <option value="presencial">Presencial</option>
              </select>
            </div>
          )}
          {step >= 2 && modality && (
            <BookingForm
              modality={modality}
              step={step}
              setStep={setStep}
              onBack={handleBack}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;