// @flow

import Relay from "react-relay";

export default class SignUpMutation extends Relay.Mutation {
  static fragments = {
    master: () => Relay.QL`
        fragment on MasterType {
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
            master {
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
      {
        type: "FIELDS_CHANGE",
        fieldIDs: { master: this.props.master.id }
      },
      {
        type: "REQUIRED_CHILDREN",
        children: [
          Relay.QL`
          fragment on SignUpPayload {
            error
          }`
        ]
      }
    ];
  }
}
