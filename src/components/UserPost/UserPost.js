import React, { useContext, useState } from 'react';
import {
  CircularProgress,
  IconButton,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import { red } from '@material-ui/core/colors';
import { db } from '../../utils/firebase';
import PostContent from '../PostContent/PostContent';
import ConfirmDeleteDialog from '../ConfirmDeleteDialog/ConfirmDeleteDialog';
import { SnackContext } from '../../context/SnackContext';
import styles from './UserPost.module.css';

const useStyles = makeStyles({
  delBtn: {
    color: red[500],
    gridArea: 'b',
  },
  txt: {
    padding: '0 10px',
    fontSize: '14px',
    color: '#fff',
  },
});

export default function UserPost({ post }) {
  const classes = useStyles();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDialog, setIsDialog] = useState(false);
  const setSnack = useContext(SnackContext)[1];

  const handleDelete = (isConfirmed) => {
    if (isConfirmed) {
      setIsDeleting(true);
      db.collection('posts')
        .doc(post.id)
        .delete()
        .then(() => {
          setSnack({
            open: true,
            message: 'Post deleted successfully',
          });
        })
        .catch((err) => {
          setSnack({
            open: true,
            message: 'An error occured, please try again',
          });
          setIsDeleting(false);
        });
    } else {
      setIsDialog(false);
    }
  };

  return (
    <div>
      <div className={styles.container}>
        <PostContent url={post.url} type={post.type} key={post.id} />
        <div>
          <Typography noWrap className={classes.txt}>
            {post.message}
          </Typography>
          {!isDeleting ? (
            <IconButton size='small' onClick={() => setIsDialog(true)}>
              <Delete className={classes.delBtn} />
            </IconButton>
          ) : (
            <CircularProgress color='secondary' size={16} />
          )}
        </div>
      </div>

      <ConfirmDeleteDialog open={isDialog} onClose={handleDelete} />
    </div>
  );
}
