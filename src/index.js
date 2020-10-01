import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { AuthProvider } from './context/AuthContext';
import { LoadingProvider } from './context/LoadingContext';
import { SnackProvider } from './context/SnackContext';
import { NavigationProvider } from './context/NavigationContext';

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <NavigationProvider>
        <LoadingProvider>
          <SnackProvider>
            <App />
          </SnackProvider>
        </LoadingProvider>
      </NavigationProvider>
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
