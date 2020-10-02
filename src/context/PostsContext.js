import React, { createContext, useEffect, useState } from 'react';
import { db } from '../utils/firebase';

export const PostsContext = createContext();

export function PostsProvider({ children }) {
  const [posts, setPosts] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    db.collection('posts')
      .orderBy('timestamp', 'desc')
      .onSnapshot((snapshot) => {
        const posts = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        setPosts(posts);
        setIsLoading(false);
      });
  }, []);
  return (
    <PostsContext.Provider value={{ posts, isLoading }}>
      {children}
    </PostsContext.Provider>
  );
}
