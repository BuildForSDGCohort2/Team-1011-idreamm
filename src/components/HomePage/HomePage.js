import React, { useContext } from 'react';
import Post from '../Post/Post';
import { PostsContext } from '../../context/PostsContext';
import styles from './HomePage.module.css';
import { CircularProgress, Typography } from '@material-ui/core';
// import LazyLoad from 'react-lazyload';

export default function HomePage() {
  const { posts, isLoading } = useContext(PostsContext);

  return (
    <div className={styles.homepage__container}>
      {isLoading ? (
        <div className={styles.loader__container}>
          <CircularProgress color='secondary' size={16} />
          <Typography variant='body2' color='textSecondary'>
            Getting posts
          </Typography>
        </div>
      ) : posts[0] ? (
        posts.map((post) => <Post key={post.id} content={post} />)
      ) : (
        <div className={styles.loader__container}>
          <Typography variant='body2' color='textSecondary'>
            No posts yet
          </Typography>
        </div>
      )}
    </div>
  );
}
