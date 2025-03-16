<template>
  <router-view></router-view>
</template>

<script setup>
import { useMenuStore } from '@/store/modules/menuStore';
import { generateMenu, filterNonAdminRoutes } from '@/utils/menu';
import { useUserStore } from '@/store/modules/userStore';
import router from '@/router';

const userStore = useUserStore();
const menuStore = useMenuStore();

const menu = generateMenu(router.options.routes)[0].children; // 生成菜单
const routes = filterNonAdminRoutes(router.options.routes); // 过滤掉非管理员路由
const menuItems = generateMenu(routes)[0].children; // 递归生成菜单

const isAdmin = userStore.getUser; // 是否是管理员
if (isAdmin.role === '1') {
  menuStore.saveRouter(menu); // 管理员菜单
} else {
  menuStore.saveRouter(menuItems); // 非管理员菜单
}
</script>
