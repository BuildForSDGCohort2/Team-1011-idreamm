import React, { createContext, useContext, useEffect, useState } from 'react';
import { db } from '../utils/firebase';
import { AuthContext } from './AuthContext';

export const MessagesContext = createContext();

export function MessagesProvider({ children }) {
  const [messages, setMessages] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    db.collection('rooms').onSnapshot((snapshot) => {
      snapshot.docs.forEach((doc) => {
        const regex = new RegExp(currentUser.email, 'g');

        if (regex.test(doc.id)) {
          const participants = doc.data().participants;

          db.collection('rooms')
            .doc(doc.id)
            .collection('messages')
            .orderBy('timestamp', 'asc')
            .onSnapshot((snapshot) => {
              const messages = snapshot.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
              }));
              setMessages((msges) => ({
                ...msges,
                [doc.id]: { messages, participants },
              }));
            });
        }
      });

      setIsLoading(false);
    });
  }, [currentUser.email]);

  return (
    <MessagesContext.Provider value={{ messages, isLoading }}>
      {children}
    </MessagesContext.Provider>
  );
}