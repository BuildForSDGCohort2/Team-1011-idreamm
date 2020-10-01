import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function ProtectedRoute({ component: Component, ...rest }) {
  const { currentUser } = useContext(AuthContext);

  return (
    <Route
      {...rest}
      render={(props) => {
        if (currentUser) {
          return <Component {...props} />;
        } else {
          return <Redirect to='/login' />;
        }
      }}
    />
  );
}
