import React, { useState } from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import { truncateText } from '../../utils/helper';
import styles from './PostComments.module.css';

const useStyles = makeStyles({
  authorComment: {
    fontSize: '14.5px',
    lineHeight: 1.3,
  },
  more: {
    color: '#0000008a',
    cursor: 'pointer',
  },
});

export default function PostComments({ authorComment }) {
  const [shortText, setShortText] = useState(truncateText(authorComment));
  const classes = useStyles();

  return (
    <div className={styles.container}>
      <div>
        {shortText ? (
          <>
            <Typography>
              {shortText}{' '}
              <span onClick={() => setShortText(null)} className={classes.more}>
                more
              </span>
            </Typography>
          </>
        ) : (
          <Typography>{authorComment}</Typography>
        )}
      </div>
    </div>
  );
}
