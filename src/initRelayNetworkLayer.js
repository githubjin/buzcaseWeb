// @flow

import Relay from "react-relay";
import {
  RelayNetworkLayer,
  urlMiddleware,
  loggerMiddleware,
  gqErrorsMiddleware,
  perfMiddleware,
  retryMiddleware,
  authMiddleware
} from "react-relay-network-layer";

import { buzcaseUserKey } from "./env";
import _ from "lodash";

type EmptyFunc = () => void;

// save master to localstorage
export function setToken(master: Object, callback: EmptyFunc) {
  window.localStorage.setItem(buzcaseUserKey, JSON.stringify(master));
  callback();
}

// get master from localstorage
export function getToken() {
  var master = window.localStorage.getItem(buzcaseUserKey);
  if (_.isEmpty(master)) {
    return null;
  }
  return JSON.parse(master).sessionToken;
}

// init relay network layer
export default function init() {
  Relay.injectNetworkLayer(
    new RelayNetworkLayer([
      urlMiddleware({
        url: req => "/graphql"
      }),
      loggerMiddleware(),
      gqErrorsMiddleware(),
      perfMiddleware(),
      retryMiddleware({
        fetchTimeout: 15000,
        retryDelays: attempt => Math.pow(2, attempt + 4) * 100, // or simple array [3200, 6400, 12800, 25600, 51200, 102400, 204800, 409600],
        forceRetry: (cb, delay) => {
          window.forceRelayRetry = cb;
          console.log(
            `call forceRelayRetry() for immediately retry! Or wait ${delay} ms.`
          );
        },
        statusCodes: [500, 503, 504]
      }),
      authMiddleware({
        token: () => getToken()
      })
    ])
  );
}
