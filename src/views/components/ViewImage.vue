<template>
  <!-- 图片查看对话框 -->
  <el-dialog
    v-model="dialogVisible"
    :fullscreen="isFullscreen"
    :show-close="false"
    :before-close="handleClose"
    class="image-preview-dialog"
    append-to-body
  >
    <!-- 图片容器 -->
    <div class="image-container">
      <div class="image-wrapper">
        <el-image :src="getURL" ref="imageRef" fit="contain" lazy></el-image>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import {
  ref,
  computed,
  watch,
  onMounted,
  onBeforeUnmount,
  defineExpose
} from 'vue';

// 响应式状态
const dialogVisible = ref(false);
const isFullscreen = ref(false);
const imageRef = ref(null);
const imageUrl = ref('');

const getURL = computed(() => {
  return import.meta.env.VITE_APP_RESOURCE_URL + imageUrl.value;
});

// 对话框关闭
const handleClose = () => {
  dialogVisible.value = false;
  reset();
};

const open = (path) => {
  dialogVisible.value = true;
  imageUrl.value = path;
};

defineExpose({
  open
});
</script>

<style scoped>
.image-preview-dialog {
  --toolbar-height: 50px;
}

.image-preview-dialog :deep(.el-dialog__header) {
  display: none;
}

.image-preview-dialog :deep(.el-dialog__body) {
  padding: 0;
  height: calc(100vh - var(--toolbar-height));
  display: flex;
  flex-direction: column;
}

.toolbar {
  height: var(--toolbar-height);
  display: flex;
  align-items: center;
  padding: 0 20px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
}

.image-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.9);
}

.image-wrapper {
  transition: transform 0.3s ease;
}

img {
  transition: transform 0.3s ease;
  cursor: grab;
}

img:active {
  cursor: grabbing;
}

.loading,
.error {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #fff;
  text-align: center;
}

.error {
  color: var(--el-color-danger);
}
</style>
