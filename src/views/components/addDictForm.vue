<template>
  <el-dialog :title="title" v-model="dialogVisible" :close-on-click-modal="false">
    <el-row>
      <el-col>
        <el-form ref="refForm" :model="formData" :rules="rules" label-width="80px">
          <el-form-item label="字典名称" prop="dictName">
            <el-input v-model="formData.dictName" placeholder="请输入字典名称"></el-input>
          </el-form-item>
          <el-form-item label="字典代码" prop="dictCode">
            <el-input v-model="formData.dictCode" placeholder="请输入字典代码"></el-input>
          </el-form-item>
          <el-form-item label="详情">
            <el-input v-model="formData.dictDescription" type="textarea" placeholder="请输入字典详情"></el-input>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="warning" @click="closeDialog">关闭</el-button>
        <el-button type="primary" @click="submitForm">{{
          title == '新增字典' ? '新增' : '修改'
        }}</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, defineExpose, defineEmits, reactive, defineProps } from 'vue';
import { ElMessage } from 'element-plus';
import { addDict, updateDict } from '@/api/dict.js';
const formData = reactive({
  dictName: '',
  dictCode: '',
  dictDescription: ''
});
const emit = defineEmits(['submit']);

const title = ref('新增字典');
const refForm = ref(null);
const dialogVisible = ref(false);

const rules = ref({
  dictName: [{ required: true, message: '请输入字典名称', trigger: 'blur' }],
  dictCode: [{ required: true, message: '请输入字典代码', trigger: 'blur' }]
});

const openDialog = (row) => {
  dialogVisible.value = true;
  if (row) {
    formData.id = row.id;
    formData.dictName = row.dictName;
    formData.dictCode = row.dictCode;
    formData.dictDescription = row.dictDescription;
  }
};

const closeDialog = () => {
  dialogVisible.value = false;
  refForm.value.resetFields();
};

const submitForm = () => {
  refForm.value.validate(async (valid) => {
    if (valid) {
      if (title.value === '编辑字典') {
        const res = await updateDict(formData);
        if (res.success) {
          ElMessage.success('编辑成功');
        }
      } else if (title.value === '新增字典') {
        const res = await addDict(formData);
        if (res.success) {
          ElMessage.success('新增成功');
        }
      }
      emit('submit');
      closeDialog();
    } else {
      ElMessage.warning('请填写完整信息');
    }
  });
};

defineExpose({
  openDialog,
  title
});
</script>

<style scoped>
.custom-form {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.pagination-table-container {
  padding: 0 !important;
  margin: 0 !important;
}

.el-form-item {
  margin-bottom: 22px;
}

.form-footer {
  text-align: center;
  margin-top: 30px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .custom-form {
    padding: 10px;
  }

  .el-form-item {
    margin-bottom: 18px;
  }
}
</style>
