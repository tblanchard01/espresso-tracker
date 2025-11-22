import React from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

export const SignIn: React.FC = () => {
    const signInWithGoogle = async () => {
        if (!auth) {
            alert("Firebase is not configured.");
            return;
        }
        try {
            await signInWithPopup(auth, googleProvider!);
        } catch (error) {
            console.error("Error signing in with Google", error);
            alert("Failed to sign in. Check console for details.");
        }
    };

    return (
        <div className="sign-in-container" style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            gap: '1rem'
        }}>
            <h1>Espresso Tracker</h1>
            <p>Sign in to save your shots to the cloud</p>
            <button
                onClick={signInWithGoogle}
                className="primary-btn"
                style={{ maxWidth: '300px' }}
            >
                Sign in with Google
            </button>
        </div>
    );
};
