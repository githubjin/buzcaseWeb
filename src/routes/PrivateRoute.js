// @flow
import React from "react";
import { Route, Redirect } from "react-router-dom";
import { sessionTokenKey, buzcaseUserKey } from "../env";
import _ from "lodash";

function isAuthenticated() {
  var user = window.localStorage.getItem(buzcaseUserKey);
  try {
    if (_.isEmpty(user) || _.isEmpty(JSON.parse(user)[sessionTokenKey])) {
      return false;
    }
  } catch (error) {
    return false;
  }
  return true;
}

const PrivateRoute = ({ component, viewer, ...rest }: any) => (
  <Route
    {...rest}
    render={props =>
      isAuthenticated()
        ? React.createElement(component, { ...props, viewer })
        : <Redirect
            to={{
              pathname: "/signin",
              state: { from: props.location }
            }}
          />}
  />
);

export default PrivateRoute;
