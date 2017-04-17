// @flow
import Relay from "react-relay";

export default class DraftsMutation extends Relay.Mutation {
  static fragments = {
    master: () => Relay.QL`
        fragment on MasterType {
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
            master {
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
        parentName: "master",
        parentID: this.props.master.id,
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
