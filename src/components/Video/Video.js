import React, { useEffect, useState } from 'react';
import { CircularProgress, Fade, makeStyles, Zoom } from '@material-ui/core';
import { PlayCircleOutline } from '@material-ui/icons';

import styles from './Video.module.css';
import GliderLoader from '../GlideLoader/GlideLoader';

const useStyles = makeStyles({
  icon: {
    fontSize: '60px',
    color: '#fff',
    cursor: 'pointer',
    pointerEvents: 'none',
    zIndex: 100,
  },
  loader: {
    zIndex: 100,
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
        onClick={handleVideo}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        className={styles.video}
        onEnded={() => {
          setIsPlaying(false);
        }}
        onCanPlay={() => setIsLoading(false)}
        src={url}
        style={{ visibility: isLoading ? 'hidden' : 'visible' }}
      ></video>
      <Zoom
        in={!isPlaying && !isLoading}
        style={{ position: 'absolute' }}
        unmountOnExit
        mountOnEnter
      >
        <PlayCircleOutline className={classes.icon} />
      </Zoom>
      <Fade in={isLoading} unmountOnExit mountOnEnter>
        <GliderLoader />
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
