// @flow
import React from "react";
import { Icon, Menu, Dropdown } from "antd";
import Relay from "react-relay";
import { withRouter } from "react-router-dom";
// import styled from "styled-components";
import _ from "lodash";
import { logout, getUser } from "../../util";

// const UserBox = styled.div`

// `;
class Masterinfo extends React.PureComponent {
  state: { viewer: Object };
  getUserInfoFromLocal: () => void;
  getMaster: () => Object;
  constructor(props) {
    super(props);
    this.state = {
      viewer: {}
    };
    this.getUserInfoFromLocal = this.getUserInfoFromLocal.bind(this);
    this.getMaster = this.getMaster.bind(this);
  }
  getUserInfoFromLocal() {
    var user = getUser();
    if (!_.isEmpty(user)) {
      var viewer = JSON.parse(user);
      this.setState({ viewer });
    }
  }
  componentDidMount() {
    if (_.isEmpty(this.props.viewer) || _.isEmpty(this.props.viewer.username)) {
      this.getUserInfoFromLocal();
    }
  }
  getMaster() {
    if (_.isEmpty(this.props.viewer) || _.isEmpty(this.props.viewer.username)) {
      return this.state.viewer;
    }
    return this.props.viewer;
  }
  _logout = () => {
    logout(() => this.props.history.push("/signin"));
  };
  handleMenuClick = e => {
    if (e.key === "2") {
      this._logout();
    }
    if (e.key === "1") {
      this.props.history.push("/drafts");
    }
  };
  render() {
    const menu = (
      <Menu onClick={this.handleMenuClick}>
        <Menu.Item key="1">
          草稿
        </Menu.Item>
        <Menu.Item key="2">
          退出
        </Menu.Item>
      </Menu>
    );
    const viewer = this.getMaster();
    return (
      <Dropdown overlay={menu} trigger={["click"]}>
        <a className="ant-dropdown-link">
          你好，{viewer.username} <Icon type="down" />
        </a>
      </Dropdown>
    );
  }
}

module.exports = Relay.createContainer(withRouter(Masterinfo), {
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        id,
        username,
        email,
        sessionToken,
        emailVerified
      }
    `
  }
});
