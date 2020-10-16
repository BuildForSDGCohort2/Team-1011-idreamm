import React, { useEffect, useState } from 'react';
import TimeCode from 'react-timecode';

export default function TimeCodeWrapper() {
  const [time, setTime] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((time) => time + 1000);
    }, 1000);

    return () => clearInterval(timer);
  }, []);
  return <TimeCode time={time} />;
}
