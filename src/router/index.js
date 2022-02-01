import { Message } from "element-ui";
import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store";
import { checkLogin, getTitle, gotoIndex } from "../utils/util";

Vue.use(VueRouter);

const articleTitle = (to, from, next) => {
  document.title = getTitle(to.path);
  next();
};

const routes = [
  {
    path: "",
    component: () => import("views/basic.vue"),
    children: [
      {
        path: "",
        component: () => import("front/index.vue"),
        meta: { title: "首页" },
      },
      {
        path: "/:type(news|knowledge|notice)",
        component: () => import("front/articleList.vue"),
        beforeEnter: articleTitle,
      },
      {
        path: "/:type(news|knowledge|notice)/:id",
        component: () => import("front/article.vue"),
        beforeEnter: articleTitle,
      },
      {
        path: "/edit-info",
        component: () => import("views/editInfo.vue"),
        meta: {
          title: "修改资料",
          needLogin: true,
        },
      },
      {
        path: "/order",
        component: () => import("views/orderList.vue"),
        meta: {
          title: "订单信息",
          needLogin: true,
        },
      },
      {
        path: "/hospital/:id",
        component: () => import("views/hospital.vue"),
        meta: {
          title: "医院信息",
        },
      },
    ],
  },
  {
    path: "manage",
  },
];

const router = new VueRouter({
  routes,
});

router.beforeEach(async (to, from, next) => {
  if (to.meta.needLogin) {
    if (store.state.isLogin === null) {
      await checkLogin();
    }
    if (!store.state.isLogin) {
      Message.warning("请登录后再访问该页面！");
      console.log(from);
      gotoIndex();
      // if (from.matched.length) {
      //   router.back();
      // } else {
      // }
      return;
    }
  }
  if (to.meta.title) {
    document.title = to.meta.title;
  } else {
    document.title = process.env.VUE_APP_TITLE;
  }
  next();
});

export default router;
