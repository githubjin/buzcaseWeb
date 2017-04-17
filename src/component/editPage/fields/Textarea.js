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
    autosize,
    defaultValue = "",
    onKeyUp = () => {}
  } = props;
  return (
    <FormItem hasFeedback {...formItemLayout} label={label}>
      {getFieldDecorator(fieldName, {
        rules: required ? getRoles(message) : emptyRoles,
        initialValue: defaultValue
      })(
        <Input
          onKeyUp={onKeyUp}
          type="textarea"
          placeholder={placeholder}
          autosize={autosize}
        />
      )}
    </FormItem>
  );
};
