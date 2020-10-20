import React, { useState } from 'react';
import { CircularProgress, Fade } from '@material-ui/core';
import GliderLoader from '../GlideLoader/GlideLoader';

export default function Image({ url, alt, upload }) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      <img
        src={url}
        alt={alt}
        onLoad={() => {
          setIsLoading(false);
        }}
        style={{ visibility: isLoading ? 'hidden' : 'visible' }}
      />
      <Fade in={isLoading} unmountOnExit mountOnEnter>
        <GliderLoader />
      </Fade>
      {upload && upload.post && (
        <CircularProgress
          variant='static'
          value={upload.progress}
          color='secondary'
          thickness={5}
          style={{ position: 'absolute', zIndex: 100 }}
        />
      )}
    </>
  );
}
