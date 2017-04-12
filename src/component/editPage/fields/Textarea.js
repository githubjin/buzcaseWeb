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
    required = false,
    message,
    placeholder,
    autosize
  } = props;
  return (
    <FormItem hasFeedback {...formItemLayout} label={label}>
      {getFieldDecorator(fieldName, {
        roles: required ? getRoles(message) : emptyRoles
      })(
        <Input type="textarea" placeholder={placeholder} autosize={autosize} />
      )}
    </FormItem>
  );
};
