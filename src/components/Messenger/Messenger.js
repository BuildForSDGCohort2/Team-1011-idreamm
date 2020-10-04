import React, { useState, useContext, useEffect } from 'react';
import {
  CircularProgress,
  IconButton,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { Add } from '@material-ui/icons';
import SelectedUser from '../SelectedUser/SelectedUser';
import Users from '../Users/Users';
import MessengerForm from '../MessengerForm/MessengerForm';
import Messages from '../Messages/Messages';
import NewMessageDialog from '../NewMessageDialog/NewMessageDialog';
import { MessagesContext } from '../../context/MessagesContext';
import { AuthContext } from '../../context/AuthContext';
import { SelectedUserContext } from '../../context/SelectedUserContext';
import styles from './Messenger.module.css';

const useStyles = makeStyles({
  title: {
    fontWeight: '500',
  },
  margin: {
    marginTop: '12px',
  },
});

export default function Messenger() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [users, setUsers] = useState(null);

  const { messages, isLoading } = useContext(MessagesContext);
  const { currentUser } = useContext(AuthContext);
  const { selectedUser, setSelectedUser } = useContext(SelectedUserContext);

  useEffect(() => {
    if (messages) {
      const users = Object.values(messages).map(
        (message) =>
          message.participants.filter(
            (participant) => participant.uid !== currentUser.uid
          )[0]
      );

      setUsers(users);
    }
  }, [messages, currentUser.uid]);

  const classes = useStyles();
  return (
    <div className={styles.messenger__container}>
      <header>
        <Typography className={classes.title}>Messenger</Typography>
        <div>
          <IconButton
            edge='end'
            color='inherit'
            onClick={() => setIsDialogOpen(true)}
          >
            <Add />
          </IconButton>
        </div>
      </header>
      <div className={styles.currentUser__container}>
        {selectedUser && <SelectedUser />}
      </div>
      <div className={styles.users__container}>
        {isLoading ? (
          <div className={styles.loader__container}>
            <CircularProgress color='secondary' size={16} />
            <Typography variant='body2' color='textSecondary'>
              Getting chats
            </Typography>
          </div>
        ) : !users ? (
          <Typography
            color='textSecondary'
            variant='body2'
            align='center'
            className={classes.margin}
          >
            No recent chats
          </Typography>
        ) : (
          <Users
            users={users}
            onClick={(user) => setSelectedUser(user)}
            canSelect={true}
          />
        )}
      </div>
      <div className={styles.messages__container}>
        <Messages />
      </div>
      <div className={styles.messenger__form__container}>
        <MessengerForm />
      </div>
      <NewMessageDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </div>
  );
}
