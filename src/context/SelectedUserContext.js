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
        selectedUser.uid > currentUser.uid
          ? `${selectedUser.uid}-${currentUser.uid}`
          : `${currentUser.uid}-${selectedUser.uid}`;

      setRoom(room);
    } else {
      setRoom(null);
    }
  }, [selectedUser, currentUser]);

  return (
    <SelectedUserContext.Provider
      value={{ selectedUser, setSelectedUser, room }}
    >
      {children}
    </SelectedUserContext.Provider>
  );
}
