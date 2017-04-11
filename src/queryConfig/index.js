// @flow

import Relay from "react-relay";

class MasterRoute extends Relay.Route {}
MasterRoute.routeName = "MasterRoute";
MasterRoute.queries = {
  master: () => Relay.QL`
    query { master }
  `
};

module.exports = MasterRoute;
