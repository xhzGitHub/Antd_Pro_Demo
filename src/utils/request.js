import fetch from "dva/fetch";
import { notification, message } from "antd";
// import { redirectLogin } from "./auth";

notification.config({
  duration: 2
});

const checkHttpStatus = (response, showNotification) => {
  if (response.status === 401 || response.redirected) {
    // return redirectLogin();
  }
  if (response.ok) {
    return response;
  }
  if (showNotification) {
    notification.error({
      message: `网络请求错误 ${response.status}: ${response.url}`,
      description: response.statusText
    });
  }
  const error = new Error(response.statusText);
  error.response = response;
  throw error;
};

const checkApiStatusAndExtractData = (response, hasSideEffect, showNotification, fullResponse) => {
  if (Number(response.errcode) === 40001) {
    fetch("/api/logout").then(() => {
      localStorage.clear();
      window.location.href = "/login";
    });
    return;
  }
  // if hasSideEffect, notify user
  if (hasSideEffect) {
    if (response.hint) {
      message.info(response.hint);
    }
    // explicitly declared to showNotification
    if (showNotification) {
      if (response.errcode === 0) {
        notification.success({ message: "递交成功" });
      } else {
        notification.error({ message: response.msg });
      }
    } else if (
      // showNotification not specified, show only success toast
      showNotification === undefined &&
      response.errcode === 0
    ) {
      notification.success({ message: "递交成功" });
    }
  }

  if (fullResponse) {
    return response;
  }

  // paginated response
  if (Number.isInteger(response.total)) {
    return response;
  }

  // `GET` request: extract `data` field
  if (response.data) {
    return response.data;
  }

  // other: check `errcode` and `msg`
  if (response.errcode && response.errcode !== 0) {
    if (showNotification) {
      notification.error({
        message: `接口请求错误 ${response.errcode}`,
        description: response.msg
      });
    }
    throw new Error(response.msg);
  }

  return response;
};

/**
 * Requests a URL, returning a promise.
 * @async
 * @function request
 * @param {string} url The URL we want to request
 * @param {Object} [options] The options we want to pass to "fetch" and optionally some configurations
 * @param {"GET"|"POST"|"PUT"|"DELETE"} [options.method] HTTP method
 * @param {*} [options.body] HTTP body
 * @param {boolean} [options.showNotification=true] Decide whether a notification should be displayed automatically after ajax finished
 * @param {boolean} [options.fullResponse=false] Decide whether full response should be returned
 * @param {boolean} [options.useGlobalCitySetting=true] Decide whether the request will append the global city setting to the query parameters
 * @typedef ReturnData Data type returned
 * @type {Object}
 * @property {*} data
 * @property {number} errcode
 * @property {string} msg
 * @returns {Promise<ReturnType|Object>}
 */
export default function request(url, options) {
  const defaultOptions = url.includes("http")
    ? {
        showNotification: true,
        fullResponse: false,
        useGlobalCitySetting: true
      }
    : {
        credentials: "include",
        showNotification: true,
        fullResponse: false,
        useGlobalCitySetting: true
      };
  const newOptions = { ...defaultOptions, ...options };
  const hasSideEffect = ["PUT", "POST", "DELETE"].includes(newOptions.method);
  const cityId = localStorage.getItem("city_id");
  if (newOptions.useGlobalCitySetting && cityId) {
    /* eslint-disable-next-line no-param-reassign */
    url = url.includes("?") ? `${url}&city_id=${cityId}` : `${url}?city_id=${cityId}`;
  }

  if (newOptions.method === "POST" || newOptions.method === "PUT") {
    newOptions.headers = {
      Accept: "application/json",
      "Content-Type": "application/json; charset=utf-8",
      "X-Requested-With": "XMLHttpRequest",
      ...newOptions.headers
    };
    newOptions.body = JSON.stringify(newOptions.body);
  }

  /* global API_URL */
  const requestUrl = API_URL ? (url.includes("http") ? url : `${API_URL}${url}`) : url;
  return fetch(requestUrl, newOptions)
    .then(response => checkHttpStatus(response, newOptions.showNotification))
    .then(response => {
      const contentType = response.headers.get("Content-Type");
      if (contentType.indexOf("image") >= 0) {
        return response.blob();
      } else if (contentType.indexOf("json") >= 0) {
        return response.json();
      } else {
        return response;
      }
    })
    .then(apiResponse => {
      return Promise.resolve(
        checkApiStatusAndExtractData(
          apiResponse,
          hasSideEffect,
          newOptions.showNotification,
          newOptions.fullResponse
        )
      );
    })
    .catch(error => {
      console.error(error); // eslint-disable-line
      Promise.resolve({});
    });
}
