// src/components/Snackbar.jsx
import React, { useEffect } from 'react';
import '../styles/App.css'; // Asegúrate de que el CSS global se aplique aquí

const Snackbar = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000); // Cierra el snackbar después de 3 segundos
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="snackbar">
      {message}
    </div>
  );
};

export default Snackbar;
