import React from 'react';
import { IconButton, makeStyles, Typography } from '@material-ui/core';
import { Add } from '@material-ui/icons';

import styles from './Messenger.module.css';
import CurrentUser from '../CurrentUser/CurrentUser';
import Users from '../Users/Users';
import MessengerForm from '../MessengerForm/MessengerForm';
import Messages from '../Messages/Messages';

const useStyles = makeStyles({
  title: {
    fontWeight: '500',
  },
});

export default function Messenger() {
  const classes = useStyles();
  return (
    <div className={styles.messenger__container}>
      <header>
        <Typography className={classes.title}>Messenger</Typography>
        <div>
          <IconButton edge='end' color='inherit'>
            <Add />
          </IconButton>
        </div>
      </header>
      <div className={styles.currentUser__container}>
        <CurrentUser />
      </div>
      <div className={styles.users__container}>
        <Users />
      </div>
      <div className={styles.messages__container}>
        <Messages />
      </div>
      <div className={styles.messenger__form__container}>
        <MessengerForm />
      </div>
    </div>
  );
}
