// @flow

import Relay from "react-relay";

export default class ArticleMutation extends Relay.Mutation {
  static fragment = {
    node: () => Relay.QL`
        fragment on Article {
            id
        }
        `
  };
  getMutation() {
    return Relay.QL`
        mutation { saveArticle }
    `;
  }
  getFatQuery() {
    return Relay.QL`
        fragment on ArticleMutationPayload {
            keys,
            eventKey2Ids,
            article {
                id
            }
        }    
    `;
  }
  getConfigs() {
    return [
      {
        type: "REQUIRED_CHILDREN",
        children: [
          Relay.QL`
          fragment on ArticleMutationPayload {
            keys,
            eventKey2Ids,
            article {
                id
            }
          }
        `
        ]
      }
    ];
  }
  getVariables() {
    return {
      ...this.props
    };
  }
}
