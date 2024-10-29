// src/components/Statistics/Statistics.jsx
import React, { useEffect, useState } from 'react';
import { db } from '../../services/firebase';
import { Bar } from 'react-chartjs-2';

const Statistics = () => {
  const [cycleDurations, setCycleDurations] = useState([]);
  
  useEffect(() => {
    const fetchCycleDurations = async () => {
      const cycles = await db.collection('cycles').get();
      const durations = cycles.docs.map(doc => {
        const data = doc.data();
        return new Date(data.endDate) - new Date(data.startDate);
      });
      setCycleDurations(durations);
    };
    fetchCycleDurations();
  }, []);

  return (
    <div>
      <h2>Cycle Duration Statistics</h2>
      <Bar data={{
        labels: cycleDurations.map((_, i) => `Cycle ${i + 1}`),
        datasets: [{ label: 'Duration (days)', data: cycleDurations }]
      }} />
    </div>
  );
};

export default Statistics;
