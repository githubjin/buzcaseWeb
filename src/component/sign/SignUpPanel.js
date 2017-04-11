// @flow
import React, { PureComponent } from "react";
import { Form, Icon, Input, Button } from "antd";
const FormItem = Form.Item;

class SignUpPanel extends PureComponent {
  state: { confirmDirty: boolean };
  handleSubmit: (any) => any;
  checkPassword: (any) => any;
  handleConfirmBlur: (any) => any;
  constructor(props) {
    super(props);
    this.state = {
      confirmDirty: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.checkPassword = this.checkPassword.bind(this);
    this.handleConfirmBlur = this.handleConfirmBlur.bind(this);
  }
  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log("Received values of form: ", values);
        this.props.handleSubmit(values, true);
      }
    });
  }
  checkPassword(rule, value, callback) {
    const form = this.props.form;
    if (value && value !== form.getFieldValue("password")) {
      callback("你输入的两次密码不一致！");
    } else {
      callback();
    }
  }
  handleConfirmBlur(e) {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  }
  render() {
    // console.log(this.props);
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
          {getFieldDecorator("email", {
            rules: [{ required: true, message: "请输入你的邮箱!" }]
          })(
            <Input
              prefix={<Icon type="mail" style={{ fontSize: 13 }} />}
              placeholder="邮箱"
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
        <FormItem hasFeedback>
          {getFieldDecorator("confirm", {
            rules: [
              {
                required: true,
                message: "请确认你的密码!"
              },
              {
                validator: this.checkPassword
              }
            ]
          })(
            <Input
              prefix={<Icon type="lock" style={{ fontSize: 13 }} />}
              type="password"
              onBlur={this.handleConfirmBlur}
              placeholder="确认密码"
            />
          )}
        </FormItem>
        <FormItem>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            注册
          </Button>
        </FormItem>
      </Form>
    );
  }
}

const WrappedNormalLoginForm = Form.create()(SignUpPanel);

export default WrappedNormalLoginForm;
