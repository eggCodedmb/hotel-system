import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useDictStore = defineStore(
  'dict',
  () => {
    const dicts = ref([])

    // 核心方法：智能合并重复 key
    const setDict = (key, values) => {
      const existIndex = dicts.value.findIndex(item => item.key === key)
      if (existIndex > -1) {
        dicts.value[existIndex] = {
          ...dicts.value[existIndex].v,
          values: [...values]
        }
      } else {
        dicts.value.push({ key, values })
      }
    }

    // 核心方法：获取字典项
    const getDict = computed(() => (key) => {
      return dicts.value.find(item => item.key === key).values
    })

    // 删除字典（支持批量）
    const removeDict = (key) => {
      const keys = Array.isArray(key) ? key : [key]
      dicts.value = dicts.value.filter(item => !keys.includes(item.key))
    }

    // 清空字典（保留指定 key）
    const clearDict = (keepKeys) => {
      if (keepKeys.length === 0) {
        dicts.value = []
      } else {
        dicts.value = dicts.value.filter(item => keepKeys.includes(item.key))
      }
    }

    return {
      dicts,
      setDict,
      getDict,
      removeDict,
      clearDict
    }
  },
  {
    persist: {
      enabled: true,
      strategies: [{
        storage: localStorage,
        // 序列化处理（可选）
        serializer: {
          serialize: JSON.stringify,
          deserialize: JSON.parse
        },
        paths: ['dicts']
      }]
    }
  }
)