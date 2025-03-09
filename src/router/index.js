import { createWebHistory, createRouter } from "vue-router";
import Layout from "@/layout/Layout.vue";

const routes = [
  {
    path: "/",
    component: Layout,
    redirect: "/home",
    children: [
      {
        path: "/home",
        name: "Home",
        component: () => import("@/views/Home.vue"),
        meta: { title: "首页", icon: "HomeFilled" },
      },
      {
        path: "/user",
        name: "User",
        component: () => import("@/views/User.vue"),
        meta: { title: "员工管理", icon: "UserFilled" },
      },
      {
        path: "/leave",
        name: "Leave",
        component: () => import("@/views/Leave.vue"),
        meta: { title: "请假审批", icon: "Document" },
      },
      {
        path: "/room",
        name: "Room",
        meta: { title: "客房管理", icon: "House" },
        component: () => import("@/views/Room.vue"),
      },
      {
        path: "/checkin",
        name: "Checkin",
        component: () => import("@/views/Checkin.vue"),
        meta: { title: "预约管理", icon: "Calendar" },
      },
      {
        path: "/system",
        meta: { title: "系统管理", icon: "Setting", hidden: true },
        children: [
          {
            path: "/department",
            name: "Department",
            component: () => import("@/views/Department.vue"),
            meta: { title: "部门管理", icon: "Document", hidden: true },
          },
        ],
      },
      {
        path: "/profile",
        name: "Profile",
        component: () => import("@/views/Profile.vue"),
        meta: { title: "个人中心", icon: "User", hidden: true },
      },
      {
        path: "/notice",
        name: "Notice",
        component: () => import("@/views/Notice.vue"),
        meta: { title: "公告管理", icon: "Document", hidden: false },
      },
      {
        path: "/dict",
        name: "Dict",
        component: () => import("@/views/Dict.vue"),
        meta: { title: "数据字典", icon: "Key", hidden: false },
      },
    ],
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/Login.vue"),
    meta: { title: "登录", hidden: true },
  },
  // 前台页面
  {
    path: "/front",
    name: "FrontDesk",
    component: () => import("@/views/FrontDesk.vue"),
    meta: { title: "前台", icon: "Home", hidden: false },
  },
  //   404页面
  {
    path: "/:catchAll(.*)",
    name: "NotFound",
    component: () => import("@/views/NotFound.vue"),
    meta: { title: "404", hidden: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
