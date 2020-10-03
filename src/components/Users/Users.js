import React from 'react';
import { List } from '@material-ui/core';
import User from '../User/User';

import styles from './Users.module.css';

export default function Users() {
  return (
    <List className={styles.users}>
      <User selected={true} />
      <User />
      <User />
      <User />
    </List>
  );
}
