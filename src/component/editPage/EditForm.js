import React from "react";
import { Form, Cascader, Button, Icon, Input } from "antd";
const FormItem = Form.Item;
import Relay from "react-relay";

import { DetailContainer } from "../ArticleDetail";

import InputItem from "./fields/InputItem";
import AutoCompleteItem from "./fields/AutoCompleteItem";
import Birthtime from "./fields/Birthtime";
import Textarea from "./fields/Textarea";
import BirthPlace from "./fields/BirthPlace";
import RelayLoading from "../RelayLoading";
import QueryRoute from "../../queryConfig";

class EditForm extends React.Component {
  props: {
    master: Object
  };
  constructor(props) {
    super(props);
    this.uuid = 0;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.normFile = this.normFile.bind(this);
    this.remove = this.remove.bind(this);
    this.add = this.add.bind(this);
  }
  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log("Received values of form: ", values);
      }
    });
  }
  normFile(e) {
    console.log("Upload event:", e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  }
  remove(k) {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue("keys");
    // We need at least one passenger
    // if (keys.length === 1) {
    //   return;
    // }

    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter(key => key !== k)
    });
  }

  add() {
    this.uuid++;
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue("keys");
    const nextKeys = keys.concat(this.uuid);
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys
    });
  }
  render() {
    const { master, node } = this.props;
    console.log(master, node);
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 }
      }
    };
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 12, offset: 5 }
      }
    };
    getFieldDecorator("keys", { initialValue: [] });
    const keys = getFieldValue("keys");
    const formItems = keys.map((k, index) => {
      return (
        <FormItem
          {...index === 0 ? formItemLayout : formItemLayoutWithOutLabel}
          label={index === 0 ? "重要事件" : ""}
          required={false}
          key={k}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            {getFieldDecorator(`event-${k}`, {
              validateTrigger: ["onChange", "onBlur"],
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: `请填写案例人物的重要事件-${k}`
                }
              ]
            })(
              <Input
                type="textarea"
                placeholder="请填写案例人物的重要事件"
                autosize={{ minRows: 2, maxRows: 10 }}
                style={{ marginRight: 8 }}
              />
            )}
            <Icon
              style={{ fontSize: 20, cursor: "pointer" }}
              className="dynamic-delete-button"
              type="minus-circle-o"
              disabled={keys.length === 1}
              onClick={() => this.remove(k)}
            />
          </div>
        </FormItem>
      );
    });
    return (
      <Form
        id="articleEditorForm"
        onSubmit={this.handleSubmit}
        style={{
          borderTop: "1px dashed #e9e9e9",
          paddingTop: 10,
          marginTop: 10
        }}
      >
        <InputItem
          label="标题"
          message="案例标题不能为空"
          placeholder="请输入案例标题"
          required={true}
          fieldName="title"
          formItemLayout={formItemLayout}
          getFieldDecorator={getFieldDecorator}
        />
        <AutoCompleteItem
          formItemLayout={formItemLayout}
          getFieldDecorator={getFieldDecorator}
          label="类别"
          fieldName="category"
          showSearch={true}
          placeholder="请选择案例类别"
          message="案例类别不能为空"
          edges={master.categories.edges}
        />
        <InputItem
          label="姓名/昵称"
          message="姓名/昵称不能为空"
          placeholder="请输入案例人物姓名/昵称"
          required={true}
          fieldName="name"
          formItemLayout={formItemLayout}
          getFieldDecorator={getFieldDecorator}
        />
        <AutoCompleteItem
          formItemLayout={formItemLayout}
          getFieldDecorator={getFieldDecorator}
          label="性别"
          fieldName="gender"
          showSearch={true}
          message="性别不能为空"
          placeholder="请选择案例人物性别"
          edges={master.genders.edges}
        />
        <Birthtime
          formItemLayout={formItemLayout}
          getFieldDecorator={getFieldDecorator}
          label="出生时间"
          fieldName="birthday"
          placeholder="出生时间"
          message="出生时间不能为空"
          required={true}
        />
        <RelayLoading route={new QueryRoute()}>
          <BirthPlace
            formItemLayout={formItemLayout}
            getFieldDecorator={getFieldDecorator}
            label="出生地点"
            fieldName="homeplace"
            placeholder="出生地点"
            message="出生地点不能为空"
            required={true}
          />
        </RelayLoading>
        <AutoCompleteItem
          formItemLayout={formItemLayout}
          getFieldDecorator={getFieldDecorator}
          label="学历"
          fieldName="education"
          showSearch={true}
          message="学历不能为空"
          placeholder="请选择案例人物学历"
          edges={master.educations.edges}
        />
        <AutoCompleteItem
          formItemLayout={formItemLayout}
          getFieldDecorator={getFieldDecorator}
          label="职业"
          fieldName="job"
          showSearch={true}
          message="人物职业不能为空"
          placeholder="请选择案例人物职业"
          edges={master.jobs.edges}
        />
        <AutoCompleteItem
          formItemLayout={formItemLayout}
          getFieldDecorator={getFieldDecorator}
          label="婚姻"
          fieldName="marriage"
          showSearch={true}
          message="人物婚姻状况不能为空"
          placeholder="请选择案例人物职业"
          edges={master.marriages.edges}
        />
        <Textarea
          label="子女"
          placeholder="子女信息(可以不填)"
          fieldName="children"
          autosize={{ minRows: 2, maxRows: 10 }}
          getFieldDecorator={getFieldDecorator}
          formItemLayout={formItemLayout}
        />
        {formItems}
        <FormItem {...formItemLayoutWithOutLabel}>
          <Button type="dashed" onClick={this.add} style={{ width: "100%" }}>
            <Icon type="plus" /> 添加重要事件
          </Button>
        </FormItem>
        <Textarea
          label="命理知识备注"
          placeholder="请填写命理知识备注(可以不填)"
          fieldName="notes"
          autosize={{ minRows: 2, maxRows: 20 }}
          getFieldDecorator={getFieldDecorator}
          formItemLayout={formItemLayout}
        />
        <FormItem {...formItemLayoutWithOutLabel}>
          <Button style={{ width: "100%" }} type="primary" htmlType="submit">
            保存
          </Button>
        </FormItem>
      </Form>
    );
  }
}

class WrappedEditForm extends React.PureComponent {
  props: {
    onValuesChange: (props: Object, values: Object) => void
  };
  render() {
    return (
      <div>
        {React.createElement(
          Form.create({
            onValuesChange: this.props.onValuesChange
          })(EditForm),
          { ...this.props }
        )}
      </div>
    );
  }
}

module.exports = Relay.createContainer(WrappedEditForm, {
  fragments: {
    node: () => Relay.QL`
        fragment on Article {
          ${DetailContainer.getFragment("node")}
        }`
  }
});
