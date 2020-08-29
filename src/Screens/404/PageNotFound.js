import React from 'react';
import { Helmet } from 'react-helmet';

export default function PageNotFound() {
  return (
    <>
      <Helmet>
        <title>404 • Page not found</title>
      </Helmet>
      <div>404 | Page not found</div>
    </>
  );
}
