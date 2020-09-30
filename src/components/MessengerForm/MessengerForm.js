import React from 'react';
import { IconButton, InputBase, makeStyles } from '@material-ui/core';
import { InsertEmoticon, Send } from '@material-ui/icons';

import styles from './MessengerForm.module.css';

const useStyles = makeStyles({
  inputRoot: {
    lineHeight: '1.5',
  },
});

export default function MessengerForm() {
  const classes = useStyles();

  return (
    <div className={styles.messenger__form}>
      <IconButton color="inherit">
        <InsertEmoticon />
      </IconButton>
      <form>
        <InputBase
          placeholder='Type message...'
          fullWidth
          multiline
          classes={{
            root: classes.inputRoot,
            input: styles.input,
          }}
          rowsMax='4'
        />
        <IconButton color="inherit">
          <Send />
        </IconButton>
      </form>
    </div>
  );
}
