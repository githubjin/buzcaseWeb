// @flow
import React from "react";
import { Button, Form, Input } from "antd";
const FormItem = Form.Item;
class NoteForm extends React.PureComponent {
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      // console.log(values);
      if (!err) {
        this.props.handleSubmit(values, () => {
          this.props.form.setFieldsValue({
            text: ""
          });
        });
      }
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form layout="vertical" onSubmit={this.handleSubmit}>
        <FormItem hasFeedback>
          {getFieldDecorator("text", {
            rules: [{ required: true, message: "内容不能为空" }]
          })(<Input type="textarea" autosize={{ minRows: 5, maxRows: 10 }} />)}
        </FormItem>
        <FormItem style={{ textAlign: "right" }}>
          <Button type="primary" htmlType="submit">保存</Button>
        </FormItem>
      </Form>
    );
  }
}

export default Form.create()(NoteForm);
