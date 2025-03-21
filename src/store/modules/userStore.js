import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { removeToken } from '@/utils/auth';
import { getEmployeeDetail } from '@/api/user';

export const useUserStore = defineStore(
  'user',
  () => {
    // 用户信息
    const user = ref({});
    const remember = ref({});
    const isRemember = ref(false);
    // 是否是初始化用户
    const isInitUser = ref(true);

    const saveUser = (newUser) => {
      if (newUser) {
        user.value = Object.assign({}, newUser);
      } else {
        user.value = {};
      }
    };

    const getUser = computed(() => user.value);

    // 获取记住密码
    const getRemember = computed(() => remember.value);
    const saveRemember = (userForm) => {
      remember.value = { ...userForm };
    };

    const removeRemember = () => {
      remember.value = {};
    };

    // 记住密码
    const updateIsRemember = (value) => {
      isRemember.value = value;
    }

    // 退出登录
    const logout = () => {
      user.value = {};
      removeToken();
    };

    return {
      user,
      getUser,
      getRemember,
      isRemember,
      remember,
      isInitUser,
      saveUser,
      saveRemember,
      removeRemember,
      logout,
      updateIsRemember
    };
  },
  {
    persist: {
      enabled: true,
      strategies: [{ storage: localStorage, paths: ['user', 'remember', 'isRemember'] }]
    }
  }
);