import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useMenuStore = defineStore(
  'menu',
  () => {
    const menus = ref([]);
    // 面包屑
    const breadCrumb = ref([]);

    const saveBreadCrumb = (breadCrumb) => {
      breadCrumb.value.push(breadCrumb);
    };
    const getBreadCrumb = computed(() => breadCrumb.value);

    const saveRouter = (menu) => {
      menus.value = menu;
    };

    // 添加路由黑名单
    const addBlackList = (role) => {
      if (role == !'admin') {
        menus.value = menus.value.filter((item) => {
          return item.meta.blackList !== true;
        });
      } else {
      }
    };
    const getRouter = computed(() => menus.value);

    return {
      menus, // ✅ 直接暴露 menus 变量
      saveRouter,
      getRouter,
      saveBreadCrumb,
      getBreadCrumb
    };
  },
  {
    persist: {
      enabled: true, // ✅ 确保 Pinia 持久化插件已启用
      strategies: [
        { storage: localStorage, paths: ['menus'] },
        { storage: sessionStorage, paths: ['breadCrumb'] }
      ]
    }
  }
);
