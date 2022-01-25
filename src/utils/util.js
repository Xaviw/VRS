import { Message } from "element-ui";
import router from "../router";
import store from "../store";
import Worker from "./worker.js";

async function checkLogin() {
  const user = await window.cookieStore.get("user");
  const info = window.local.get("info");
  if (user && !info) {
    Message.warning("登录信息已失效，请重新登录！");
    clearLogin();
  } else if (info && user) {
    store.commit("modify", { isLogin: true, userInfo: JSON.parse(info) });
  } else {
    store.commit("modify", { isLogin: false });
  }
}

async function clearLogin() {
  window.local.clear();
  document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  store.commit("modify", { isLogin: false, userInfo: null });
  console.log(router, router.app.$route);
  if (store.state.isBack) {
    router.app.$router.push("/manage/login");
  } else if (router.app.$route.meta.needLogin) {
    router.push("/");
  }
}

function checkBack() {
  if (window.location.pathname.startsWith("/manage")) {
    store.commit("modify", { isBack: true });
  } else if (store.state.isBack) {
    store.commit("modify", { isBack: false });
  }
}

function getPosition() {
  const res = new Promise((resolve, reject) => {
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };
    const success = (pos) => {
      const { latitude: lat, longitude: lon } = pos.coords;
      return resolve({ lat, lon });
    };

    const error = (err) => {
      return reject(err);
    };

    navigator.geolocation.getCurrentPosition(success, error, options);
  });
  return res;
}

function location() {
  if (store.state.isBack) return;
  const geoWorker = new Worker();
  geoWorker.onmessage = function (e) {
    console.log("主线程接收到: ", e.data);
    store.commit("modify", e.data);
    geoWorker.terminate();
  };
  getPosition().then(
    (res) => {
      res.type = "location";
      geoWorker.postMessage(res);
    },
    () => {
      store.commit("modify", { geoText: "定位失败，请选择地区", geo: null });
    }
  );
}

function getTitle(url) {
  if (url.includes("news")) {
    return "新闻";
  } else if (url.includes("knowledge")) {
    return "科普常识";
  } else if (url.includes("notice")) {
    return "公告";
  }
}

export { checkLogin, clearLogin, checkBack, getPosition, location, getTitle };
