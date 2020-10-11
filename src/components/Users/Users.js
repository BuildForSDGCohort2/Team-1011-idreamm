import React, { useContext } from 'react';
import { List } from '@material-ui/core';
import User from '../User/User';
import { SelectedUserContext } from '../../context/SelectedUserContext';
import styles from './Users.module.css';

export default function Users({ users, onClick, disabled, isChatUsers, disableSelect }) {
  const { selectedUser } = useContext(SelectedUserContext);
  return (
    <List className={styles.users}>
      {users &&
        users.map((user) => (
          <User
            key={user.uid}
            user={user}
            onClick={() => onClick(user)}
            disabled={disabled}
            selected={
              isChatUsers && selectedUser && user.uid === selectedUser.uid && !disableSelect
            }
            isChatUser={isChatUsers}
          />
        ))}
    </List>
  );
}
