import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useDictStore = defineStore(
  "dict",
  () => {
    const dicts = ref([
      {
        key: "SEX",
        values: [
          { label: "男", value: "M" },
          { label: "女", value: "F" },
        ],
      },
    ]);

    const saveDict = (dict) => {};

    const getDict = computed((key) => {});

    const removeDict = (key) => {};

    const updateDict = (key, dict) => {};

    return {
      saveDict,
      getDict,
      removeDict,
      updateDict,
    };
  },
  {
    persist: {
      enabled: true,
      strategies: [{ storage: localStorage, paths: ["dicts"] }],
    },
  }
);
