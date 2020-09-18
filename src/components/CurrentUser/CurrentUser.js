import React from 'react';
import { Avatar, IconButton, makeStyles, Typography } from '@material-ui/core';
import { MoreHoriz } from '@material-ui/icons';
import { red } from '@material-ui/core/colors';

import styles from './CurrentUser.module.css';

const useStyles = makeStyles({
  avatar: {
    height: '32px',
    width: '32px',
    marginRight: '15px',
    background: red[500],
  },
});

export default function CurrentUser() {
  const classes = useStyles();
  return (
    <div className={styles.currentUser}>
      <div>
        <Avatar className={classes.avatar}>L</Avatar>
        <Typography variant='subtitle2'>Lafen Lesley</Typography>
      </div>
      <div>
        <IconButton edge='end' color='inherit'>
          <MoreHoriz />
        </IconButton>
      </div>
    </div>
  );
}
