import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Typography } from '@material-ui/core';
import { Login, Layout } from '../../components';

import styles from './LoginScreen.module.css';

export default function LoginScreen() {
  return (
    <>
      <Helmet>
        <title>Login • iDreamm</title>
      </Helmet>
      <Layout>
        <div className={styles.container}>
          <Login />
          <div className={styles.signup__container}>
            <Typography>
              Don't have an account? <Link to='/register'>Sign up</Link>
            </Typography>
          </div>
        </div>
      </Layout>
    </>
  );
}
