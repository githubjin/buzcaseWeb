// @flow

import Relay from "react-relay";
import DicFilterItem from "./DicFilterItem";

export default Relay.createContainer(DicFilterItem, {
  fragments: {
    master: () => Relay.QL`
        fragment on MasterType {
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
