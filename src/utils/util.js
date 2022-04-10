import { Message } from 'element-ui';
import router from '@/router';
import store from '@/store';
import Worker from './worker.js';

async function checkLogin() {
  const user = await window.cookieStore.get('user');
  const info = window.local.get('info');
  if (user && !info) {
    Message.warning('登录信息已失效，请重新登录！');
    clearLogin();
  } else if (info && user) {
    store.commit('modify', {
      isLogin: true,
      userInfo: info,
      isBack: info.isBack,
    });
  } else {
    store.commit('modify', {
      isLogin: false,
      isBack: window.location.pathname.startsWith('/manage'),
    });
  }
}

async function clearLogin() {
  window.local.clear();
  document.cookie = 'user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  store.commit('modify', { isLogin: false, userInfo: null });
  gotoIndex();
}

async function gotoIndex() {
  if (store.state.isBack) {
    router.app.$router.push('/manage/login');
  } else if (!router.app.$route || router.app.$route.meta.needLogin) {
    router.push('/');
  }
}

function getPosition() {
  const res = new Promise((resolve, reject) => {
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };
    const success = pos => {
      const { latitude: lat, longitude: lon } = pos.coords;
      return resolve({ lat, lon });
    };

    const error = err => {
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
    store.commit('modify', e.data);
    geoWorker.terminate();
  };
  getPosition().then(
    res => {
      res.type = 'location';
      geoWorker.postMessage(res);
    },
    () => {
      store.commit('modify', { geoText: '定位失败，请选择地区', geo: null });
    },
  );
}

function getTitle(url) {
  if (url.includes('news')) {
    return '新闻';
  } else if (url.includes('knowledge')) {
    return '科普常识';
  } else if (url.includes('notice')) {
    return '公告';
  }
}

function money(val) {
  return Number(val).toFixed(2).toLocaleString() + '￥';
}

function standardTime(time) {
  if (!time) {
    throw new TypeError();
  } else if (time instanceof Date) {
    return time.toLocaleString().replaceAll('/', '-');
  } else {
    return new Date(time).toLocaleString().replaceAll('/', '-');
  }
}

function deepClone(value) {
  let map = new Map();

  function main(value) {
    if (value === null || typeof value !== 'object') {
      return value;
    }
    if (map.get(value)) {
      return map.get(value);
    }
    let result = Array.isArray(value) ? [] : {};
    map.set(value, result);
    for (let key in value) {
      // eslint-disable-next-line no-prototype-builtins
      if (value.hasOwnProperty(key)) {
        result[key] = main(value[key]);
      }
    }
    return result;
  }

  return main(value);
}

export { checkLogin, clearLogin, getPosition, location, getTitle, gotoIndex, money, standardTime, deepClone };
