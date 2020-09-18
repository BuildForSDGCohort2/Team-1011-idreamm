import React from 'react';
import { IconButton, makeStyles, Typography } from '@material-ui/core';
import { Add } from '@material-ui/icons';

import styles from './Messenger.module.css';
import CurrentUser from '../CurrentUser/CurrentUser';

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
      <div className={styles.allUsers__container}>all users</div>
      <div className={styles.messages__container}>messages</div>
      <div className={styles.messenger__form__container}>form</div>
    </div>
  );
}
