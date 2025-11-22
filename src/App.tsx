import { Timer } from './components/Timer';
import { ShotForm } from './components/ShotForm';
import { ShotList } from './components/ShotList';
import { auth } from './firebase';
import { signOut } from 'firebase/auth';
import { useTimer } from './hooks/useTimer';
import { useAuth } from './hooks/useAuth';
import { useShots } from './hooks/useShots';
import { useCoffees } from './hooks/useCoffees';
import { Shot } from './types';
import './style.css';

import { Modal } from './components/Modal';
import { CoffeeManager } from './components/CoffeeManager';
import { useState } from 'react';

function App() {
    const { user, loading, isFirebaseAvailable } = useAuth();
    const { shots, addShot, deleteShot } = useShots(user);
    const { coffees, addCoffee, deleteCoffee, editCoffee } = useCoffees(user);
    const { elapsedTime, isRunning, toggleTimer, resetTimer } = useTimer();

    const [shotToDelete, setShotToDelete] = useState<string | number | null>(null);
    const [, setShotToEdit] = useState<Shot | null>(null);
    const [isManagerOpen, setIsManagerOpen] = useState(false);

    const handleAddShot = async (doseIn: number, doseOut: number, coffeeBean: string) => {
        const success = await addShot(doseIn, doseOut, parseFloat(elapsedTime.toFixed(1)), coffeeBean);
        if (success) {
            resetTimer();
        }
    };

    const confirmDelete = () => {
        if (shotToDelete) {
            deleteShot(shotToDelete);
            setShotToDelete(null);
        }
    };

    if (loading) return <div className="app-container">Loading...</div>;

    const handleSignIn = async () => {
        if (!isFirebaseAvailable) return;

        try {
            const { signInWithPopup } = await import('firebase/auth');
            const { auth, googleProvider } = await import('./firebase');

            if (auth && googleProvider) {
                await signInWithPopup(auth, googleProvider);
            }
        } catch (error) {
            console.error('Sign-in error:', error);
            alert('Failed to sign in. Please try again.');
        }
    };

    return (
        <div className="app-container">
            <Modal
                isOpen={!!shotToDelete}
                onClose={() => setShotToDelete(null)}
                onConfirm={confirmDelete}
                title="Delete Shot"
                message="Are you sure you want to delete this shot? This action cannot be undone."
            />

            <CoffeeManager
                isOpen={isManagerOpen}
                onClose={() => setIsManagerOpen(false)}
                coffees={coffees}
                onDelete={deleteCoffee}
                onEdit={editCoffee}
            />

            <header>
                <h1>Espresso Tracker</h1>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {user ? (
                        <>
                            <span className="mode-badge" style={{ background: '#e6f7ed', color: '#38a169' }}>☁️ Synced</span>
                            <button onClick={() => auth && signOut(auth)} className="secondary-btn" style={{ padding: '4px 12px', fontSize: '0.8rem' }}>
                                Sign Out
                            </button>
                        </>
                    ) : (
                        <>
                            {isFirebaseAvailable && (
                                <button onClick={handleSignIn} className="secondary-btn" style={{ padding: '4px 12px', fontSize: '0.8rem' }}>
                                    Sign In
                                </button>
                            )}
                        </>
                    )}
                </div>
            </header>

            <main>
                <section className="input-section glass-panel">
                    <ShotForm
                        onLog={handleAddShot}
                        coffees={coffees}
                        onAddCoffee={addCoffee}
                        onManageCoffees={() => setIsManagerOpen(true)}
                        isAuthenticated={!!user}
                        onSignIn={handleSignIn}
                    >
                        <Timer
                            time={elapsedTime}
                            isRunning={isRunning}
                            onToggle={toggleTimer}
                            onReset={resetTimer}
                        />
                    </ShotForm>
                </section>

                <section className="history-section">
                    <h2 className='recent-shots'>Recent Shots</h2>
                    <ShotList shots={shots} onDelete={setShotToDelete} onEdit={setShotToEdit} />
                </section>
            </main>
        </div>
    );
}

export default App;
