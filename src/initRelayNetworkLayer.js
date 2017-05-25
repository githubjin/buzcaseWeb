// @flow

import {
  RelayNetworkLayer,
  urlMiddleware,
  // loggerMiddleware,
  // gqErrorsMiddleware,
  // perfMiddleware,
  retryMiddleware,
  authMiddleware
} from "react-relay-network-layer";

import { buzcaseUserKey } from "./env";
import _ from "lodash";

type EmptyFunc = () => void;

// save viewer to localstorage
export function setToken(viewer: Object, callback: EmptyFunc) {
  window.localStorage.setItem(buzcaseUserKey, JSON.stringify(viewer));
  callback();
}

// get viewer from localstorage
export function getToken(): string {
  var viewer = window.localStorage.getItem(buzcaseUserKey);
  if (_.isEmpty(viewer)) {
    return "";
  }
  return JSON.parse(viewer).sessionToken;
}

// init relay network layer
let relayNetworkLayer = new RelayNetworkLayer([
  urlMiddleware({
    url: req => "/graphql"
  }),
  // loggerMiddleware(),
  // gqErrorsMiddleware(),
  // perfMiddleware(),
  retryMiddleware({
    fetchTimeout: 15000,
    retryDelays: attempt => Math.pow(2, attempt + 4) * 100, // or simple array [3200, 6400, 12800, 25600, 51200, 102400, 204800, 409600],
    forceRetry: (cb, delay) => {
      window.forceRelayRetry = cb;
      // console.log(
      //   `call forceRelayRetry() for immediately retry! Or wait ${delay} ms.`
      // );
    },
    statusCodes: [500, 503, 504]
  }),
  authMiddleware({
    token: () => getToken()
  })
]);

export default relayNetworkLayer;
