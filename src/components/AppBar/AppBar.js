import React from 'react';
import {
  AppBar as MuiAppBar,
  Toolbar,
  Typography,
  InputBase,
  makeStyles,
  IconButton,
} from '@material-ui/core';
import { SearchRounded } from '@material-ui/icons';

import styles from './AppBar.module.css';
import AppMenu from '../AppMenu/AppMenu';

const useStyles = makeStyles((theme) => ({
  appbar: {
    backgroundColor: '#fff',
    borderBottom: '1px solid #ddd',
    color: '#334',
  },
  toolbar: {
    padding: 0,
    boxSizing: 'border-box',
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  brand: {
    fontFamily: 'Lobster Two, cursive',
    fontSize: '24px',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    fontSize: '14px',
  },
}));

export default function AppBar() {
  const classes = useStyles();

  return (
    <MuiAppBar position='static' elevation={0} className={classes.appbar}>
      <Toolbar className={classes.toolbar}>
        <div className={styles.container}>
          <Typography className={classes.brand} variant='h6' noWrap>
            iDreamm
          </Typography>
          <div className={styles.search__container}>
            <div className={styles.searchIcon__container}>
              <SearchRounded fontSize='small' />
            </div>
            <InputBase
              placeholder='Search…'
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'search' }}
            />
          </div>
          <div className={styles.mobile__search__btn}>
            <IconButton color='inherit' edge='end'>
              <SearchRounded />
            </IconButton>
          </div>
          <div className={styles.appbar__menu__container}>
            <AppMenu />
          </div>
        </div>
      </Toolbar>
    </MuiAppBar>
  );
}
