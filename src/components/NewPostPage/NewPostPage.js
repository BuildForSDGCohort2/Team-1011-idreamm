import React from 'react';
import { Helmet } from 'react-helmet';

import NewPost from '../NewPost/NewPost';

import styles from './NewPostPage.module.css';

export default function MesssengerPage() {
  return (
    <>
      <Helmet>
        <title>New post • iDreamm</title>
      </Helmet>
      <div className={styles.container}>
        <NewPost />
      </div>
    </>
  );
}
