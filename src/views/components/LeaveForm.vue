<template>
  <el-dialog
    :title="title"
    v-model="dialogVisible"
    :close-on-click-modal="false"
  >
    <el-form> </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="warning" @click="closeDialog">关闭</el-button>
        <el-button type="primary" @click="submitForm">保存</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, defineExpose, defineOptions, defineEmits } from 'vue';
import { Plus } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import {
  addEmployee,
  updateEmployee,
  getEmployeeList,
  deleteEmployee
} from '@/api/user';

import useDict from '@/hooks/useDict';

const form = ref({
  approverId: '',
  approver: '',
  leaveApplicantId: '',
  leaveApplicant: '',
  startTime: '',
  endTime: '',
  result: '',
  comment: '',
  approvalTime: ''
});
const emit = defineEmits(['refresh']);

const title = ref('请假申请');
const refForm = ref(null);
const dialogVisible = ref(false);

const rules = ref({});

const { getDict } = useDict();

//是否是员工
const isEmployee = ref(false);
const isView = ref(false);

const items = getDict('Department');

const openDialog = (row) => {
  dialogVisible.value = true;
  if (!row) return;
  form.value = { ...row };
  if (title.value === '详情') {
    isView.value = true;
  }
};

const closeDialog = () => {
  dialogVisible.value = false;
  refForm.value.resetFields();
};

const submitForm = () => {
  refForm.value.validate((valid) => {
    if (valid) {
      if (title.value === '新增员工') {
        saveUser();
      } else if (title.value === '编辑信息') {
        handleEdit();
      }
      emit('refresh');
      closeDialog();
    } else {
      ElMessage.warning('请填写完整信息');
    }
  });
};

const handleEdit = () => {
  updateEmployee(form.value).then((res) => {
    if (res.success) {
      ElMessage.success('修改成功');
    } else {
      ElMessage.error('修改失败');
    }
  });
};
const saveUser = () => {
  const params = {
    loginName: form.value.loginName,
    department: form.value.department
  };
  addEmployee(params).then((res) => {
    if (res.success) {
      ElMessage.success('添加成功');
    } else {
      ElMessage.error('添加失败');
    }
  });
};

defineExpose({
  openDialog,
  title,
  isEmployee,
  isView
});
</script>

<style scoped>
.custom-form {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.el-form-item {
  margin-bottom: 22px;
}

.avatar-uploader {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 100px;
  height: 100px;
  transition: border-color 0.3s;
}

.avatar-uploader:hover {
  border-color: var(--el-color-primary);
}

.avatar-uploader-icon {
  font-size: 24px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  text-align: center;
}

.avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-tip {
  font-size: 12px;
  color: #909399;
  margin-top: 8px;
  padding-left: 10px;
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
