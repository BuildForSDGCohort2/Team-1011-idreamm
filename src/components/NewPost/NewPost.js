import React from 'react';

import FileDrop from '../FileDrop/FileDrop';
import PostPreview from '../PostPreview/PostPreview';

import styles from './NewPost.module.css';

export default function NewPost() {
  return (
    <div className={styles.container}>
      <FileDrop />
      <PostPreview />
    </div>
  );
}
