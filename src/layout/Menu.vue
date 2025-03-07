<template>
  <el-aside class="sidebar-container" :width="isCollapse ? '64px' : '200px'">
    <!-- Logo 区域 -->
    <div class="logo-container" @click="toggleCollapse">
      <img src="/img/logo/2103833.png" class="logo" />
      <h1 v-show="!isCollapse">酒店管理系统</h1>
    </div>

    <!-- 菜单 -->
    <el-menu
      :default-active="activeMenu"
      :collapse="isCollapse"
      :router="true"
      class="el-menu-vertical"
      background-color="#ffffff"
      text-color="#303133"
      active-text-color="#409eff"
    >
      <template v-for="item in menuList" :key="item.path">
        <!-- 一级菜单（无子菜单）-->
        <el-menu-item
          v-if="!item.children || item.children.length === 0"
          :index="item.path"
        >
          <el-icon v-if="item.icon">
            <component :is="item.icon" />
          </el-icon>
          <span>{{ item.title }}</span>
        </el-menu-item>

        <!-- 多级菜单 -->
        <el-sub-menu v-else :index="item.path">
          <template #title>
            <el-icon v-if="item.icon">
              <component :is="item.icon" />
            </el-icon>
            <span>{{ item.title }}</span>
          </template>
          <el-menu-item
            v-for="sub in item.children"
            :key="sub.path"
            :index="sub.path"
          >
            <el-icon v-if="sub.icon">
              <component :is="sub.icon" />
            </el-icon>
            <span>{{ sub.title }}</span>
          </el-menu-item>
        </el-sub-menu>
      </template>
    </el-menu>
  </el-aside>
</template>

<script>
import { useMenuStore } from "@/store/modules/menuStore";

export default {
  data() {
    return {
      isCollapse: false,
      menuStore: useMenuStore(),
    };
  },
  computed: {
    menuList() {
      return this.menuStore.getRouter;
    },
    activeMenu() {
      return this.$route.path;
    },
  },
  methods: {
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    // 添加面包屑
    addBreadcrumb() {
      console.log(this.$route);
      
      this.menuStore.saveBreadCrumb(this.$route);
    },
  },
};
</script>

<style scoped lang="scss">
.sidebar-container {
  background: #ffffff;
  box-shadow: 2px 0 8px 0 rgba(29, 35, 41, 0.05);
  transition: width 0.3s;
  height: 100vh;
  display: flex;
  flex-direction: column;

  .logo-container {
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 16px;
    cursor: pointer;
    border-bottom: 1px solid var(--el-border-color-light);
    transition: all 0.3s;

    .logo {
      width: 32px;
      height: 32px;
      margin-right: 8px;
      transition: width 0.3s;
    }

    h1 {
      font-size: 18px;
      color: var(--el-text-color-primary);
      white-space: nowrap;
      transition: opacity 0.3s;
    }
  }

  .el-menu {
    border-right: none;
    flex-grow: 1;
    height: calc(100vh - 56px);
  }
}
</style>
