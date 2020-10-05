import React, { createContext, useState } from 'react';

export const NavigationContext = createContext();

export function NavigationProvider({ children }) {
  const [currentPage, setCurrentPage] = useState('home');
  return (
    <NavigationContext.Provider value={[currentPage, setCurrentPage]}>
      {children}
    </NavigationContext.Provider>
  );
}
