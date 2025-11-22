import React from 'react';
import { Shot } from '../types';

interface ShotListProps {
    shots: Shot[];
    onDelete: (id: string | number) => void;
    onEdit: (shot: Shot) => void;
}

export const ShotList: React.FC<ShotListProps> = ({ shots, onDelete, onEdit }) => {
    if (shots.length === 0) {
        return (
            <div className="empty-state">
                <p>No shots logged yet. Pull a shot!</p>
            </div>
        );
    }

    return (
        <div className="shots-list">
            {shots.map(shot => {
                const date = new Date(shot.timestamp);
                const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const dateString = date.toLocaleDateString();

                return (
                    <div key={shot.id} className="shot-card">
                        <div className="shot-info">
                            <div className="shot-details" style={{ color: 'var(--text-primary)', fontWeight: 500, marginBottom: '2px' }}>
                                {shot.coffeeBean || 'Unknown Bean'}
                            </div>
                            <div className="shot-details" style={{ marginBottom: '4px' }}>
                                {shot.doseIn}g in / {shot.doseOut}g out
                            </div>
                            <div className="shot-ratio" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                Ratio: {shot.ratio} • {shot.time}s
                            </div>
                        </div>
                        <div className="shot-meta">
                            <div className="shot-time">{dateString} {timeString}</div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button
                                    className="edit-btn"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onEdit(shot);
                                    }}
                                >
                                    ✎
                                </button>
                                <button
                                    className="delete-btn"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete(shot.id);
                                    }}
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
