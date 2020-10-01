import React, { useContext } from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import {
  HomeScreen,
  LoginScreen,
  RegisterScreen,
  PageNotFound,
} from './screens';
import ProtectedRoute from './auth/ProtectedRoute';
import styles from './App.module.css';
import { LinearProgress } from '@material-ui/core';
import { SnackBar } from './components';
import { LoadingContext } from './context/LoadingContext';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#006eff',
    },
  },
});

export default function App() {
  const [isLoading] = useContext(LoadingContext);

  return (
    <ThemeProvider theme={theme}>
      <div className={styles.app}>
        <Router>
          <Switch>
            <ProtectedRoute path='/' component={HomeScreen} exact />
            <Route path='/login' component={LoginScreen} exact />
            <Route path='/register' component={RegisterScreen} exact />
            <Route path='*' component={PageNotFound} exact />
          </Switch>
        </Router>
        {isLoading && (
          <LinearProgress
            color='secondary'
            style={{ position: 'fixed', left: 0, top: 0, right: 0 }}
          />
        )}
        <SnackBar />
      </div>
    </ThemeProvider>
  );
}
