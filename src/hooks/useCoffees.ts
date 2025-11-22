import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { db } from '../firebase';
import {
    collection,
    addDoc,
    deleteDoc,
    updateDoc,
    doc,
    query,
    orderBy,
    onSnapshot,
    serverTimestamp
} from 'firebase/firestore';

export interface Coffee {
    id: string;
    name: string;
}

const DEFAULT_COFFEES = [
    { id: '1', name: "Your Coffee" },
];

export const useCoffees = (user: User | null) => {
    const [coffees, setCoffees] = useState<Coffee[]>(DEFAULT_COFFEES);

    // Initial Load & Sync
    useEffect(() => {
        if (user && db) {
            const q = query(
                collection(db, 'users', user.uid, 'coffees'),
                orderBy('createdAt', 'asc')
            );

            const unsubscribe = onSnapshot(q, (snapshot) => {
                const loadedCoffees = snapshot.docs.map(doc => ({
                    id: doc.id,
                    name: doc.data().name as string
                }));

                if (loadedCoffees.length > 0) {
                    setCoffees(loadedCoffees);
                } else {
                    setCoffees(DEFAULT_COFFEES);
                }
            });

            return () => unsubscribe();
        }
    }, [user]);

    const addCoffee = async (name: string) => {
        if (coffees.some(c => c.name === name)) return;

        if (user && db) {
            try {
                await addDoc(collection(db, 'users', user.uid, 'coffees'), {
                    name,
                    createdAt: serverTimestamp()
                });
            } catch (error) {
                console.error("Error adding coffee: ", error);
                alert("Error saving coffee to cloud");
            }
        }
    };

    const deleteCoffee = async (id: string) => {
        if (user && db) {
            try {
                await deleteDoc(doc(db, 'users', user.uid, 'coffees', id));
            } catch (error) {
                console.error("Error deleting coffee: ", error);
            }
        }
    };

    const editCoffee = async (id: string, newName: string) => {
        if (user && db) {
            try {
                await updateDoc(doc(db, 'users', user.uid, 'coffees', id), {
                    name: newName
                });
            } catch (error) {
                console.error("Error updating coffee: ", error);
            }
        }
    };

    return { coffees, addCoffee, deleteCoffee, editCoffee };
};
