import React, { useContext, useState } from 'react';
import {
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { Add, ArrowBack } from '@material-ui/icons';
import cx from 'classnames';
import NewMessageDialog from '../NewMessageDialog/NewMessageDialog';
import { SelectedUserContext } from '../../context/SelectedUserContext';
import { NavigationContext } from '../../context/NavigationContext';
import Users from '../Users/Users';
import styles from './MobileMessenger.module.css';
import SelectedUser from '../SelectedUser/SelectedUser';
import MessengerForm from '../MessengerForm/MessengerForm';
import Messages from '../Messages/Messages';

const useStyles = makeStyles({
  content: {
    padding: 0,
    minWidth: '350px',
    width: '100%',
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
  title: {
    fontWeight: '500',
    padding: '0',
  },
  margin: {
    marginTop: '12px',
  },
});

export default function MobileMessenger({ users, isGettingUsers }) {
  const [isNewMessageDialog, setIsNewMessageDialog] = useState(false);
  const [isChatDialog, setIsChatDialog] = useState(false);

  const { selectedUser, setSelectedUser } = useContext(SelectedUserContext);
  const setCurrentPage = useContext(NavigationContext)[1];

  const classes = useStyles();

  return (
    <div>
      <Dialog
        open={true}
        fullScreen={true}
        scroll='paper'
        onClose={() => setCurrentPage('home')}
        className={styles.selectUser__container}
      >
        <header>
          <div>
            <IconButton onClick={() => setCurrentPage('home')} color='inherit'>
              <ArrowBack />
            </IconButton>
            <DialogTitle className={classes.title}>Messenger</DialogTitle>
          </div>
          <IconButton
            onClick={() => setIsNewMessageDialog(true)}
            color='inherit'
          >
            <Add />
          </IconButton>
        </header>
        <DialogContent
          dividers={true}
          className={cx(classes.content, 'custom-scrollbar')}
        >
          {isGettingUsers ? (
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
              onClick={(user) => {
                setSelectedUser(user);
                setIsChatDialog(true);
              }}
              isChatUsers={true}
            />
          )}
        </DialogContent>
      </Dialog>

      <NewMessageDialog
        open={isNewMessageDialog}
        onClose={() => setIsNewMessageDialog(false)}
        isMobile={true}
        mobileCallback={() => setIsChatDialog(true)}
      />

      {selectedUser && (
        <Dialog
          open={isChatDialog}
          onClose={() => {
            setIsChatDialog(false);
            setSelectedUser(null);
          }}
          fullScreen={true}
        >
          <div className={styles.chat__container}>
            <SelectedUser
              isMobile={true}
              onBack={() => {
                setIsChatDialog(false);
                setSelectedUser(null);
              }}
            />

            <DialogContent
              dividers={true}
              className={cx(classes.content, 'custom-scrollbar')}
            >
              <Messages />
            </DialogContent>
            <MessengerForm />
          </div>
        </Dialog>
      )}
    </div>
  );
}
