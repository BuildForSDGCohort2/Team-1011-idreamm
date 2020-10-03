import React from 'react';
import Image from '../Image/Image';
import Video from '../Video/Video';

import styles from './PostContent.module.css';

export default function PostContent({ type, url }) {
  return (
    <div className={styles.post__content}>
      {type === 'image' ? (
        <Image url={url} />
      ) : type === 'video' ? (
        <Video url={url} />
      ) : (
        'Type error'
      )}
    </div>
  );
}
