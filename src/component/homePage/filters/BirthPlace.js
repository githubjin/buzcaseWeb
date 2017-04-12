// @flow

import React, { PropTypes } from "react";
import Relay from "react-relay";
import ChinaDivision from "../../common/ChinaDivision";

class BirthPlace extends React.PureComponent {
  render() {
    return (
      <div id="filter_homeplace">
        <ChinaDivision
          matchInputWidth={true}
          relay={this.props.relay}
          master={this.props.master}
          doSearch={this.props.doSearch}
        />
      </div>
    );
  }
}

BirthPlace.propTypes = {
  doSearch: PropTypes.func.isRequired
};

module.exports = Relay.createContainer(BirthPlace, {
  initialVariables: { provinceCode: "0", cityCode: "0" },
  fragments: {
    master: () => Relay.QL`
      fragment on MasterType {
        provinces: provinces(first: 50){
          edges {
            node {
              id,
              name,
              code,
              isLeaf
            }
          }
        },
        cities: subQuyu(code: $provinceCode) {
          id,
          name,
          code,
          isLeaf
        },
        areas: subQuyu(code: $cityCode) {
          id,
          name,
          code,
          isLeaf
        }
      }
    `
  }
});
