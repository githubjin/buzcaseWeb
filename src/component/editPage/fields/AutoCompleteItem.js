// @flow
import React from "react";
import { Form, AutoComplete } from "antd";
const FormItem = Form.Item;

const emptyRoles = [];
function getRole(message) {
  return [{ required: true, message }];
}

module.exports = (props: any) => {
  const {
    formItemLayout,
    getFieldDecorator,
    label,
    fieldName,
    placeholder,
    edges,
    message,
    required = true,
    defaultValue = ""
  } = props;
  return (
    <FormItem {...formItemLayout} label={label} hasFeedback>
      {getFieldDecorator(fieldName, {
        rules: required ? getRole(message) : emptyRoles,
        initialValue: defaultValue
      })(
        <AutoComplete
          dataSource={edges
            .filter(edge => edge.node.order !== 0)
            .map(edge => edge.node.name)}
          placeholder={placeholder}
        />
      )}
    </FormItem>
  );
};
