// @flow

import React, { Component, PropTypes } from "react";

import { Row, Col, Icon } from "antd";

export default class SectionTitle extends Component {
  render() {
    const {
      icon = "database",
      style = {},
      wrapStyle = {},
      text = "",
      left = null,
      saving = false
    } = this.props;
    return (
      <Row style={wrapStyle}>
        <Col span={3}>
          <span className="App-content-title">
            <Icon type={icon} style={{ ...style, ...{ marginRight: 5 } }} />
            {text}
          </span>
        </Col>
        <Col span={3}>
          {saving &&
            <Icon
              style={{ paddingTop: 4, fontSize: 14, paddingLeft: 20 }}
              type="loading"
            >
              <span style={{ paddingLeft: 5 }}>保存中...</span>
            </Icon>}

        </Col>
        <Col span={18}>
          {left}
        </Col>
      </Row>
    );
  }
}

SectionTitle.propTypes = {
  icon: PropTypes.string,
  style: PropTypes.object,
  wrapStyle: PropTypes.object,
  text: PropTypes.string,
  saving: PropTypes.bool
};
