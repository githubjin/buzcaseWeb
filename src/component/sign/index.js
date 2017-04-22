// @flow
import React, { PureComponent } from "react";
import { Link, Route } from "react-router-dom";
import { Menu } from "antd";
import styled from "styled-components";
import SignUpPanel from "./SignUpPanel";
import SignInPanel from "./SignInPanel";
import logo_big from "../../images/logo_big.png";
import Relay from "react-relay";
import SignUpMutation from "./mutations/SignUpMutation";
import SignInMutation from "./mutations/SignInMutation";
import alertError from "../alertError";
import { setToken } from "../../initRelayNetworkLayer";
import { withRouter } from "react-router-dom";

const Wraper = styled.div`
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 100%;
    `;
const H2 = styled.h2`
      margin: 30px 0 20px;
      font-weight: 400;
      font-size: 18px;
      line-height: 1;
    `;
const FormWraper = styled.div`
      padding-top: 20px;
      min-height: 350px;
    `;

class SignPage extends PureComponent {
  state: { current: string };
  constructor(props) {
    super(props);
    this.state = {
      current: "/signup"
    };
  }
  onSuccess(res) {
    var sign = res.signUp || res.signIn;
    var { error, viewer } = sign;
    if (!error) {
      setToken(viewer, () => {
        // console.log("withRoute is ok ? ", this.props);
        this.props.history.push("/");
      });
    } else {
      alertError(error);
    }
  }
  onFailure(transaction) {
    alertError(transaction.getError());
  }
  handleSubmit(values, isSignUp) {
    var _Mutation = isSignUp ? SignUpMutation : SignInMutation;
    Relay.Store.commitUpdate(
      new _Mutation({ ...values, viewer: this.props.viewer }),
      {
        onFailure: this.onFailure.bind(this),
        onSuccess: this.onSuccess.bind(this)
      }
    );
  }
  render() {
    console.log(this.props.viewer);
    const { pathname } = this.props.location;
    return (
      <Wraper id="signtab">
        <img style={{ width: 300 }} src={logo_big} alt="八字命理案例库" />
        <H2>积累回顾你的案例、知识、经验和见解</H2>
        <Menu
          style={{ fontSize: 18, opacity: 0.7 }}
          selectedKeys={[pathname]}
          mode="horizontal"
        >
          <Menu.Item key="/signup">
            <Link to="/signup">注册</Link>
          </Menu.Item>
          <Menu.Item key="/signin">
            <Link to="/signin">登录</Link>
          </Menu.Item>
        </Menu>
        <FormWraper>
          <Route
            path="/signup"
            render={props => (
              <SignUpPanel
                handleSubmit={this.handleSubmit.bind(this)}
                {...props}
                viewer={this.props.viewer}
              />
            )}
          />
          <Route
            path="/signin"
            render={props => (
              <SignInPanel
                handleSubmit={this.handleSubmit.bind(this)}
                {...props}
                viewer={this.props.viewer}
              />
            )}
          />
        </FormWraper>
      </Wraper>
    );
  }
}

module.exports = Relay.createContainer(withRouter(SignPage), {
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        id
        ${SignUpMutation.getFragment("viewer")}
      }
    `
  }
});
