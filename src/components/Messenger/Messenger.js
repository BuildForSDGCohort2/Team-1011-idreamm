import React, { useState, useContext, useEffect } from 'react';
import {
  CircularProgress,
  IconButton,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { Add } from '@material-ui/icons';
import cx from 'classnames';
import SelectedUser from '../SelectedUser/SelectedUser';
import Users from '../Users/Users';
import MessengerForm from '../MessengerForm/MessengerForm';
import Messages from '../Messages/Messages';
import NewMessageDialog from '../NewMessageDialog/NewMessageDialog';
import { MessagesContext } from '../../context/MessagesContext';
import { AuthContext } from '../../context/AuthContext';
import { SelectedUserContext } from '../../context/SelectedUserContext';
import MobileMessenger from '../MobileMessenger/MobileMessenger';
import styles from './Messenger.module.css';
import { getUserById } from '../../utils/helper';
import { SnackContext } from '../../context/SnackContext';

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
  const [isMobile, setIsMobile] = useState(true);

  const { messages, isLoading } = useContext(MessagesContext);
  const { currentUser } = useContext(AuthContext);
  const { selectedUser, setSelectedUser } = useContext(SelectedUserContext);
  const setSnack = useContext(SnackContext)[1];

  useEffect(() => {
    if (window.screen.width < 768) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }

    window.addEventListener('resize', () => {
      if (window.screen.width < 768) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    });
  }, []);

  useEffect(() => {
    if (messages) {
      const promises = Object.values(messages).map(async (message) => {
        const userId = message.participants.filter(
          (participant) => participant !== currentUser.uid
        )[0];
        return await getUserById(userId);
      });

      Promise.all(promises)
        .then((users) => {
          setUsers(users);
        })
        .catch(() => {
          setSnack({ open: true, message: 'Failed to get recent chats' });
        });
    }
  }, [messages, currentUser.uid, setSnack]);

  const classes = useStyles();

  if (isMobile) {
    return <MobileMessenger users={users} isGettingUsers={isLoading} />;
  }

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
      <div
        className={styles.currentUser__container}
        style={{ borderBottom: selectedUser ? '1px solid #ddd' : 'none' }}
      >
        {selectedUser && <SelectedUser />}
      </div>
      <div className={cx(styles.users__container, 'custom-scrollbar')}>
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
            isChatUsers={true}
          />
        )}
      </div>
      <div className={styles.messages__container}>
        <Messages />
      </div>
      <div
        className={styles.messenger__form__container}
        style={{ borderTop: selectedUser ? '1px solid #ddd' : 'none' }}
      >
        {selectedUser && <MessengerForm />}
      </div>
      <NewMessageDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </div>
  );
}
