// src/components/Calendar.jsx
import React, { useState, useEffect } from 'react';
import { db } from '../services/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { format, addDays, differenceInDays, eachDayOfInterval, getDaysInMonth } from 'date-fns';

const Calendar = () => {
  const [viewMode, setViewMode] = useState("month"); // 'month' o 'year'
  const [periodDays, setPeriodDays] = useState([]); // Días de menstruación registrados
  const [nextPredictedDays, setNextPredictedDays] = useState([]); // Próximos días estimados
  const [fertilityDays, setFertilityDays] = useState([]); // Días de fertilidad estimados

  useEffect(() => {
    // Cargar los datos de Firebase
    const fetchCycleData = async () => {
      const cyclesCollection = collection(db, 'cycles');
      const cycleSnapshot = await getDocs(cyclesCollection);
      const cycles = cycleSnapshot.docs.map(doc => doc.data()).sort((a, b) => new Date(a.date) - new Date(b.date));

      if (cycles.length < 2) return;

      // Calcular días de menstruación y próximos ciclos estimados
      const periodDates = cycles.map(cycle => new Date(cycle.date));
      setPeriodDays(periodDates);

      // Calcular el intervalo promedio entre ciclos para predicción
      const intervals = periodDates.slice(1).map((date, index) => differenceInDays(date, periodDates[index]));
      const averageCycleLength = Math.round(intervals.reduce((sum, val) => sum + val, 0) / intervals.length);

      // Calcular próximos periodos estimados y días de fertilidad
      const lastPeriodDate = periodDates[periodDates.length - 1];
      const nextPeriodStart = addDays(lastPeriodDate, averageCycleLength);
      const nextPeriodRange = eachDayOfInterval({ start: nextPeriodStart, end: addDays(nextPeriodStart, 4) });
      setNextPredictedDays(nextPeriodRange);

      const ovulationDay = addDays(nextPeriodStart, -14); // Aproximación del día de ovulación
      const fertilityRange = eachDayOfInterval({ start: addDays(ovulationDay, -3), end: addDays(ovulationDay, 3) });
      setFertilityDays(fertilityRange);
    };

    fetchCycleData();
  }, []);

  // Renderizado de la vista mensual
  const renderMonthView = (month, year) => {
    const daysInMonth = getDaysInMonth(new Date(year, month));
    const days = Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1));

    return (
      <div className="calendar-grid">
        {days.map((day) => {
          const isPeriod = periodDays.some(d => format(d, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd'));
          const isNextPeriod = nextPredictedDays.some(d => format(d, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd'));
          const isFertility = fertilityDays.some(d => format(d, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd'));

          let dayClass = '';
          if (isPeriod) dayClass = 'period-day';
          else if (isNextPeriod) dayClass = 'next-period-day';
          else if (isFertility) dayClass = 'fertility-day';

          return (
            <div key={day} className={`calendar-day ${dayClass}`}>
              {day.getDate()}
            </div>
          );
        })}
      </div>
    );
  };

  // Renderizado de la vista anual
  const renderYearView = (year) => {
    const months = Array.from({ length: 12 }, (_, i) => i);

    return (
      <div className="calendar-year">
        {months.map((month) => (
          <div key={month} className="calendar-month">
            <h3>{format(new Date(year, month), 'MMMM')}</h3>
            {renderMonthView(month, year)}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="calendar">
      <div className="toggle-view">
        <button onClick={() => setViewMode("month")} className={viewMode === "month" ? "active" : ""}>Mes</button>
        <button onClick={() => setViewMode("year")} className={viewMode === "year" ? "active" : ""}>Año</button>
      </div>
      {viewMode === "month" ? renderMonthView(new Date().getMonth(), new Date().getFullYear()) : renderYearView(new Date().getFullYear())}
    </div>
  );
};

export default Calendar;
