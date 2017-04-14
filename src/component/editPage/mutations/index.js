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
            article
        }    
    `;
  }
  getConfigs() {
    if (this.props.doSubmit) {
      return [
        {
          type: "FIELDS_CHANGE",
          fieldIDs: { article: this.props.input.id }
        }
      ];
    }
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
      ...this.props.input
    };
  }
}
