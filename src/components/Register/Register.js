import React, { useState } from 'react';
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
import moment from 'moment';
import firebase from 'firebase/app';

import {
  validateFirstName,
  validateUserName,
  validateEmail,
  validatePassword,
} from '../../utils/helper';
import { auth, db } from '../../utils/firebase';

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

export default function Register({ history }) {
  const [firstName, setFirstName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstNameError, setFirstNameError] = useState(null);
  const [userNameError, setUsernameError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const classes = useStyles();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'firstName') {
      setFirstName(value);
      setFirstNameError(validateFirstName(value));
    } else if (name === 'username') {
      setUsername(value);
      setUsernameError(validateUserName(value));
    } else if (name === 'email') {
      setEmail(value);
      setEmailError(validateEmail(value));
    } else if (name === 'password') {
      setPassword(value);
      setPasswordError(validatePassword(value));
    }
  };

  const handleSignUp = (e) => {
    e.preventDefault();

    if (
      firstNameError ||
      userNameError ||
      emailError ||
      passwordError ||
      !firstName ||
      !username ||
      !email ||
      !password
    ) {
      return;
    }

    auth
      .createUserWithEmailAndPassword(email, password)
      .then((data) => {
        data.user.updateProfile({
          displayName: username,
        });
        data.user.sendEmailVerification().catch((err) => {
          //console.log(err);
        });
        db.collection('users').doc(data.user.uid).set({
          uid: data.user.uid,
          email,
          username,
          joined: moment.utc().format(),
        });

        history.push('/');
      })
      .catch((err) => {
        if (err.code === 'auth/email-already-in-use') {
        } else {
        }
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
        Sign up to start your journey
      </Typography>
      <form className={styles.form} onSubmit={handleSignUp}>
        <TextField
          fullWidth
          label='First name'
          variant='filled'
          className={classes.input}
          size='small'
          type='text'
          name='firstName'
          value={firstName}
          onChange={handleChange}
          error={firstNameError}
          helperText={firstNameError ? firstNameError : ''}
        />
        <TextField
          fullWidth
          label='Username'
          variant='filled'
          className={classes.input}
          size='small'
          type='text'
          name='username'
          value={username}
          onChange={handleChange}
          error={userNameError}
          helperText={userNameError ? userNameError : ''}
        />
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
          type='submit'
          disabled={
            firstNameError ||
            userNameError ||
            emailError ||
            passwordError ||
            !firstName ||
            !username ||
            !email ||
            !password
              ? true
              : false
          }
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
      </form>
    </div>
  );
}
