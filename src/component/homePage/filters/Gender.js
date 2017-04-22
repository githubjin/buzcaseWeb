// @flow

import Relay from "react-relay";
import DictDropdown from "./DictDropdown";

export default Relay.createContainer(DictDropdown, {
  fragments: {
    viewer: () => Relay.QL`
        fragment on User {
          dic(code: "Gender", first: 99999) {
            edges {
              node{
                id,
                name,
                order,
              }
            }
          }
        }
      `
  }
});
