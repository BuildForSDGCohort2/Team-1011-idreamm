import React, { useState, useEffect, createContext, useContext } from 'react';
import { AuthContext } from './AuthContext';
import { SnackContext } from './SnackContext';
import uploadDp from '../utils/dpUpload';

export const DpUploadContext = createContext();

export function DpUploadProvider({ children }) {
  const [dp, setDp] = useState(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(false);
  const [complete, setComplete] = useState(false);

  const { currentUser } = useContext(AuthContext);
  const setSnack = useContext(SnackContext)[1];

  useEffect(() => {
    if (dp) {
      uploadDp(dp, currentUser, setProgress, setComplete, setError);
    }
  }, [dp, currentUser]);

  useEffect(() => {
    if (complete) {
      setDp(null);
      setProgress(0);
      setSnack({ open: true, message: 'Profile updated successfully' });
      setComplete(false);
    }

    if (error) {
      setSnack({ open: true, message: 'An error occured' });
    }
  }, [complete, setSnack, error]);
  return (
    <DpUploadContext.Provider value={{ dp, setDp, progress, error, complete }}>
      {children}
    </DpUploadContext.Provider>
  );
}
