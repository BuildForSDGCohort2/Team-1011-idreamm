import React, { createContext, useState, useEffect } from 'react';
import { auth } from '../utils/firebase';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem('authenticated_user'))
  );

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        localStorage.setItem(
          'authenticated_user',
          JSON.stringify({
            email: user.email,
            uid: user.uid,
            username: user.displayName,
          })
        );
        setCurrentUser({
          email: user.email,
          uid: user.uid,
          username: user.displayName,
        });
      } else {
        localStorage.removeItem('authenticated_user');
        setCurrentUser(null);
      }
    });
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
}
