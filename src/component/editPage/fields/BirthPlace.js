// @flow
import React from "react";
import { Form, Cascader } from "antd";
import ChinaDivision from "../../common/ChinaDivision";
const FormItem = Form.Item;
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
      master,
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
        rules={required ? getRules(message) : emptyRoles}
        matchInputWidth={false}
        master={master}
        relay={relay}
      />
    );
  }
}

module.exports = Relay.createContainer(BirthPlaceInForm, {
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
