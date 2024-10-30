// src/components/RegisterPeriod.jsx
import React, { useState } from 'react';
import { db, auth } from '../services/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { format, getDaysInMonth } from 'date-fns';
import Modal from './Modal';
import Snackbar from './Snackbar';

const RegisterPeriod = ({ onClose = () => {} }) => { // Default to empty function if not provided
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [showModal, setShowModal] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const daysInMonth = getDaysInMonth(new Date(new Date().getFullYear(), selectedMonth));

  const handleMonthChange = (direction) => {
    setSelectedMonth((prev) => (prev + direction + 12) % 12);
  };

  const handleDayClick = (day) => {
    setSelectedDay(day);
  };

  const confirmRegister = async () => {
    try {
      const selectedDate = new Date(new Date().getFullYear(), selectedMonth, selectedDay);
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      const user = auth.currentUser;

      if (user) {
        const periodDocRef = doc(db, `users/${user.uid}/periods`, 'current');
        
        await setDoc(periodDocRef, {
          startDate: formattedDate,
          isActive: true
        });

        setSnackbarMessage('Periodo registrado con éxito');
        setShowModal(false);
        onClose(); // Close the modal and return to the Dashboard
      }
    } catch (error) {
      console.error('Error registrando el periodo:', error);
      setSnackbarMessage('Error al registrar el periodo');
    }
  };

  return (
    <div className="register-period">
      <button className="back-button" onClick={onClose}>Cerrar</button>
      <h2>Selecciona el día en el que ha comenzado tu menstruación:</h2>
      <div className="day-selector">
        <button onClick={() => setSelectedDay((selectedDay - 1 + daysInMonth) % daysInMonth + 1)}>{"<"}</button>
        <div className="day-display">{selectedDay}</div>
        <button onClick={() => setSelectedDay((selectedDay % daysInMonth) + 1)}>{">"}</button>
      </div>
      <div className="month-selector">
        <button onClick={() => handleMonthChange(-1)}>{"<"}</button>
        <div className="month-display">{format(new Date(new Date().getFullYear(), selectedMonth), 'MMMM')}</div>
        <button onClick={() => handleMonthChange(1)}>{">"}</button>
      </div>
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
      <button onClick={() => setShowModal(true)} className="confirm-button">Registrar</button>
      {showModal && (
        <Modal
          message="¿Confirmar el registro del periodo?"
          onConfirm={confirmRegister}
          onCancel={() => setShowModal(false)}
        />
      )}
      {snackbarMessage && (
        <Snackbar message={snackbarMessage} onClose={() => setSnackbarMessage('')} />
      )}
    </div>
  );
};

export default RegisterPeriod;
