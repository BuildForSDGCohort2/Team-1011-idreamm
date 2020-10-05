import React, { Fragment, useContext, useEffect, useState } from 'react';
import Message from '../Message/Message';
import ScrollToBottom from 'react-scroll-to-bottom';
import moment from 'moment';
import { MessagesContext } from '../../context/MessagesContext';
import { SelectedUserContext } from '../../context/SelectedUserContext';
import TimeDivider from '../TimeDivider/TimeDivider';
import { makeStyles, Typography } from '@material-ui/core';
import { ArrowBack } from '@material-ui/icons';
import cx from 'classnames';
import styles from './Messages.module.css';

const useStyles = makeStyles({
  icon: {
    color: '#0000008a',
    marginRight: '10px',
  },
  txt: {
    fontSize: '20px',
  },
});

export default function Messages() {
  const [chats, setChats] = useState([]);

  const { messages } = useContext(MessagesContext);
  const { selectedUser, room } = useContext(SelectedUserContext);

  const classes = useStyles();

  useEffect(() => {
    if (room && messages[room]) {
      const chats = messages[room].messages;
      setChats(chats);
    }
  }, [room, messages]);

  if (!selectedUser) {
    return (
      <div className={cx(styles.splash__container, 'custom-scrollbar')}>
        <img src='message_splash.svg' alt='' />
        <div>
          <ArrowBack className={classes.icon} />
          <Typography color='textSecondary' className={classes.txt}>
            Select user to start chat
          </Typography>
        </div>
      </div>
    );
  }
  return (
    <ScrollToBottom className={styles.messages}>
      {chats[0] && (
        <TimeDivider
          time={chats[0].timestamp}
          style={{ marginBottom: '-8px' }}
        />
      )}
      {chats.map((chat, index) => (
        <Fragment key={chat.id}>
          <Message
            text={chat.text}
            timestamp={chat.timestamp}
            senderId={chat.senderId}
            key={chat.id}
          />
          {index < chats.length - 1 &&
            moment.utc(chat.timestamp).format('L') !==
              moment.utc(chats[index + 1].timestamp).format('L') && (
              <TimeDivider time={chats[index + 1].timestamp} />
            )}
        </Fragment>
      ))}
    </ScrollToBottom>
  );
}
