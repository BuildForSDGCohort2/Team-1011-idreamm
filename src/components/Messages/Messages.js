import React, { useContext, useEffect, useState } from 'react';
import Message from '../Message/Message';
import ScrollToBottom from 'react-scroll-to-bottom';
import moment from 'moment';
import { MessagesContext } from '../../context/MessagesContext';
import { SelectedUserContext } from '../../context/SelectedUserContext';
import TimeDivider from '../TimeDivider/TimeDivider';
import styles from './Messages.module.css';

export default function Messages() {
  const [chats, setChats] = useState([]);

  const { messages } = useContext(MessagesContext);
  const { room } = useContext(SelectedUserContext);

  useEffect(() => {
    if (room) {
      const chats = messages[room].messages;
      setChats(chats);
    }
  }, [room, messages]);
  return (
    <ScrollToBottom className={styles.messages}>
      {chats[0] && <TimeDivider time={chats[0].timestamp} />}
      {chats.map((chat, index) => (
        <>
          <Message
            key={chat.id}
            text={chat.text}
            timestamp={chat.timestamp}
            senderId={chat.senderId}
          />
          {index < chats.length - 1 &&
            moment.utc(chat.timestamp).format('L') !==
              moment.utc(chats[index + 1].timestamp).format('L') && (
              <TimeDivider time={chats[index + 1].timestamp} />
            )}
        </>
      ))}
    </ScrollToBottom>
  );
}
