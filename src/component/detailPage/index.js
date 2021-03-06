// @flow

import React, { Component } from "react";
import { Icon, message } from "antd";
import { withRouter, Link } from "react-router-dom";
import Relay from "react-relay";
import SectionTitle from "../SectionTitle";
import NoteMutation from "./mutation";
import RelayLoading from "../RelayLoading";
import NodeQueryConfig from "../../queryConfig/NodeQueryConfig";
import { DetailContainer } from "../ArticleDetail";
import NoteForm from "./NoteForm";
import styled from "styled-components";

const Empty = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 0 auto;
`;
const EmptyTitle = styled.p`
    margin-top: 20px;
    font-size: 15px;
    font-weight: 500;
`;
const EmptyBack = styled.p`
    font-size: 15px;
    margin-top: 20px;
`;

const styles = {
  icon: {
    padding: "0 3px 0 9px"
  }
};
class DetailPage extends Component {
  back: () => void;
  clearTextarea: any;
  constructor(props) {
    super(props);
    this.back = this.back.bind(this);
    this.clearTextarea = null;
  }
  componentDidMount() {
    window.scrollTo(0, 0);
  }
  back() {
    this.props.history.goBack();
  }
  onFailure = (transaction: Relay.RelayMutationTransaction): void => {
    message.error("error !", 2);
    if (this.clearTextarea) {
      // this.clearTextarea();
      this.clearTextarea = null;
    }
  };
  onSuccess = (response: Object): void => {
    message.success("success !", 2);
    if (this.clearTextarea) {
      this.clearTextarea();
      this.clearTextarea = null;
    }
  };
  doMutation = (input: Object): void => {
    this.props.relay.commitUpdate(new NoteMutation(input), {
      onFailure: this.onFailure,
      onSuccess: this.onSuccess
    });
  };
  handleSubmit = (values, callback) => {
    this.doMutation({
      text: values.text,
      node: this.props.node
    });
    this.clearTextarea = callback;
  };
  removeNote = (noteId: string): any => {
    return () => {
      this.doMutation({
        noteId,
        node: this.props.node
      });
    };
  };
  render() {
    // console.log("------------------id--------------", 9090);
    if (!this.props.node) {
      return <EmptyDetail />;
    }
    const { node: { id } } = this.props;
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
              <Link to={`/edit/${id}/${Math.random()}`} className="meta-item">
                <Icon style={styles.icon} type="edit" />编辑
              </Link>
            </div>
          }
        />
        <section className="filter-box">
          <DetailContainer
            removeNote={this.removeNote}
            node={this.props.node}
            showAll={true}
          />
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
            <NoteForm handleSubmit={this.handleSubmit} />
          </div>
        </section>
      </div>
    );
  }
}

class EmptyDetail extends React.PureComponent {
  render() {
    return (
      <Empty>
        <EmptyTitle>该案例已经不存在</EmptyTitle>
        <EmptyBack><Link to="/">返回首页</Link></EmptyBack>
      </Empty>
    );
  }
}

const Container = Relay.createContainer(withRouter(DetailPage), {
  initialVariables: {
    width: window.innerWidth > 800 ? 800 : window.innerWidth
  },
  fragments: {
    node: () => Relay.QL`
        fragment on Article {
          id,
          attachments_h300,
          attachments_maxw(width: $width),
          ${NoteMutation.getFragment("node")}
          ${DetailContainer.getFragment("node")}
        }
      `
  }
});

class DetailPageContainer extends Component {
  render() {
    let { match: { params: { id } } } = this.props;
    if (!id) {
      id = this.props.id;
    }
    return (
      <RelayLoading route={new NodeQueryConfig({ id })}>
        <Container />
      </RelayLoading>
    );
  }
}

export default DetailPageContainer;
