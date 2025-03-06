<template>
  <div class="common-layout">
    <el-container>
      <Menu />
      <el-container>
        <el-header>
          <Header />
        </el-header>
        <el-main class="page-main">
          <router-view> </router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import Header from "./Header.vue";
import Menu from "./Menu.vue";
import { ref } from "vue";
</script>

<style scoped>
/* 处理Element组件样式穿透 */
:deep(.el-header) {
  padding: 0;
}
:deep(.el-main) {
  background: #f0f2f5;
}
</style>
