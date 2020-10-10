import React, {useContext, useEffect} from 'react';
import {
  Avatar,
  Badge,
  Button,
  CircularProgress,
  IconButton,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { CameraAlt, Clear, Done } from '@material-ui/icons';
import { red } from '@material-ui/core/colors';
import moment from 'moment';
import { auth } from '../../utils/firebase';
import { SnackContext } from '../../context/SnackContext';
import { NewDpContext } from '../../context/NewDpContext';
import { DpUploadContext } from '../../context/DpUploadContext';
import { AuthContext } from '../../context/AuthContext';
import styles from './Profile.module.css';

const useStyles = makeStyles((theme) => ({
  avatar: {
    width: '150px',
    height: '150px',
    fontSize: '32px',
    background: red[500],
    margin: '-5px',
    [theme.breakpoints.down('xs')]: {
      width: '100px',
      height: '100px',
    },
  },
  username: {
    fontSize: '22px',
    fontWeight: '400',
  },
  dateJoined: {
    fontSize: '14px',
    color: '#0000008a',
    marginBottom: '10px',
  },
  btn: {
    marginRight: '10px',
  },
}));

export default function Profile() {
  const setSnack = useContext(SnackContext)[1];
  const [file, setFile] = useContext(NewDpContext);
  const { dp, setDp, progress, complete } = useContext(DpUploadContext);
  const { currentUser } = useContext(AuthContext);
  const classes = useStyles();

  const selectFile = () => {
    document.getElementById('dpSelectInput').click();
  };

  const handleSelectedFile = (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    } else if (!/^image/.test(file.type)) {
      //Wrong file type
      setSnack({ open: true, message: 'Invalid file type' });
    } else if (file.size > 2000000) {
      //Large file
      setSnack({ open: true, message: 'File size too large' });
    } else {
      setFile({ data: file, preview: URL.createObjectURL(file) });
    }
  };

  const uploadDp = () => {
    if (file) {
      setDp(file.data);
    }
  };

  useEffect(() => {
    if (complete) {
      setFile(null);
    }
  }, [complete, setFile]);

  return (
    <div className={styles.container}>
      <div>
        <Badge
          badgeContent={
            <div className={styles.cameraBtn__container}>
              {!!dp ? (
                <CircularProgress
                  variant='static'
                  value={progress}
                  color='secondary'
                  thickness={5}
                />
              ) : !file ? (
                <IconButton
                  aria-label='upload picture'
                  component='span'
                  color='inherit'
                  onClick={selectFile}
                >
                  <CameraAlt />
                </IconButton>
              ) : (
                <IconButton
                  aria-label='upload picture'
                  component='span'
                  color='inherit'
                  onClick={uploadDp}
                >
                  <Done />
                </IconButton>
              )}
            </div>
          }
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          overlap='circle'
        >
          <Badge
            badgeContent={
              <div className={styles.cameraBtn__container}>
                <IconButton
                  aria-label='upload picture'
                  component='span'
                  color='inherit'
                  onClick={() => setFile(null)}
                >
                  <Clear />
                </IconButton>
              </div>
            }
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            overlap='circle'
            invisible={!file || !!dp}
          >
            <Avatar
              className={classes.avatar}
              src={
                (file && file.preview) ||
                (auth.currentUser && auth.currentUser.photoURL)
              }
              alt={auth.currentUser && auth.currentUser.displayName}
            />
          </Badge>
        </Badge>
      </div>
      <div>
        <Typography className={classes.username}>
          {currentUser.username}
        </Typography>
        <Typography variant="body2">{currentUser.email}</Typography>
        <Typography className={classes.dateJoined}>
          Joined on {moment.utc(currentUser.joined).local().format('LL')}
        </Typography>
        <Button size='small' className={classes.btn}>
          Edit profile
        </Button>
        <Button
          size='small'
          className={classes.btn}
          color='secondary'
          onClick={() => auth.signOut()}
        >
          Log out
        </Button>
        <input
          type='file'
          style={{
            visibility: 'hidden',
            position: 'absolute',
            width: 0,
            height: 0,
          }}
          id='dpSelectInput'
          onChange={handleSelectedFile}
        />
      </div>
    </div>
  );
}
