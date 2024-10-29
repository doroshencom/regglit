// src/components/Prediction/Prediction.jsx
import React, { useEffect, useState } from 'react';
import { db } from '../../services/firebase';

const Prediction = () => {
  const [nextCycleDate, setNextCycleDate] = useState('');
  
  useEffect(() => {
    const calculateNextCycle = async () => {
      const cycles = await db.collection('cycles').orderBy('startDate', 'desc').get();
      if (cycles.docs.length >= 2) {
        const lastCycle = cycles.docs[0].data();
        const avgDuration = cycles.docs.slice(1).reduce((acc, doc) => {
          return acc + new Date(doc.data().startDate) - new Date(doc.data().endDate);
        }, 0) / (cycles.docs.length - 1);
        const nextCycleEstimate = new Date(new Date(lastCycle.endDate).getTime() + avgDuration);
        setNextCycleDate(nextCycleEstimate.toLocaleDateString());
      }
    };
    calculateNextCycle();
  }, []);

  return (
    <div>
      <h2>Next Cycle Prediction</h2>
      <p>Estimated start of next cycle: {nextCycleDate || "Calculating..."}</p>
    </div>
  );
};

export default Prediction;
