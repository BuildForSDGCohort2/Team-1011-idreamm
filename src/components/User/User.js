import React, { useState, useContext, useEffect } from 'react';
import {
  Avatar,
  Badge,
  ListItem,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { blue, red } from '@material-ui/core/colors';
import firebase from 'firebase/app';
import moment from 'moment';
import { MessagesContext } from '../../context/MessagesContext';
import { AuthContext } from '../../context/AuthContext';
import { db } from '../../utils/firebase';
import styles from './User.module.css';

const useStyles = makeStyles((theme) => ({
  avatar: {
    background: red[500],
    height: '50px',
    width: '50px',
  },
  username: {
    fontSize: '14px',
    fontWeight: 400,
  },
  badge: {
    position: 'absolute',
    right: '30px',
  },
  badgeDot: {
    backgroundColor: blue[500],
    color: blue[500],
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: '$ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
  statusOnline: {
    color: blue[500],
    fontWeight: 500,
  },
  statusOffline: {
    color: '#0000008a',
  },
}));

export default function User({
  selected,
  onClick,
  disabled,
  isChatUser,
  user,
}) {
  const [unread, setUnread] = useState(0);
  const [status, setStatus] = useState('Offline');
  const [photoUrl, setPhotoUrl] = useState('');
  const classes = useStyles();
  const { messages, setUnreadMessages } = useContext(MessagesContext);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    if (isChatUser && messages) {
      const room =
        user.uid > currentUser.uid
          ? `${user.uid}-${currentUser.uid}`
          : `${currentUser.uid}-${user.uid}`;

      const unread = messages[room].messages.filter(
        (message) => message.senderId !== currentUser.uid && !message.isRead
      ).length;
      setUnread(unread);
      setUnreadMessages((prev) =>
        Object.values({ ...prev, [user.uid]: unread }).reduce((a, b) => a + b)
      );
    }
  }, [
    currentUser.email,
    currentUser.uid,
    isChatUser,
    messages,
    user.email,
    user.uid,
    setUnreadMessages,
  ]);

  useEffect(() => {
    if (selected && unread && isChatUser && messages) {
      setUnreadMessages((prev) =>
        Object.values({ ...prev, [user.uid]: 0 }).reduce((a, b) => a + b)
      );
      setUnread(0);
      const room =
        user.uid > currentUser.uid
          ? `${user.uid}-${currentUser.uid}`
          : `${currentUser.uid}-${user.uid}`;

      const messagesRef = db
        .collection('rooms')
        .doc(room)
        .collection('messages');

      const query = messagesRef.where('senderId', '==', user.uid);

      query.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          messagesRef.doc(doc.id).update({ isRead: true });
        });
      });
    }
  }, [
    currentUser,
    isChatUser,
    messages,
    selected,
    user.email,
    unread,
    user.uid,
    setUnreadMessages,
  ]);

  useEffect(() => {
    const statusRef = firebase.database().ref('status/' + user.uid);
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
    });

    db.collection('users')
      .doc(user.uid)
      .get()
      .then((snapshot) => {
        const user = snapshot.data();
        setPhotoUrl(user.photoUrl);
      });
  }, [user.uid]);

  return (
    <ListItem
      className={styles.user}
      button
      selected={selected}
      onClick={onClick}
      disabled={disabled}
    >
      <div>
        <Badge
          color='secondary'
          variant='dot'
          overlap='circle'
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          classes={{ dot: classes.badgeDot }}
          invisible={status === 'Online' ? false : true}
        >
          <Avatar className={classes.avatar} src={photoUrl} alt={user.username}>
            {!photoUrl && user.username[0].toUpperCase()}
          </Avatar>
        </Badge>
      </div>
      <div>
        <Typography className={classes.username}>{user.username}</Typography>
        <Typography
          variant='body2'
          className={
            status === 'Online' ? classes.statusOnline : classes.statusOffline
          }
        >
          {status}
        </Typography>
      </div>
      {isChatUser && (
        <Badge
          badgeContent={unread}
          color='secondary'
          className={classes.badge}
        />
      )}
    </ListItem>
  );
}
