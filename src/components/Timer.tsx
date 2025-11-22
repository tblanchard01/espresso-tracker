import React from 'react';

interface TimerProps {
    time: number;
    isRunning: boolean;
    onToggle: () => void;
    onReset: () => void;
}

export const Timer: React.FC<TimerProps> = ({ time, isRunning, onToggle, onReset }) => {
    return (
        <div className="timer-container">
            <div id="timer-display" className="timer-display">
                {time.toFixed(1)}<span className="timer-unit">s</span>
            </div>

            <div className="timer-controls">
                <button
                    type="button"
                    id="timer-btn"
                    className={`timer-btn ${isRunning ? 'running' : ''}`}
                    onClick={onToggle}
                >
                    {isRunning ? 'STOP' : 'START'}
                </button>

                {!isRunning && time > 0 && (
                    <button
                        type="button"
                        id="timer-reset"
                        className="timer-reset"
                        title="Reset Timer"
                        onClick={onReset}
                    >
                        Reset
                    </button>
                )}
            </div>
        </div>
    );
};
