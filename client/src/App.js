import React from 'react';
import {
  BrowserRouter as Router, Switch, Redirect, Route, Link,
} from 'react-router-dom';

import Users from './components/Users';
import Roles from './components/Roles';
import './App.css';

const App = () => (
  <>
    <Router>
      <div>
        <nav className="navbar has-shadow" role="navigation" aria-label="main navigation">
          <div className="container">
            <div className="navbar-menu">
              <div className="navbar-start">
                <Link className="navbar-item" to="/users">
                  Users
                </Link>
                <Link className="navbar-item" to="/roles">
                  Roles
                </Link>
              </div>
            </div>
          </div>
        </nav>
        <section className="section">
          <div className="container">
            <Switch>
              <Redirect exact from="/" to="/users" />
              <Route exact path="/users" component={Users} />
              <Route exact path="/roles" component={Roles} />
            </Switch>
          </div>
        </section>
      </div>
    </Router>
  </>
);

export default App;
