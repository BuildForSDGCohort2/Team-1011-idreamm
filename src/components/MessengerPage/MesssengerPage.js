import React from 'react';
import { Helmet } from 'react-helmet';
import { SelectedUserProvider } from '../../context/SelectedUserContext';
import Messenger from '../Messenger/Messenger';

import styles from './MessengerPage.module.css';

export default function MesssengerPage() {
  return (
    <>
      <Helmet>
        <title>Messenger • iDreamm</title>
      </Helmet>
      <div className={styles.messenger__page__container}>
        <SelectedUserProvider>
          <Messenger />
        </SelectedUserProvider>
      </div>
    </>
  );
}
