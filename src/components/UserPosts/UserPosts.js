import React, { useContext } from 'react';
import { CircularProgress, Typography } from '@material-ui/core';
import { PostsContext } from '../../context/PostsContext';
import { AuthContext } from '../../context/AuthContext';
import styles from './UserPosts.module.css';
import UserPost from '../UserPost/UserPost';

export default function UserPosts() {
  const { posts, isLoading } = useContext(PostsContext);
  const { currentUser } = useContext(AuthContext);
  const userPosts = posts.filter((post) => post.authorId === currentUser.uid);

  return (
    <>
      <div className={styles.container}>
        <div>
          <Typography color='textSecondary' variant='subtitle2'>
            Recent Posts
          </Typography>
        </div>

        {isLoading ? (
          <div className={styles.loader__container}>
            <CircularProgress color='secondary' size={16} />
            <Typography variant='body2' color='textSecondary'>
              Getting posts
            </Typography>
          </div>
        ) : userPosts[0] ? (
          <div className={styles.posts__container}>
            {userPosts.map((post) => (
              <UserPost post={post} key={post.id} />
            ))}
          </div>
        ) : (
          <Typography align='center' color='textSecondary' variant='body2'>
            You don't have any post yet
          </Typography>
        )}
      </div>
    </>
  );
}
