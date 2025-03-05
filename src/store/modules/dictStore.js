import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useDictStore = defineStore('dict', () => {
    const dicts = ref([]);

    const saveDict = (dict) => {
        dicts.value.push(dict);
    };

    const getDict = computed(() => dicts.value);

    const removeDict = (id) => {
        dicts.value = dicts.value.filter((dict) => dict.id !== id);
    }

    const updateDict = (id, dict) => {
        dicts.value = dicts.value.map((d) => (d.id === id ? dict : d));
    }

    return {
        saveDict,
        getDict,
        removeDict,
        updateDict
    };
}, {
    persist: {
        enabled: true,
        strategies: [
            { storage: localStorage, paths: ['dicts'] }
        ]
    }
});
