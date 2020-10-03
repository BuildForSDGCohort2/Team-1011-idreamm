import React from 'react';
import Image from '../Image/Image';
import Video from '../Video/Video';

import styles from './PostContent.module.css';

export default function PostContent({ type, url }) {
  return (
    <div className={styles.post__content}>
      {/image*/.test(type) ? (
        <Image url={url} />
      ) : /video*/.test(type) ? (
        <Video url={url} />
      ) : (
        'Content not supported'
      )}
    </div>
  );
}
