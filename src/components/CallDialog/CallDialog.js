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
  const { call, setCall, peer, status, setStatus } = useContext(CallContext);
  const { currentUser } = useContext(AuthContext);
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
        setStatus('Calling');

        const userPeerRef = firebase.database().ref('/peer/' + userId);

        userPeerRef.once('value').then((snapshot) => {
          const { id: userId } = snapshot.val();

          navigator.mediaDevices
            .getUserMedia({
              audio: { echoCancellation: true, facingMode: 'user' },
              video: call.type === 'video' ? { facingMode: 'user' } : false,
            })
            .then((stream) => {
              const remoteMedia = document.createElement(
                call.type === 'video' ? 'video' : 'audio'
              );

              let localVideo;

              if (call.type === 'video') {
                localVideo = document.createElement('video');
                localVideo.srcObject = stream;
                localVideo.muted = true;
                localVideo.autoplay = true;
                localVideo.onloadedmetadata = () => {
                  document
                    .getElementById('main-video-container')
                    .appendChild(localVideo);
                };
              }

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

                if (call.type === 'video') {
                  remoteMedia.srcObject = remoteStream;
                  remoteMedia.autoplay = true;
                  remoteMedia.onloadedmetadata = () => {
                    document
                      .getElementById('main-video-container')
                      .removeChild(localVideo);
                    document
                      .getElementById('main-video-container')
                      .appendChild(remoteMedia);
                    document
                      .getElementById('mini-video-container')
                      .appendChild(localVideo);
                  };
                } else {
                  remoteMedia.srcObject = remoteStream;
                  remoteMedia.play();
                }
              });

              _call.on('close', () => {
                setStatus('Call ended');

                remoteMedia.remove();
                stream.getTracks().forEach((track) => track.stop());

                setTimeout(() => {
                  setCall({ isCalling: false });
                }, 2000);
              });

              _call.on('error', () => {
                setStatus('Can not connect');

                remoteMedia.remove();
                stream.getTracks().forEach((track) => track.stop());

                setTimeout(() => {
                  setCall({ isCalling: false });
                }, 2000);
              });
            });
        });
      }
    }
  }, [peer, call, currentUser.uid, setCall, setStatus]);

  const answerCall = () => {
    setStatus('Connecting...');
    call.accept();
  };

  const rejectCall = () => {
    if (localCall) {
      localCall.close();
    } else {
      call.end();
    }
  };

  return (
    <Slide in={call.isCalling} direction='up' mountOnEnter unmountOnExit>
      <div className={styles.container}>
        <div>
          {call.type === 'audio' ? (
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
          ) : (
            <>
              <div
                id='main-video-container'
                className={styles.mainVideo__container}
              ></div>
              <div
                id='mini-video-container'
                className={styles.miniVideo__container}
              ></div>{' '}
            </>
          )}
          <div className={styles.callActions__container}>
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
