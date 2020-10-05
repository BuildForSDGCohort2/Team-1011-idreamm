import React, { useContext } from 'react';
import { Tooltip, IconButton, Badge, makeStyles } from '@material-ui/core';
import {
  HomeRounded,
  MailOutline,
  AccountCircleOutlined,
  PostAddRounded,
} from '@material-ui/icons';
import cx from 'classnames';

import { NavigationContext } from '../../context/NavigationContext';

import styles from './AppMenu.module.css';
import { MessagesContext } from '../../context/MessagesContext';

const useStyles = makeStyles((theme) => ({
  profile_btn: {
    marginRight: '-12px',
    [theme.breakpoints.down('sm')]: {
      marginRight: 0,
    },
  },
}));

export default function AppMenu() {
  const classes = useStyles();
  const [currentPage, setCurrentPage] = useContext(NavigationContext);
  const { unreadMessages } = useContext(MessagesContext);

  return (
    <div className={styles.appbar__menu}>
      <Tooltip title='Home'>
        <IconButton
          aria-label='home'
          color='inherit'
          className={cx({ [styles.active_menu]: currentPage === 'home' })}
          onClick={() => setCurrentPage('home')}
        >
          <HomeRounded />
        </IconButton>
      </Tooltip>
      <Tooltip title='Messages'>
        <IconButton
          aria-label='show 4 new mails'
          color='inherit'
          className={cx({ [styles.active_menu]: currentPage === 'messenger' })}
          onClick={() => setCurrentPage('messenger')}
        >
          <Badge badgeContent={unreadMessages} color='secondary'>
            <MailOutline />
          </Badge>
        </IconButton>
      </Tooltip>
      <Tooltip title='New post'>
        <IconButton
          aria-label='show 17 new notifications'
          color='inherit'
          className={cx({ [styles.active_menu]: currentPage === 'newpost' })}
          onClick={() => setCurrentPage('newpost')}
        >
          <PostAddRounded />
        </IconButton>
      </Tooltip>
      <Tooltip title='Profile'>
        <IconButton
          aria-label='account of current user'
          aria-haspopup='true'
          color='inherit'
          className={cx(
            { [styles.active_menu]: currentPage === 'profile' },
            classes.profile_btn
          )}
          onClick={() => setCurrentPage('profile')}
        >
          <AccountCircleOutlined />
        </IconButton>
      </Tooltip>
    </div>
  );
}
