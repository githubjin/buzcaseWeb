// @flow

import Relay from "react-relay";

export default class FeedbackMutation extends Relay.Mutation {
  static fragments = {
    viewer: () => Relay.QL`
      fragment on User {
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
        viewer {
          feedbacks
        }
      }
    `;
  }
  getConfigs() {
    return [
      {
        type: "RANGE_ADD",
        parentName: "viewer",
        parentID: this.props.viewer.id,
        connectionName: "feedbacks",
        edgeName: "newEdge",
        rangeBehaviors: (calls: Object) => {
          if (calls.page === 1) {
            return "prepend";
          } else {
            return "ignore";
          }
        }
      }
    ];
  }
  getVariables() {
    return {
      isPublic: this.props.isPublic === "0" ? false : true,
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
      viewer: {
        id: this.props.viewer.id,
        feedbacks: {
          totalInfo: {
            total: this.props.total + 1
          }
        }
      }
    };
  }
}
