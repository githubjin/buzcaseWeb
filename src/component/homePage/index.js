// @flow

import React from "react";
import Relay from "react-relay";
import _ from "lodash";
import FilterBox from "./FilterBox";
import FilteredList from "./FilteredList";
import CategoryFilter from "../filters/Category";
import EducationFilter from "../filters/Education";
import JobFilter from "../filters/Job";
import BirthPlace from "../filters/BirthPlace";
import Marriage from "../filters/Marriage";
import Gender from "../filters/Gender";

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
        <FilterBox
          master={this.props.master}
          doSearch={this.doSearch.bind(this)}
        />
        <FilteredList
          master={this.props.master}
          goPage={this.goPage.bind(this)}
          articles={articles}
        />
      </div>
    );
  }
}

module.exports = Relay.createContainer(HomePage, {
  initialVariables: {
    page: 1,
    pageSize: 10,
    sorters: [{ order: "createdAt", dir: "DESC" }],
    conditions: {}
  },
  fragments: {
    master: () => Relay.QL`
      fragment on MasterType {
        ${EducationFilter.getFragment("master")}
        ${CategoryFilter.getFragment("master")}
        ${JobFilter.getFragment("master")}
        ${BirthPlace.getFragment("master")}
        ${Gender.getFragment("master")}
        ${Marriage.getFragment("master")}
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
                text,
                createdAt,
              },
              knowledge,
              notes {
                text,
                createdAt,
              },
              createdAt
            }
          }
        }
      }
    `
  }
});
