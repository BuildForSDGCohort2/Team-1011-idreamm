import React from "react";
import Dropzone from "react-dropzone";
import { makeStyles, Typography } from "@material-ui/core";
import { CloudUpload, GetApp } from "@material-ui/icons";
// import cx from "classnames";

import styles from "./FileDrop.module.css";

const useStyles = makeStyles({
  icon: {
    fontSize: "60px",
  },
});

export default function FileDrop() {
  const classes = useStyles();

  const onDrop = (files) => {
    const file = files[0];
    if (!file) return;
    console.log(file);
  };

  return (
    <div className={styles.container}>
      <Dropzone
        maxFiles={1}
        maxSize={10000000}
        multiple={false}
        onDrop={onDrop}
        accept="image/*, video/*"
      >
        {({ getRootProps, getInputProps, isDragActive, isDragReject }) => (
          <div
            {...getRootProps()}
            style={{
              border: isDragActive
                ? isDragReject
                  ? "2px dashed #f50057"
                  : "2px dashed #006eff"
                : "2px dashed grey",
            }}
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              isDragReject ? (
                <div>
                  <Typography variant="subtitle2" color="secondary">
                    Only images and videos are supported!
                  </Typography>
                </div>
              ) : (
                <div>
                  <GetApp className={classes.icon} color="primary" />
                  <Typography variant="subtitle2" color="primary">
                    Drop file here
                  </Typography>
                </div>
              )
            ) : (
              <div>
                <CloudUpload className={classes.icon} />
                <Typography variant="subtitle2" color="textSecondary">
                  Drag 'n' drop file here, or click to select file
                </Typography>
              </div>
            )}
          </div>
        )}
      </Dropzone>
    </div>
  );
}
