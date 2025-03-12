<template>
  <div class="common-layout">
    <el-container>
      <Menu />
      <el-container>
        <el-header>
          <Header />
        </el-header>
        <el-main>
          <div class="bg-white main-container">
            <router-view> </router-view>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import Header from './Header.vue';
import Menu from './Menu.vue';
import { ref } from 'vue';
</script>

<style lang="scss" scoped>
/* 处理Element组件样式穿透 */
:deep(.el-header) {
  padding: 0;
}
:deep(.el-main) {
  padding: 10px;
}
.main-container {
  height: calc(100vh - 100px);
  box-sizing: border-box;
  padding: 8px;
  border-radius: 8px;
  // 滚动条样式
  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #dcdfe6;
    border-radius: 4px;
  }
  &::-webkit-scrollbar-track {
    background-color: #f0f2f5;
    border-radius: 4px;
  }
}
</style>
