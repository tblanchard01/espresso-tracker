import { useState, useRef } from 'react';

export const useTimer = () => {
    const [elapsedTime, setElapsedTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const startTimeRef = useRef<number | null>(null);
    const timerIntervalRef = useRef<number | null>(null);

    const toggleTimer = () => {
        if (isRunning) {
            if (timerIntervalRef.current) {
                clearInterval(timerIntervalRef.current);
                timerIntervalRef.current = null;
            }
            setIsRunning(false);
        } else {
            startTimeRef.current = Date.now() - (elapsedTime * 1000);
            timerIntervalRef.current = setInterval(() => {
                const now = Date.now();
                if (startTimeRef.current) {
                    setElapsedTime((now - startTimeRef.current) / 1000);
                }
            }, 100) as unknown as number;
            setIsRunning(true);
        }
    };

    const resetTimer = () => {
        if (isRunning) toggleTimer();
        setElapsedTime(0);
    };

    return {
        elapsedTime,
        isRunning,
        toggleTimer,
        resetTimer
    };
};
