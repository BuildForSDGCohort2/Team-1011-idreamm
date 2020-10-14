import React, { useContext, useState } from 'react';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  InputAdornment,
  makeStyles,
  TextField,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import { Close, Visibility, VisibilityOff } from '@material-ui/icons';
import {
  validateFirstName,
  validateUserName,
  validateEmail,
  validatePassword,
} from '../../utils/helper';
import { auth, db } from '../../utils/firebase';
import { SnackContext } from '../../context/SnackContext';
import styles from './ProfileUpdateDialog.module.css';

const useStyles = makeStyles({
  input: {
    marginBottom: '10px',
  },
  my: {
    margin: '20px 0',
  },
  loader: {
    marginRight: '8px',
  },
});

export default function ProfileUpdateDialog({ open, onClose }) {
  const [firstName, setFirstName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstNameError, setFirstNameError] = useState(null);
  const [usernameError, setUsernameError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const setSnack = useContext(SnackContext)[1];
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));
  const classes = useStyles();

  const handleClose = () => {
    if (!isLoading) {
      resetState();
      onClose();
    }
  };

  const resetState = () => {
    setFirstName('');
    setUsername('');
    setEmail('');
    setPassword('');
    setFirstNameError(null);
    setUsernameError(null);
    setEmailError(null);
    setPasswordError(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'firstName') {
      setFirstName(value);
      setFirstNameError(validateFirstName(value, true));
    } else if (name === 'username') {
      setUsername(value);
      setUsernameError(validateUserName(value, true));
    } else if (name === 'email') {
      setEmail(value);
      setEmailError(validateEmail(value, true));
    } else if (name === 'password') {
      setPassword(value);
      setPasswordError(validatePassword(value, true));
    }
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    setIsLoading(true);

    const promises = [];
    const user = auth.currentUser;

    if (email) {
      const promise = user.updateEmail(email).then(() => {
        db.collection('users')
          .doc(user.uid)
          .update({ email })
          .then(() => {
            user.sendEmailVerification();
          });
      });
      promises.push(promise);
    }

    if (password) {
      const promise = user.updatePassword(password);
      promises.push(promise);
    }

    if (firstName) {
      const promise = db.collection('users').doc(user.uid).update({
        firstName,
      });
      promises.push(promise);
    }

    if (username) {
      const promise = user
        .updateProfile({
          displayName: username,
        })
        .then(() => {
          db.collection('users').doc(user.uid).update({ username });
        });
      promises.push(promise);
    }

    Promise.all(promises)
      .then(() => {
        if (email && password) {
          setSnack({
            open: true,
            message: 'Profile updated successfully, please sign in again',
          });
        } else {
          setSnack({ open: true, message: 'Profile updated successfully' });
        }
        handleClose();
      })
      .catch((err) => {
        console.log(err);
        if (err.code === 'auth/requires-recent-login') {
          setSnack({
            open: true,
            message: 'This operation requires recent authentication',
          });
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Dialog
      fullScreen={fullScreen}
      scroll='paper'
      open={open}
      onClose={handleClose}
    >
      <div className={styles.header__container}>
        <DialogTitle id='form-dialog-title'>Update Profile</DialogTitle>
        {!isLoading ? (
          <IconButton color='inherit' onClick={handleClose}>
            <Close />
          </IconButton>
        ) : (
          <CircularProgress
            color='secondary'
            size={16}
            className={classes.loader}
          />
        )}
      </div>
      <DialogContent className='custom-scrollbar'>
        <DialogContentText color='textPrimary'>
          Ignore any field you do not wish to update
        </DialogContentText>
        <form
          className={styles.form}
          autoComplete='off'
          onSubmit={handleUpdate}
        >
          <TextField
            label='First name'
            type='text'
            fullWidth
            className={classes.input}
            size='small'
            name='firstName'
            value={firstName}
            onChange={handleChange}
            error={firstNameError}
            helperText={firstNameError ? firstNameError : ''}
            disabled={isLoading}
            variant='outlined'
          />
          <TextField
            label='Username'
            type='text'
            fullWidth
            className={classes.input}
            size='small'
            name='username'
            value={username}
            onChange={handleChange}
            error={usernameError}
            helperText={usernameError ? usernameError : ''}
            disabled={isLoading}
            variant='outlined'
          />
          <DialogContentText
            color='textSecondary'
            variant='subtitle2'
            className={classes.my}
          >
            To update your email or password, your recent login must be within
            an hour.
          </DialogContentText>
          <TextField
            label='Email'
            type='email'
            fullWidth
            className={classes.input}
            size='small'
            name='email'
            value={email}
            onChange={handleChange}
            error={emailError}
            helperText={emailError ? emailError : ''}
            disabled={isLoading}
            variant='outlined'
          />
          <TextField
            fullWidth
            label='Password'
            variant='outlined'
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
            fullWidth
            color='primary'
            variant='outlined'
            className={classes.my}
            disabled={
              firstNameError ||
              usernameError ||
              emailError ||
              passwordError ||
              isLoading ||
              (!firstName && !username && !email && !password)
                ? true
                : false
            }
            type='submit'
          >
            Done
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
