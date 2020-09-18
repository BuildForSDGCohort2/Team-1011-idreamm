import React from 'react';
import { Helmet } from 'react-helmet';
import { AppBar, AppMenu, MessengerPage } from '../../components';

import styles from './HomeScreen.module.css';

export default function HomeScreen() {
  return (
    <>
      <Helmet>
        <title>iDreamm</title>
      </Helmet>
      <div className={styles.container}>
        <AppBar />
        <div className={styles.app__content__container}>
          <main className={styles.app__content}>
            <MessengerPage />
          </main>
        </div>
        <div className={styles.app__menu__container}>
          <AppMenu />
        </div>
      </div>
    </>
  );
}
