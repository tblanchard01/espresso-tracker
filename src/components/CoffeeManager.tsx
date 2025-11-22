import React, { useState } from 'react';
import { Coffee } from '../hooks/useCoffees';


interface CoffeeManagerProps {
    isOpen: boolean;
    onClose: () => void;
    coffees: Coffee[];
    onDelete: (id: string) => void;
    onEdit: (id: string, newName: string) => void;
}

export const CoffeeManager: React.FC<CoffeeManagerProps> = ({ isOpen, onClose, coffees, onDelete, onEdit }) => {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState('');
    const [deleteId, setDeleteId] = useState<string | null>(null);

    if (!isOpen) return null;

    const startEdit = (coffee: Coffee) => {
        setEditingId(coffee.id);
        setEditName(coffee.name);
    };

    const saveEdit = () => {
        if (editingId && editName.trim()) {
            onEdit(editingId, editName.trim());
            setEditingId(null);
        }
    };

    const confirmDelete = () => {
        if (deleteId) {
            onDelete(deleteId);
            setDeleteId(null);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{ maxHeight: '80vh', overflowY: 'auto', position: 'relative' }}>
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        background: 'transparent',
                        border: 'none',
                        fontSize: '1.5rem',
                        cursor: 'pointer',
                        color: 'var(--text-secondary)',
                        padding: '4px'
                    }}
                >
                    ✕
                </button>
                <div style={{ marginBottom: '24px', paddingRight: '32px' }}>
                    <h3>Manage Coffees</h3>
                </div>

                <div className="coffee-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {coffees.map(coffee => (
                        <div key={coffee.id} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            {editingId === coffee.id ? (
                                <>
                                    <input
                                        type="text"
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        autoFocus
                                    />
                                    <button onClick={saveEdit} className="primary-btn" style={{ width: 'auto', marginTop: 0, padding: '8px' }}>✓</button>
                                    <button onClick={() => setEditingId(null)} className="secondary-btn" style={{ width: 'auto', marginTop: 0, padding: '8px' }}>✕</button>
                                </>
                            ) : (
                                <>
                                    <span style={{ flexGrow: 1, fontWeight: 500 }}>{coffee.name}</span>
                                    <button
                                        onClick={() => startEdit(coffee)}
                                        className="secondary-btn"
                                        style={{ width: 'auto', padding: '8px', fontSize: '0.8rem' }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => setDeleteId(coffee.id)}
                                        className="danger-btn"
                                        style={{ width: 'auto', padding: '8px', fontSize: '0.8rem' }}
                                    >
                                        Delete
                                    </button>
                                </>
                            )}
                        </div>
                    ))}
                </div>

                {/* Nested Modal for Delete Confirmation */}
                {deleteId && (
                    <div className="modal-overlay" style={{ zIndex: 1100 }}>
                        <div className="modal-content">
                            <h3>Delete Coffee?</h3>
                            <p>Are you sure you want to delete this coffee? This will not affect past shots.</p>
                            <div className="modal-actions">
                                <button onClick={() => setDeleteId(null)} className="secondary-btn">Cancel</button>
                                <button onClick={confirmDelete} className="danger-btn">Delete</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
