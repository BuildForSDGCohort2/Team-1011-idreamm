import React, { useState } from 'react';
import { makeStyles, InputBase, IconButton } from '@material-ui/core';
import { Send } from '@material-ui/icons';
import { db } from '../../utils/firebase';
import moment from 'moment';
import styles from './CommentForm.module.css';

const useStyles = makeStyles({
  inputRoot: {
    fontSize: '14px',
    lineHeight: '1.5',
  },
});

export default function CommentForm({ postId, author, authorId }) {
  const [comment, setComment] = useState('');
  const [isCommenting, setIsCommenting] = useState(false);

  const classes = useStyles();

  const handleComment = (e) => {
    e.preventDefault();
    setIsCommenting(true);

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
        .then(() => {
          setComment('');
          setIsCommenting(false);
        });
    }
  };

  return (
    <form onSubmit={handleComment} className={styles.form}>
      <InputBase
        placeholder='Add a comment'
        fullWidth
        multiline
        classes={{
          root: classes.inputRoot,
          input: styles.input,
        }}
        rowsMax='4'
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        disabled={isCommenting}
      />
      <IconButton
        edge='end'
        color='inherit'
        type='submit'
        disabled={isCommenting}
      >
        <Send />
      </IconButton>
    </form>
  );
}
