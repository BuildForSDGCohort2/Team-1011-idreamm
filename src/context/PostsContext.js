import React, { createContext, useEffect, useState } from 'react';
import { db } from '../utils/firebase';

export const PostsContext = createContext();

export function PostsProvider({ children }) {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [limit, setLimit] = useState(5);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    db.collection('posts')
      .orderBy('timestamp', 'desc')
      .limit(limit)
      .onSnapshot((snapshot) => {
        const posts = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        if (limit === posts.length) {
          setHasMore(true);
        } else {
          setHasMore(false);
        }

        setPosts(posts);
        setIsLoading(false);
      });
  }, [limit]);
  return (
    <PostsContext.Provider
      value={{ posts, isLoading, limit, setLimit, hasMore, setHasMore }}
    >
      {children}
    </PostsContext.Provider>
  );
}
