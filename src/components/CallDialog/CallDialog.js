import React, { useState, useContext, useEffect } from 'react';
import { Avatar, Fab, makeStyles, Typography, Slide } from '@material-ui/core';
import { Call, CallEnd } from '@material-ui/icons';
import firebase from 'firebase/app';
import { AuthContext } from '../../context/AuthContext';
import { CallContext } from '../../context/CallContext';
import TimeCodeWrapper from '../TimeCodeWrapper/TimeCodeWrapper';
import { getUserById } from '../../utils/helper';
import styles from './CallDialog.module.css';

const useStyles = makeStyles({
  avatar: {
    height: '100px',
    width: '100px',
  },
  username: {
    opacity: 0.75,
    fontSize: '14px',
    margin: '5px 0 25px',
  },
  mx: {
    margin: '0 25px',
  },
});

export default function CallDialog() {
  const [user, setUser] = useState({});
  const classes = useStyles();
  const { call, setCall, peer } = useContext(CallContext);
  const { currentUser } = useContext(AuthContext);
  const [status, setStatus] = useState('');
  const [localCall, setLocalCall] = useState(null);

  useEffect(() => {
    if (call?.isCalling && peer) {
      const userId = call.room
        .split('-')
        .filter((userId) => userId !== currentUser.uid)
        .toString();

      getUserById(userId)
        .then((user) => setUser(user))
        .catch(() => {
          setCall({ isCalling: false });
        });

      if (call.caller) {
        const mediaStream = document.createElement('audio');
        setStatus('Calling');

        const userPeerRef = firebase.database().ref('/peer/' + userId);

        userPeerRef.once('value').then((snapshot) => {
          const { id: userId } = snapshot.val();

          navigator.mediaDevices
            .getUserMedia({ audio: true })
            .then((stream) => {
              const _call = peer.call(userId, stream, {
                metadata: { type: call.type, room: call.room },
              });

              setLocalCall(_call);

              const ringBell = new Audio('./simple_bell_2.mp3');
              ringBell.volume = 0.5;
              ringBell.play();
              ringBell.onended = () => {
                if (!_call.open) {
                  ringBell.play();
                }
              };

              _call.on('stream', (remoteStream) => {
                setStatus('');

                if (!ringBell.ended) {
                  ringBell.pause();
                  ringBell.currentTime = 0;
                }

                mediaStream.srcObject = remoteStream;
                mediaStream.play();
              });

              _call.on('close', () => {
                setStatus('Call ended');

                mediaStream.remove();
                stream.getTracks().forEach((track) => track.stop());

                setTimeout(() => {
                  setCall({ isCalling: false });
                }, 2000);
              });
            });
        });
      } else {
        setStatus('Incoming call');
        call.controller.on('close', () => {
          setStatus('Call ended');
          setTimeout(() => {
            setCall({ isCalling: false });
          }, 2000);
        });
      }
    }
  }, [peer, call, currentUser.uid, setCall]);

  const answerCall = () => {
    setStatus('Connecting...');

    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      call.controller.answer(stream);
      const mediaStream = document.createElement('audio');

      call.controller.on('stream', (remoteStream) => {
        setStatus('');
        mediaStream.srcObject = remoteStream;
        mediaStream.play();
      });

      call.controller.on('close', () => {
        mediaStream.remove();
        stream.getTracks().forEach((track) => track.stop());
      });

      call.ringTone.pause();
      call.ringTone.currentTime = 0;
    });
  };

  const rejectCall = () => {
    if (localCall) {
      localCall.close();
    } else {
      call.controller.close();
    }
  };

  return (
    <Slide in={call.isCalling} direction='up' mountOnEnter unmountOnExit>
      <div className={styles.container}>
        <div>
          <div>
            <Avatar
              className={classes.avatar}
              alt={user.username?.toUpperCase()}
              src={user.photoUrl}
            />
            <Typography className={classes.username} align='center'>
              {user.username}
            </Typography>
          </div>
          <div>
            <Typography align='center'>
              {status ? status : <TimeCodeWrapper />}
            </Typography>
            <div>
              <Fab
                color='secondary'
                className={classes.mx}
                onClick={rejectCall}
              >
                <CallEnd />
              </Fab>
              {!call.caller && status === 'Incoming call' && (
                <Fab
                  color='primary'
                  className={classes.mx}
                  onClick={answerCall}
                >
                  <Call />
                </Fab>
              )}
            </div>
          </div>
        </div>
      </div>
    </Slide>
  );
}
