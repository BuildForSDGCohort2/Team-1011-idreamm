import React, { useContext } from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import moment from 'moment';
import { AuthContext } from '../../context/AuthContext';
import styles from './Message.module.css';

const useStyles = makeStyles({
  text: {
    minWidth: '100px',
    fontSize: '14.5px',
    marginRight: '10px',
    padding: '10px 10px 15px',
    wordBreak: 'break-all',
    msWordBreak: 'break-all',
    color: '#000',
  },
  time: {
    fontSize: '11px',
    position: 'absolute',
    zIndex: 2,
    right: '5px',
    bottom: 0,
    fontWeight: 400,
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
