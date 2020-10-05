import React, { useContext, useEffect, useState } from 'react';
import {
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  InputBase,
  makeStyles,
  useMediaQuery,
  useTheme,
} from '@material-ui/core/';
import { Close, Search } from '@material-ui/icons';
import firebase from 'firebase/app';
import cx from 'classnames';
import Users from '../Users/Users';
import { db } from '../../utils/firebase';
import { AuthContext } from '../../context/AuthContext';
import { SnackContext } from '../../context/SnackContext';
import { SelectedUserContext } from '../../context/SelectedUserContext';
import styles from './NewMessageDialog.module.css';

const useStyles = makeStyles({
  content: {
    padding: 0,
    minWidth: '350px',
  },
  icon: {
    color: '#0000008a',
  },
  input: {
    marginLeft: '24px',
  },
  loader: {
    marginRight: '8px',
  },
});

export default function NewMessageDialog({ open, onClose }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [users, setUsers] = useState([]);

  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));

  const { currentUser } = useContext(AuthContext);
  const { setSelectedUser } = useContext(SelectedUserContext);
  const setSnack = useContext(SnackContext)[1];

  useEffect(() => {
    db.collection('users')
      .get()
      .then((snapShot) => {
        const users = snapShot.docs
          .map((doc) => doc.data())
          .filter((user) => user.uid !== currentUser.uid);
        setUsers(users);
      })
      .catch(() => setSnack({ open: true, message: 'Failed to get users' }))
      .finally(() => setIsLoading(false));
  }, [currentUser.uid, setSnack]);

  const createRoom = (user) => {
    setIsCreatingRoom(true);

    const room =
      user.email > currentUser.email
        ? `${user.email}-${currentUser.email}`
        : `${currentUser.email}-${user.email}`;

    const roomRef = db.collection('rooms').doc(room);

    roomRef
      .get()
      .then((room) => {
        if (room.exists) {
          //Set selectedUser to this user
          setSelectedUser(user);
        } else {
          roomRef
            .set({
              participants: [
                { username: user.username, uid: user.uid, email: user.email },
                {
                  username: currentUser.username,
                  uid: currentUser.uid,
                  email: currentUser.email,
                },
              ],
              timestamp: firebase.firestore.Timestamp.now(),
            })
            .then(() => {
              //Set selectedUser to this user
              setSelectedUser(user);
            });
        }

        setIsCreatingRoom(false);
        onClose();
      })
      .catch(() => {
        setSnack({ open: true, message: 'An error occured, please try again' });
        setIsCreatingRoom(false);
      });
  };

  return (
    <Dialog
      open={open}
      onClose={!isCreatingRoom && onClose}
      fullScreen={fullScreen}
      scroll='paper'
    >
      <div className={styles.header__container}>
        <DialogTitle className={classes.title}>New Message</DialogTitle>
        {!isCreatingRoom ? (
          <IconButton onClick={onClose} color='inherit'>
            <Close />
          </IconButton>
        ) : (
          <CircularProgress
            color='secondary'
            size={16}
            className={classes.loader}
          />
        )}
      </div>
      <div className={styles.search__container}>
        <Search className={classes.icon} fontSize='small' />
        <InputBase
          className={classes.input}
          fullWidth
          placeholder='Search user...'
          disabled={isCreatingRoom}
        />
      </div>
      <DialogContent
        dividers={true}
        className={cx(classes.content, 'custom-scrollbar')}
      >
        <div className={styles.users__container}>
          {isLoading ? (
            <div>loading</div>
          ) : (
            <Users
              users={users}
              onClick={createRoom}
              disabled={isCreatingRoom}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
