import React, { useContext } from 'react';
import { Helmet } from 'react-helmet';
import {
  AppBar,
  AppMenu,
  HomePage,
  NewPostPage,
  ProfilePage,
  MessengerPage,
} from '../../components';
import { NavigationContext } from '../../context/NavigationContext';
import { NewPostProvider } from '../../context/NewPostContext';

import styles from './HomeScreen.module.css';

export default function HomeScreen() {
  const [currentPage] = useContext(NavigationContext);
  return (
    <>
      <Helmet>
        <title>iDreamm</title>
      </Helmet>
      <NewPostProvider>
        <div className={styles.container}>
          <AppBar />
          <div className={styles.app__content__container}>
            <main className={styles.app__content}>
              {currentPage === 'home' ? (
                <HomePage />
              ) : currentPage === 'messenger' ? (
                <MessengerPage />
              ) : currentPage === 'newpost' ? (
                <NewPostPage />
              ) : (
                <ProfilePage />
              )}
            </main>
          </div>
          <div className={styles.app__menu__container}>
            <AppMenu />
          </div>
        </div>
      </NewPostProvider>
    </>
  );
}
