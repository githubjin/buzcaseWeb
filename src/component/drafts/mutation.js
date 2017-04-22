// @flow
import Relay from "react-relay";

export default class DraftsMutation extends Relay.Mutation {
  static fragments = {
    viewer: () => Relay.QL`
        fragment on User {
        id
    }
    `
  };
  getMutation() {
    return Relay.QL`
        mutation { DraftMutation }
    `;
  }
  getFatQuery() {
    return Relay.QL`
        fragment on DraftMutationPayload {
            distroyedId,
            viewer {
                articles
            },
            error
        }
    `;
  }
  getConfigs() {
    return [
      {
        type: "NODE_DELETE",
        parentName: "viewer",
        parentID: this.props.viewer.id,
        connectionName: "articles",
        deletedIDFieldName: "distroyedId"
      }
    ];
  }
  getVariables() {
    return {
      id: this.props.id,
      order: this.props.order
    };
  }
}
