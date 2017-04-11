import React from "react";
import { Form, Select, Cascader, Button, Icon, Input, DatePicker } from "antd";
const FormItem = Form.Item;
const Option = Select.Option;
import Relay from "react-relay";
import ArticleDetail from "../ArticleDetail";

const residences = [
  {
    value: "zhejiang",
    label: "Zhejiang",
    children: [
      {
        value: "hangzhou",
        label: "Hangzhou",
        children: [
          {
            value: "xihu",
            label: "West Lake"
          }
        ]
      }
    ]
  },
  {
    value: "jiangsu",
    label: "Jiangsu",
    children: [
      {
        value: "nanjing",
        label: "Nanjing",
        children: [
          {
            value: "zhonghuamen",
            label: "Zhong Hua Men"
          }
        ]
      }
    ]
  }
];

class EditForm extends React.Component {
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
        onSubmit={this.handleSubmit}
        style={{
          borderTop: "1px dashed #e9e9e9",
          paddingTop: 10,
          marginTop: 10
        }}
      >
        <FormItem hasFeedback {...formItemLayout} label="标题">
          {getFieldDecorator("title", {
            rules: [{ required: true, message: "案例标题不能为空" }]
          })(<Input placeholder="请输入案例标题" />)}
        </FormItem>

        <FormItem {...formItemLayout} label="类别" hasFeedback>
          {getFieldDecorator("tags")(
            <Select showSearch={true} placeholder="请选择案例类别">
              <Option value="全部">全部</Option>
              <Option value="高官">高官</Option>
              <Option value="牢狱">牢狱</Option>
              <Option value="晚婚">晚婚</Option>
            </Select>
          )}
        </FormItem>

        <FormItem hasFeedback {...formItemLayout} label="姓名/昵称">
          {getFieldDecorator("name", {
            rules: [{ required: true, message: "姓名/昵称不能为空" }]
          })(<Input placeholder="请输入案例人物姓名/昵称" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="性别" hasFeedback>
          {getFieldDecorator("gender", {
            rules: [{ required: true, message: "性别不能为空" }]
          })(
            <Select placeholder="请选择案例人物性别">
              <Option value="1">全部</Option>
              <Option value="2">男</Option>
              <Option value="3">女</Option>
              <Option value="4">其他</Option>
            </Select>
          )}
        </FormItem>
        <FormItem hasFeedback {...formItemLayout} label="出生时间">
          {getFieldDecorator("birthday", {
            rules: [{ required: true, message: "出生时间不能为空" }]
          })(
            <DatePicker
              format="YYYY-MM-DD HH:mm"
              showTime={true}
              style={{ width: "100%" }}
            />
          )}
        </FormItem>

        <FormItem hasFeedback {...formItemLayout} label="出生地点">
          {getFieldDecorator("homeplace", {
            initialValue: ["zhejiang", "hangzhou", "xihu"],
            rules: [{ type: "array", required: true, message: "出生地点不能为空" }]
          })(<Cascader options={residences} />)}
        </FormItem>

        <FormItem {...formItemLayout} label="学历" hasFeedback>
          {getFieldDecorator("education")(
            <Select showSearch={true} placeholder="请选择案例人物学历">
              <Option value="全部">全部</Option>
              <Option value="小学">小学</Option>
              <Option value="初中">初中</Option>
              <Option value="高中">高中</Option>
              <Option value="中专">中专</Option>
              <Option value="大学">大学</Option>
            </Select>
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="职业" hasFeedback>
          {getFieldDecorator("job")(
            <Select showSearch={true} placeholder="请选择案例人物职业">
              <Option value="全部">全部</Option>
              <Option value="导演">导演</Option>
              <Option value="演员">演员</Option>
              <Option value="专业游戏玩家">专业游戏玩家</Option>
              <Option value="自由职业">自由职业</Option>
              <Option value="CEO">CEO</Option>
            </Select>
          )}
        </FormItem>

        <FormItem {...formItemLayout} label="婚姻" hasFeedback>
          {getFieldDecorator("marriage")(
            <Select showSearch={true} placeholder="请选择案例人物职业">
              <Option value="全部">全部</Option>
              <Option value="已婚">已婚</Option>
              <Option value="离婚">离婚</Option>
              <Option value="未婚">未婚</Option>
            </Select>
          )}
        </FormItem>

        <FormItem hasFeedback {...formItemLayout} label="子女">
          {getFieldDecorator("children")(
            <Input
              type="textarea"
              placeholder="子女信息(可以不填)"
              autosize={{ minRows: 2, maxRows: 10 }}
            />
          )}
        </FormItem>

        {formItems}

        <FormItem {...formItemLayoutWithOutLabel}>
          <Button type="dashed" onClick={this.add} style={{ width: "100%" }}>
            <Icon type="plus" /> 添加重要事件
          </Button>
        </FormItem>

        <FormItem hasFeedback {...formItemLayout} label="命理知识备注">
          {getFieldDecorator("notes")(
            <Input
              type="textarea"
              placeholder="请填写命理知识备注(可以不填)"
              autosize={{ minRows: 2, maxRows: 20 }}
            />
          )}
        </FormItem>

        <FormItem {...formItemLayoutWithOutLabel}>
          <Button style={{ width: "100%" }} type="primary" htmlType="submit">
            保存
          </Button>
        </FormItem>
      </Form>
    );
  }
}

// const WrappedEditForm = Form.create()(EditForm);

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

var ArticleEditorContainer = Relay.createContainer(WrappedEditForm, {
  fragments: {
    article: () => Relay.QL`
      fragment on Article {
        ${ArticleDetail.getFragment("node")}
      }
    `,
    provinces: () => Relay.QL`
      fragment on JobConnection {
        edges {
          node {
            id,
            name,
            order
          }
        }
      }
    `,
    categories: () => Relay.QL`
      fragment on JobConnection {
        edges {
          node {
            id,
            name,
            order
          }
        }
      }
    `,
    educations: () => Relay.QL`
      fragment on JobConnection {
        edges {
          node {
            id,
            name,
            order
          }
        }
      }
    `,
    jobs: () => Relay.QL`
      fragment on JobConnection {
        edges {
          node {
            id,
            name,
            order
          }
        }
      }
    `,
    genders: () => Relay.QL`
      fragment on JobConnection {
        edges {
          node {
            id,
            name,
            order
          }
        }
      }
    `,
    marriages: () => Relay.QL`
      fragment on JobConnection {
        edges {
          node {
            id,
            name,
            order
          }
        }
      }
    `
  }
});

export default WrappedEditForm;
