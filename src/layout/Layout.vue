<template>
  <div class="common-layout">
    <el-container>
      <Menu />
      <el-container>
        <el-header>
          <Header />
        </el-header>
        <el-main>
          <div class="main-content">
            <router-view></router-view>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script setup>
import Header from "./Header.vue";
import Menu from "./Menu.vue";
</script>

<style scoped>
:deep(.el-header) {
  padding: 0;
}
.main-content {
  width: 100%;
  height: calc(100vh - 100px);
  background: #fff;
  padding: 10px;
}
</style>
