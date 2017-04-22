// @flow

import Relay from "react-relay";

class MasterRoute extends Relay.Route {}
MasterRoute.routeName = "MasterRoute";
MasterRoute.queries = {
  viewer: () => Relay.QL`
    query { viewer }
  `
};

module.exports = MasterRoute;
