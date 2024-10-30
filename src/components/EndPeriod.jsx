// src/components/EndPeriod.jsx
import React, { useState } from 'react';
import { db, auth } from '../services/firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { format, differenceInDays } from 'date-fns';
import Modal from './Modal';
import Snackbar from './Snackbar';

const EndPeriod = ({ onClose = () => {} }) => { // Add a default function
  const [showModal, setShowModal] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const confirmEndPeriod = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const periodDocRef = doc(db, `users/${user.uid}/periods`, 'current');
        const endDate = new Date();
        const formattedEndDate = format(endDate, 'yyyy-MM-dd');

        const periodDoc = await getDoc(periodDocRef);
        if (periodDoc.exists()) {
          const startDate = new Date(periodDoc.data().startDate);
          const duration = differenceInDays(endDate, startDate) + 1;

          await updateDoc(periodDocRef, {
            endDate: formattedEndDate,
            duration: duration,
            isActive: false
          });

          setSnackbarMessage('Periodo finalizado con éxito');
          setShowModal(false);
          onClose(); // Call onClose to close the component
        }
      }
    } catch (error) {
      console.error('Error finalizando el periodo:', error);
      setSnackbarMessage('Error al finalizar el periodo');
    }
  };

  return (
    <div className="end-period">
      <h2>Confirmar la fecha de finalización del periodo</h2>
      <button onClick={() => setShowModal(true)} className="confirm-button">Finalizar Periodo</button>
      {showModal && (
        <Modal
          message="¿Confirmar el final del periodo?"
          onConfirm={confirmEndPeriod}
          onCancel={() => setShowModal(false)}
        />
      )}
      {snackbarMessage && (
        <Snackbar message={snackbarMessage} onClose={() => setSnackbarMessage('')} />
      )}
    </div>
  );
};

export default EndPeriod;
