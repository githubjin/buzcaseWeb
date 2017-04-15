import React, { PureComponent } from "react";

import { Form, Icon, Input, Button } from "antd";
const FormItem = Form.Item;

class SignInPanel extends PureComponent {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log("Received values of form: ", values);
        this.props.handleSubmit(values, false);
      }
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form id="sign-form" onSubmit={this.handleSubmit} className="login-form">
        <FormItem hasFeedback>
          {getFieldDecorator("username", {
            rules: [{ required: true, message: "请输入你的用户名!" }]
          })(
            <Input
              prefix={<Icon type="user" style={{ fontSize: 13 }} />}
              placeholder="用户名"
            />
          )}
        </FormItem>
        <FormItem hasFeedback>
          {getFieldDecorator("password", {
            rules: [{ required: true, message: "请输入你的密码！" }]
          })(
            <Input
              prefix={<Icon type="lock" style={{ fontSize: 13 }} />}
              type="password"
              placeholder="密码"
            />
          )}
        </FormItem>
        <FormItem>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            登录
          </Button>
          <a className="login-form-forgot">忘记密码?</a>
        </FormItem>
      </Form>
    );
  }
}

const WrappedNormalLoginForm = Form.create()(SignInPanel);

export default WrappedNormalLoginForm;
