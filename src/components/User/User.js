import { Avatar, ListItem, makeStyles, Typography } from '@material-ui/core';
import { red } from '@material-ui/core/colors';
import React from 'react';

import styles from './User.module.css';

const useStyles = makeStyles({
  avatar: {
    background: red[500],
    height: '50px',
    width: '50px',
  },
  username: {
    fontSize: '14px',
  },
});

export default function User({ selected, username, onClick, disabled }) {
  const classes = useStyles();

  return (
    <ListItem
      className={styles.user}
      button
      selected={selected}
      onClick={onClick}
      disabled={disabled}
    >
      <div>
        <Avatar className={classes.avatar}>{username[0].toUpperCase()}</Avatar>
      </div>
      <div>
        <Typography className={classes.username}>{username}</Typography>
        <Typography variant='body2' color='textSecondary'>
          Active now
        </Typography>
      </div>
    </ListItem>
  );
}
