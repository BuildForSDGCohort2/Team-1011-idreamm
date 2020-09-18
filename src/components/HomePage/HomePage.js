import React from 'react';
import Post from '../Post/Post';

import styles from './HomePage.module.css';

export default function HomePage() {
  return (
    <div className={styles.homepage__container}>
      <Post />
      <Post />
      <Post />
    </div>
  );
}
