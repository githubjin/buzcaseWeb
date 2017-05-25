// @flow

import Relay from "react-relay";

export default class SignUpMutation extends Relay.Mutation {
  static fragments = {
    viewer: () => Relay.QL`
        fragment on User {
            id,
            username,
            email,
            emailVerified,
            sessionToken
        }`
  };
  getMutation() {
    return Relay.QL`
        mutation { signUp }
    `;
  }
  getFatQuery() {
    return Relay.QL`
        fragment on SignUpPayload {
            error,
            viewer {
                id,
                username,
                email,
                sessionToken,
                emailVerified
            }
        }
    `;
  }
  getVariables() {
    return {
      username: this.props.username,
      password: this.props.password,
      email: this.props.email
    };
  }
  getConfigs() {
    return [
      // {
      //   type: "FIELDS_CHANGE",
      //   fieldIDs: { viewer: this.props.viewer.id }
      // },
      {
        type: "REQUIRED_CHILDREN",
        children: [
          Relay.QL`
          fragment on SignUpPayload {
            error,
            viewer {
                id,
                username,
                email,
                sessionToken,
                emailVerified
            }
          }`
        ]
      }
    ];
  }
}
