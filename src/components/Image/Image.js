import React from 'react';

export default function Image({ url, alt }) {
  return (
    <img
      src={url}
      alt={alt}
      onLoadedMetadata={() => URL.revokeObjectURL(url)}
    />
  );
}
