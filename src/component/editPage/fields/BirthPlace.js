// @flow
import React from "react";
import ChinaDivision from "../../common/ChinaDivision";
import Relay from "react-relay";

const emptyRoles = [];
function getRules(message) {
  return [{ required: true, message }];
}
class BirthPlaceInForm extends React.PureComponent {
  render() {
    const {
      formItemLayout,
      getFieldDecorator,
      label,
      fieldName,
      required = true,
      message,
      placeholder,
      defaultValue,
      viewer,
      relay
    } = this.props;
    return (
      <ChinaDivision
        inForm={true}
        label={label}
        placeholder={placeholder}
        formItemLayout={formItemLayout}
        getFieldDecorator={getFieldDecorator}
        fieldName={fieldName}
        defaultValue={defaultValue}
        rules={required ? getRules(message) : emptyRoles}
        matchInputWidth={false}
        viewer={viewer}
        relay={relay}
      />
    );
  }
}

module.exports = Relay.createContainer(BirthPlaceInForm, {
  initialVariables: { provinceCode: "0", cityCode: "0" },
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
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
