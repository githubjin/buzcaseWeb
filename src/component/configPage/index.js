// @flow

import React from "react";
import styled from "styled-components";
import Relay from "react-relay";
import { message } from "antd";
import SectionTitle from "../SectionTitle";
import RelayLoading from "../RelayLoading";
import QueryRoute from "../../queryConfig";
import Category from "./Category";
import DictionaryMutation from "./mutation";

const Box = styled.section`
    border: 1px dashed rgb(233, 233, 233);
    position: relative;
    min-height: 70px;
    margin-top: 20px;
`;
const BoxTitle = styled.div`
    color: #777;
    position: absolute;
    top: -18px;
    background: #fff;
    left: 10px;
`;
const BoxTitleText = styled.a`
    color: rgba(0,0,0,.65);
    font-size: 14px;
    font-weight: 500;
`;

class ConfigPage extends React.PureComponent {
  add = (type: string, name: string, order: number): void => {
    this.props.relay.commitUpdate(
      new DictionaryMutation({ master: this.props.master, type, name, order }),
      { onFailure: this.onFailure, onSuccess: this.onSuccess }
    );
  };
  deleteTag = (type: string, nodeId: string): void => {
    this.props.relay.commitUpdate(
      new DictionaryMutation({ master: this.props.master, type, id: nodeId }),
      { onFailure: this.onFailure, onSuccess: this.onSuccess }
    );
  };
  onFailure = (transaction: Relay.RelayMutationTransaction): void => {
    // console.log(transaction.getError());
    message.success("error !", 2);
  };
  onSuccess = (response: Object): void => {
    // console.log(response);
    message.success("success !", 2);
  };
  render() {
    console.log(this.props);
    const {
      master: { categories, educations, jobs, genders, marriages }
    } = this.props;
    return (
      <div>
        <SectionTitle icon="edit" text="基础数据配置" />
        <section className="filter-box">
          <Box>
            <BoxTitle>
              <BoxTitleText>案例类别</BoxTitleText>
            </BoxTitle>
            <Category
              add={this.add}
              deleteTag={this.deleteTag}
              type="Category"
              datasource={categories.edges}
            />
          </Box>
          <Box>
            <BoxTitle>
              <BoxTitleText>学历</BoxTitleText>
            </BoxTitle>
            <Category
              add={this.add}
              deleteTag={this.deleteTag}
              type="Education"
              datasource={educations.edges}
            />
          </Box>
          <Box>
            <BoxTitle>
              <BoxTitleText>职业</BoxTitleText>
            </BoxTitle>
            <Category
              add={this.add}
              deleteTag={this.deleteTag}
              type="Job"
              datasource={jobs.edges}
            />
          </Box>
          <Box>
            <BoxTitle>
              <BoxTitleText>婚姻状况</BoxTitleText>
            </BoxTitle>
            <Category
              add={this.add}
              deleteTag={this.deleteTag}
              type="Marriage"
              datasource={marriages.edges}
            />
          </Box>
          <Box>
            <BoxTitle>
              <BoxTitleText>性别</BoxTitleText>
            </BoxTitle>
            <Category
              add={this.add}
              deleteTag={this.deleteTag}
              type="Gender"
              datasource={genders.edges}
            />
          </Box>
        </section>
      </div>
    );
  }
}

export var ConfigPageContainer = Relay.createContainer(ConfigPage, {
  fragments: {
    master: () => Relay.QL`
      fragment on MasterType {
        ${DictionaryMutation.getFragment("master")}
        jobs:dic(code: "Job", first: 99999) {
          edges {
            node {
              id
              name
              order
            }
          }
        },
        categories:dic(code: "Category", first: 99999) {
          edges {
            node {
              id
              name
              order
            }
          }
        },
        educations:dic(code: "Education", first: 99999) {
          edges {
            node {
              id
              name
              order
            }
          }
        },
        genders:dic(code: "Gender", first: 99999) {
          edges {
            node {
              id
              name
              order
            }
          }
        },
        marriages:dic(code: "Marriage", first: 99999) {
          edges {
            node {
              id
              name
              order
            }
          }
        }
      }
    `
  }
});

export default (props: any) => (
  <RelayLoading route={new QueryRoute()}>
    <ConfigPageContainer {...props} />
  </RelayLoading>
);
