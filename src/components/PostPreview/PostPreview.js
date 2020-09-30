import React from "react";
import { Button, InputBase, makeStyles, Typography } from "@material-ui/core";

import styles from "./PostPreview.module.css";

const useStyles = makeStyles({
  txt: {
    fontSize: "18px",
    fontWeight: 500,
    textTransform: "uppercase",
  },
  input: {
    fontSize: "14px",
    padding: "10px",
    lineHeight: "1.2",
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
          <img
            src="https://images.pexels.com/photos/2690323/pexels-photo-2690323.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
            alt="Post preview"
          />
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
