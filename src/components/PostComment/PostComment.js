import React, { useState } from 'react';
import { Avatar, makeStyles, Typography } from '@material-ui/core';
import cx from 'classnames';
import styles from './PostComment.module.css';

const useStyles = makeStyles({
  avatar: {
    height: '16px',
    width: '16px',
    background: '#f50057',
    fontSize: '12px',
  },
  author: {
    fontSize: '14px',
    fontWeight: 500,
    margin: '0 6px',
  },
  comment: {
    fontSize: '14px',
    lineHeight: 1.2,
    whiteSpace: 'nowrap',
  },
});

export default function PostComment({ author, comment }) {
  const [isEllipsis, setIsEllipsis] = useState(true);
  const classes = useStyles();

  return (
    <div className={styles.container}>
      <div>
        <Avatar className={classes.avatar}>{author[0].toUpperCase()}</Avatar>
        <Typography className={classes.author}>{author}</Typography>
      </div>
      <div>
        <Typography
          className={cx(classes.comment, styles.comment)}
          style={{
            textOverflow: isEllipsis ? 'ellipsis' : 'unset',
            overflow: isEllipsis ? 'hidden' : 'auto',
          }}
        >
          <span onClick={() => setIsEllipsis((isEllipsis) => !isEllipsis)}>
            {comment}
          </span>
        </Typography>
      </div>
    </div>
  );
}
