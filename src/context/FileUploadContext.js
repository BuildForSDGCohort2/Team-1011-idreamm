import React, { useState, useEffect, createContext, useContext } from 'react';
import { AuthContext } from './AuthContext';
import { SnackContext } from './SnackContext';
import uploadFile from '../utils/fileUpload';

export const FileUploadContext = createContext();

export function FileUploadProvider({ children }) {
  const [post, setPost] = useState(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(false);
  const [complete, setComplete] = useState(false);

  const { currentUser } = useContext(AuthContext);
  const setSnack = useContext(SnackContext)[1];

  useEffect(() => {
    if (post) {
      uploadFile(
        post.file,
        post.message,
        currentUser,
        setProgress,
        setComplete,
        setError
      );
    }
  }, [post, currentUser]);

  useEffect(() => {
    if (complete) {
      setPost(null);
      setProgress(0);
      setSnack({ open: true, message: 'Post uploaded successfully' });
      setComplete(false);
    }

    if (error) {
      setSnack({ open: true, message: 'An error occured' });
    }
  }, [complete, setSnack, error]);
  return (
    <FileUploadContext.Provider
      value={{ post, setPost, progress, error, complete }}
    >
      {children}
    </FileUploadContext.Provider>
  );
}
