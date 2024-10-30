// src/components/Home.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithGoogle } from '../auth/socialAuth';

const Home = () => {
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    await signInWithGoogle();
    navigate('/dashboard');
  };

  const handleFacebookSignIn = async () => {
    await signInWithFacebook();
    navigate('/dashboard');
  };

  return (
    <div className="home">
      <img src="/path/to/logo.png" alt="Regglit logo" className="logo" />
      <h1>Regglit</h1>
      <p>Tu periodo, en regla.</p>
      <button onClick={() => navigate('/dashboard')} className="btn-primary">Entrar</button>
      <button onClick={handleGoogleSignIn} className="btn-primary btn-google">Sign in with Google</button>

    </div>
  );
};

export default Home;
