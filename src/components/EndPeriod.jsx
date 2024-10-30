// src/components/EndPeriod.jsx
import React, { useState } from 'react';
import { db } from '../services/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import Modal from './Modal';
import Snackbar from './Snackbar';

const EndPeriod = ({ onPeriodEnd }) => {
  const [showModal, setShowModal] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);

  const handleEndPeriod = async () => {
    const docRef = doc(db, 'periods', 'current');
    await updateDoc(docRef, { isActive: false, endDate: new Date().toISOString() });
    onPeriodEnd();
    setShowSnackbar(true); // Mostrar Snackbar de confirmación
  };

  return (
    <>
      <button onClick={() => setShowModal(true)} className="btn-primary">Ha terminado mi periodo</button>
      {showModal && (
        <Modal
          message="¿Estás seguro de que quieres finalizar el periodo?"
          onConfirm={() => {
            handleEndPeriod();
            setShowModal(false);
          }}
          onCancel={() => setShowModal(false)}
        />
      )}
      {showSnackbar && (
        <Snackbar
          message="Periodo finalizado con éxito"
          onClose={() => setShowSnackbar(false)}
        />
      )}
    </>
  );
};

export default EndPeriod;
