// @flow
import React from "react";
import { Form, Input } from "antd";
const FormItem = Form.Item;

const emptyRoles = [];
function getRoles(message) {
  return [{ required: true, message }];
}
module.exports = (props: any) => {
  const {
    formItemLayout,
    getFieldDecorator,
    label,
    fieldName,
    required,
    message,
    placeholder,
    defaultValue = ""
  } = props;
  return (
    <FormItem hasFeedback {...formItemLayout} label={label}>
      {getFieldDecorator(fieldName, {
        rules: required ? getRoles(message) : emptyRoles,
        initialValue: defaultValue
      })(<Input placeholder={placeholder} />)}
    </FormItem>
  );
};
