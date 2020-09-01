import React from 'react';
import { Helmet } from 'react-helmet';
import { Link, Typography } from '@material-ui/core';
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
              Don't have an account? <Link>Sign up</Link>
            </Typography>
          </div>
        </div>
      </Layout>
    </>
  );
}
