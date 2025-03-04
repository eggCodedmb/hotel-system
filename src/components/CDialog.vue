<template>
  <el-dialog
    v-model="dialogVisible"
    :title="title"
    :width="width"
    :close-on-click-modal="closeOnClickModal"
    :destroy-on-close="destroyOnClose"
    @closed="handleClosed"
  >
    <!-- 内容插槽 -->
    <div class="dialog-content" :style="contentStyle">
      <slot name="form" :formRef="formRef"></slot>
    </div>

    <!-- 底部操作栏 -->
    <template #footer>
      <slot name="footer">
        <div class="dialog-footer">
          <el-button @click="handleCancel" :loading="loading">取消</el-button>
          <el-button type="primary" @click="handleConfirm" :loading="loading">
            {{ confirmText }}
          </el-button>
        </div>
      </slot>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch, defineExpose } from "vue";

const props = defineProps({
  // 是否显示弹窗
  modelValue: {
    type: Boolean,
    default: false,
  },
  // 标题
  title: {
    type: String,
    default: "表单弹窗",
  },
  // 弹窗宽度
  width: {
    type: [String, Number],
    default: "600px",
  },
  // 确认按钮文字
  confirmText: {
    type: String,
    default: "确定",
  },
  // 点击遮罩层关闭
  closeOnClickModal: {
    type: Boolean,
    default: false,
  },
  // 关闭时销毁内容
  destroyOnClose: {
    type: Boolean,
    default: true,
  },
  // 内容区域样式
  contentStyle: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(["update:modelValue", "confirm", "cancel", "closed"]);

const dialogVisible = ref(false);
const loading = ref(false);
const formRef = ref(null);

// 暴露方法给父组件
defineExpose({
  open: () => (dialogVisible.value = true),
  close: () => (dialogVisible.value = false),
  setLoading: (status) => (loading.value = status),
  getFormRef: () => formRef.value,
});

// 处理确认操作
const handleConfirm = async () => {};

// 处理取消操作
const handleCancel = () => {
  emit("cancel");
  dialogVisible.value = false;
};

// 弹窗关闭后处理
const handleClosed = () => {
  emit("closed");
  if (formRef.value) {
    formRef.value.resetFields();
  }
};

// 同步v-model状态
watch(
  () => props.modelValue,
  (val) => {
    dialogVisible.value = val;
  }
);

watch(dialogVisible, (val) => {
  emit("update:modelValue", val);
});
</script>

<style scoped>
.dialog-content {
  max-height: 70vh;
  overflow-y: auto;
  padding-right: 10px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  padding: 16px 0 0;
}
</style>
