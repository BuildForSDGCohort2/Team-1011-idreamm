import React, { useState } from 'react';
import {
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Typography,
  makeStyles,
  Link,
} from '@material-ui/core';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

import firebase from 'firebase/app';

import { validateEmail, validatePassword } from '../../utils/helper';
import { auth } from '../../utils/firebase';

import styles from './Login.module.css';

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
  forgot_pass: {
    margin: '20px 0',
  },
  google_btn: {
    textTransform: 'initial',
  },
  google_logo: {
    marginRight: '20px',
  },
});

export default function Login({ history }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const classes = useStyles();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'email') {
      setEmail(value);
      setEmailError(validateEmail(value));
    } else if (name === 'password') {
      setPassword(value);
      setPasswordError(validatePassword(value));
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();

    if (emailError || passwordError || !email || !password) {
      return;
    }

    auth.signInWithEmailAndPassword(email, password).then((data) => {
      history.push('/');
    });
  };

  const handleGoogleLogin = () => {
    const provider = new firebase.auth.GoogleAuthProvider();

    auth.signInWithPopup(provider).then((data) => {
      console.log(data.user);
      history.push('/');
    });
  };

  return (
    <div className={styles.container}>
      <Typography variant='h4' className={classes.brand}>
        iDreamm
      </Typography>
      <Typography className={classes.subtitle} color='textSecondary'>
        Sign in to continue your journey
      </Typography>
      <form className={styles.form} onSubmit={handleLogin}>
        <TextField
          fullWidth
          label='Email'
          variant='filled'
          className={classes.input}
          size='small'
          type='email'
          name='email'
          value={email}
          onChange={handleChange}
          error={emailError}
          helperText={emailError ? emailError : ''}
        />
        <TextField
          fullWidth
          label='Password'
          variant='filled'
          InputProps={{
            endAdornment: (
              <InputAdornment position='end'>
                <IconButton
                  aria-label='toggle password visibility'
                  edge='end'
                  onClick={() =>
                    setIsPasswordVisible(
                      (isPasswordVisible) => !isPasswordVisible
                    )
                  }
                >
                  {!isPasswordVisible ? (
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
          type={isPasswordVisible ? 'text' : 'password'}
          name='password'
          value={password}
          onChange={handleChange}
          error={passwordError}
          helperText={passwordError ? passwordError : ''}
        />
        <Button
          variant='contained'
          fullWidth
          className={classes.btn}
          disableElevation
          color='primary'
          disabled={
            emailError || passwordError || !email || !password ? true : false
          }
          type='submit'
        >
          Log In
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
          onClick={handleGoogleLogin}
        >
          <img
            src='google-icon.svg'
            alt='Google logo'
            width='18px'
            className={styles.google_logo}
          />
          <Typography display='inline'>Log in with Google</Typography>
        </Button>
        <Typography className={classes.forgot_pass} variant='subtitle2'>
          <Link>Forgot password?</Link>
        </Typography>
      </form>
    </div>
  );
}
