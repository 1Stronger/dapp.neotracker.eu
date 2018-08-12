import "babel-polyfill";
import React from "react";
import ReactDOM from "react-dom";

import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch
} from 'react-router-dom'

import { create as createJss } from "jss";
import camelCase from "jss-camel-case";
import globalStyles from "jss-global";
import vendorPrefixer from "jss-vendor-prefixer";
import { JssProvider } from "react-jss";

import App from "./views/App";

import Login from "./components/Login";
import Wallets from './components/Wallets';
import PrivateRoute from './components/PrivateRoute';

import './styles/styles.scss';

const jss = createJss();
jss.use(vendorPrefixer(), camelCase(), globalStyles());

ReactDOM.render((
  <Router>
  <JssProvider jss={jss}>
    <App>
      <Switch>
        <Route exact path="/" component={Login}/>
        <PrivateRoute path="/wallets" component={Wallets} />
      </Switch>
    </App>
    </JssProvider>
  </Router>

), document.getElementById('root'));
