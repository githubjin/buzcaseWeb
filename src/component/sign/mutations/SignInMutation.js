// @flow

import Relay from "react-relay";
// import SignUpMutation from "./SignUpMutation";

export default class SignInMutation extends Relay.Mutation {
  // Warning: RelayMutation: Expected prop `master` supplied to `SignInMutation`
  // to be data fetched by Relay. This is likely an error unless you are purposely
  // passing in mock data that conforms to the shape of this mutation's fragment.
  // static fragments = {
  //   master: () => Relay.QL`
  //       fragment on MasterType {
  //           ${SignUpMutation.getFragment("master")}
  //       }`
  // };
  getMutation() {
    return Relay.QL`
        mutation { signIn }
    `;
  }
  getFatQuery() {
    return Relay.QL`
        fragment on SignInPayload {
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
      password: this.props.password
    };
  }
  getConfigs() {
    console.log(this.props);
    return [
      {
        type: "FIELDS_CHANGE",
        fieldIDs: { master: this.props.master.id }
      },
      {
        type: "REQUIRED_CHILDREN",
        children: [
          Relay.QL`
          fragment on SignInPayload {
            error
          }`
        ]
      }
    ];
  }
}
