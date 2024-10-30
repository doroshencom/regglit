// src/components/PeriodCalendar.jsx
import React, { useState } from 'react';
import { getDaysInMonth, startOfMonth, format } from 'date-fns';

const PeriodCalendar = ({ defaultDate = new Date(), onConfirmDate }) => {
  const [selectedDate, setSelectedDate] = useState(defaultDate);

  const daysInMonth = getDaysInMonth(selectedDate);
  const startDay = startOfMonth(selectedDate).getDay(); // Día de la semana de inicio

  const handleDateClick = (day) => {
    const date = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
    setSelectedDate(date);
  };

  const handleConfirmClick = () => {
    onConfirmDate(selectedDate); // Llama al callback con la fecha seleccionada
  };

  // Generar una matriz de fechas del mes
  const datesArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="period-calendar">
      <h3>{format(selectedDate, 'MMMM yyyy')}</h3>
      <div className="calendar-grid">
        {[...Array(startDay)].map((_, i) => (
          <div key={`empty-${i}`} className="calendar-day empty" />
        ))}
        {datesArray.map((day) => (
          <div
            key={day}
            className={`calendar-day ${selectedDate.getDate() === day ? 'selected' : ''}`}
            onClick={() => handleDateClick(day)}
          >
            {day}
          </div>
        ))}
      </div>
      <button className="confirm-button" onClick={handleConfirmClick}>
        Confirmar
      </button>
    </div>
  );
};

export default PeriodCalendar;
