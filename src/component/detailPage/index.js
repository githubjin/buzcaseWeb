// @flow

import React, { Component } from "react";
import { Button, Icon, Form, Input } from "antd";
import { withRouter } from "react-router-dom";
const FormItem = Form.Item;
import SectionTitle from "../SectionTitle";
import { ArticleDetailContainer } from "../ArticleDetail";

const styles = {
  icon: {
    padding: "0 3px 0 9px"
  }
};
class DetailPage extends Component {
  back: () => void;
  constructor(props) {
    super(props);
    this.back = this.back.bind(this);
  }
  componentDidMount() {
    window.scrollTo(0, 0);
  }
  back() {
    this.props.history.goBack();
  }
  render() {
    const { match: { params: { id } } } = this.props;
    return (
      <div>
        <SectionTitle
          icon="exception"
          text="案例详细信息"
          left={
            <div style={{ textAlign: "right", paddingTop: 3, fontSize: 13 }}>
              <a onClick={this.back} className="meta-item">
                <Icon style={styles.icon} type="rollback" />返回
              </a>
              <a className="meta-item">
                <Icon style={styles.icon} type="edit" />编辑
              </a>
              <a className="meta-item">
                <Icon style={styles.icon} type="delete" />删除
              </a>
            </div>
          }
        />
        <ArticleDetailContainer id={id} />
        <SectionTitle
          icon="link"
          text="追加备注"
          wrapStyle={{
            paddingTop: 10,
            marginBottom: 10,
            marginTop: 20,
            borderTop: "1px solid #e9e9e9"
          }}
        />
        <div>
          <Form layout="vertical">
            <FormItem>
              <Input type="textarea" />
            </FormItem>
            <FormItem style={{ textAlign: "right" }}>
              <Button type="primary">保存</Button>
            </FormItem>
          </Form>
        </div>
      </div>
    );
  }
}

export default withRouter(DetailPage);