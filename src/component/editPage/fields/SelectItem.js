// @flow
import React from "react";
import { Form, Select } from "antd";
const FormItem = Form.Item;
const Option = Select.Option;

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
    showSearch = true,
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
        <Select showSearch={showSearch} placeholder={placeholder}>
          {edges.map(edge => (
            <Option key={edge.node.id} value={edge.node.name}>
              {edge.node.name}
            </Option>
          ))}
        </Select>
      )}
    </FormItem>
  );
};
