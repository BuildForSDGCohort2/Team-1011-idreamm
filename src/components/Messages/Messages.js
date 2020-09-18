import React from 'react';
import Message from '../Message/Message';
import ScrollToBottom from 'react-scroll-to-bottom';

import styles from './Messages.module.css';

export default function Messages() {
  return (
    <ScrollToBottom className={styles.messages}>
      <Message />
    </ScrollToBottom>
  );
}
