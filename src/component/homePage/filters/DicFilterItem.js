// @flow

import React, { PureComponent, PropTypes } from "react";
import { Row, Col } from "antd";
import _ from "lodash";

export default class DicFilterItem extends PureComponent {
  state: {
    selected: Object[],
    allKey: string
  };
  filter: (node: Object) => (e: Object) => {};
  removeFilter: (edge: Object) => (e: Object) => {};
  renderItem: (node: Object) => any;
  doSearch: () => void;
  constructor(props: any) {
    super(props);
    this.state = {
      selected: [],
      allKey: ""
    };
    this.filter = this.filter.bind(this);
    this.renderItem = this.renderItem.bind(this);
    this.doSearch = this.doSearch.bind(this);
  }
  doSearch(selected: any) {
    const { fieldName, doSearch: doFilter } = this.props;
    let values = _.map(_.filter(selected, o => o.order > 0), edge => edge.name);
    let filter = {};
    filter[fieldName] = values;
    doFilter(filter);
  }
  removeFilter(edge: any) {
    const { id, order } = edge;
    return (e: any) => {
      if (order !== 0) {
        let { selected } = this.state;
        let finArr = selected.filter(item => item.id !== id);
        this.doSearch(finArr);
        this.setState({
          selected: finArr
        });
      }
    };
  }
  filter(edge: any) {
    const { id, order } = edge;
    return (e: any) => {
      const { multiselect = true } = this.props;
      let { allKey, selected } = this.state;
      if (order === 0) {
        if (allKey.length === 0) {
          allKey = id;
        }
        this.doSearch([edge]);
        this.setState({
          selected: [edge],
          allKey
        });
      } else {
        if (multiselect) {
          let newArr = selected.filter(item => item.id !== allKey);
          newArr.push(edge);
          this.doSearch(newArr);
          this.setState({
            selected: newArr
          });
        } else {
          this.doSearch([edge]);
          this.setState({
            selected: [edge]
          });
        }
      }
    };
  }
  renderItem(node: any, index: any) {
    let { selected } = this.state;
    if (
      _.findIndex(selected, o => o.id === node.id) !== -1 ||
      (index === 0 && selected.length === 0)
    ) {
      return (
        <span onClick={this.removeFilter(node)} className="filter-selected">
          {node.name}
        </span>
      );
    } else {
      return <a onClick={this.filter(node)}>{node.name}</a>;
    }
  }
  render() {
    // const { viewer: { dic: dict }, title } = this.props;
    const viewer = this.props.viewer || {};
    const dict = viewer.dic || {};
    const edges = dict.edges || [];
    const title = this.props.title;
    // console.log("--------------------------", this.props);
    return (
      <Row>
        <Col span={2}>
          <span>{title}</span>
        </Col>
        <Col span={22}>
          <Row>
            {edges.map((edge, index) => (
              <Col span={2} key={edge.node.id}>
                {this.renderItem(edge.node, index)}
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    );
  }
}

DicFilterItem.propTypes = {
  title: PropTypes.string.isRequired,
  multiselect: PropTypes.bool,
  fieldName: PropTypes.string.isRequired
};
