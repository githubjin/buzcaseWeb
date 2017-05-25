// @flow
import React, { PureComponent, PropTypes } from "react";
import Relay from "react-relay";
import { Spin } from "antd";
import { currentRelay } from "../util";

const styles = {
  loadingStyle: {
    width: "100%",
    textAlign: "center"
  }
};
export default class RelayLoading extends PureComponent {
  // constructor(props: any) {
  //   super(props);
  // }
  renderChild(child: any, props: Object) {
    return React.cloneElement(child, { ...this.props, ...props });
  }
  shouldComponentUpdate(nextProps: any, nextState: any, nextContext: any) {
    let { shouldUpdate = true } = nextProps;
    // console.log(
    //   "RelayLoading-shouldComponentUpdate-shouldUpdate : ",
    //   shouldUpdate
    // );
    return shouldUpdate;
  }
  render() {
    const child = React.Children.only(this.props.children);
    const {
      route,
      loadingElement = Spin,
      forceFetch = false,
      loadingStyle = styles.loadingStyle
    } = this.props;
    const routeConfig = route;
    return (
      <Relay.Renderer
        Container={child.type}
        queryConfig={routeConfig}
        environment={currentRelay.store}
        forceFetch={forceFetch}
        render={({ done, error, props, retry, stale }) => {
          if (error) {
            return <h1>${error}<a onClick={retry}>重新加载</a></h1>;
          } else if (props) {
            return this.renderChild(child, props);
          } else {
            return (
              <div style={loadingStyle}>
                {React.createElement(loadingElement)}
              </div>
            );
          }
        }}
      />
    );
  }
}

RelayLoading.propTypes = {
  route: PropTypes.object.isRequired,
  loadingElement: PropTypes.func,
  forceFetch: PropTypes.bool
};
