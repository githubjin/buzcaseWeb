import React, { Component, PropTypes } from 'react';

import { Row, Col } from 'antd';

export default class RowX extends Component {
  render() {
    const { style={}, span=24, children } = this.props;
    return (
      <Row style={style}>
        <Col span={span}>
          {children}
        </Col>
      </Row>
    );
  }
}

RowX.propTypes = {
  span: PropTypes.number,
  style: PropTypes.object,
}
