<template>
  <div class="image-uploader">
    <!-- 上传控件 -->
    <el-upload
      ref="uploadRef"
      :action="action"
      :headers="headers"
      :multiple="multiple"
      :limit="limit"
      :file-list="fileList"
      :accept="accept"
      :list-type="listType"
      :disabled="disabled"
      :data="extraData"
      :on-exceed="handleExceed"
      :before-upload="beforeUpload"
      :on-success="handleSuccess"
      :on-error="handleError"
      :on-progress="handleProgress"
      :on-remove="handleRemove"
      :on-preview="handlePreview"
      :auto-upload="autoUpload"
      drag
      class="uploader-main"
    >
      <!-- 不同模式的显示 -->
      <template v-if="listType === 'picture-card'">
        <el-icon><Plus /></el-icon>
      </template>
      <template v-else>
        <el-button v-if="!disabled" type="primary">
          <el-icon><Upload /></el-icon>
          {{ buttonText }}
        </el-button>
        <div v-else class="tip-text">{{ tip }}</div>
      </template>

      <!-- 自定义提示 -->
      <template #tip>
        <div class="upload-tip" v-if="tip">{{ tip }}</div>
      </template>

      <!-- 文件列表显示 -->
      <template #file="{ file }">
        <div class="file-item">
          <img
            v-if="isImage(file)"
            :src="file.url || getObjectURL(file)"
            class="file-thumb"
          />
          <el-icon v-else class="file-icon"><Document /></el-icon>

          <div class="file-actions">
            <el-icon v-if="!disabled" @click="handleRemove(file)">
              <Close />
            </el-icon>
            <el-progress
              v-if="file.status === 'uploading'"
              :percentage="file.percentage"
              class="upload-progress"
            />
          </div>
        </div>
      </template>
    </el-upload>

    <!-- 图片预览 -->
    <el-dialog v-model="previewVisible" title="图片预览" width="60%">
      <img :src="previewImage" class="preview-image" />
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits, defineExpose } from 'vue';
import { Plus, Upload, Document, Close } from '@element-plus/icons-vue';

const props = defineProps({
  // 上传地址
  action: {
    type: String,
    required: true
  },
  // 请求头
  headers: {
    type: Object,
    default: () => ({})
  },
  // 已上传文件列表
  modelValue: {
    type: Array,
    default: () => []
  },
  // 是否多选
  multiple: {
    type: Boolean,
    default: false
  },
  // 最大允许上传数量
  limit: {
    type: Number,
    default: 5
  },
  // 接受的文件类型
  accept: {
    type: String,
    default: 'image/*'
  },
  // 显示模式
  listType: {
    type: String,
    default: 'picture-card', // text/picture/picture-card
    validator: (val) => ['text', 'picture', 'picture-card'].includes(val)
  },
  // 上传额外参数
  extraData: {
    type: Object,
    default: () => ({})
  },
  // 文件大小限制(MB)
  maxSize: {
    type: Number,
    default: 5
  },
  // 按钮文字
  buttonText: {
    type: String,
    default: '点击上传'
  },
  // 提示文字
  tip: {
    type: String,
    default: '支持扩展名：jpg/png，单文件不超过5MB'
  },
  // 是否禁用
  disabled: Boolean,
  // 是否自动上传
  autoUpload: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits([
  'update:modelValue',
  'success',
  'error',
  'exceed',
  'remove',
  'progress'
]);

const uploadRef = ref(null);
const previewVisible = ref(false);
const previewImage = ref('');
const fileList = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
});

// 暴露给父组件的方法
defineExpose({
  submit: () => uploadRef.value.submit(),
  clearFiles: () => uploadRef.value.clearFiles(),
  getFileList: () => fileList.value
});

// 文件类型判断
const isImage = (file) => {
  return (
    file.type?.includes('image') || /\.(jpg|jpeg|png|gif)$/i.test(file.name)
  );
};

// 获取本地预览地址
const getObjectURL = (file) => {
  return URL.createObjectURL(file.raw);
};

// 文件超出限制
const handleExceed = (files) => {
  emit('exceed', files);
  ElMessage.warning(`最多上传${props.limit}个文件`);
};

// 上传前校验
const beforeUpload = (file) => {
  const isImageType =
    props.accept.includes(file.type) ||
    /\.(jpg|jpeg|png|gif)$/i.test(file.name);
  const isLtMaxSize = file.size / 1024 / 1024 < props.maxSize;

  if (!isImageType) {
    ElMessage.error('请上传图片格式文件');
    return false;
  }

  if (!isLtMaxSize) {
    ElMessage.error(`文件大小不能超过${props.maxSize}MB`);
    return false;
  }

  return true;
};

// 上传成功
const handleSuccess = (res, file) => {
  file.url = res.data.url; // 根据实际接口调整
  emit('success', { res, file, fileList: fileList.value });
};

// 上传失败
const handleError = (err, file) => {
  emit('error', { err, file, fileList: fileList.value });
};

// 上传进度
const handleProgress = (event, file) => {
  emit('progress', { event, file, fileList: fileList.value });
};

// 删除文件
const handleRemove = (file) => {
  emit('remove', { file, fileList: fileList.value });
};

// 预览图片
const handlePreview = (file) => {
  if (isImage(file)) {
    previewImage.value = file.url || getObjectURL(file);
    previewVisible.value = true;
  }
};
</script>

<style lang="scss" scoped>
.image-uploader {
  .uploader-main {
    :deep(.el-upload) {
      width: 100px;
      height: 100px;
      line-height: 100px;
    }

    :deep(.el-upload-list__item) {
      transition: all 0.3s;
    }
  }

  .file-item {
    position: relative;
    width: 100%;
    height: 100%;

    &:hover .file-actions {
      opacity: 1;
    }

    .file-thumb {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .file-actions {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      opacity: 0;
      transition: opacity 0.3s;
      display: flex;
      align-items: center;
      justify-content: center;

      .el-icon {
        color: #fff;
        font-size: 20px;
        cursor: pointer;

        &:hover {
          color: var(--el-color-primary);
        }
      }

      .upload-progress {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 0 10px;
      }
    }
  }

  .preview-image {
    width: 100%;
    height: 70vh;
    object-fit: contain;
  }

  .upload-tip {
    color: var(--el-text-color-secondary);
    font-size: 12px;
    margin-top: 8px;
  }

  .tip-text {
    color: var(--el-color-info);
    font-size: 14px;
  }
}
</style>
