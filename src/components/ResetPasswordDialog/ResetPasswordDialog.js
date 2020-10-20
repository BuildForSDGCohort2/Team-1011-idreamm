import React, { useContext, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@material-ui/core';
import { validateEmail } from '../../utils/helper';
import { SnackContext } from '../../context/SnackContext';
import { LoadingContext } from '../../context/LoadingContext';
import { auth } from '../../utils/firebase';

export default function ResetPasswordDialog({ open, onClose }) {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(null);
  const [isLoading, setIsLoading] = useContext(LoadingContext);
  const setSnack = useContext(SnackContext)[1];

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!email || emailError) {
      return;
    }

    auth
      .sendPasswordResetEmail(email)
      .then(() => {
        handleClose();
        setEmail('');
        setSnack({ open: true, message: 'Reset link sent successfully' });
      })
      .catch((err) => {
        if (err.code === 'auth/user-not-found') {
          setSnack({
            open: true,
            message: 'An account with that email does not exist',
          });
        } else {
          setSnack({
            open: true,
            message: 'An error occured, please try again',
          });
        }
      })
      .finally(() => setIsLoading(false));
  };

  const handleChange = (e) => {
    const { value } = e.target;

    setEmail(value);
    setEmailError(validateEmail(value));
  };

  const handleClose = () => {
    if (!isLoading) {
      setEmail('');
      setEmailError(null);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Reset Password</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please enter the email address you used to create your account and
          you'll receive a reset link from us
        </DialogContentText>
        <form onSubmit={handleSubmit}>
          <TextField
            value={email}
            onChange={handleChange}
            label='Email'
            disabled={isLoading}
            helperText={emailError ? emailError : ''}
            error={emailError ? true : false}
            fullWidth
          />
          <DialogActions>
            <Button disabled={isLoading} onClick={handleClose}>
              Cancel
            </Button>
            <Button
              color='primary'
              disabled={!email || emailError || isLoading ? true : false}
              type='submit'
            >
              Done
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
}
