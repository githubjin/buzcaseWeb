// @flow
import React, { Component } from "react";
import {
  Form,
  Button,
  Input,
  Radio,
  Table,
  Icon,
  Modal,
  Spin,
  message
} from "antd";
const FormItem = Form.Item;
import _ from "lodash";
import Relay from "react-relay";
import moment from "moment";
// import "moment/locale/zh-cn";

import SectionTitle from "../SectionTitle";
import AddFeedbackMutation from "./FeedbackMutation";
import DicPoolRoute from "../../queryConfig";
import RelayLoading from "../RelayLoading";

const columns = [
  {
    title: "内容",
    dataIndex: "content",
    key: "content"
  },
  {
    title: "时间",
    dataIndex: "createAt",
    key: "createAt"
  },
  {
    title: "用户",
    dataIndex: "user",
    key: "user"
  }
];

class Feedback extends Component {
  state: {
    visible: boolean,
    saving: boolean
  };
  onCancel: () => void;
  onCreate: () => (e: any) => void;
  showModal: () => void;
  onChange: (pagination: Object, filters: Object, sorter: Object) => void;
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      saving: false
    };
    this.onCancel = this.onCancel.bind(this);
    this.onCreate = this.onCreate.bind(this);
    this.showModal = this.showModal.bind(this);
  }
  onCancel() {
    this.setState({ visible: false });
  }
  onCreate() {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // console.log("Received values of form: ", values);
        // console.log(this.props.viewer);
        this.setState({ saving: true });
        this.props.relay.commitUpdate(
          new AddFeedbackMutation({
            ...values,
            total: this.props.viewer.feedbacks.totalInfo.total,
            viewer: this.props.viewer
          }),
          {
            onFailure: this.onFailure.bind(this),
            onSuccess: this.onSuccess.bind(this)
          }
        );
      }
    });
  }
  onSuccess = () => {
    this.setState({
      saving: false,
      visible: false
    });
  };
  onFailure = transaction => {
    // var error = transaction.getError() || new Error("Mutation failed.");
    message.error("内容保存异常，请确保内容不要过长！", 10);
    this.setState({
      saving: false
    });
  };
  onChange(pagination: Object, filters: Object, sorter: Object): void {
    // console.log(pagination);
    let { pageSize, current } = pagination;
    const { variables, setVariables } = this.props.relay;
    setVariables({
      ...variables,
      page: current,
      pageSize
    });
    window.scrollTo(0, 0);
  }
  showModal() {
    this.setState({ visible: true });
  }
  dataFormat(edges: Object[]): Object[] {
    if (_.isEmpty(edges)) {
      return [];
    }
    return edges.map(edge => {
      return {
        key: edge.node.id,
        user: edge.node.username,
        createAt: moment(edge.node.createdAt).format("L"),
        content: _.truncate(edge.node.text, { length: 50 }),
        fullContent: edge.node.text
      };
    });
  }
  render() {
    const { viewer: { feedbacks: { edges, totalInfo } } } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { visible } = this.state;
    // console.log(this.props);
    return (
      <div>
        <SectionTitle
          icon="message"
          text="意见反馈"
          left={
            <div style={{ textAlign: "right", fontSize: 14 }}>
              <Button type="dashed" size="small" onClick={this.showModal}>
                <Icon type="edit" />新建反馈
              </Button>
            </div>
          }
        />
        <Table
          onChange={this.onChange.bind(this)}
          dataSource={this.dataFormat(edges)}
          className="feedbackTable"
          pagination={{
            pageSize: totalInfo.pageSize,
            current: totalInfo.currentPage,
            total: totalInfo.total
          }}
          expandedRowRender={record => <p>{record.fullContent}</p>}
          columns={columns}
          style={{ paddingTop: 10 }}
        />
        <Modal
          className="feedbackModal"
          width={960}
          visible={visible}
          title="请留下您宝贵的意见，促进我们的改进"
          okText="保存"
          onCancel={this.onCancel}
          onOk={this.onCreate}
        >
          <Spin spinning={this.state.saving} tip="保存中...">
            <Form layout="vertical">
              <FormItem>
                {getFieldDecorator("text", {
                  rules: [{ required: true, message: "请输入您的反馈内容！" }]
                })(
                  <Input
                    type="textarea"
                    autosize={{ minRows: 5, maxRows: 10 }}
                  />
                )}
              </FormItem>
              <FormItem className="collection-create-form_last-form-item">
                {getFieldDecorator("isPublic", {
                  initialValue: "1"
                })(
                  <Radio.Group>
                    <Radio value="1" style={{ fontSize: 14 }}>公开</Radio>
                    <Radio value="0" style={{ fontSize: 14 }}>私信</Radio>
                  </Radio.Group>
                )}
              </FormItem>
            </Form>
          </Spin>
        </Modal>
      </div>
    );
  }
}

const Container = Relay.createContainer(Form.create()(Feedback), {
  initialVariables: {
    page: 1,
    pageSize: 20,
    sorters: [{ order: "createdAt", dir: "DESC" }]
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on User{
        ${AddFeedbackMutation.getFragment("viewer")}
        feedbacks(page: $page, pageSize: $pageSize, sorters: $sorters, first: $pageSize){
          totalInfo{
            pageSize
            total
            totalPage
            currentPage
          }
          edges{
            node{
              id
              isPublic
              text
              createdAt
              username
            }
          }
        }
      }
    `
  }
});

module.exports = (props: any) => (
  <RelayLoading route={new DicPoolRoute()}>
    <Container {...props} />
  </RelayLoading>
);
