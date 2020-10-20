import React, { useContext, useEffect, useState } from 'react';
import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { ArrowBack, Call, Videocam } from '@material-ui/icons';
import { blue, red } from '@material-ui/core/colors';
import moment from 'moment';
import firebase from 'firebase/app';
import { SelectedUserContext } from '../../context/SelectedUserContext';
import { CallContext } from '../../context/CallContext';
import { db } from '../../utils/firebase';
import styles from './SelectedUser.module.css';

const useStyles = makeStyles({
  avatar: {
    height: '32px',
    width: '32px',
    marginRight: '10px',
    background: red[500],
  },
  statusOnline: {
    color: blue[500],
    fontWeight: 500,
    fontSize: '12px',
  },
  statusOffline: {
    color: '#0000008a',
    fontSize: '12px',
  },
});

export default function SelectedUser({ isMobile, onBack }) {
  const [photoUrl, setPhotoUrl] = useState('');
  const [status, setStatus] = useState('Offline');
  const [isErrorDialog, setIsErrorDialog] = useState(false);
  const classes = useStyles();

  const { selectedUser, room } = useContext(SelectedUserContext);
  const { setCall, peer } = useContext(CallContext);

  useEffect(() => {
    const statusRef = firebase.database().ref('status/' + selectedUser.uid);
    statusRef.on('value', function (snapshot) {
      const status = snapshot.val();

      if (status) {
        if (status.state === 'online') {
          setStatus('Online');
        } else {
          setStatus(
            moment.utc(status.last_changed).local().calendar().toLowerCase()
          );
        }
      } else {
        setStatus('Offline');
      }

      db.collection('users')
        .doc(selectedUser.uid)
        .get()
        .then((snapshot) => {
          const user = snapshot.data();
          setPhotoUrl(user.photoUrl);
        });
    });
  }, [selectedUser.uid]);

  const handleAudioCall = () => {
    if (peer.id) {
      setCall({ isCalling: true, type: 'audio', room, caller: true });
    } else {
      setIsErrorDialog(true);
    }
  };

  const handleVideoCall = () => {
    if (peer.id) {
      setCall({ isCalling: true, type: 'video', room, caller: true });
    } else {
      setIsErrorDialog(true);
    }
  };

  return (
    <>
      <div
        className={styles.selectedUser}
        style={{ padding: isMobile ? 0 : '0 20px' }}
      >
        <div>
          {isMobile && (
            <IconButton onClick={onBack} color='inherit'>
              <ArrowBack />
            </IconButton>
          )}
          <Avatar
            className={classes.avatar}
            src={photoUrl}
            alt={selectedUser.username}
          />
          <div>
            <Typography variant='body2'>{selectedUser.username}</Typography>
            <Typography
              className={
                status === 'Online'
                  ? classes.statusOnline
                  : classes.statusOffline
              }
            >
              {status}
            </Typography>
          </div>
        </div>
        <div>
          <IconButton color='inherit' onClick={handleAudioCall}>
            <Call />
          </IconButton>
          <IconButton
            edge={isMobile ? '' : 'end'}
            color='inherit'
            onClick={handleVideoCall}
          >
            <Videocam />
          </IconButton>
        </div>
      </div>
      <Dialog open={isErrorDialog} onClose={() => setIsErrorDialog(false)}>
        <DialogTitle>Information</DialogTitle>
        <DialogContent>
          <DialogContentText color='inherit'>
            Sorry, this feature is under maintenance. Please try again later
          </DialogContentText>
          <DialogActions>
            <Button color='primary' onClick={() => setIsErrorDialog(false)}>
              Ok
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </>
  );
}
