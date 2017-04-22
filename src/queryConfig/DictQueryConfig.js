// @flow

import Relay from "react-relay";

class DictQueryRoute extends Relay.Route {}
DictQueryRoute.routeName = "DictQueryRoute";
DictQueryRoute.queries = {
  dict: () => Relay.QL`
    query { viewer }
  `
};

module.exports = DictQueryRoute;
