// @flow

import Relay from "react-relay";
// import SignUpMutation from "./SignUpMutation";

export default class SignInMutation extends Relay.Mutation {
  // Warning: RelayMutation: Expected prop `viewer` supplied to `SignInMutation`
  // to be data fetched by Relay. This is likely an error unless you are purposely
  // passing in mock data that conforms to the shape of this mutation's fragment.
  // static fragments = {
  //   viewer: () => Relay.QL`
  //       fragment on User {
  //           ${SignUpMutation.getFragment("viewer")}
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
      password: this.props.password
    };
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
          fragment on SignInPayload {
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
