import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";
import Relay from "react-relay";
import initRelayNetworkLayer from "./initRelayNetworkLayer";
import AppRoute from "./queryConfig";

initRelayNetworkLayer();

ReactDOM.render(
  <Relay.RootContainer Component={App} route={new AppRoute()} />,
  document.getElementById("root")
);
