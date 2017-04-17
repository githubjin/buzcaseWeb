import Relay from "react-relay";

class NodeQueryConfig extends Relay.Route {}
NodeQueryConfig.routeName = "NodeQueryConfig";
NodeQueryConfig.paramDefinitions = {
  id: { required: true },
  idIsNew: true
};
NodeQueryConfig.prepareParams = prevParams => {
  return {
    ...prevParams,
    idIsNew: prevParams.id === "new"
  };
};
NodeQueryConfig.queries = {
  node: () => Relay.QL`
    query { node(id: $id) @skip(if: $idIsNew) }
  `
};

module.exports = NodeQueryConfig;
