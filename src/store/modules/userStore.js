import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useUserStore = defineStore('user', () => {
    const user = ref({});
    // 记住密码
    const remember = ref({
        username: '',
        password: '',
    });

    const saveUser = (user) => {
        user.value = user;
    };

    const getUser = computed(() => user.value);

    const saveRemember = (username, password) => {
        remember.value = {
            username,
            password,
        }
    };

    const removeRemember = () => {
        remember.value = {}
    }

    const getRemember = computed(() => remember.value);

    // 退出登录
    const logout = () => {
        user.value = {};
    }

    return {
        user,
        saveUser,
        getUser,
        saveRemember,
        getRemember,
        removeRemember,
        logout,
    };
}, {
    persist: {
        enabled: true,
        strategies: [
            { storage: localStorage, paths: ['user'] },
            { storage: localStorage, paths: ['remember'] }
        ]
    }
});
