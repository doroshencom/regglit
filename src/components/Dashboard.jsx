// src/components/Dashboard.jsx
// Add EndPeriod component with onClose prop
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../services/firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { format, differenceInDays, addDays } from 'date-fns';
import EndPeriod from './EndPeriod';

const Dashboard = () => {
  const [nextPeriodDate, setNextPeriodDate] = useState(null);
  const [daysUntilNextPeriod, setDaysUntilNextPeriod] = useState(null);
  const [isRegular, setIsRegular] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isPeriodActive, setIsPeriodActive] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [displayName, setDisplayName] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setDisplayName(user.displayName);
      fetchUserPeriodData(user.uid);
    }
  }, []);

  const fetchUserPeriodData = async (uid) => {
    const periodRef = doc(db, `users/${uid}/periods`, 'current');
    const periodSnap = await getDoc(periodRef);

    if (periodSnap.exists() && periodSnap.data().isActive) {
      setIsPeriodActive(true);
      setStartDate(new Date(periodSnap.data().startDate));
    } else {
      setIsPeriodActive(false);
      setStartDate(null);
    }

    calculateNextPeriod(uid);
  };

  const calculateNextPeriod = async (uid) => {
    const cyclesCollection = collection(db, `users/${uid}/cycles`);
    const cycleSnapshot = await getDocs(cyclesCollection);
    const cycles = cycleSnapshot.docs
      .map(doc => doc.data())
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    if (cycles.length < 2) return;

    const intervals = cycles.slice(1).map((cycle, i) =>
      differenceInDays(new Date(cycle.date), new Date(cycles[i].date))
    );
    const averageInterval = intervals.reduce((acc, val) => acc + val, 0) / intervals.length;
    const deviation = Math.max(...intervals) - Math.min(...intervals);
    setIsRegular(deviation <= 3);

    const lastPeriodDate = new Date(cycles[cycles.length - 1].date);
    setNextPeriodDate(addDays(lastPeriodDate, Math.round(averageInterval)));
    setDaysUntilNextPeriod(differenceInDays(addDays(lastPeriodDate, Math.round(averageInterval)), new Date()));
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="dashboard">
      <h3 className="user-greeting">Hola, {displayName || "Usuario"}</h3>
      <img src="/path/to/logo.png" alt="Regglit logo" className="logo" />
      <h2>{format(currentDate, 'MMMM')}</h2>
      <h1>{format(currentDate, 'd')}</h1>

      {!isPeriodActive ? (
        <>
          {nextPeriodDate && daysUntilNextPeriod !== null ? (
            <p>
              Debería de bajarte la regla durante los próximos <span style={{ color: 'red' }}>{daysUntilNextPeriod}</span> días
            </p>
          ) : (
            <p>Calculando próxima fecha de menstruación...</p>
          )}

          <p style={{ color: isRegular ? 'green' : 'red' }}>
            {isRegular ? 'Ciclo regular' : 'Ciclo irregular'}
          </p>
          <button onClick={() => navigate('/symptoms')} className="btn-outline">Añadir Síntoma</button>
          <button onClick={() => navigate('/period')} className="btn-primary">Registrar Periodo</button>
          <button onClick={() => navigate('/calendar')} className="btn-secondary">Calendario</button>
        </>
      ) : (
        <>
          <p>Estás en tu periodo</p>
          <p>Iniciado el {startDate ? format(startDate, 'dd/MM/yyyy') : 'N/A'}</p>
          <EndPeriod onPeriodEnd={() => setIsPeriodActive(false)} onClose={() => navigate('/dashboard')} />
        </>
      )}

      <button onClick={() => setShowLogoutModal(true)} className="btn-primary logout-button">Cerrar Sesión</button>

      {showLogoutModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p>¿Estás seguro de que deseas cerrar sesión?</p>
            <div className="modal-buttons">
              <button onClick={handleLogout} className="btn-primary">Sí, cerrar sesión</button>
              <button onClick={() => setShowLogoutModal(false)} className="btn-secondary">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
