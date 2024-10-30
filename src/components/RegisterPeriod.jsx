// src/components/RegisterPeriod.jsx
import React, { useState } from 'react';
import { db } from '../services/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { format, getDaysInMonth } from 'date-fns';
import BackButton from './BackButton';
import Modal from './Modal'; // Componente Modal de confirmación
import Snackbar from './Snackbar'; // Componente Snackbar para mensajes

const RegisterPeriod = ({ onClose }) => {
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [showModal, setShowModal] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const daysInMonth = getDaysInMonth(new Date(new Date().getFullYear(), selectedMonth));

  // Cambia de mes
  const handleMonthChange = (direction) => {
    setSelectedMonth((prev) => (prev + direction + 12) % 12);
  };

  // Selecciona día directamente del calendario
  const handleDayClick = (day) => {
    setSelectedDay(day);
  };

  // Confirma y guarda el periodo en Firebase
  const confirmRegister = async () => {
    try {
      const selectedDate = new Date(new Date().getFullYear(), selectedMonth, selectedDay);
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      
      await setDoc(doc(db, 'cycles', formattedDate), {
        date: formattedDate,
        event: 'inicio'
      });

      setSnackbarMessage('Periodo registrado con éxito');
      setShowModal(false);
    } catch (error) {
      console.error('Error registrando el periodo:', error);
      setSnackbarMessage('Error al registrar el periodo');
    }
  };

  return (
    <div className="register-period">
      <button className="back-button" onClick={onClose}>Cerrar</button>
      <h2>Selecciona el día en el que ha comenzado tu menstruación:</h2>

      {/* Selector de número de día */}
      <div className="day-selector">
        <button onClick={() => setSelectedDay((selectedDay - 1 + daysInMonth) % daysInMonth + 1)}>{"<"}</button>
        <div className="day-display">{selectedDay}</div>
        <button onClick={() => setSelectedDay((selectedDay % daysInMonth) + 1)}>{">"}</button>
      </div>

      {/* Selector de mes */}
      <div className="month-selector">
        <button onClick={() => handleMonthChange(-1)}>{"<"}</button>
        <div className="month-display">{format(new Date(new Date().getFullYear(), selectedMonth), 'MMMM')}</div>
        <button onClick={() => handleMonthChange(1)}>{">"}</button>
      </div>

      {/* Calendario de días */}
      <div className="calendar-grid">
        {[...Array(daysInMonth)].map((_, dayIndex) => (
          <div
            key={dayIndex + 1}
            className={`calendar-day ${selectedDay === dayIndex + 1 ? 'selected' : ''}`}
            onClick={() => handleDayClick(dayIndex + 1)}
          >
            {dayIndex + 1}
          </div>
        ))}
      </div>

      {/* Botón de confirmación */}
      <button onClick={() => setShowModal(true)} className="confirm-button">Registrar</button>

      {/* Modal de confirmación */}
      {showModal && (
        <Modal
          message="¿Confirmar el registro del periodo?"
          onConfirm={confirmRegister}
          onCancel={() => setShowModal(false)}
        />
      )}

      {/* Snackbar para confirmar la acción */}
      {snackbarMessage && (
        <Snackbar message={snackbarMessage} onClose={() => setSnackbarMessage('')} />
      )}
    </div>
  );
};

export default RegisterPeriod;
