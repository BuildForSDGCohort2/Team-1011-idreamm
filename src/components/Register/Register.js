import React from 'react';
import {
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Typography,
  makeStyles,
} from '@material-ui/core';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

import styles from './Register.module.css';

const useStyles = makeStyles({
  subtitle: {
    fontWeight: 500,
    marginBottom: '30px',
  },
  or_text: {
    margin: '0px 15px',
  },
  input: {
    marginBottom: '10px',
  },
  btn: {
    marginTop: '10px',
    textTransform: 'none',
  },
  brand: {
    fontFamily: 'Lobster Two, cursive',
    fontWeight: 700,
    marginTop: '30px',
  },
  google_btn: {
    textTransform: 'initial',
  },
  google_logo: {
    marginRight: '20px',
  },
});

export default function Register() {
  const classes = useStyles();
  return (
    <div className={styles.container}>
      <Typography variant='h4' className={classes.brand}>
        iDreamm
      </Typography>
      <Typography className={classes.subtitle} color='textSecondary'>
        Sign up to start your journey
      </Typography>
      <form className={styles.form}>
        <TextField
          fullWidth
          label='First name'
          variant='filled'
          className={classes.input}
          size='small'
          type='text'
        />
        <TextField
          fullWidth
          label='Username'
          variant='filled'
          className={classes.input}
          size='small'
          type='text'
        />
        <TextField
          fullWidth
          label='Email'
          variant='filled'
          className={classes.input}
          size='small'
          type='email'
        />
        <TextField
          fullWidth
          label='Password'
          variant='filled'
          InputProps={{
            endAdornment: (
              <InputAdornment position='end'>
                <IconButton aria-label='toggle password visibility' edge='end'>
                  {true ? (
                    <Visibility fontSize='small' />
                  ) : (
                    <VisibilityOff fontSize='small' />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
          className={classes.input}
          size='small'
          type='password'
        />
        <Button
          variant='contained'
          fullWidth
          className={classes.btn}
          disableElevation
          color='primary'
        >
          Sign Up
        </Button>
        <div className={styles.or_seperator}>
          <span></span>
          <Typography
            variant='body2'
            className={classes.or_text}
            color='textSecondary'
          >
            OR
          </Typography>
          <span></span>
        </div>
        <Button
          className={classes.google_btn}
          fullWidth
          variant='outlined'
          color='primary'
        >
          <img
            src='google-icon.svg'
            alt='Google logo'
            width='18px'
            className={styles.google_logo}
          />
          <Typography display='inline'>Log in with Google</Typography>
        </Button>
      </form>
    </div>
  );
}
