import { Message } from "element-ui";
import Vue from "vue";
import VueRouter from "vue-router";
import store from "@/store";
import { checkLogin, getTitle, gotoIndex } from "util/util";

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
        component: () => import("views/articleList.vue"),
        beforeEnter: articleTitle,
      },
      {
        path: "/:type(news|knowledge|notice)/:id",
        component: () => import("views/article.vue"),
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
        component: () => import("front/hospital.vue"),
        meta: {
          title: "医院信息",
        },
      },
    ],
  },
  {
    path: "/manage",
    component: () => import("views/basic.vue"),
    redirect: "/manage/login",
    children: [
      {
        path: "login",
        component: () => import("com/login.vue"),
        meta: { title: "后台登录" },
      },
      {
        path: "index",
        component: () => import("back/index.vue"),
        meta: { title: "后台首页", needLogin: true },
      },
      {
        path: "publish/:type(news|knowledge|notice)",
        component: () => import("back/publishArticle.vue"),
        meta: { title: "发布", needLogin: true },
      },
      {
        path: ":type(news|knowledge|notice)/:id",
        component: () => import("back/publishArticle.vue"),
        meta: { title: "编辑", needLogin: true },
      },
    ],
  },
];

const router = new VueRouter({
  routes,
});

const manageRoutes = [
  "/manage",
  "/news",
  "/knowledge",
  "/notice",
  "/order",
  "/edit-info",
];

router.beforeEach(async (to, from, next) => {
  if (store.state.isLogin === null) {
    await checkLogin();
  }
  if (to.meta.needLogin && !store.state.isLogin) {
    Message.warning("请登录后再访问该页面！");
    gotoIndex();
    return;
  }
  if (to.path == "/manage/login" && store.state.isLogin) {
    router.replace("/manage/index");
    return;
  }
  if (
    store.state.isLogin &&
    ((store.state.isBack &&
      !manageRoutes.some((item) => to.path.startsWith(item))) ||
      (!store.state.isBack && to.path.startsWith("/manage")))
  ) {
    gotoIndex();
    return;
  }
  if (to.meta.title) {
    document.title = to.meta.title;
  } else {
    document.title = process.env.VUE_APP_TITLE;
  }
  next();
});

export default router;
