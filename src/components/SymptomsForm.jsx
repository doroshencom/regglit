// src/components/SymptomsForm.jsx
import React, { useState } from 'react';

const SymptomsForm = () => {
  const [symptoms, setSymptoms] = useState({
    spotting: false,
    bloating: false,
    moodSwings: false,
    headache: false,
    fatigue: false,
    breastTenderness: false,
    backPain: false,
    others: ''
  });

  const handleSymptomChange = (symptom) => {
    setSymptoms({ ...symptoms, [symptom]: !symptoms[symptom] });
  };

  return (
    <div className="symptoms-form">
      <h3>¿Tienes síntomas relacionados con el ciclo?</h3>
      {Object.keys(symptoms).map(symptom => (
        <label key={symptom} className="symptom-label">
          <input
            type="checkbox"
            checked={symptoms[symptom]}
            onChange={() => handleSymptomChange(symptom)}
          />
          {symptom.charAt(0).toUpperCase() + symptom.slice(1)}
        </label>
      ))}
      <button className="btn-primary">Añadir Síntoma</button>
    </div>
  );
};

export default SymptomsForm;
