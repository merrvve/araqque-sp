"use client";

import { useState, useEffect } from "react";

type TimeProp = {
  initialTime: number;
  quizState: boolean;
  onTimeOut: () => void;
};

export const CountdownTimer = ({ initialTime, quizState, onTimeOut }: TimeProp) => {
  const [timeRemaining, setTimeRemaining] = useState(initialTime);

  useEffect(() => {
    // Reset timer when quizState changes
    setTimeRemaining(initialTime);

    // Only start timer if quizState is true
    if (!quizState) return;

    const timerInterval = setInterval(() => {
      setTimeRemaining((prevTime: number) => {
        if (prevTime <= 1) {
          clearInterval(timerInterval); // Stop timer at zero
          setTimeout(onTimeOut, 0); // Defer calling onTimeOut to avoid direct state update during render
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    // Cleanup interval on unmount or when quizState changes
    return () => clearInterval(timerInterval);
  }, []);

  // Convert seconds to minutes and seconds for display
  const minutes = Math.floor((timeRemaining % 3600) / 60);
  const seconds = timeRemaining % 60;

  return (
    
    <div className="font-bold text-2xl">
      {quizState && <>
        <h2>Kalan Süre:</h2>
        <p className="leading-loose">{`${minutes} dk ${seconds} sn`}</p>
      </>}
      
    </div>
  );
};
