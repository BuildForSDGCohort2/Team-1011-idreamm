import React, { createContext, useState } from 'react';

export const NewDpContext = createContext();

export function NewDpProvider({ children }) {
  const [file, setFile] = useState(null);

  return (
    <NewDpContext.Provider value={[file, setFile]}>
      {children}
    </NewDpContext.Provider>
  );
}
