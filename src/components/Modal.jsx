// src/components/Modal.jsx
import React from 'react';
import '../styles/App.css'; // Asegúrate de que el CSS global se aplique aquí

const Modal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p>{message}</p>
        <div className="modal-buttons">
          <button onClick={onConfirm} className="btn-primary">Confirmar</button>
          <button onClick={onCancel} className="btn-secondary">Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
