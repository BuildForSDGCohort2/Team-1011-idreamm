import React, { createContext, useState } from 'react';

export const NewPostContext = createContext();

export function NewPostProvider({ children }) {
  const [file, setFile] = useState(null);

  return (
    <NewPostContext.Provider value={[file, setFile]}>
      {children}
    </NewPostContext.Provider>
  );
}
