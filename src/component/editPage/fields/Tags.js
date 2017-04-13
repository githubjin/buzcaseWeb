// @flow
import React from "react";
import { Form, Select } from "antd";
const FormItem = Form.Item;
const Option = Select.Option;

const emptyRoles = [];
function getRole(message) {
  return [{ required: true, message, type: "array" }];
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
    required = true
  } = props;
  return (
    <FormItem {...formItemLayout} label={label} hasFeedback>
      {getFieldDecorator(fieldName, {
        rules: required ? getRole(message) : emptyRoles
      })(
        <Select
          mode="tags"
          tags={true}
          allowClear
          placeholder={placeholder}
          style={{ width: "100%" }}
        >
          {edges.map(edge => (
            <Option key={edge.node.name}>{edge.node.name}</Option>
          ))}
        </Select>
      )}
    </FormItem>
  );
};
