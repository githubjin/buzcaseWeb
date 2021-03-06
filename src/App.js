// @flow

import React, { PureComponent } from "react";
import "./App.css";
import { Layout, BackTop } from "antd";
const { Content, Footer } = Layout;
import Header from "./component/header";
import Relay from "react-relay";

import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";
import PrivateRoute from "./routes/PrivateRoute";
import SignPage from "./component/sign";

import HomePage from "./component/homePage";
import Masterinfo from "./component/header/Masterinfo";
import AddPage from "./component/editPage";
import ConfigPage from "./component/configPage";
import Feedback from "./component/feedback";
import DetailPage from "./component/detailPage";
import DraftsPage from "./component/drafts";

// import asyncComponent from "./component/asyncComponent";
// const Feedback = asyncComponent(
//   () => System.import("./component/feedback").then(module => module.default),
//   { name: "Feedback" }
// );

class App extends PureComponent {
  render() {
    return (
      <Router>
        <Switch>
          <Route
            path="/signin"
            render={props => <SignPage viewer={this.props.viewer} {...props} />}
          />
          <Route
            path="/signup"
            render={props => <SignPage viewer={this.props.viewer} {...props} />}
          />
          <Route
            path="/"
            render={() => (
              <Layout style={{ minWidth: 960 }}>
                <Header viewer={this.props.viewer} />
                <Content
                  className="App-content-wrap"
                  style={{ background: "#fff" }}
                >
                  <div className="App-content">
                    <PrivateRoute exact path="/" component={HomePage} />
                    <PrivateRoute
                      path="/edit/:id/:random"
                      component={AddPage}
                    />
                    <PrivateRoute path="/feedback" component={Feedback} />
                    <PrivateRoute path="/detail/:id" component={DetailPage} />
                    <PrivateRoute path="/config" component={ConfigPage} />
                    <PrivateRoute path="/drafts" component={DraftsPage} />
                  </div>
                </Content>
                <Footer className="App-footer-wrap">
                  <div className="App-footer">
                    <p style={{ fontSize: 14, fontWeight: 700 }}>
                      Copyright © 2017
                    </p>
                    <p style={{ fontSize: 13 }}>JinXu</p>
                    <p style={{ fontSize: 13 }}>Built with React antd</p>
                  </div>
                </Footer>
                <BackTop />
              </Layout>
            )}
          />
          <Route
            render={(props: any) => {
              return (
                <Redirect
                  to={{
                    pathname: "/"
                  }}
                />
              );
            }}
          />
        </Switch>
      </Router>
    );
  }
}

module.exports = Relay.createContainer(App, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        ${Masterinfo.getFragment("viewer")}
      }
    `
  }
});
