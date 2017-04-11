// @flow
import React from "react";
import { Layout, Button, Menu } from "antd";
const { Header } = Layout;
const { Item } = Menu;
import { withRouter } from "react-router-dom";

import SearchBar from "./SearchBar";
import Masterinfo from "./Masterinfo";
import logoWorlds from "./logo.png";

class AppHeader extends React.Component {
  clickHandler: (path: string) => (e: ?Event) => void;
  menuHandler: (obj: Object) => void;
  constructor(props) {
    super(props);
    this.clickHandler = this.clickHandler.bind(this);
    this.menuHandler = this.menuHandler.bind(this);
  }
  clickHandler(path) {
    return e => {
      if (this.props.history.location.pathname !== path) {
        this.props.history.push(path);
      }
    };
  }
  menuHandler({ key }) {
    this.clickHandler(key)();
  }
  render() {
    return (
      <Header className="App-header-wrap">
        <div className="App-header">
          <div className="App-header-left">
            <img
              style={{ cursor: "pointer" }}
              alt="logo"
              src={logoWorlds}
              onClick={this.clickHandler("/")}
            />
            <Menu
              defaultSelectedKeys={["1"]}
              mode="horizontal"
              theme="dark"
              onClick={this.menuHandler}
              className="App-header-menu"
            >
              <Item key="/">首页</Item>
              <Item key="/feedback">反馈</Item>
            </Menu>
            <SearchBar />
            <Button
              type="primary"
              size="large"
              onClick={this.clickHandler("/edit/new")}
              className="add-article-bnt"
            >
              录入新案例
            </Button>
          </div>
          <div>
            <Masterinfo master={this.props.master} />
          </div>
        </div>
      </Header>
    );
  }
}

export default withRouter(AppHeader);
