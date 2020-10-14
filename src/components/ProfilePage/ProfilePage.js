import React, { useContext } from 'react';
import { Helmet } from 'react-helmet';
import { Switch, Typography } from '@material-ui/core';
import { DarkModeContext } from '../../context/DarkModeContext';
import Profile from '../Profile/Profile';
import UserPosts from '../UserPosts/UserPosts';
import Quotes from '../Quotes/Quotes';
import styles from './ProfilePage.module.css';

export default function ProfilePage() {
  const [isDarkMode, setIsDarkMode] = useContext(DarkModeContext);

  const handleChange = (e) => {
    setIsDarkMode(e.target.checked);
  };

  return (
    <>
      <Helmet>
        <title>Profile • iDreamm</title>
      </Helmet>

      <div className={styles.container}>
        <div>
          <div>
            <Profile />
          </div>
          <div>
            <Quotes />
          </div>
        </div>
        <UserPosts />
        <div className={styles.switch__container}>
          <Switch size='small' onChange={handleChange} checked={isDarkMode} />
          <Typography
            color='textSecondary'
            style={{ fontSize: '12px', fontWeight: 300 }}
          >
            dark
          </Typography>
        </div>
      </div>
    </>
  );
}
