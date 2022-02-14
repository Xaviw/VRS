import axios from "axios";
import { Message } from "element-ui";
import qs from "qs";
import { clearLogin } from "util/util";

const _axios = axios.create({
  baseURL: process.env.NODE_ENV === "production" ? "" : "/api",
  timeout: 60 * 1000,
  withCredentials: true,
});

_axios._get = function (url, data) {
  let str = qs.stringify(data);
  if (str) {
    url += `?${str}`;
  }
  return _axios.get(url);
};

_axios.interceptors.request.use(
  (config) => config,
  (err) => {
    return Promise.reject(err);
  }
);

_axios.interceptors.response.use(
  (res) => {
    if (res.status < 300) {
      switch (res.data.status) {
        case 1:
          Message.error(res.data.msg);
          return Promise.reject(res);
        case 2:
          Message.success(res.data.msg);
        // eslint-disable-next-line no-fallthrough
        default:
          return Promise.resolve(res);
      }
    } else {
      return Promise.reject(res);
    }
  },
  (err) => {
    const { response } = err;
    let msg;
    if (response) {
      switch (response.status) {
        case 401:
          msg = "登录已失效！";
          clearLogin();
          break;
        case 403:
          msg = "拒绝访问！";
          break;
        case 404:
          msg = "资源不存在！";
          break;
        default:
          msg = "请求失败！";
      }
    } else {
      msg = "系统错误，请稍后再试！";
    }
    Message.error(msg);
    return Promise.reject(err);
  }
);

export default _axios;
