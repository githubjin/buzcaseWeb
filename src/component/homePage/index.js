// @flow

import React from "react";
import Relay from "react-relay";
import _ from "lodash";
import styled from "styled-components";
import FilterBox from "./FilterBox";
import FilteredList from "./FilteredList";
import { Row, Col, Icon, message } from "antd";
import DicPoolRoute from "../../queryConfig";
import RelayLoading from "../RelayLoading";
import DelMutation from "./mutation";

const FilterBoxLoading = styled.div`
  width: 960px;
  height: 416px;
`;
class HomePage extends React.PureComponent {
  goPage: (page: number, pageSize: number) => void;
  state: {
    page: number,
    pageSize: number
  };
  constructor(props: any) {
    super(props);
    this.goPage = this.goPage.bind(this);
    this.state = {
      page: 1,
      pageSize: 10
    };
  }
  goPage(page: number, pageSize: number): void {
    const { variables, setVariables } = this.props.relay;
    setVariables({
      ...variables,
      page,
      pageSize
    });
    window.scrollTo(0, 0);
  }
  doSearch(conditions: Object): void {
    if (_.isEmpty(conditions)) {
      return;
    }
    const { variables, setVariables } = this.props.relay;
    // console.log(variables, conditions);
    setVariables({
      ...variables,
      conditions: { ...variables.conditions, ...conditions },
      page: 1
    });
  }
  onFailure = (transaction: Relay.RelayMutationTransaction): void => {
    message.error("案例未删除成功！", 2);
  };
  onSuccess = (response: Object): void => {
    // console.log(response);
    let { ArticleDeleteMutation: { error } = {} } = response;
    if (!error) {
      const { forceFetch, variables } = this.props.relay;
      forceFetch(variables);
      message.success("案例已删除", 2);
    } else {
      message.error("案例未删除成功！", 2);
    }
  };
  deleteArticle = (id: string): any => {
    return () => {
      // console.log("this.props", this.props);
      this.props.relay.commitUpdate(
        new DelMutation({
          articleId: id,
          viewer: this.props.viewer
          // userId: this.props.viewer.id
        }),
        {
          onFailure: this.onFailure,
          onSuccess: this.onSuccess
        }
      );
    };
  };
  render() {
    const { viewer } = this.props;
    return (
      <div>
        <Row>
          <Col span={24}>
            <span className="App-content-title">
              <Icon type="filter" style={{ marginRight: 5 }} />查询条件
            </span>
          </Col>
        </Row>
        <RelayLoading
          route={new DicPoolRoute()}
          loadingElement={FilterBoxLoading}
        >
          <FilterBox doSearch={this.doSearch.bind(this)} />
        </RelayLoading>
        <Row>
          <Col span={24}>
            <span className="App-content-title">
              <Icon type="database" style={{ marginRight: 5 }} />案例列表
            </span>
          </Col>
        </Row>
        <FilteredList
          deleteArticle={this.deleteArticle}
          goPage={this.goPage.bind(this)}
          viewer={viewer}
        />
      </div>
    );
  }
}

const Container = Relay.createContainer(HomePage, {
  initialVariables: {
    page: 1,
    pageSize: 10,
    sorters: [{ order: "createdAt", dir: "DESC" }],
    conditions: {},
    width: window.innerWidth > 800 ? 800 : window.innerWidth,
    eventFirst: 1
  },
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        id,
        ${DelMutation.getFragment("viewer")}
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
              attachments_inline,
              submit,
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
              events(first: $eventFirst) {
                edges {
                  node {
                    id,
                    text,
                    createdAt,
                  }
                }
              },
              knowledge,
              createdAt
            }
          }
        }
      }
    `
  }
});

module.exports = (props: any) => (
  <RelayLoading route={new DicPoolRoute()} forceFetch={true}>
    <Container {...props} />
  </RelayLoading>
);
