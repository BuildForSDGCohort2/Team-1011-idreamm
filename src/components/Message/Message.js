import React, { useContext } from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import moment from 'moment';
import { AuthContext } from '../../context/AuthContext';
import styles from './Message.module.css';

const useStyles = makeStyles({
  text: {
    fontSize: '14.5px',
    marginRight: '25px',
    padding: '10px 10px 5px',
  },
  time: {
    fontSize: '11px',
    marginRight: '5px',
  },
});

export default function Message({ text, senderId, timestamp }) {
  const classes = useStyles();
  const { currentUser } = useContext(AuthContext);

  return (
    <div
      className={
        senderId === currentUser.uid
          ? styles.sender__container
          : styles.receiver__container
      }
    >
      <div>
        <Typography className={classes.text}>{text}</Typography>
        <Typography
          className={classes.time}
          align='right'
          color='textSecondary'
        >
          {moment.utc(timestamp).local().format('LT')}
        </Typography>
      </div>
    </div>
  );
}
