import React, { useState, useEffect } from 'react';
import { Coffee } from '../hooks/useCoffees';

interface ShotFormProps {
    onLog: (doseIn: number, doseOut: number, coffeeBean: string) => void;
    coffees: Coffee[];
    onAddCoffee: (name: string) => void;
    onManageCoffees: () => void;
    isAuthenticated: boolean;
    onSignIn: () => void;
    children?: React.ReactNode;
}

export const ShotForm: React.FC<ShotFormProps> = ({
    onLog,
    coffees,
    onAddCoffee,
    onManageCoffees,
    isAuthenticated,
    onSignIn,
    children
}) => {
    const [doseIn, setDoseIn] = useState('18');
    const [doseOut, setDoseOut] = useState('36');
    const [ratio, setRatio] = useState(2.0);
    const [coffeeBean, setCoffeeBean] = useState(coffees[0]?.name || "House Blend");

    const [isAddingCoffee, setIsAddingCoffee] = useState(false);
    const [newCoffeeName, setNewCoffeeName] = useState('');

    // Update selected bean if coffees list changes
    useEffect(() => {
        if (coffees.length > 0 && !coffees.some(c => c.name === coffeeBean)) {
            setCoffeeBean(coffees[0].name);
        }
    }, [coffees]);

    // Auto-calculate doseOut when ratio or doseIn changes
    const handleRatioChange = (newRatio: number) => {
        setRatio(newRatio);
        const inVal = parseFloat(doseIn);
        if (!isNaN(inVal)) {
            setDoseOut((inVal * newRatio).toFixed(1));
        }
    };

    const handleDoseInChange = (val: string) => {
        setDoseIn(val);
        const inVal = parseFloat(val);
        if (!isNaN(inVal)) {
            setDoseOut((inVal * ratio).toFixed(1));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isAuthenticated) {
            onLog(parseFloat(doseIn), parseFloat(doseOut), coffeeBean);
        }
    };

    const handleSaveCoffee = () => {
        if (newCoffeeName && newCoffeeName.trim()) {
            onAddCoffee(newCoffeeName.trim());
            setCoffeeBean(newCoffeeName.trim());
            setIsAddingCoffee(false);
            setNewCoffeeName('');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {children}

            <div className="form-group">
                <label htmlFor="coffee-bean">Coffee Bean</label>
                {isAddingCoffee ? (
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <input
                            autoFocus
                            type="text"
                            placeholder="Roaster - Bean Name"
                            value={newCoffeeName}
                            onChange={(e) => setNewCoffeeName(e.target.value)}
                            style={{ flexGrow: 1 }}
                        />
                        <button
                            type="button"
                            onClick={handleSaveCoffee}
                            className="primary-btn"
                            style={{ width: 'auto', marginTop: 0, padding: '0 16px' }}
                        >
                            Save
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsAddingCoffee(false)}
                            className="secondary-btn"
                            style={{ width: 'auto', marginTop: 0 }}
                        >
                            Cancel
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <select
                            id="coffee-bean"
                            value={coffeeBean}
                            onChange={(e) => setCoffeeBean(e.target.value)}
                            className="select-input"
                            style={{ flexGrow: 1 }}
                        >
                            {coffees.map(bean => (
                                <option key={bean.id} value={bean.name}>{bean.name}</option>
                            ))}
                        </select>
                        <button
                            type="button"
                            onClick={() => setIsAddingCoffee(true)}
                            className="icon-btn"
                            title="Add new coffee"
                        >
                            +
                        </button>
                        <button
                            type="button"
                            onClick={onManageCoffees}
                            className="icon-btn"
                            title="Manage coffees"
                            style={{ fontSize: '1rem' }}
                        >
                            ⚙️
                        </button>
                    </div>
                )}
            </div>

            <div className="form-group">
                <label>Target Ratio: 1:{ratio.toFixed(1)}</label>
                <input
                    type="range"
                    min="1"
                    max="5"
                    step="0.5"
                    value={ratio}
                    onChange={(e) => handleRatioChange(parseFloat(e.target.value))}
                    style={{ width: '100%', margin: '8px 0' }}
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                    <label htmlFor="dose-in">Dose In <span className="unit">(g)</span></label>
                    <input
                        type="number"
                        id="dose-in"
                        step="0.1"
                        value={doseIn}
                        onChange={(e) => handleDoseInChange(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="dose-out">Dose Out <span className="unit">(g)</span></label>
                    <input
                        type="number"
                        id="dose-out"
                        step="0.1"
                        value={doseOut}
                        onChange={(e) => setDoseOut(e.target.value)}
                    />
                </div>
            </div>

            {isAuthenticated ? (
                <button type="submit" className="primary-btn">
                    Log Shot
                </button>
            ) : (
                <button
                    type="button"
                    onClick={onSignIn}
                    className="primary-btn"
                    style={{ background: '#48bb78', cursor: 'pointer' }}
                >
                    Sign In to Log Shot
                </button>
            )}
        </form>
    );
};
