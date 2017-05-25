// @flow

import React from "react";
import moment from "moment";
// import "moment/locale/zh-cn";
import { Link } from "react-router-dom";
import SectionTitle from "../SectionTitle";
import Relay from "react-relay";
import { Row, Col, Icon, Popconfirm, message } from "antd";
import styled from "styled-components";
import RelayLoading from "../RelayLoading";
import QueryRoute from "../../queryConfig";
import DraftMutation from "./mutation";

const styles = {
  draftBbox: {
    borderBottom: "1px dashed rgb(233, 233, 233)",
    padding: "10px 0"
  },
  tags: {
    marginRight: 3,
    marginLeft: 20
  },
  first_tag: {
    marginRight: 3
  }
};
const Title = styled.div`
    font-size: 14px;
    font-weight: 500;
`;
const Dot = styled.span`
    padding-left: 3px;
    padding-right: 3px;
`;
const Category = styled.div`
    font-size: 14px;
`;
const DeleteBnt = styled.a`
    padding-left: 10px;
`;
const EmptyBox = styled.div`
    display: flex;
    justify-content: center;
    padding: 30px;
    text-align: center;
`;
const Man = ["男", "Man", "male", "Male", "man", "男性", "先生", "爷们"];
const Woman = [
  "女",
  "Woman",
  "woman",
  "female",
  "Female",
  "女性",
  "小姐",
  "女士",
  "娘们"
];
class Drafts extends React.PureComponent {
  renderGender = edge => {
    const { gender } = edge.node;
    if (!gender) {
      return null;
    }
    let man = Man.indexOf(gender) !== -1;
    let woman = Woman.indexOf(gender) !== -1;
    return (
      <span>
        {woman && <Icon style={styles.tags} type="woman" />}
        {man && <Icon style={styles.tags} type="man" />}{gender}
      </span>
    );
  };
  renderHomeplace = edge => {
    var { homePlace } = edge.node;
    if (!homePlace) {
      return null;
    }
    return (
      <span>
        <Icon style={styles.tags} type="environment-o" />
        {homePlace.province}
        {homePlace.city}
        {homePlace.area}
      </span>
    );
  };
  delete = (articleId, index) => {
    return () => {
      this.props.relay.commitUpdate(
        new DraftMutation({
          viewer: this.props.viewer,
          order: index,
          id: articleId
        }),
        { onFailure: this.onFailure, onSuccess: this.onSuccess }
      );
    };
  };
  onFailure = (transaction: Relay.RelayMutationTransaction): void => {
    message.error("error !", 2);
  };
  onSuccess = (response: Object): void => {
    message.success("success !", 2);
  };
  render() {
    const { viewer: { articles: { edges } } } = this.props;
    // console.log(edges);
    return (
      <div>
        <SectionTitle icon="file-text" text="草稿" />
        <section className="filter-box">
          {edges.length === 0 &&
            <EmptyBox>
              暂无内容
            </EmptyBox>}
          {edges.map((edge, index) => (
            <Row key={edge.node.id} style={styles.draftBbox}>
              <Col span={24}>
                <Title>
                  <Link to={`/edit/${edge.node.id}/${Math.random()}`}>
                    {edge.node.name || "无姓名"}
                    <Dot>●</Dot>
                    {edge.node.title || "无标题"}
                  </Link>
                </Title>
                <Category>
                  <Icon type="clock-circle-o" style={styles.first_tag} />
                  {moment(edge.node.createdAt).fromNow()}
                  {this.renderGender(edge)}
                  {edge.node.categories &&
                    <Icon type="tags-o" style={styles.tags} />}
                  {edge.node.categories && edge.node.categories.join(",")}
                  {this.renderHomeplace(edge)}
                  <Popconfirm
                    title="你确定要删除该草稿吗？"
                    onConfirm={this.delete(edge.node.id, index)}
                    okText="是"
                    cancelText="否"
                  >
                    <DeleteBnt>
                      <Icon type="delete" style={styles.tags} />
                    </DeleteBnt>
                  </Popconfirm>
                </Category>
              </Col>
            </Row>
          ))}

        </section>
      </div>
    );
  }
}

var DraftsContainer = Relay.createContainer(Drafts, {
  initialVariables: {
    page: 1,
    pageSize: 50,
    sorters: [{ order: "createdAt", dir: "DESC" }],
    conditions: { submit: false },
    width: 78,
    height: 78,
    m: "m_pad",
    maxWidth: window.innerWidth > 800 ? 800 : window.innerWidth
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        ${DraftMutation.getFragment("viewer")}
        articles(page: $page, pageSize: $pageSize, sorters: $sorters, first: $pageSize, conditions: $conditions){
          totalInfo {
            total,
            totalPage,
            currentPage,
            pageSize,
          },
          edges {
            node{
              id,
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
              attachments,
              larges:attachments_maxw(width: $maxWidth),
              thumbs:attachments_wh(width: $width, height: $height, m: $m),
              marriage,
              children,
              knowledge,
              createdAt
            }
          }
        }
      }
    `
  }
});

export default (props: any) => (
  <RelayLoading route={new QueryRoute()} forceFetch={true}>
    <DraftsContainer {...props} />
  </RelayLoading>
);
