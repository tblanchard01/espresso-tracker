import { useState, useEffect } from 'react';
import { Shot } from '../types';
import { User } from 'firebase/auth';
import { db } from '../firebase';
import {
    collection,
    addDoc,
    deleteDoc,
    doc,
    query,
    orderBy,
    onSnapshot,
    serverTimestamp
} from 'firebase/firestore';

export const useShots = (user: User | null) => {
    const [shots, setShots] = useState<Shot[]>([]);

    // Initial Load & Sync
    useEffect(() => {
        if (user && db) {
            const q = query(
                collection(db, 'users', user.uid, 'shots'),
                orderBy('createdAt', 'desc')
            );

            const unsubscribe = onSnapshot(q, (snapshot) => {
                const loadedShots = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as unknown as Shot[];
                setShots(loadedShots);
            });

            return () => unsubscribe();
        } else {
            setShots([]);
        }
    }, [user]);

    const addShot = async (doseIn: number, doseOut: number, time: number, coffeeBean: string) => {
        const ratio = doseOut / doseIn;
        const newShotBase = {
            doseIn,
            doseOut,
            time,
            ratio: ratio.toFixed(2),
            coffeeBean,
            timestamp: new Date().toISOString(),
        };

        if (user && db) {
            try {
                await addDoc(collection(db, 'users', user.uid, 'shots'), {
                    ...newShotBase,
                    createdAt: serverTimestamp()
                });
                return true;
            } catch (error) {
                console.error("Error adding shot: ", error);
                alert("Error saving shot to cloud");
                return false;
            }
        }
        return false;
    };

    const deleteShot = async (id: string | number) => {
        if (user && db) {
            try {
                await deleteDoc(doc(db, 'users', user.uid, 'shots', id.toString()));
            } catch (error) {
                console.error("Error deleting shot: ", error);
                alert("Error deleting shot");
            }
        }
    };

    return { shots, addShot, deleteShot };
};
