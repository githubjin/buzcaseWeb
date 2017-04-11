import Relay from "react-relay";

class NodeQueryConfig extends Relay.Route {}
NodeQueryConfig.routeName = "NodeQueryConfig";
NodeQueryConfig.paramDefinitions = {
  id: { required: true }
};
NodeQueryConfig.queries = {
  node: () => Relay.QL`
    query { node(id: $id) }
  `
};

module.exports = NodeQueryConfig;
