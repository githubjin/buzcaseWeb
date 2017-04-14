// @flow

import React from "react";
import Relay from "react-relay";
import _ from "lodash";
import styled from "styled-components";
import FilterBox from "./FilterBox";
import FilteredList from "./FilteredList";
import { Row, Col, Icon } from "antd";
import DicPoolRoute from "../../queryConfig";
import RelayLoading from "../RelayLoading";

const FilterBoxLoading = styled.div`
  width: 960px;
  height: 416px;
`;
class HomePage extends React.Component {
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
  render() {
    const { master: { articles } } = this.props;
    // console.log(articles);
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
        <FilteredList goPage={this.goPage.bind(this)} articles={articles} />
      </div>
    );
  }
}

const Container = Relay.createContainer(HomePage, {
  initialVariables: {
    page: 1,
    pageSize: 10,
    sorters: [{ order: "createdAt", dir: "DESC" }],
    conditions: {}
  },
  fragments: {
    master: () => Relay.QL`
      fragment on MasterType {
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
              attachments,
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
