import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    appTitle: process.env.VUE_APP_TITLE,
    isLogin: null,
    userInfo: null,
    isBack: false,
    geoText: "定位中...",
    geo: null,
  },
  mutations: {
    modify(state, payload) {
      Object.keys(payload).forEach((e) => {
        // eslint-disable-next-line no-prototype-builtins
        if (state.hasOwnProperty(e)) {
          state[e] = payload[e];
        } else {
          console.error(
            "Sorry，更新失败：属性" + e + "在对应的modules模块中未定义！"
          );
        }
      });
    },
  },
  actions: {},
  modules: {},
});
