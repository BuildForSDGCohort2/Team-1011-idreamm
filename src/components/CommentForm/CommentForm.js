import React, { useContext, useState } from 'react';
import { makeStyles, InputBase, IconButton } from '@material-ui/core';
import { Send } from '@material-ui/icons';
import { db } from '../../utils/firebase';
import moment from 'moment';
import { SnackContext } from '../../context/SnackContext';
import styles from './CommentForm.module.css';

const useStyles = makeStyles({
  inputRoot: {
    fontSize: '14px',
    lineHeight: '1.4',
  },
});

export default function CommentForm({ postId, author, authorId }) {
  const [comment, setComment] = useState('');

  const setSnack = useContext(SnackContext)[1];

  const classes = useStyles();

  const sendComment = () => {
    if (!author) return;

    const commentBackup = comment;
    setComment('');

    if (comment.trim()) {
      db.collection('posts')
        .doc(postId)
        .collection('comments')
        .add({
          postId,
          author,
          authorId,
          text: comment,
          timestamp: moment.utc().format(),
        })
        .catch(() => {
          setComment(commentBackup);
          setSnack({ open: true, message: 'An error occured' });
        });
    }
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      if (!e.shiftKey) {
        e.preventDefault();
        sendComment();
      }
    }
  };

  return (
    <form className={styles.form}>
      <InputBase
        placeholder='Add a comment'
        fullWidth
        multiline
        classes={{
          root: classes.inputRoot,
          input: 'custom-scrollbar',
        }}
        rowsMax='4'
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <IconButton
        edge='end'
        color='inherit'
        onClick={sendComment}
        disabled={!comment.trim()}
      >
        <Send />
      </IconButton>
    </form>
  );
}
