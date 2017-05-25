// @flow
import Relay from "react-relay";
import appReplayNetworkLayer, { getToken } from "./initRelayNetworkLayer";
import { buzcaseUserKey } from "./env";
import "whatwg-fetch";

export let currentRelay = {
  reset: function() {
    let env = new Relay.Environment();
    env.injectNetworkLayer(appReplayNetworkLayer);
    // env.injectTaskScheduler(InteractionManager.runAfterInteractions);
    currentRelay.store = env;
  },
  store: null
};

currentRelay.reset();

export let logout = (callback: () => {}) => {
  fetch("logout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${getToken()}`
    }
  })
    .then(function(data) {
      // console.log("request succeeded with JSON response", data);
      window.localStorage.removeItem(buzcaseUserKey);
      currentRelay.reset();
      callback();
    })
    .catch(function(error) {
      // console.log("request failed", error);
    });
};

export function getUser() {
  return window.localStorage.getItem(buzcaseUserKey);
}
