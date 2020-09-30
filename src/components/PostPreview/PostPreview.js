import React from "react";
import { Button, InputBase, makeStyles, Typography } from "@material-ui/core";

import Video from "../Video/Video";

import styles from "./PostPreview.module.css";

const useStyles = makeStyles({
  txt: {
    fontSize: "18px",
    fontWeight: 500,
    textTransform: "uppercase",
  },
  input: {
    fontSize: "14px",
    padding: "10px 0 10px 10px",
    lineHeight: "1.3",
  },
});

export default function PostPreview() {
  const classes = useStyles();

  return (
    <div className={styles.container}>
      {false ? (
        <div>
          <Typography className={classes.txt}>Preview</Typography>
          <Typography variant="subtitle2" color="textSecondary">
            Your file will display here
          </Typography>
        </div>
      ) : (
        <div className={styles.preview}>
          {true ? (
            <img
              src="https://images.pexels.com/photos/4727507/pexels-photo-4727507.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
              alt="Post preview"
            />
          ) : (
            <Video url="https://player.vimeo.com/external/335062628.sd.mp4?s=4b9655670fe0c5320c3a1019c9a05d4c96065117&profile_id=139&oauth2_token_id=57447761" />
          )}

          <form>
            <InputBase
              placeholder="Add comment..."
              fullWidth
              className={classes.input}
              rowsMax={4}
              multiline
            />
            <Button color="primary" size="small">
              Post
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
