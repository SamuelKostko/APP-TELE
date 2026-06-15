import { useState, useEffect } from 'react';
import { collection, doc, onSnapshot, setDoc, addDoc, deleteDoc, updateDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';

let bcvSyncInitialized = false;

const INITIAL_FINANCE = {
  bcv: '36.50',
  bcvEuro: '39.00',
  usdt: '40.10',
};

const INITIAL_SETTINGS = {
  showTodos: true
};

export function useAppStore() {
  const [ships, setShips] = useState([]);
  const [finance, setFinance] = useState(INITIAL_FINANCE);
  const [todos, setTodos] = useState([]);
  const [settings, setSettings] = useState(INITIAL_SETTINGS);

  useEffect(() => {
    if (!bcvSyncInitialized) {
      bcvSyncInitialized = true;
      const fetchBcv = async () => {
        try {
          const resUsd = await fetch('https://ve.dolarapi.com/v1/dolares/oficial');
          const dataUsd = await resUsd.json();
          const resEur = await fetch('https://ve.dolarapi.com/v1/euros/oficial');
          const dataEur = await resEur.json();
          
          let updateData = {};
          if (dataUsd && dataUsd.promedio) {
            updateData.bcv = dataUsd.promedio.toFixed(2);
          }
          if (dataEur && dataEur.promedio) {
            updateData.bcvEuro = dataEur.promedio.toFixed(2);
          }
          if (Object.keys(updateData).length > 0) {
            await setDoc(doc(db, 'finance', 'rates'), updateData, { merge: true });
          }
        } catch (e) {
          console.error('Error fetching BCV auto', e);
        }
      };
      
      fetchBcv();
      setInterval(fetchBcv, 1000 * 60 * 60); // Cada 1 hora
    }
  }, []);

  useEffect(() => {
    // Escuchar cambios en la colección de barcos
    const unsubscribeShips = onSnapshot(collection(db, 'ships'), (snapshot) => {
      const shipsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setShips(shipsData);
    });

    // Escuchar cambios en la colección de To-Dos ordenados por fecha
    const qTodos = query(collection(db, 'todos'), orderBy('createdAt', 'desc'));
    const unsubscribeTodos = onSnapshot(qTodos, (snapshot) => {
      const todosData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTodos(todosData);
    });

    // Escuchar cambios en el documento de finanzas
    const unsubscribeFinance = onSnapshot(doc(db, 'finance', 'rates'), (docSnapshot) => {
      if (docSnapshot.exists()) {
        setFinance(docSnapshot.data());
      } else {
        setDoc(doc(db, 'finance', 'rates'), INITIAL_FINANCE);
      }
    });

    // Escuchar cambios en la configuración
    const unsubscribeSettings = onSnapshot(doc(db, 'settings', 'general'), (docSnapshot) => {
      if (docSnapshot.exists()) {
        setSettings(docSnapshot.data());
      } else {
        setDoc(doc(db, 'settings', 'general'), INITIAL_SETTINGS);
      }
    });

    return () => {
      unsubscribeShips();
      unsubscribeTodos();
      unsubscribeFinance();
      unsubscribeSettings();
    };
  }, []);

  const addShip = async (ship) => {
    try {
      await addDoc(collection(db, 'ships'), ship);
    } catch (error) {
      console.error("Error adding ship: ", error);
    }
  };

  const updateShip = async (id, updatedShip) => {
    try {
      const shipRef = doc(db, 'ships', id);
      await updateDoc(shipRef, updatedShip);
    } catch (error) {
      console.error("Error updating ship: ", error);
    }
  };

  const removeShip = async (id) => {
    try {
      await deleteDoc(doc(db, 'ships', id));
    } catch (error) {
      console.error("Error deleting ship: ", error);
    }
  };

  const updateFinance = async (newFinance) => {
    try {
      await setDoc(doc(db, 'finance', 'rates'), newFinance);
    } catch (error) {
      console.error("Error updating finance: ", error);
    }
  };

  const addTodo = async (text) => {
    try {
      await addDoc(collection(db, 'todos'), {
        text,
        completed: false,
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error adding todo: ", error);
    }
  };

  const toggleTodo = async (id, currentStatus) => {
    try {
      await updateDoc(doc(db, 'todos', id), { completed: !currentStatus });
    } catch (error) {
      console.error("Error toggling todo: ", error);
    }
  };

  const removeTodo = async (id) => {
    try {
      await deleteDoc(doc(db, 'todos', id));
    } catch (error) {
      console.error("Error deleting todo: ", error);
    }
  };

  const updateSettings = async (newSettings) => {
    try {
      await setDoc(doc(db, 'settings', 'general'), newSettings, { merge: true });
    } catch (error) {
      console.error("Error updating settings: ", error);
    }
  };

  return {
    ships,
    finance,
    todos,
    settings,
    addShip,
    updateShip,
    removeShip,
    updateFinance,
    addTodo,
    toggleTodo,
    removeTodo,
    updateSettings
  };
}
