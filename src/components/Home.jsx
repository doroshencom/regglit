// src/components/Home.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home">
      <img src="/path/to/logo.png" alt="Regglit logo" className="logo" />
      <h1>Regglit</h1>
      <p>Tu periodo, en regla.</p>
      <button onClick={() => navigate('/dashboard')} className="btn-primary">Entrar</button>
    </div>
  );
};

export default Home;
