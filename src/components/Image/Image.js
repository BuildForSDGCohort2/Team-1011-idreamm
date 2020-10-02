import React from 'react';
import { CircularProgress } from '@material-ui/core';

export default function Image({ url, alt, upload }) {
  return (
    <>
      <img
        src={url}
        alt={alt}
        onLoadedMetadata={() => URL.revokeObjectURL(url)}
      />
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
