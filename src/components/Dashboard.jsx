// src/components/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../services/firebase';
import { collection, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import { format, differenceInDays, addDays } from 'date-fns';
import EndPeriod from './EndPeriod'; // Componente para finalizar el periodo
import BackButton from './BackButton';

const Dashboard = () => {
  const [nextPeriodDate, setNextPeriodDate] = useState(null);
  const [daysUntilNextPeriod, setDaysUntilNextPeriod] = useState(null);
  const [isRegular, setIsRegular] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isPeriodActive, setIsPeriodActive] = useState(false);
  const [startDate, setStartDate] = useState(null); // Fecha de inicio del periodo
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPeriodStatus = async () => {
      // Verificar si hay un periodo activo en la base de datos
      const docRef = doc(db, 'periods', 'current');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists() && docSnap.data().isActive) {
        setIsPeriodActive(true);
        setStartDate(new Date(docSnap.data().startDate)); // Guardar la fecha de inicio del periodo
      } else {
        setIsPeriodActive(false);
        setStartDate(null);
      }
    };

    const calculateNextPeriod = async () => {
      const cyclesCollection = collection(db, 'cycles');
      const cycleSnapshot = await getDocs(cyclesCollection);
      const cycles = cycleSnapshot.docs.map(doc => doc.data()).sort((a, b) => new Date(a.date) - new Date(b.date));

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

    fetchPeriodStatus();
    calculateNextPeriod();
    setCurrentDate(new Date());
  }, []);

  return (
    <div className="dashboard">
      <BackButton /> {/* Botón de regreso */}
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
          <button onClick={() => navigate('/register')} className="btn-primary">Registrar Periodo</button>
          <button onClick={() => navigate('/calendar')} className="btn-secondary">Calendario</button>

        </>
      ) : (
        <>
          <p>Estás en tu periodo</p>
          <p>Iniciado el {startDate ? format(startDate, 'dd/MM/yyyy') : 'N/A'}</p>
          <EndPeriod onPeriodEnd={() => setIsPeriodActive(false)} /> {/* Componente para finalizar el periodo */}
        </>
      )}
    </div>
  );
};

export default Dashboard;
