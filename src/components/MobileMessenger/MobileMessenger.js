import React, { useContext, useEffect, useState, useRef, useCallback, forwardRef } from 'react';
import {
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  makeStyles,
  Slide,
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

const TransitionUp = forwardRef(function TransitionUp(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const TransitionLeft = forwardRef(function TransitionLeft(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

export default function MobileMessenger({ users, isGettingUsers }) {
  const [isNewMessageDialog, _setIsNewMessageDialog] = useState(false);
  const [isChatDialog, _setIsChatDialog] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  const isNewMessageDialogRef = useRef(isNewMessageDialog);
  const isChatDialogRef = useRef(isChatDialog);

  const { selectedUser, setSelectedUser } = useContext(SelectedUserContext);
  const setCurrentPage = useContext(NavigationContext)[1];
  const setIsMobileMessenger = useContext(NavigationContext)[2];

  const setIsNewMessageDialog = data => {
    isNewMessageDialogRef.current = data;
    _setIsNewMessageDialog(data);
  }

  const setIsChatDialog = data => {
    isChatDialogRef.current = data;
    _setIsChatDialog(data);
  }

  const classes = useStyles();

  const closeMessenger = useCallback(() => {
    setIsOpen(false);
    setTimeout(() => {
      setCurrentPage('home');
    }, 150)
  }, [setCurrentPage])
  
  const closeChat = useCallback(() => {
    setIsChatDialog(false);      
    setTimeout(() => {
      setSelectedUser(null);
    }, 300)
  }, [setSelectedUser])

  const handleNavigation = useCallback(e => {
      e.stopPropagation();
      e.preventDefault();
      window.history.pushState(null, document.title, window.location.href);
      
      if(isChatDialogRef.current){
        closeChat()
      } else if(isNewMessageDialogRef.current){
        setIsNewMessageDialog(false);
      } else {
        closeMessenger();
      }
  
    }, [closeChat, closeMessenger])

  useEffect(() => {
    setIsMobileMessenger(true);
    // Add actual page to history
    window.history.pushState(null, document.title, window.location.href)

    window.addEventListener('popstate', handleNavigation);
    return () => {
      window.removeEventListener('popstate', handleNavigation); 
      setIsMobileMessenger(false)
    };
  }, [handleNavigation, setIsMobileMessenger])
  

  return (
    <div>
      <Dialog
        open={isOpen}
        fullScreen={true}
        scroll='paper'
        onClose={closeMessenger}
        className={styles.selectUser__container}
        TransitionComponent={TransitionUp}
      >
        <header>
          <div>
            <IconButton onClick={closeMessenger} color='inherit'>
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
              disableSelect
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
          onClose={closeChat}
          fullScreen={true}
          TransitionComponent={TransitionLeft}
        >
          <div className={styles.chat__container}>
            <SelectedUser
              isMobile={true}
              onBack={closeChat}
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
