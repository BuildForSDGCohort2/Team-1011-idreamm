import React from 'react';
import { Typography } from '@material-ui/core';
import moment from 'moment';
import styles from './TimeDivider.module.css';

export default function TimeDivider({ time, style }) {
  return (
    <div className={styles.container} style={style}>
      <Typography>
        {moment.utc(time).local().calendar(null, {
          lastDay: '[Yesterday]',
          sameDay: '[Today]',
          lastWeek: '[last] dddd',
          sameElse: 'l',
        })}
      </Typography>
    </div>
  );
}
