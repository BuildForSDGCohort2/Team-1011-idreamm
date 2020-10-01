import React from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import {
  HomeScreen,
  LoginScreen,
  RegisterScreen,
  PageNotFound,
} from './screens';

import { NavigationProvider } from './context/NavigationContext';
import ProtectedRoute from './auth/ProtectedRoute';

import styles from './App.module.css';
import { AuthProvider } from './context/AuthContext';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#006eff',
    },
  },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <NavigationProvider>
          <div className={styles.app}>
            <Router>
              <Switch>
                <ProtectedRoute path='/' component={HomeScreen} exact />
                <Route path='/login' component={LoginScreen} exact />
                <Route path='/register' component={RegisterScreen} exact />
                <Route path='*' component={PageNotFound} exact />
              </Switch>
            </Router>
          </div>
        </NavigationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
