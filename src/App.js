// @flow

import React, { PureComponent } from "react";
import "./App.css";
import { Layout, BackTop } from "antd";
const { Content, Footer } = Layout;
import Header from "./component/header";
import Relay from "react-relay";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import HomePage from "./component/homePage";
import Masterinfo from "./component/header/Masterinfo";
import AddPage from "./component/editPage";
import Feedback from "./component/feedback";
import DetailPage from "./component/detailPage";
import SignPage from "./component/sign";
import PrivateRoute from "./routes/PrivateRoute";

class App extends PureComponent {
  render() {
    return (
      <Router>
        <Switch>
          <Route path="/signin" component={SignPage} />
          <Route path="/signup" component={SignPage} />
          <Route
            path="/"
            render={() => (
              <Layout style={{ minWidth: 960 }}>
                <Header master={this.props.master} />
                <Content
                  className="App-content-wrap"
                  style={{ background: "#fff" }}
                >
                  <div className="App-content">
                    <PrivateRoute
                      exact
                      path="/"
                      master={this.props.master}
                      component={HomePage}
                    />
                    <PrivateRoute path="/edit/:id" component={AddPage} />
                    <PrivateRoute
                      path="/feedback"
                      master={this.props.master}
                      component={Feedback}
                    />
                    <PrivateRoute path="/detail/:id" component={DetailPage} />
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
        </Switch>
      </Router>
    );
  }
}

module.exports = Relay.createContainer(App, {
  fragments: {
    master: () => Relay.QL`
      fragment on MasterType {
        ${Masterinfo.getFragment("master")}
        ${SignPage.getFragment("master")}
        ${HomePage.getFragment("master")}
        ${Feedback.getFragment("master")}
      }
    `
  }
});
