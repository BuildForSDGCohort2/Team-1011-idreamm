import React from 'react';
import {
  Avatar,
  IconButton,
  InputBase,
  makeStyles,
  Typography,
} from '@material-ui/core';
import {
  FavoriteBorder,
  LoyaltyOutlined,
  MoreHoriz,
  Send,
  Share,
} from '@material-ui/icons';
import PostContent from '../PostContent/PostContent';
import PostComments from '../PostComments/PostComments';

import styles from './Post.module.css';
import { red } from '@material-ui/core/colors';

const useStyles = makeStyles({
  avatar: {
    height: '32px',
    width: '32px',
    marginRight: '15px',
    background: red[500],
  },
  smallBtn: {
    height: '40px',
    width: '40px',
  },
  inputRoot: {
    fontSize: '14px',
    lineHeight: '1.5',
  },
  postTime: {
    marginTop: '12px',
  },
});

export default function Post() {
  const classes = useStyles();

  return (
    <article className={styles.post}>
      <header>
        <div>
          <Avatar className={classes.avatar}>L</Avatar>
          <Typography variant='subtitle2'>Lafen Lesley</Typography>
        </div>
        <IconButton className={classes.smallBtn} edge='end' color='inherit'>
          <MoreHoriz fontSize='small' />
        </IconButton>
      </header>
      <section className={styles.post__content__section}>
        <PostContent />
      </section>
      <section className={styles.post__feedback__section}>
        <div>
          <div>
            <IconButton
              edge='start'
              className={classes.smallBtn}
              color='inherit'
            >
              <FavoriteBorder />
            </IconButton>
            <IconButton className={classes.smallBtn} color='inherit'>
              <Share />
            </IconButton>
          </div>
          <div>
            <IconButton edge='end' className={classes.smallBtn} color='inherit'>
              <LoyaltyOutlined />
            </IconButton>
          </div>
        </div>
        <div>
          <PostComments />
        </div>
        <div>
          <Typography
            variant='body2'
            color='textSecondary'
            className={classes.postTime}
          >
            1 day ago
          </Typography>
        </div>
      </section>
      <section className={styles.post__comment__section}>
        <form>
          <InputBase
            placeholder='Add a comment'
            fullWidth
            multiline
            classes={{
              root: classes.inputRoot,
              input: styles.input,
            }}
            rowsMax='4'
          />
          <IconButton edge='end' color='inherit'>
            <Send />
          </IconButton>
        </form>
      </section>
    </article>
  );
}
