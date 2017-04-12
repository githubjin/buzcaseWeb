// @flow
import React, { PureComponent, PropTypes } from "react";
import { Row, Col } from "antd";
import Relay from "react-relay";
import BirthPlace from "./filters/BirthPlace";
import MoreFilter from "./filters/MoreFilter";

import CategoryFilter from "./filters/Category";
import EducationFilter from "./filters/Education";
import JobFilter from "./filters/Job";

class FilterBox extends PureComponent {
  render(props: any) {
    const { doSearch } = this.props;
    return (
      <section className="filter-box">
        <CategoryFilter
          master={this.props.master}
          dicCode={"Category"}
          fieldName="categories"
          doSearch={doSearch}
          title="类别："
        />
        <EducationFilter
          master={this.props.master}
          dicCode={"Education"}
          fieldName="education"
          doSearch={doSearch}
          title="学历："
          multiselect={false}
        />
        <JobFilter
          master={this.props.master}
          dicCode={"Job"}
          fieldName="jobs"
          doSearch={doSearch}
          title="职业："
        />
        <Row>
          <Col span={2}>
            <span>出生地点：</span>
          </Col>
          <Col span={22}>
            <BirthPlace master={this.props.master} doSearch={doSearch} />
          </Col>
        </Row>
        <Row>
          <Col span={2}>
            <span>更多：</span>
          </Col>
          <Col span={22}>
            <MoreFilter master={this.props.master} doSearch={doSearch} />
          </Col>
        </Row>
      </section>
    );
  }
}

FilterBox.propTypes = {
  doSearch: PropTypes.func.isRequired
};

module.exports = Relay.createContainer(FilterBox, {
  fragments: {
    master: () => Relay.QL`
      fragment on MasterType {
        ${BirthPlace.getFragment("master")}
        ${EducationFilter.getFragment("master")}
        ${CategoryFilter.getFragment("master")}
        ${JobFilter.getFragment("master")}
        ${MoreFilter.getFragment("master")}
      }
    `
  }
});
