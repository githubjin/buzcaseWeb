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
  state: { master: Object };
  getUserInfoFromLocal: () => void;
  getMaster: () => Object;
  constructor(props) {
    super(props);
    this.state = {
      master: {}
    };
    this.getUserInfoFromLocal = this.getUserInfoFromLocal.bind(this);
    this.getMaster = this.getMaster.bind(this);
  }
  getUserInfoFromLocal() {
    var user = getUser();
    if (!_.isEmpty(user)) {
      var master = JSON.parse(user);
      this.setState({ master });
    }
  }
  componentDidMount() {
    if (_.isEmpty(this.props.master.username)) {
      this.getUserInfoFromLocal();
    }
  }
  getMaster() {
    if (_.isEmpty(this.props.master.username)) {
      return this.state.master;
    }
    return this.props.master;
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
    const master = this.getMaster();
    return (
      <Dropdown overlay={menu} trigger={["click"]}>
        <a className="ant-dropdown-link">
          你好，{master.username} <Icon type="down" />
        </a>
      </Dropdown>
    );
  }
}

module.exports = Relay.createContainer(withRouter(Masterinfo), {
  fragments: {
    master: () => Relay.QL`
      fragment on MasterType {
        id,
        username,
        sessionToken,
        emailVerified
      }
    `
  }
});
