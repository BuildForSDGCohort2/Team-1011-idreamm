import React from 'react';
import Image from '../Image/Image';
import Video from '../Video/Video';

import styles from './PostContent.module.css';

export default function PostContent({ content }) {
  return (
    <div className={styles.post__content}>
      {content.type === 'image' ? (
        <Image url={content.url} />
      ) : content.type === 'video' ? (
        <Video url={content.url} />
      ) : (
        'Type error'
      )}
    </div>
  );
}
