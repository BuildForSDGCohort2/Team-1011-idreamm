import React, { useContext, useState, useEffect } from 'react';
import { IconButton, InputBase, makeStyles } from '@material-ui/core';
import moment from 'moment';
import { InsertEmoticon, Send } from '@material-ui/icons';
import { AuthContext } from '../../context/AuthContext';
import { SelectedUserContext } from '../../context/SelectedUserContext';
import { SnackContext } from '../../context/SnackContext';
import { db } from '../../utils/firebase';
import styles from './MessengerForm.module.css';

const useStyles = makeStyles({
  inputRoot: {
    lineHeight: '1.4',
  },
});

export default function MessengerForm() {
  const [message, setMessage] = useState('');
  const classes = useStyles();
  const { currentUser } = useContext(AuthContext);
  const { selectedUser, room } = useContext(SelectedUserContext);
  const setSnack = useContext(SnackContext)[1];

  const sendMessage = () => {
    const messageBackup = message;
    setMessage('');
    document.getElementById('messengerInput').focus();
    if (room && message.trim()) {
      db.collection('rooms')
        .doc(room)
        .collection('messages')
        .add({
          senderId: currentUser.uid,
          sender: currentUser.username,
          text: message.trim(),
          isRead: false,
          timestamp: moment.utc().format(),
        })
        .catch(() => {
          setMessage(messageBackup);
          setSnack({
            open: true,
            message: 'An error occured, failed to send message',
          });
        });
    }
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      if (!e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    }
  };

  useEffect(() => {
    if (selectedUser) {
      document.getElementById('messengerInput').focus();
    }
  }, [selectedUser]);

  return (
    <div className={styles.messenger__form}>
      <IconButton color='inherit' disabled={!selectedUser}>
        <InsertEmoticon />
      </IconButton>
      <form>
        <InputBase
          placeholder='Type message...'
          fullWidth
          classes={{
            root: classes.inputRoot,
            input: 'custom-scrollbar',
          }}
          multiline
          rowsMax={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={!selectedUser}
          onKeyDown={handleKeyDown}
          id='messengerInput'
        />
        <IconButton
          color='inherit'
          onClick={sendMessage}
          disabled={!message.trim() || !selectedUser}
        >
          <Send />
        </IconButton>
      </form>
    </div>
  );
}
