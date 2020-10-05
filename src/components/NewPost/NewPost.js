import React, { useContext } from 'react';
import { Fab, makeStyles } from '@material-ui/core';
import { AddPhotoAlternate } from '@material-ui/icons';
import FileDrop from '../FileDrop/FileDrop';
import PostPreview from '../PostPreview/PostPreview';
import { NewPostContext } from '../../context/NewPostContext';
import { FileUploadContext } from '../../context/FileUploadContext';
import { SnackContext } from '../../context/SnackContext';
import styles from './NewPost.module.css';

const useStyles = makeStyles({
  fab: {
    position: 'absolute',
    top: '20px',
    right: '20px',
  },
});

export default function NewPost() {
  const setFile = useContext(NewPostContext)[1];
  const { post } = useContext(FileUploadContext);
  const setSnack = useContext(SnackContext)[1];
  const classes = useStyles();

  const selectFile = () => {
    document.getElementById('fileSelectInput').click();
  };

  const handleSelectedFile = (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    } else if (!/^image|^video/.test(file.type)) {
      //Wrong file type
      setSnack({ open: true, message: 'Only images and videos are supported' });
    } else if (file.size > 20000000) {
      //Large file
      setSnack({ open: true, message: 'File can not be more than 20MB' });
    } else {
      setFile({ data: file, preview: URL.createObjectURL(file) });
    }
  };

  return (
    <div className={styles.container}>
      <FileDrop />
      <PostPreview />
      <Fab
        color='secondary'
        aria-label='add'
        className={classes.fab}
        onClick={selectFile}
        disabled={!!post}
      >
        <AddPhotoAlternate />
        <input
          type='file'
          style={{
            visibility: 'hidden',
            position: 'absolute',
            height: 0,
            width: 0,
          }}
          id='fileSelectInput'
          onChange={handleSelectedFile}
        />
      </Fab>
    </div>
  );
}
