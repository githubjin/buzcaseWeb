// @flow

import React from "react";
import { Form, Button, Icon } from "antd";
const FormItem = Form.Item;
import Relay from "react-relay";
// import { DetailContainer } from "../ArticleDetail";
import InputItem from "./fields/InputItem";
import AutoCompleteItem from "./fields/AutoCompleteItem";
import Tags from "./fields/Tags";
import Birthtime from "./fields/Birthtime";
import Textarea from "./fields/Textarea";
import BirthPlace from "./fields/BirthPlace";
import EventNoteItem from "./fields/EventNoteItem";
import RelayLoading from "../RelayLoading";
import QueryRoute from "../../queryConfig";
import _ from "lodash";

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

class EditForm extends React.Component {
  props: {
    viewer: Object,
    node: Object,
    form: Object,
    onEventInputDelete: (id: number) => void,
    onEventInputBlur: (id: number) => any,
    handleSubmit: (values: Object, node: Object) => void
  };
  uuid: number;
  handleSubmit: (e: Object) => void;
  remove: (k: any) => void;
  add: () => void;
  timerID: any;

  constructor(props) {
    super(props);
    this.uuid = 0;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.remove = this.remove.bind(this);
    this.add = this.add.bind(this);
  }
  // componentDidMount() {
  //   this.timerID = setInterval(() => {
  //     // console.log("timer is running");
  //     this.props.form.setFieldsValue({
  //       timer: Math.random()
  //     });
  //   }, 5000);
  // }
  // componentWillUnmount() {
  //   // console.log("timer is removed");
  //   clearInterval(this.timerID);
  // }
  onKeyUp = e => {
    console.log(e.keyCode);
    if (e.keyCode === 32) {
      this.props.form.setFieldsValue({
        timer: Math.random()
      });
    }
  };
  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // console.log("Received values of form: ", values);
        this.props.handleSubmit(values, this.props.node);
      } else {
        console.log(err);
      }
    });
  }
  remove(k) {
    this.props.onEventInputDelete(k);
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
  getIntialHomeplace = () => {
    var initialHomeplace: string[];
    var { node } = this.props;
    if (!node) {
      return initialHomeplace;
    }
    const { homePlace } = node;
    if (!homePlace) {
      return initialHomeplace;
    }
    const { province, city, area } = homePlace;
    if (province) {
      initialHomeplace = [];
      initialHomeplace.push(province);
      if (city) {
        initialHomeplace.push(city);
      }
      if (area) {
        initialHomeplace.push(area);
      }
    }
    return initialHomeplace;
  };
  getEventItemDefaultValue = (id: number | string): string => {
    if (_.isNumber(id)) {
      return "";
    }
    const { node: { events: { edges } } } = this.props;
    const currentNode = edges.filter(edge => edge.node.id === id);
    if (_.isEmpty(currentNode)) {
      return "";
    }
    return currentNode[0].node.text;
  };
  render() {
    const { viewer, node = {} } = this.props;
    const {
      title,
      categories,
      name,
      gender,
      birthday,
      education,
      jobs,
      marriage,
      children,
      knowledge,
      events = {}
    } = node;
    // console.log("-01-101-101-11--101-101-101-101--101-1-", node);
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { edges = [] } = events;
    getFieldDecorator("keys", {
      initialValue: edges.map(_node => _node.node.id)
    });
    getFieldDecorator("timer", {
      initialValue: Math.random()
    });
    const keys = getFieldValue("keys");
    const formItems = keys.map((k, index) => {
      // console.log(k, "99999999999999999999999999");
      return (
        <EventNoteItem
          index={index}
          formItemLayout={formItemLayout}
          formItemLayoutWithOutLabel={formItemLayoutWithOutLabel}
          getFieldDecorator={getFieldDecorator}
          label="重要事件"
          prefix="event_"
          getFieldValue={getFieldValue}
          defaultValue={this.getEventItemDefaultValue(k, index)}
          k={k}
          key={k}
          onKeyUp={this.props.onEventInputBlur}
          length={keys.length}
          remove={this.remove}
          placeholder="请填写案例人物的重要事件"
          message="请填写案例人物的重要事件"
        />
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
          defaultValue={title}
          formItemLayout={formItemLayout}
          getFieldDecorator={getFieldDecorator}
        />
        <Tags
          formItemLayout={formItemLayout}
          getFieldDecorator={getFieldDecorator}
          label="类别"
          defaultValue={categories ? categories : undefined}
          fieldName="categories"
          showSearch={true}
          placeholder="请选择案例类别"
          message="案例类别不能为空"
          edges={viewer.categories.edges}
        />
        <InputItem
          label="姓名/昵称"
          message="姓名/昵称不能为空"
          placeholder="请输入案例人物姓名/昵称"
          required={true}
          fieldName="name"
          defaultValue={name}
          formItemLayout={formItemLayout}
          getFieldDecorator={getFieldDecorator}
        />
        <AutoCompleteItem
          formItemLayout={formItemLayout}
          getFieldDecorator={getFieldDecorator}
          label="性别"
          fieldName="gender"
          showSearch={true}
          defaultValue={gender}
          message="性别不能为空"
          placeholder="请选择案例人物性别"
          edges={viewer.genders.edges}
        />
        <Birthtime
          formItemLayout={formItemLayout}
          getFieldDecorator={getFieldDecorator}
          label="出生时间"
          fieldName="birthday"
          defaultValue={birthday}
          placeholder="出生时间"
          message="出生时间不能为空"
          required={true}
        />
        <RelayLoading route={new QueryRoute()}>
          <BirthPlace
            formItemLayout={formItemLayout}
            getFieldDecorator={getFieldDecorator}
            label="出生地点"
            defaultValue={this.getIntialHomeplace()}
            fieldName="homePlace"
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
          defaultValue={education}
          showSearch={true}
          message="学历不能为空"
          placeholder="请选择案例人物学历"
          edges={viewer.educations.edges}
        />
        <Tags
          formItemLayout={formItemLayout}
          getFieldDecorator={getFieldDecorator}
          label="职业"
          fieldName="jobs"
          showSearch={true}
          defaultValue={jobs ? jobs : undefined}
          message="人物职业不能为空"
          placeholder="请选择案例人物职业"
          edges={viewer.jobs.edges}
        />
        <AutoCompleteItem
          formItemLayout={formItemLayout}
          getFieldDecorator={getFieldDecorator}
          label="婚姻"
          fieldName="marriage"
          defaultValue={marriage}
          showSearch={true}
          message="人物婚姻状况不能为空"
          placeholder="请选择案例人物职业"
          edges={viewer.marriages.edges}
        />
        <Textarea
          onKeyUp={this.onKeyUp}
          label="子女"
          placeholder="子女信息(可以不填)"
          fieldName="children"
          defaultValue={children}
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
          onKeyUp={this.onKeyUp}
          label="命理知识备注"
          placeholder="请填写命理知识备注(可以不填)"
          fieldName="knowledge"
          defaultValue={knowledge}
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

export class WrappedEditForm extends React.PureComponent {
  props: {
    onValuesChange: (props: Object, values: Object) => void,
    node?: Object
  };
  render() {
    const { node } = this.props;
    return (
      <div>
        {React.createElement(
          Form.create({
            onValuesChange: (props, values) => {
              this.props.onValuesChange(props, values, node);
            }
          })(EditForm),
          { ...this.props }
        )}
      </div>
    );
  }
}

export default Relay.createContainer(WrappedEditForm, {
  fragments: {
    node: () => Relay.QL`
        fragment on Article {
          id,
          attachments,
          title,
          categories,
          name,
          education,
          gender,
          birthday,
          homePlace {
            province,
            city,
            area
          },
          jobs,
          marriage,
          children,
          events {
            edges {
              node {
                id,
                text,
                createdAt,
              }
            }
          },
          knowledge,
          notes {
            edges {
              node {
                id,
                text,
                createdAt,
              }
            }
          },
          createdAt,
          submit
        }
        `
  }
});
