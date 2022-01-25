import Vue from "vue";
import ElementUI from "element-ui";
import "cookie-store";

import "element-ui/lib/theme-chalk/index.css";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axios from "./apis";
import "./styles/common.scss";
import { checkBack, checkLogin, location } from "./utils/util";
import { local } from "./utils/storage";

Vue.use(ElementUI);
Vue.config.productionTip = false;
window.local = local;
Vue.prototype.$http = axios;

checkBack();
checkLogin();
location();

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
