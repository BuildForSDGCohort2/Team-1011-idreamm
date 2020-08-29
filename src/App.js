import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import {
  HomeScreen,
  LoginScreen,
  RegisterScreen,
  PageNotFound,
} from './Screens';

export default function App() {
  return (
    <>
      <Router>
        <Switch>
          <Route path='/' component={HomeScreen} exact />
          <Route path='/login' component={LoginScreen} exact />
          <Route path='/register' component={RegisterScreen} exact />
          <Route path='*' component={PageNotFound} exact />
        </Switch>
      </Router>
    </>
  );
}
