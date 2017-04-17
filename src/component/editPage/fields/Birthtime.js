// @flow
import React from "react";
import { Form, DatePicker } from "antd";
const FormItem = Form.Item;
import moment from "moment";

module.exports = (props: any) => {
  const {
    formItemLayout,
    getFieldDecorator,
    label,
    fieldName,
    placeholder,
    message,
    required = true,
    defaultValue = null,
    onBlur
  } = props;

  const options: Object = { rules: [{ required: required, message }] };
  if (defaultValue != null) {
    options.initialValue = moment(
      moment(defaultValue).format("YYYY-MM-DD HH:mm"),
      "YYYY-MM-DD HH:mm"
    );
  }
  return (
    <FormItem hasFeedback {...formItemLayout} label={label}>
      {getFieldDecorator(fieldName, options)(
        <DatePicker
          onOk={onBlur}
          placeholder={placeholder}
          format="YYYY-MM-DD HH:mm"
          showTime={true}
          style={{ width: "100%" }}
        />
      )}
    </FormItem>
  );
};
