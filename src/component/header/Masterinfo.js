// @flow
import React from "react";
import { Menu, Dropdown, Icon } from "antd";
import Relay from "react-relay";
import { buzcaseUserKey } from "../../env";
import _ from "lodash";

const menu = (
  <Menu>
    <Menu.Item>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="http://www.alipay.com/"
      >
        设置
      </a>
    </Menu.Item>
    <Menu.Item>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="http://www.taobao.com/"
      >
        退出
      </a>
    </Menu.Item>
  </Menu>
);

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
    var user = window.localStorage.getItem(buzcaseUserKey);
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
  render() {
    // console.log("UserInfo props are : ", this.props);
    const master = this.getMaster();
    return (
      <Dropdown overlay={menu} placement="bottomCenter">
        <a className="ant-dropdown-link" href="#">
          <Icon type="user" /> {master.username}
        </a>
      </Dropdown>
    );
  }
}

module.exports = Relay.createContainer(Masterinfo, {
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
