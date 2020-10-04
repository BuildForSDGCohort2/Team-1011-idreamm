import React, { useContext } from 'react';
import { Avatar, IconButton, makeStyles, Typography } from '@material-ui/core';
import { MoreHoriz } from '@material-ui/icons';
import { red } from '@material-ui/core/colors';
import { SelectedUserContext } from '../../context/SelectedUserContext';
import styles from './SelectedUser.module.css';

const useStyles = makeStyles({
  avatar: {
    height: '32px',
    width: '32px',
    marginRight: '15px',
    background: red[500],
  },
});

export default function SelectedUser() {
  const classes = useStyles();

  const { selectedUser } = useContext(SelectedUserContext);

  return (
    <div className={styles.selectedUser}>
      <div>
        <Avatar className={classes.avatar}>
          {selectedUser.username[0].toUpperCase()}
        </Avatar>
        <Typography variant='subtitle2'>{selectedUser.username}</Typography>
      </div>
      <div>
        <IconButton edge='end' color='inherit'>
          <MoreHoriz />
        </IconButton>
      </div>
    </div>
  );
}
