<template>
  <el-header class="header-container">
    <div class="header-content">
      <!-- 面包屑导航 -->
      <el-breadcrumb separator="/" class="breadcrumb">
        <el-breadcrumb-item
          v-for="(item, index) in breadcrumbList"
          :key="index"
          :to="item.path"
        >
          <el-icon v-if="index === 0" class="breadcrumb-icon">
            <location />
          </el-icon>
          {{ item.meta.title }}
        </el-breadcrumb-item>
      </el-breadcrumb>

      <!-- 用户操作区 -->
      <div class="user-area">
        <el-dropdown
          trigger="hover"
          placement="bottom-end"
          @command="handleCommand"
        >
          <div class="user-wrapper">
            <el-avatar :size="36" :src="getUrl" class="user-avatar" />
            <span class="user-name">{{ userInfo.name || '无' }}</span>
            <el-icon class="arrow-icon"><arrow-down /></el-icon>
          </div>

          <template #dropdown>
            <el-dropdown-menu class="user-menu">
              <el-dropdown-item command="profile">
                <el-icon>
                  <user />
                </el-icon>
                个人中心
              </el-dropdown-item>
              <el-dropdown-item command="front">
                <el-icon>
                  <OfficeBuilding />
                </el-icon>
                前台
              </el-dropdown-item>
              <el-dropdown-item divided command="logout">
                <el-icon><switch-button /></el-icon>
                退出登录
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </el-header>
  <userForm ref="userInfoFormRef" @refresh="refreshUser" />
</template>

<script setup>
import { ref, watch, nextTick, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from '@/store/modules/userStore';
import { useMenuStore } from '@/store/modules/menuStore';
import { useDark, useToggle } from '@vueuse/core';
import userForm from '@/views/components/userForm.vue';
import { getEmployeeDetail } from '@/api/user';
// 弹框
import { ElMessage } from 'element-plus';
const userInfoFormRef = ref(null);
const isShow = ref(false);
const router = useRouter();
const route = useRoute();
const userStore = useUserStore();
const menuStore = useMenuStore();

const userInfo = userStore.getUser;

const getUrl = computed(() => {
  return import.meta.env.VITE_APP_RESOURCE_URL + userInfo.picture;
});

// 面包屑数据
const breadcrumbList = ref([]);

const handleCommand = (command) => {
  switch (command) {
    case 'logout':
      handleLogout();
      break;
    case 'profile':
      router.push('/profile');
      break;
    case 'front':
      router.push('/front');
      break;
  }
};

// 退出登录
const handleLogout = () => {
  userStore.logout();
  router.push('/login');
};
const refreshUser = () => {
  ElMessage.success('更新成功,请重新登录');
  setTimeout(() => {
    userStore.logout();
  }, 1000);
};
onMounted(() => {});
nextTick(() => {
  setTimeout(() => {
    if (!userInfo.name) {
      userInfoFormRef.value.title = '完善信息';
      userInfoFormRef.value.isEmployee = true;
      userInfoFormRef.value.openDialog(userInfo);
    }
  }, 200);
});
</script>

<style scoped lang="scss">
.header-container {
  width: 100%;
  height: 56px;
  border-bottom: 1px solid var(--el-border-color-light);
  background: #ffffff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .header-content {
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 24px;

    .breadcrumb {
      flex: 1;
      margin-left: 16px;

      &-icon {
        vertical-align: text-bottom;
        margin-right: 6px;
      }
    }

    .user-area {
      .user-wrapper {
        display: flex;
        align-items: center;
        padding: 4px 8px;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.3s;

        &:hover {
          background: var(--el-color-primary-light-9);

          .user-name {
            color: var(--el-color-primary);
          }

          .arrow-icon {
            transform: rotate(180deg);
          }
        }
      }

      .user-avatar {
        margin-right: 8px;
      }

      .user-name {
        font-size: 14px;
        margin-right: 6px;
        transition: color 0.3s;
      }

      .arrow-icon {
        transition: transform 0.3s;
        font-size: 12px;
        color: var(--el-text-color-secondary);
      }
    }

    .user-menu {
      .el-dropdown-menu__item {
        padding: 8px 16px;
        font-size: 14px;

        .el-icon {
          margin-right: 8px;
          font-size: 16px;
        }
      }
    }
  }
}
</style>
