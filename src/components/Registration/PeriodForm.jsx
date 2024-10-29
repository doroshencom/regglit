// src/components/Registration/PeriodForm.jsx
import React, { useState } from 'react';
import { db } from '../../services/firebase';

const PeriodForm = () => {
  const [cycleData, setCycleData] = useState({
    startDate: '',
    endDate: '',
    symptoms: {
      spotting: false,
      bloating: false,
      moodSwings: false,
      headache: false,
      fatigue: false,
      breastTenderness: false,
      backPain: false,
      others: '',
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await db.collection('cycles').add(cycleData);
      alert("Cycle data saved successfully!");
    } catch (error) {
      console.error("Error saving cycle data: ", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register Cycle</h2>
      <label>
        Start Date:
        <input
          type="date"
          value={cycleData.startDate}
          onChange={(e) => setCycleData({ ...cycleData, startDate: e.target.value })}
          required
        />
      </label>
      <label>
        End Date:
        <input
          type="date"
          value={cycleData.endDate}
          onChange={(e) => setCycleData({ ...cycleData, endDate: e.target.value })}
          required
        />
      </label>
      <h3>Symptoms</h3>
      {Object.keys(cycleData.symptoms).map((symptom) => (
        <label key={symptom}>
          <input
            type="checkbox"
            checked={cycleData.symptoms[symptom]}
            onChange={() => setCycleData({
              ...cycleData,
              symptoms: { ...cycleData.symptoms, [symptom]: !cycleData.symptoms[symptom] }
            })}
          />
          {symptom}
        </label>
      ))}
      <button type="submit">Save Cycle</button>
    </form>
  );
};

export default PeriodForm;
