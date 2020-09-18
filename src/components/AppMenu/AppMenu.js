import React from 'react';
import { Tooltip, IconButton, Badge, makeStyles } from '@material-ui/core';
import {
  HomeRounded,
  MailOutline,
  PostAddOutlined,
  AccountCircleOutlined,
} from '@material-ui/icons';

import styles from './AppMenu.module.css';

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

  return (
    <div className={styles.appbar__menu}>
      <Tooltip title='Home'>
        <IconButton
          aria-label='home'
          color='inherit'
          className={styles.active_menu}
        >
          <HomeRounded />
        </IconButton>
      </Tooltip>
      <Tooltip title='Messages'>
        <IconButton aria-label='show 4 new mails' color='inherit'>
          <Badge badgeContent={4} color='secondary'>
            <MailOutline />
          </Badge>
        </IconButton>
      </Tooltip>
      <Tooltip title='New post'>
        <IconButton aria-label='show 17 new notifications' color='inherit'>
          <PostAddOutlined />
        </IconButton>
      </Tooltip>
      <Tooltip title='Profile'>
        <IconButton
          aria-label='account of current user'
          aria-haspopup='true'
          color='inherit'
          className={classes.profile_btn}
        >
          <AccountCircleOutlined />
        </IconButton>
      </Tooltip>
    </div>
  );
}
