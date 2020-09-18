import React from 'react';

import styles from './PostContent.module.css';

export default function PostContent() {
  return (
    <div className={styles.post__content}>
      <img
        src='https://images.pexels.com/photos/2690323/pexels-photo-2690323.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'
        alt=''
      />
    </div>
  );
}
