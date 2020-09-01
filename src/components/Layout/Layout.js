import React from 'react';

import styles from './Layout.module.css';
import { Typography, makeStyles } from '@material-ui/core';
import Footer from '../Footer/Footer';

const useStyles = makeStyles({
  title: {
    fontSize: '42px',
    fontWeight: 700,
  },
  subtitle: {
    fontSize: '66px',
    fontWeight: 200,
  },
});

export default function Layout({ children }) {
  const classes = useStyles();
  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <div>
          <Typography variant='h1' align='right' className={classes.title}>
            Get inspired.
          </Typography>
          <Typography variant='h2' align='right' className={classes.subtitle}>
            Change your life today
          </Typography>
        </div>
        <div>{children}</div>
      </div>
      <Footer />
    </div>
  );
}
