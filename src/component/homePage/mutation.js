// @flow

import Relay from "react-relay";

export default class ArticleDeleteMutation extends Relay.Mutation {
  static fragments = {
    viewer: () => Relay.QL`
        fragment on User {
            id
        }
    `
  };
  getMutation() {
    return Relay.QL`
            mutation { articlDel }
        `;
  }
  getFatQuery() {
    return Relay.QL`
        fragment on ArticleDeletePayload {
            distroyedId,
            viewer {
                articles 
            },
            error
        }`;
  }
  getConfigs() {
    // console.log(this.props);
    return [
      // {
      //   type: "FIELDS_CHANGE",
      //   fieldIDs: { viewer: this.props.viewer.id }
      // },
      {
        type: "REQUIRED_CHILDREN",
        children: [
          Relay.QL`
          fragment on ArticleDeletePayload {
            error
          }
        `
        ]
      },
      {
        type: "RANGE_DELETE",
        parentName: "viewer",
        parentID: this.props.viewer.id,
        // parentID: this.props.userId,
        connectionName: "articles",
        deletedIDFieldName: "distroyedId",
        pathToConnection: ["viewer", "articles"]
      }
      // {
      //   type: "NODE_DELETE",
      //   parentName: "viewer",
      //   parentID: this.props.viewer.id,
      //   connectionName: "articles",
      //   deletedIDFieldName: "distroyedId"
      // }
    ];
  }
  getVariables() {
    const { articleId } = this.props;
    return {
      id: articleId
    };
  }
  // getOptimisticResponse() {
  //   // console.log("getOptimisticResponse", this.props);
  //   return {
  //     distroyedId: this.props.articleId,
  //     viewer: {
  //       id: this.props.viewer.id,
  //       articles: {
  //         edges: [
  //           {
  //             node: {
  //               id: this.props.articleId
  //             }
  //           }
  //         ]
  //       }
  //     }
  //   };
  // }
}
