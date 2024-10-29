// src/components/RegisterPeriod.jsx
import React, { useState } from 'react';

const RegisterPeriod = ({ onComplete }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  return (
    <div className="register-period">
      <h3>Selecciona el día en el que ha comenzado tu menstruación:</h3>
      <Calendar selectedDate={selectedDate} onDateChange={handleDateChange} />
      <button onClick={() => onComplete(selectedDate)} className="btn-primary">Registrar</button>
    </div>
  );
};

export default RegisterPeriod;
