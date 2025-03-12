import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useUserStore = defineStore(
  'user',
  () => {
    const user = ref({});
    // 记住密码
    const remember = ref({
      username: '',
      password: ''
    });

    const saveUser = (user) => {
      user.value = user;
    };

    const getUser = computed(() => user.value);
    // 获取记住密码
    const getRemember = computed(() => remember.value);
    const saveRemember = (userForm) => {
      remember.value = userForm;
    };

    const removeRemember = () => {
      remember.value = {};
    };

    // 退出登录
    const logout = () => {
      user.value = {};
    };

    return {
      user,
      saveUser,
      getUser,
      saveRemember,
      getRemember,
      removeRemember,
      logout
    };
  },
  {
    persist: {
      enabled: true,
      strategies: [{ storage: localStorage, paths: ['user', 'remember'] }]
    }
  }
);
