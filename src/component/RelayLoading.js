// @flow
import React, { Component, PropTypes } from "react";
import Relay from "react-relay";
import { Spin } from "antd";

export default class RelayLoading extends Component {
  // constructor(props: any) {
  //   super(props);
  // }
  renderChild(child: any, props: Object) {
    return React.cloneElement(child, { ...this.props, ...props });
  }
  render() {
    const child = React.Children.only(this.props.children);
    const { route } = this.props;
    const routeConfig = route;
    return (
      <Relay.Renderer
        Container={child.type}
        queryConfig={routeConfig}
        environment={Relay.Store}
        render={({ done, error, props, retry, stale }) => {
          if (error) {
            return <h1>${error}</h1>;
          } else if (props) {
            return this.renderChild(child, props);
          } else {
            return <Spin />;
          }
        }}
      />
    );
  }
}

RelayLoading.propTypes = {
  route: PropTypes.object.isRequired
};
