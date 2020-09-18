import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Typography } from '@material-ui/core';

import { Layout, Register } from '../../components';

import styles from './RegisterScreen.module.css';

export default function RegisterScreen() {
  return (
    <>
      <Helmet>
        <title>Sign up • iDreamm</title>
      </Helmet>
      <Layout>
        <div className={styles.container}>
          <Register />
          <div className={styles.signin__container}>
            <Typography>
              Already have an account? <Link to='/login'>Sign in</Link>
            </Typography>
          </div>
        </div>
      </Layout>
    </>
  );
}
