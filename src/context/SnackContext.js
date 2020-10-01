import React, { useState, createContext } from 'react';

export const SnackContext = createContext();

export function SnackProvider({ children }) {
  const [snack, setSnack] = useState({ open: false, message: '' });

  return (
    <SnackContext.Provider value={[snack, setSnack]}>
      {children}
    </SnackContext.Provider>
  );
}
