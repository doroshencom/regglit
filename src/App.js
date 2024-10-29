// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import RegisterPeriod from './components/RegisterPeriod';
import SymptomsForm from './components/SymptomsForm';
import CalendarView from './components/CalendarView';
import './styles/App.css';

const App = () => {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/register" element={<RegisterPeriod />} />
          <Route path="/symptoms" element={<SymptomsForm />} />
          <Route path="/calendar" element={<CalendarView />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
