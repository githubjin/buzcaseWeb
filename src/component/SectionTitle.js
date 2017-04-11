import React, { Component, PropTypes } from 'react';

import { Row, Col, Icon } from 'antd';

export default class SectionTitle extends Component {
  render() {
    const { icon="database", style={}, wrapStyle={}, text="", left=null } = this.props;
    return (
      <Row style={wrapStyle}>
        <Col span={3}>
          <span className="App-content-title">
            <Icon type={icon} style={{...style, ...{marginRight: 5}}}/>
            { text }
          </span>
        </Col>
        <Col span={21}>
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
}
