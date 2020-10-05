import React, { useState, useContext, useEffect } from 'react';
import {
  Avatar,
  Badge,
  ListItem,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { red } from '@material-ui/core/colors';
import { MessagesContext } from '../../context/MessagesContext';

import styles from './User.module.css';
import { AuthContext } from '../../context/AuthContext';
import { db } from '../../utils/firebase';

const useStyles = makeStyles({
  avatar: {
    background: red[500],
    height: '50px',
    width: '50px',
  },
  username: {
    fontSize: '14px',
  },
  badge: {
    position: 'absolute',
    right: '30px',
  },
});

export default function User({
  selected,
  onClick,
  disabled,
  isChatUser,
  user,
}) {
  const [unread, setUnread] = useState(0);
  const classes = useStyles();
  const { messages, setUnreadMessages } = useContext(MessagesContext);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    if (isChatUser && messages) {
      const room =
        user.email > currentUser.email
          ? `${user.email}-${currentUser.email}`
          : `${currentUser.email}-${user.email}`;

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
        user.email > currentUser.email
          ? `${user.email}-${currentUser.email}`
          : `${currentUser.email}-${user.email}`;

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
    currentUser.email,
    isChatUser,
    messages,
    selected,
    user.email,
    unread,
    user.uid,
    setUnreadMessages,
  ]);

  return (
    <ListItem
      className={styles.user}
      button
      selected={selected}
      onClick={onClick}
      disabled={disabled}
    >
      <div>
        <Avatar className={classes.avatar}>
          {user.username[0].toUpperCase()}
        </Avatar>
      </div>
      <div>
        <Typography className={classes.username}>{user.username}</Typography>
        <Typography variant='body2' color='textSecondary'>
          Active now
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
