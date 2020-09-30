import { CircularProgress, Fade, makeStyles, Zoom } from "@material-ui/core";
import { PlayCircleOutline } from "@material-ui/icons";
import React from "react";
import { useState } from "react";

import styles from "./Video.module.css";

const useStyles = makeStyles({
  icon: {
    fontSize: "50px",
    color: "#fff",
    cursor: "pointer",
    pointerEvents: "none",
  },
  loader: {
    color: "#fff",
  },
});

export default function Video({ url }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  const classes = useStyles();

  const handleVideo = (e) => {
    if (e.target.paused) {
      e.target.play();
      setIsPlaying(true);
    } else {
      e.target.pause();
      setIsPlaying(false);
    }
  };

  return (
    <>
      <video
        src={url}
        onClick={handleVideo}
        className={styles.video}
        onEnded={() => setIsPlaying(false)}
        onLoadedMetadata={() => setIsLoading(false)}
      ></video>
      <Zoom in={!isPlaying && !isLoading} style={{ position: "absolute" }}>
        <PlayCircleOutline className={classes.icon} />
      </Zoom>
      <Fade in={isLoading} style={{ position: "absolute" }} timeout={0}>
        <CircularProgress className={classes.loader} />
      </Fade>
    </>
  );
}
