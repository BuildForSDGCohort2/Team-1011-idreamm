import React from 'react';
import { makeStyles, Typography } from '@material-ui/core';

import styles from './Message.module.css';

const useStyles = makeStyles({
  text: {
    marginRight: '25px',
    padding: '10px 10px 5px',
  },
  time: {
    fontSize: '12px',
    marginRight: '5px',
  },
});

export default function Message() {
  const classes = useStyles();

  return (
    <div className={styles.receiver__container}>
      <div>
        <Typography className={classes.text}>Hello there Johnny</Typography>
        <Typography
          className={classes.time}
          align='right'
          color='textSecondary'
        >
          6:00 PM
        </Typography>
      </div>
    </div>
  );
}
