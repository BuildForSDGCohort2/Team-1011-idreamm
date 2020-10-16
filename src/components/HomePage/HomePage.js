import React, { useContext } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import Post from '../Post/Post';
import { PostsContext } from '../../context/PostsContext';
import styles from './HomePage.module.css';
import { CircularProgress, Typography } from '@material-ui/core';

export default function HomePage() {
  const { posts, isLoading, limit, setLimit, hasMore, setHasMore } = useContext(
    PostsContext
  );

  const fetchMoreData = () => {
    if (limit === posts.length) {
      setLimit((limit) => limit + 5);
    } else {
      setHasMore(false);
    }
  };

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
        <InfiniteScroll
          dataLength={limit}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={
            <div className={styles.loader__container}>
              <CircularProgress color='secondary' size={16} />
              <Typography variant='body2' color='textSecondary'>
                Loading more...
              </Typography>
            </div>
          }
          scrollableTarget='scrollableDiv'
          scrollThreshold={0.7}
        >
          {posts.map((post) => (
            <Post key={post.id} content={post} />
          ))}
        </InfiniteScroll>
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
