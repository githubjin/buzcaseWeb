import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";
import Relay from "react-relay";
import { Spin } from "antd";
// import initRelayNetworkLayer from "./initRelayNetworkLayer";
import AppRoute from "./queryConfig";
import styled from "styled-components";
import Logo from "./images/Icon-60@3x.png";

const Loading = styled.div`
  width: 960px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const LoadingWords = styled.div`
  font-size: 15px;
  padding: 30px;
`;
const H2 = styled.h2`
      margin: 30px 0 20px;
      font-weight: 400;
      font-size: 18px;
      line-height: 1;
      padding-bottom: 30px;
    `;
const ErrorWords = styled.p`
  font-size: 15px;
  margin-bottom: 20px;
`;
// initRelayNetworkLayer();

/*ReactDOM.render(
  <Loading>
    <img src={Logo} />
    <H2>积累回顾你的案例、知识、经验和见解</H2>
    <Spin size="large" />
    <LoadingWords>数据加载中</LoadingWords>
  </Loading>,
  document.getElementById("root")
);*/
/*ReactDOM.render(
  <Loading>
    <ErrorWords>sadfkasfhalksjfhalskfhaskljfhaslkdjfhalskfhaskjdf</ErrorWords>
    <ErrorWords><button onClick={() => {}}>重新加载</button></ErrorWords>
  </Loading>,
  document.getElementById("root")
);*/

ReactDOM.render(
  <Relay.RootContainer
    Component={App}
    route={new AppRoute()}
    renderLoading={function() {
      return (
        <Loading>
          <img alt="logo" src={Logo} />
          <H2>积累回顾你的案例、知识、经验和见解</H2>
          <Spin size="large" />
          <LoadingWords>数据加载中</LoadingWords>
        </Loading>
      );
    }}
    renderFailure={function(error, retry) {
      return (
        <Loading>
          <ErrorWords>{error.message}</ErrorWords>
          <ErrorWords><button onClick={retry}>重新加载</button></ErrorWords>
        </Loading>
      );
    }}
  />,
  document.getElementById("root")
);
