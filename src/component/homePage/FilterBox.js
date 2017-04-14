// @flow
import React, { PureComponent, PropTypes } from "react";
import { Row, Col, Button } from "antd";
import Relay from "react-relay";
import { withRouter } from "react-router-dom";
import BirthPlace from "./filters/BirthPlace";
import MoreFilter from "./filters/MoreFilter";

import CategoryFilter from "./filters/Category";
import EducationFilter from "./filters/Education";
import JobFilter from "./filters/Job";

const styles = {
  filterEditIcon: {
    position: "absolute",
    right: 0,
    top: 0,
    zIndex: 9999,
    marginTop: -1,
    marginRight: -1,
    borderBottomRightRadius: 0,
    borderTopLeftRadius: 0
  }
};
class FilterBox extends PureComponent {
  goConfig = () => {
    this.props.history.push("/config");
  };
  render(props: any) {
    const { doSearch } = this.props;
    return (
      <section className="filter-box">
        <Button
          onClick={this.goConfig}
          type="dashed"
          style={styles.filterEditIcon}
        >
          编辑
        </Button>
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

module.exports = Relay.createContainer(withRouter(FilterBox), {
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
