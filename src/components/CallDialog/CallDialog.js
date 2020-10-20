import React, { useState, useContext, useEffect, useCallback } from 'react';
import { Avatar, Fab, makeStyles, Typography, Slide } from '@material-ui/core';
import { Call, CallEnd } from '@material-ui/icons';
import { AuthContext } from '../../context/AuthContext';
import { CallContext } from '../../context/CallContext';
import TimeCodeWrapper from '../TimeCodeWrapper/TimeCodeWrapper';
import { getUserById } from '../../utils/helper';
import styles from './CallDialog.module.css';
import {
  answerAudioCall,
  answerVideoCall,
  makeAudioCall,
  makeVideoCall,
} from '../../utils/call';

const useStyles = makeStyles({
  avatar: {
    height: '100px',
    width: '100px',
  },
  username: {
    opacity: 0.75,
    fontSize: '14px',
    marginTop: '20px',
  },
  mx: {
    margin: '0 25px',
  },
});

export default function CallDialog() {
  const [user, setUser] = useState({});
  const [localCall, setLocalCall] = useState(null);
  const classes = useStyles();
  const {
    call,
    setCall,
    peer,
    status,
    setStatus,
    connection,
    setConnection,
  } = useContext(CallContext);
  const { currentUser } = useContext(AuthContext);

  const closeWithStatus = useCallback(
    (connection, status = 'Call ended') => {
      setStatus(status);
      setTimeout(() => {
        connection.close();
        setCall({ isCalling: false });
      }, 2000);
    },
    [setCall, setStatus]
  );

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

        const conn = peer.connect(userId);

        //Keep connection object in state to use in entire component
        setConnection(conn);

        // Check if the user connects after 9s so we don't keep them waiting
        const checkConnection = setTimeout(() => {
          if (!conn.open) {
            closeWithStatus(conn, 'User is unavailable');
          }
        }, 9000);

        conn.on('open', () => {
          //call user here as connection is open and clear checkConnection timeout
          clearTimeout(checkConnection);

          //Wait 300ms to find out if user is another call
          setTimeout(() => {
            if (conn.open) {
              //Set status to ringing as connection is open
              setStatus('Ringing');

              if (call.type === 'video') {
                //Make a video call
                makeVideoCall(
                  peer,
                  userId,
                  call.room,
                  conn,
                  setStatus,
                  closeWithStatus,
                  setLocalCall
                );
              } else {
                //Make an audio call
                makeAudioCall(
                  peer,
                  userId,
                  call.room,
                  conn,
                  setStatus,
                  closeWithStatus,
                  setLocalCall
                );
              }
            }
          }, 300);
        });

        conn.on('data', (data) => {
          //Check if caller ends call or is busy
          if (data === 'oncall') {
            closeWithStatus(conn, 'User is on another call');
          } else if (data === 'end-call') {
            closeWithStatus(conn);
          } else if (data === 'decline-call') {
            closeWithStatus(conn, 'Call declined');
          }
        });

        conn.on('error', () => {
          clearTimeout(checkConnection);
          closeWithStatus(conn, "Can't resolve call");
        });
      }
    }
  }, [
    peer,
    call,
    currentUser.uid,
    setCall,
    setStatus,
    closeWithStatus,
    setConnection,
  ]);

  const answerCall = () => {
    if (call.type === 'video') {
      //Answer video call
      answerVideoCall(call.remote, connection, setStatus, closeWithStatus);
    } else {
      //Answer audio call
      answerAudioCall(call.remote, connection, setStatus, closeWithStatus);
    }
  };

  const endCall = () => {
    //End call block
    if (!localCall && !call.remote) {
      setStatus('Call ended');
      setTimeout(() => {
        setCall({ isCalling: false });
      }, 2000);

      return;
    }

    if (!connection) {
      return;
    }

    if (localCall) {
      connection.send('end-call');
      localCall.close();
    } else {
      if (call.remote.open) {
        connection.send('end-call');
      } else {
        connection.send('decline-call');
      }
      call.remote.close();
    }

    closeWithStatus(connection);
  };

  return (
    <Slide in={call.isCalling} direction='up' mountOnEnter unmountOnExit>
      <div className={styles.container}>
        <div
          className={
            call.type === 'audio'
              ? styles.audioCall__container
              : styles.videoCall__container
          }
        >
          {(call.type === 'audio' || call.remote) && (
            <div className={styles.user__container}>
              <Avatar
                className={classes.avatar}
                alt={user.username?.toUpperCase()}
                src={user.photoUrl}
              />
              <Typography className={classes.username} align='center'>
                {user.username}
              </Typography>
            </div>
          )}
          {call.type === 'video' && (
            <>
              <div className={styles.mainVideo__container}>
                <video autoPlay id='main-video'></video>
              </div>
              <div className={styles.miniVideo__container}>
                <video autoPlay id='mini-video' muted></video>
              </div>
            </>
          )}
          <div className={styles.callActions__container}>
            <Typography align='center'>
              {status ? status : <TimeCodeWrapper />}
            </Typography>
            <div>
              <Fab color='secondary' className={classes.mx} onClick={endCall}>
                <CallEnd />
              </Fab>
              {!call.caller && status.includes('Incoming') && (
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
