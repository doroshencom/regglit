// src/components/CalendarView.jsx
import React, { useState, useEffect } from 'react';
import { db, auth } from '../services/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { format, addDays, differenceInDays, eachDayOfInterval, getDaysInMonth } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import BackButton from './BackButton';

const CalendarView = () => {
  const [viewMode, setViewMode] = useState("month");
  const [periodRanges, setPeriodRanges] = useState([]);
  const [nextPredictedDays, setNextPredictedDays] = useState([]);
  const [fertilityDays, setFertilityDays] = useState([]);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());

  useEffect(() => {
    const fetchCycleData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const periodsCollection = collection(db, `users/${user.uid}/periods`);
          const periodSnapshot = await getDocs(periodsCollection);

          const periods = periodSnapshot.docs
            .map(doc => doc.data())
            .filter(data => data.startDate && data.duration)
            .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

          // Construct period ranges to highlight on calendar
          const periodRanges = periods.map(period => {
            const startDate = new Date(period.startDate);
            const endDate = addDays(startDate, period.duration - 1);
            const range = eachDayOfInterval({ start: startDate, end: endDate });
            return { range, startDate, endDate };
          });
          setPeriodRanges(periodRanges);

          if (periods.length < 2) return;

          // Calculate average cycle length and predict next period
          const intervals = periods.slice(1).map((period, index) =>
            differenceInDays(new Date(period.startDate), new Date(periods[index].startDate))
          );
          const averageCycleLength = Math.round(intervals.reduce((sum, val) => sum + val, 0) / intervals.length);

          const lastPeriodDate = new Date(periods[periods.length - 1].startDate);
          const nextPeriodStart = addDays(lastPeriodDate, averageCycleLength);
          const nextPeriodRange = eachDayOfInterval({ start: nextPeriodStart, end: addDays(nextPeriodStart, 4) });
          setNextPredictedDays(nextPeriodRange);

          // Calculate fertility days based on ovulation day (14 days before next period start)
          const ovulationDay = addDays(nextPeriodStart, -14);
          const fertilityRange = eachDayOfInterval({ start: addDays(ovulationDay, -3), end: addDays(ovulationDay, 3) });
          setFertilityDays(fertilityRange);
        }
      } catch (error) {
        console.error("Error fetching period data:", error);
      }
    };

    fetchCycleData();
  }, []);

  const renderMonthView = (month, year) => {
    const daysInMonth = getDaysInMonth(new Date(year, month));
    const days = Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1));

    return (
      <div className="calendar-grid">
        {days.map((day) => {
          const formattedDay = format(day, 'yyyy-MM-dd');
          let dayClass = '';

          // Determine class for start, end, and range of period days
          periodRanges.forEach(({ range, startDate, endDate }) => {
            if (format(startDate, 'yyyy-MM-dd') === formattedDay) {
              dayClass = 'start-period-day';
            } else if (format(endDate, 'yyyy-MM-dd') === formattedDay) {
              dayClass = 'end-period-day';
            } else if (range.some(d => format(d, 'yyyy-MM-dd') === formattedDay)) {
              dayClass = 'period-day';
            }
          });

          // Check if day is part of next predicted period or fertility window
          if (nextPredictedDays.some(d => format(d, 'yyyy-MM-dd') === formattedDay)) {
            dayClass = 'next-period-day';
          }
          if (fertilityDays.some(d => format(d, 'yyyy-MM-dd') === formattedDay)) {
            dayClass = 'fertility-day';
          }

          return (
            <div key={day} className={`calendar-day ${dayClass}`}>
              {day.getDate()}
            </div>
          );
        })}
      </div>
    );
  };

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

  const handleNextYear = () => setCurrentYear(prevYear => prevYear + 1);
  const handlePreviousYear = () => setCurrentYear(prevYear => prevYear - 1);
  const handleNextMonth = () => setCurrentMonth(prevMonth => (prevMonth + 1) % 12);
  const handlePreviousMonth = () => setCurrentMonth(prevMonth => (prevMonth - 1 + 12) % 12);

  return (
    <div className="calendar">
      <BackButton />

      <div className="toggle-view">
        <button onClick={() => setViewMode("month")} className={viewMode === "month" ? "active" : ""}>Mes</button>
        <button onClick={() => setViewMode("year")} className={viewMode === "year" ? "active" : ""}>Año</button>
      </div>

      <div className="navigation">
        {viewMode === "month" ? (
          <div className="month-navigation">
            <button onClick={handlePreviousMonth}>
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            <h2>{format(new Date(currentYear, currentMonth), 'MMMM yyyy')}</h2>
            <button onClick={handleNextMonth}>
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>
        ) : (
          <div className="year-navigation">
            <button onClick={handlePreviousYear}>
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            <h2>{currentYear}</h2>
            <button onClick={handleNextYear}>
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>
        )}
      </div>

      {viewMode === "month" ? renderMonthView(currentMonth, currentYear) : renderYearView(currentYear)}

      <div className="legend">
        <p><span className="legend-box start-period-day"></span> Inicio del periodo</p>
        <p><span className="legend-box period-day"></span> Días de menstruación</p>
        <p><span className="legend-box end-period-day"></span> Fin del periodo</p>
        <p><span className="legend-box next-period-day"></span> Próximo periodo estimado</p>
        <p><span className="legend-box fertility-day"></span> Días de fertilidad</p>
      </div>
    </div>
  );
};

export default CalendarView;
