import React, { useContext, useState } from 'react';
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
    lineHeight: '1.5',
  },
});

export default function MessengerForm() {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const classes = useStyles();
  const { currentUser } = useContext(AuthContext);
  const { selectedUser, room } = useContext(SelectedUserContext);
  const setSnack = useContext(SnackContext)[1];

  const sendMessage = (e) => {
    e.preventDefault();
    setIsSending(true);
    if (room && message.trim()) {
      db.collection('rooms')
        .doc(room)
        .collection('messages')
        .add({
          senderId: currentUser.uid,
          sender: currentUser.username,
          text: message.trim(),
          timestamp: moment.utc().format(),
        })
        .then(() => {
          setMessage('');
        })
        .catch(() =>
          setSnack({
            open: true,
            message: 'An error occured, failed to send message',
          })
        )
        .finally(() => setIsSending(false));
    }
  };

  return (
    <div className={styles.messenger__form}>
      <IconButton color='inherit' disabled={isSending || !selectedUser}>
        <InsertEmoticon />
      </IconButton>
      <form onSubmit={sendMessage}>
        <InputBase
          placeholder='Type message...'
          fullWidth
          multiline
          classes={{
            root: classes.inputRoot,
            input: styles.input,
          }}
          rowsMax='4'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={isSending || !selectedUser}
        />
        <IconButton
          color='inherit'
          type='submit'
          disabled={!message.trim() || isSending || !selectedUser}
        >
          <Send />
        </IconButton>
      </form>
    </div>
  );
}
