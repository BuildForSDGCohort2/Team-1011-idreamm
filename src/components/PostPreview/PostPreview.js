import React, { useContext, useEffect, useState } from 'react';
import { Button, InputBase, makeStyles, Typography } from '@material-ui/core';
import Video from '../Video/Video';
import Image from '../Image/Image';
import { NewPostContext } from '../../context/NewPostContext';
import styles from './PostPreview.module.css';

const useStyles = makeStyles({
  txt: {
    fontSize: '18px',
    fontWeight: 500,
    textTransform: 'uppercase',
  },
  input: {
    fontSize: '14px',
    padding: '10px 0 10px 10px',
    lineHeight: '1.3',
  },
});

export default function PostPreview() {
  const [file] = useContext(NewPostContext);
  const [fileType, setFileType] = useState('none');

  const classes = useStyles();

  useEffect(() => {
    if (file) {
      setFileType(file.data.type);
    }
  }, [file]);

  return (
    <div className={styles.container}>
      {!file ? (
        <div>
          <Typography className={classes.txt}>Preview</Typography>
          <Typography variant='subtitle2' color='textSecondary'>
            Your file will display here
          </Typography>
        </div>
      ) : (
        <div className={styles.preview}>
          {/image*/i.test(fileType) && (
            <Image url={file.preview} alt='Post preview' />
          )}
          {/video*/i.test(fileType) && <Video url={file.preview} />}
          <form>
            <InputBase
              placeholder='Add comment...'
              fullWidth
              className={classes.input}
              rowsMax={4}
              multiline
            />
            <Button color='primary' size='small'>
              Post
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
