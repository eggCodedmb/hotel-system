import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useMenuStore = defineStore('menu', () => {
    const menus = ref([]);

    const saveRouter = (menu) => {
        menus.value = menu;
    };

    const getRouter = computed(() => menus.value);

    return {
        menus, // ✅ 直接暴露 menus 变量
        saveRouter,
        getRouter
    };
}, {
    persist: {
        enabled: true, // ✅ 确保 Pinia 持久化插件已启用
        strategies: [
            { storage: localStorage, paths: ['menus'] } // ✅ 存储到 `localStorage`
        ]
    }
});
