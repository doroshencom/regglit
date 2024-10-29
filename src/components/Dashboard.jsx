// src/components/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../services/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { format, differenceInDays, addDays } from 'date-fns';

const Dashboard = () => {
  const [nextPeriodDate, setNextPeriodDate] = useState(null);
  const [daysUntilNextPeriod, setDaysUntilNextPeriod] = useState(null);
  const [isRegular, setIsRegular] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    const calculateNextPeriod = async () => {
      // Fetch historical period data from Firebase
      const cyclesCollection = collection(db, 'cycles');
      const cycleSnapshot = await getDocs(cyclesCollection);
      const cycles = cycleSnapshot.docs.map(doc => doc.data()).sort((a, b) => new Date(a.date) - new Date(b.date));

      console.log("Fetched cycles:", cycles); // Debugging line to check data

      if (cycles.length < 2) {
        console.warn("Not enough data to calculate intervals.");
        return;
      }

      // Calculate intervals between periods
      const intervals = [];
      for (let i = 1; i < cycles.length; i++) {
        const prevDate = new Date(cycles[i - 1].date);
        const currDate = new Date(cycles[i].date);
        const interval = differenceInDays(currDate, prevDate);
        intervals.push(interval);
        console.log(`Interval between ${cycles[i - 1].date} and ${cycles[i].date}: ${interval} days`); // Debugging
      }

      // Average interval and regularity check
      const averageInterval = intervals.reduce((acc, val) => acc + val, 0) / intervals.length;
      const deviation = Math.max(...intervals) - Math.min(...intervals);
      setIsRegular(deviation <= 3); // Define regularity threshold

      console.log("Average interval:", averageInterval); // Debugging
      console.log("Cycle regularity (deviation <= 3):", deviation <= 3); // Debugging

      // Calculate next predicted period date
      const lastPeriodDate = new Date(cycles[cycles.length - 1].date);
      const predictedDate = addDays(lastPeriodDate, Math.round(averageInterval));
      setNextPeriodDate(predictedDate);

      // Calculate days until the next period
      const daysRemaining = differenceInDays(predictedDate, new Date());
      setDaysUntilNextPeriod(daysRemaining);

      console.log("Predicted next period date:", predictedDate); // Debugging
      console.log("Days until next period:", daysRemaining); // Debugging
    };

    calculateNextPeriod();
    setCurrentDate(new Date());
  }, []);

  return (
    <div className="dashboard">
      <img src="/path/to/logo.png" alt="Regglit logo" className="logo" />
      <h2>{format(currentDate, 'MMMM')}</h2>
      <h1>{format(currentDate, 'd')}</h1>
      {nextPeriodDate && daysUntilNextPeriod !== null ? (
        <p>
          Debería de bajarte la regla durante los próximos <span style={{ color: 'red' }}>{daysUntilNextPeriod}</span> días
        </p>
      ) : (
        <p>Calculando próxima fecha de menstruación...</p>
      )}
      <button onClick={() => navigate('/symptoms')} className="btn-outline">Añadir Síntoma</button>
      <button onClick={() => navigate('/register')} className="btn-primary">Registrar Periodo</button>
      <button onClick={() => navigate('/calendar')} className="btn-secondary">Calendario</button>
      <p style={{ color: isRegular ? 'green' : 'red' }}>
        {isRegular ? 'Ciclo regular' : 'Ciclo irregular'}
      </p>
    </div>
  );
};

export default Dashboard;
