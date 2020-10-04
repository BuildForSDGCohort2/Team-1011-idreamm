import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';

export const SelectedUserContext = createContext();

export function SelectedUserProvider({ children }) {
  const [selectedUser, setSelectedUser] = useState(null);
  const [room, setRoom] = useState(null);

  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    if (selectedUser) {
      const room =
        selectedUser.email > currentUser.email
          ? `${selectedUser.email}-${currentUser.email}`
          : `${currentUser.email}-${selectedUser.email}`;

      setRoom(room);
    } else {
      setRoom(null);
    }
  }, [selectedUser, currentUser.email]);

  return (
    <SelectedUserContext.Provider
      value={{ selectedUser, setSelectedUser, room }}
    >
      {children}
    </SelectedUserContext.Provider>
  );
}
