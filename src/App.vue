<template>
  <router-view></router-view>
</template>

<script setup>
import Layout from "./layout/Layout.vue";
import { useMenuStore } from "@/store/modules/menuStore";
import { generateMenu } from "@/utils/menu";
import router from "@/router";

const menu = generateMenu(router.options.routes)[0].children; // 生成菜单
const menuStore = useMenuStore();
menuStore.saveRouter(menu); // 保存菜单
</script>
