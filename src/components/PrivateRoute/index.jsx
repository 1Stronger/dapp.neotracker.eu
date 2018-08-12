import React from 'react';
import { Redirect, Route } from 'react-router-dom';

import auth from '../../utils/auth';

function isAuthenticated(){
 var token = auth.getToken();
 return  (token !== null);
}

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      isAuthenticated() ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: '/',
            state: { from: props.location },
          }}
        />
      )
    }
  />
);
export default PrivateRoute;
