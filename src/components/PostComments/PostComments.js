import React, { useEffect, useState } from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import { truncateText } from '../../utils/helper';
import styles from './PostComments.module.css';
import PostComment from '../PostComment/PostComment';
import { db } from '../../utils/firebase';

const useStyles = makeStyles({
  authorComment: {
    fontSize: '14.5px',
    lineHeight: 1.3,
  },
  more: {
    color: '#0000008a',
    cursor: 'pointer',
  },
  moreComments: {
    cursor: 'pointer',
    marginTop: '10px',
  },
});

export default function PostComments({ authorComment, postId }) {
  const [comments, setComments] = useState([]);
  const [max, setMax] = useState(3);
  const [shortText, setShortText] = useState(truncateText(authorComment));
  const classes = useStyles();

  useEffect(() => {
    db.collection('posts')
      .doc(postId)
      .collection('comments')
      .orderBy('timestamp', 'desc')
      .onSnapshot((snapshot) => {
        const comments = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        setComments(comments);
      });
  }, [postId]);

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
      <div>
        <div className={styles.comments__container}>
          {comments
            .map((comment) => (
              <PostComment
                author={comment.author}
                comment={comment.text}
                key={comment.id}
              />
            ))
            .slice(0, max)}
        </div>
        {comments.length > 3 && (
          <Typography
            color='textSecondary'
            variant='body2'
            className={classes.moreComments}
          >
            {max === 3 ? (
              <span onClick={() => setMax(comments.length)}>
                Show all {comments.length} comments
              </span>
            ) : (
              <span onClick={() => setMax(3)}>Show fewer comments</span>
            )}
          </Typography>
        )}
      </div>
    </div>
  );
}
