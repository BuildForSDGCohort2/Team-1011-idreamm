import { CircularProgress, Fade, makeStyles, Zoom } from '@material-ui/core';
import { PlayCircleOutline } from '@material-ui/icons';
import React, { useEffect } from 'react';
import { useState } from 'react';

import styles from './Video.module.css';

const useStyles = makeStyles({
  icon: {
    fontSize: '60px',
    color: '#fff',
    cursor: 'pointer',
    pointerEvents: 'none',
    zIndex: 3,
  },
  loader: {
    zIndex: 3,
  },
});

export default function Video({ url, upload }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  const classes = useStyles();

  const handleVideo = (e) => {
    if (e.target.paused) {
      const videos = document.getElementsByTagName('video');

      for (let i = 0; i < videos.length; i++) {
        videos[i].pause();
      }

      e.target.play();
    } else {
      e.target.pause();
    }
  };

  useEffect(() => {
    setIsPlaying(false);
  }, [url]);

  return (
    <>
      <video
        src={url}
        onClick={handleVideo}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        className={styles.video}
        onEnded={() => {
          setIsPlaying(false);
          URL.revokeObjectURL(url);
        }}
        onLoadedMetadata={() => setIsLoading(false)}
      ></video>
      <Zoom in={!isPlaying && !isLoading} style={{ position: 'absolute' }}>
        <PlayCircleOutline className={classes.icon} />
      </Zoom>
      <Fade in={isLoading} style={{ position: 'absolute' }} timeout={0}>
        <CircularProgress className={classes.loader} color='secondary' />
      </Fade>
      {upload && upload.post && (
        <CircularProgress
          variant='static'
          value={upload.progress}
          color='secondary'
          thickness={5}
          style={{ position: 'absolute' }}
        />
      )}
    </>
  );
}
