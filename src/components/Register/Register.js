import React, { useState, useContext } from 'react';
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
import { LoadingContext } from '../../context/LoadingContext';
import { SnackContext } from '../../context/SnackContext';
import { AuthContext } from '../../context/AuthContext';
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

  const { setCurrentUser } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useContext(LoadingContext);
  const setSnack = useContext(SnackContext)[1];

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
    setIsLoading(true);

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
        data.user
          .updateProfile({
            displayName: username,
          })
          .then(() => {
            data.user.sendEmailVerification();
            db.collection('users').doc(data.user.uid).set({
              uid: data.user.uid,
              email,
              username,
              firstName,
              joined: moment.utc().format(),
            });

            setCurrentUser({
              email: data.user.email,
              uid: data.user.uid,
              username,
            });

            setIsLoading(false);
            history.push('/');
          });
      })
      .catch((err) => {
        if (err.code === 'auth/email-already-in-use') {
          setSnack({
            open: true,
            message: 'Email already exist',
          });
        } else {
          setSnack({
            open: true,
            message: 'Sign up failed! Please try again',
          });
        }

        setIsLoading(false);
      });
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);

    const provider = new firebase.auth.GoogleAuthProvider();

    auth
      .signInWithPopup(provider)
      .then(async (data) => {
        const user = await db.collection('users').doc(data.user.uid).get();

        if (!user.exists) {
          db.collection('users')
            .doc(data.user.uid)
            .set({
              uid: data.user.uid,
              email: data.user.email,
              username: data.user.displayName,
              firstName: data.user.displayName.split(' ')[0],
              photoUrl: data.user.photoURL,
              joined: moment.utc().format(),
            });
        }

        setCurrentUser({
          email: data.user.email,
          uid: data.user.uid,
          username: data.user.displayName,
        });

        setIsLoading(false);
        history.push('/');
      })
      .catch((err) => {
        if (/^auth/.test(err.code)) {
          setSnack({
            open: true,
            message: 'Invalid email or password',
          });
        } else {
          setSnack({
            open: true,
            message: 'Sign in failed, unknwon error!',
          });
        }

        setIsLoading(false);
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
      <form className={styles.form} onSubmit={handleSignUp} autoComplete='off'>
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
          disabled={isLoading}
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
          disabled={isLoading}
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
          disabled={isLoading}
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
          disabled={isLoading}
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
            !password ||
            isLoading
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
          disabled={isLoading}
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
