// @flow
import React from "react";
import { Form, Input, Icon, Popconfirm } from "antd";
const FormItem = Form.Item;
import _ from "lodash";

module.exports = (props: any) => {
  const {
    index,
    formItemLayout,
    formItemLayoutWithOutLabel,
    getFieldDecorator,
    label,
    prefix,
    k,
    length,
    remove,
    placeholder,
    message,
    onblur,
    getFieldValue,
    defaultValue = ""
  } = props;
  var isvisible = !_.isEmpty(getFieldValue(`${prefix}${k}`));
  return (
    <FormItem
      {...index === 0 ? formItemLayout : formItemLayoutWithOutLabel}
      label={index === 0 ? label : ""}
      required={false}
      key={k}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        {getFieldDecorator(`${prefix}${k}`, {
          validateTrigger: ["onChange", "onBlur"],
          initialValue: defaultValue,
          rules: [
            {
              required: true,
              whitespace: true,
              message: `${message}-${index + 1}`
            }
          ]
        })(
          <Input
            type="textarea"
            onBlur={_.debounce(onblur(k), 2000, {
              leading: false,
              trailing: true
            })}
            placeholder={placeholder}
            autosize={{ minRows: 2, maxRows: 10 }}
            style={{ marginRight: 8 }}
          />
        )}
        {isvisible &&
          <Popconfirm
            title="你确定要删除该条记录吗？"
            onConfirm={() => remove(k)}
            okText="确定"
            cancelText="取消"
          >
            <Icon
              style={{ fontSize: 20, cursor: "pointer" }}
              className="dynamic-delete-button"
              type="minus-circle-o"
              disabled={length === 1}
            />
          </Popconfirm>}
        {!isvisible &&
          <Icon
            style={{ fontSize: 20, cursor: "pointer" }}
            className="dynamic-delete-button"
            type="minus-circle-o"
            onClick={() => remove(k)}
            disabled={length === 1}
          />}

      </div>
    </FormItem>
  );
};
