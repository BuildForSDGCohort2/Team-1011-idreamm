import React, { useState } from 'react';
import { CircularProgress, Fade } from '@material-ui/core';

export default function Image({ url, alt, upload }) {
  const [isLoading, setIsLoading] = useState(true);
  return (
    <>
      <img
        src={url}
        alt={alt}
        onLoad={() => {
          URL.revokeObjectURL(url);
          setIsLoading(false);
        }}
      />
      <Fade in={isLoading} style={{ position: 'absolute' }} timeout={0}>
        <CircularProgress color='secondary' />
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
