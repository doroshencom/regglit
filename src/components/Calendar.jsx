// src/components/CalendarView.jsx
import React, { useState } from 'react';

const CalendarView = () => {
  const [viewMode, setViewMode] = useState("month"); // "month" o "year"

  return (
    <div className="calendar-view">
      <div className="view-toggle">
        <button onClick={() => setViewMode("month")} className={viewMode === "month" ? "active" : ""}>Mes</button>
        <button onClick={() => setViewMode("year")} className={viewMode === "year" ? "active" : ""}>Año</button>
      </div>
      {/* Renderizado condicional de calendario mensual o anual */}
      {viewMode === "month" ? (
        <MonthCalendar />
      ) : (
        <YearCalendar />
      )}
    </div>
  );
};

export default CalendarView;
