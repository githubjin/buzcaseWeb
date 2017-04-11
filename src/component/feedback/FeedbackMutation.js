// @flow

import Relay from "react-relay";

export default class FeedbackMutation extends Relay.Mutation {
  static fragments = {
    master: () => Relay.QL`
      fragment on MasterType {
        id
      }
    `
  };
  getMutation() {
    return Relay.QL`
      mutation { addFeedback }
    `;
  }
  getFatQuery() {
    return Relay.QL`
      fragment on AddFeedbackPayload {
        newEdge,
        error,
        master {
          feedbacks
        }
      }
    `;
  }
  getConfigs() {
    return [
      {
        type: "RANGE_ADD",
        parentName: "master",
        parentID: this.props.master.id,
        connectionName: "feedbacks",
        edgeName: "newEdge",
        // rangeBehaviors: (calls: Object) => {
        //   console.log("Calls are : ", calls);
        //   if (calls.page === 1) {
        //     return "prepend";
        //   } else {
        //     return "ignore";
        //   }
        // }
        rangeBehaviors: {
          "": "refetch"
        }
      }
    ];
  }
  getVariables() {
    return {
      isPublic: this.props.isPublic,
      text: this.props.text
    };
  }
  getOptimisticResponse() {
    // console.log(this.props);
    return {
      newEdge: {
        node: {
          text: this.props.text,
          isPublic: this.props.isPublic
        }
      },
      master: {
        id: this.props.master.id,
        feedbacks: {
          totalInfo: {
            total: this.props.total + 1
          }
        }
      }
    };
  }
}
