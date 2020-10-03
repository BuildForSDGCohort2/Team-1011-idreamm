import React, { useContext, useState, useEffect } from 'react';
import {
  Avatar,
  IconButton,
  InputBase,
  makeStyles,
  Typography,
} from '@material-ui/core';
import {
  Favorite,
  FavoriteBorder,
  Loyalty,
  LoyaltyOutlined,
  MoreHoriz,
  Send,
  Share,
} from '@material-ui/icons';
import moment from 'moment';
import PostContent from '../PostContent/PostContent';
import PostComments from '../PostComments/PostComments';
import styles from './Post.module.css';
import { red } from '@material-ui/core/colors';
import { db } from '../../utils/firebase';
import { AuthContext } from '../../context/AuthContext';
import { formatLikes } from '../../utils/helper';

const useStyles = makeStyles({
  avatar: {
    height: '32px',
    width: '32px',
    marginRight: '15px',
    background: '#f50057',
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
    fontSize: '12px',
  },
  likedIcon: {
    color: red[600],
  },
});

export default function Post({ content }) {
  const [isLiked, setIsLiked] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [timeAgo] = useState(moment.utc(content.timestamp).local().fromNow());
  const { currentUser } = useContext(AuthContext);
  const classes = useStyles();

  useEffect(() => {
    if (content.likes.includes(currentUser.uid)) {
      setIsLiked(true);
    } else {
      setIsLiked(false);
    }

    db.collection('users')
      .doc(currentUser.uid)
      .get()
      .then((snapShot) => {
        const data = snapShot.data();

        if (data.favorites.includes(content.id)) {
          setIsFavorite(true);
        } else {
          setIsFavorite(false);
        }
      });
  }, [content.likes, currentUser.uid, content.id]);

  const handleLike = () => {
    setIsLiked((isLiked) => !isLiked);
    const index = content.likes.indexOf(currentUser.uid);

    if (index === -1) {
      content.likes.push(currentUser.uid);
      db.collection('posts').doc(content.id).update({ likes: content.likes });
    } else {
      content.likes.splice(index, 1);
      db.collection('posts').doc(content.id).update({ likes: content.likes });
    }
  };

  const handleFavorite = () => {
    setIsFavorite((isFav) => !isFav);
    const userRef = db.collection('users').doc(currentUser.uid);

    userRef.get().then((snapShot) => {
      const data = snapShot.data();
      const index = data.favorites.indexOf(content.id);

      if (index === -1) {
        data.favorites.push(content.id);
        userRef.update({
          favorites: data.favorites,
        });
      } else {
        data.favorites.splice(index, 1);
        userRef.update({
          favorites: data.favorites,
        });
      }
    });
  };

  return (
    <div className={styles.post}>
      <header>
        <div>
          <Avatar className={classes.avatar}>
            {content.author[0].toUpperCase()}
          </Avatar>
          <Typography variant='subtitle2'>{content.author}</Typography>
        </div>
        <IconButton className={classes.smallBtn} edge='end' color='inherit'>
          <MoreHoriz fontSize='small' />
        </IconButton>
      </header>
      <section className={styles.post__content__section}>
        <PostContent url={content.url} type={content.type} />
      </section>
      <section className={styles.post__feedback__section}>
        <div>
          <div>
            <IconButton
              edge='start'
              className={classes.smallBtn}
              color='inherit'
              onClick={handleLike}
            >
              {isLiked ? (
                <Favorite className={classes.likedIcon} />
              ) : (
                <FavoriteBorder />
              )}
            </IconButton>
            <IconButton className={classes.smallBtn} color='inherit'>
              <Share />
            </IconButton>
          </div>
          <div>
            <IconButton
              edge='end'
              className={classes.smallBtn}
              color='inherit'
              onClick={handleFavorite}
            >
              {isFavorite ? (
                <Loyalty className={classes.likedIcon} />
              ) : (
                <LoyaltyOutlined />
              )}
            </IconButton>
          </div>
        </div>
        <div>
          <Typography variant='subtitle2'>
            {formatLikes(content.likes.length)}
          </Typography>
        </div>
        <div>
          <PostComments authorComment={content.message} />
        </div>
        <div>
          <Typography color='textSecondary' className={classes.postTime}>
            {timeAgo}
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
    </div>
  );
}
