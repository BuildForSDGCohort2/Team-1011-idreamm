import React, { createContext, useState, useRef, useEffect } from 'react';

export const NavigationContext = createContext();

export function NavigationProvider({ children }) {
  const [currentPage, setCurrentPage] = useState('home');

  const isMobileMessengerRef = useRef(null);

  const setIsMobileMessenger = data => {
    isMobileMessengerRef.current = data;
  }

  const handleNavigation = e => {
    e.preventDefault();

    window.history.pushState(null, document.title, window.location.href);
    if(!isMobileMessengerRef.current){
      setCurrentPage('home');
    }
  }

  useEffect(() => {
    // Add actual page to history
    window.history.pushState(null, document.title, window.location.href)
  
    window.addEventListener('popstate', handleNavigation);
    return () => window.removeEventListener('popstate', handleNavigation);
  }, [])

  return (
    <NavigationContext.Provider value={[currentPage, setCurrentPage, setIsMobileMessenger]}>
      {children}
    </NavigationContext.Provider>
  );
}
