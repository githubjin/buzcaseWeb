// @flow
import React from "react";
import { Form, DatePicker } from "antd";
const FormItem = Form.Item;

module.exports = (props: any) => {
  const {
    formItemLayout,
    getFieldDecorator,
    label,
    fieldName,
    placeholder,
    message,
    required = true
  } = props;
  return (
    <FormItem hasFeedback {...formItemLayout} label={label}>
      {getFieldDecorator(fieldName, {
        rules: [{ required: required, message }]
      })(
        <DatePicker
          placeholder={placeholder}
          format="YYYY-MM-DD HH:mm"
          showTime={true}
          style={{ width: "100%" }}
        />
      )}
    </FormItem>
  );
};
