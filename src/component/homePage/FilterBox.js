// @flow
import React, { PureComponent, PropTypes } from "react";
import { Row, Col, Icon } from "antd";
import BirthPlace from "../filters/BirthPlace";
import MoreFilter from "../filters/MoreFilter";

import CategoryFilter from "../filters/Category";
import EducationFilter from "../filters/Education";
import JobFilter from "../filters/Job";

import RouteConfig from "../../queryConfig";

export default class FilterBox extends PureComponent {
  state: {
    provinceId: string,
    cityId: string
  };
  constructor(props: any) {
    super(props);
    this.state = {
      provinceId: "UXV5dTpCdEJNNGpVM0Yy",
      cityId: "UXV5dTo0R3FxVkZYamJ2"
    };
  }
  loadCityOrArea(
    { provinceId, cityId }: { provinceId: string, cityId: string }
  ) {
    console.log(provinceId, cityId);
    this.setState({ provinceId, cityId });
  }
  render(props: any) {
    const { provinceId, cityId } = this.state;
    const { doSearch } = this.props;
    return (
      <div>
        <Row>
          <Col span={24}>
            <span className="App-content-title">
              <Icon type="filter" style={{ marginRight: 5 }} />查询条件
            </span>
          </Col>
        </Row>
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
              <BirthPlace
                master={this.props.master}
                doSearch={doSearch}
                loadCA={this.loadCityOrArea.bind(this)}
              />
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
      </div>
    );
  }
}

FilterBox.propTypes = {
  doSearch: PropTypes.func.isRequired
};
