// @flow

import Relay from "react-relay";
import DicFilterItem from "./DicFilterItem";

export default Relay.createContainer(DicFilterItem, {
  fragments: {
    viewer: () => Relay.QL`
        fragment on User {
          dic(code: "Job", first: 99999) {
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
