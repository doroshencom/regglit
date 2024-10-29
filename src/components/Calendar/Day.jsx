
import React from 'react';

const Day = ({ date, event }) => (
  <div className={`day ${event ? 'event' : ''}`}>
    <span>{date}</span>
    {event && <span className="dot"></span>}
  </div>
);

export default Day;
