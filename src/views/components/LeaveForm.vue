<template>
  <el-dialog
    :title="title"
    v-model="dialogVisible"
    :close-on-click-modal="false"
  >
    <el-form ref="refForm" :model="form" :rules="rules" label-width="80px">
      <el-row :gutter="20">
        <el-col :xs="24" :md="12">
          <el-form-item label="审批人" prop="approverId">
            <el-select
              v-model="form.approverId"
              placeholder="请选择审批人"
              clearable
              :disabled="isView"
              @change="handleApproverChange"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.itemText"
                :value="item.itemValue"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :md="12">
          <el-form-item label="请假人" prop="leaveApplicant">
            <el-input v-model="form.leaveApplicant" :disabled="true" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :md="12">
          <el-form-item label="开始时间" prop="startTime">
            <el-date-picker
              v-model="form.startTime"
              type="datetime"
              placeholder="请选择开始时间"
              :disabled="isView"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :md="12">
          <el-form-item label="结束时间" prop="endTime">
            <el-date-picker
              v-model="form.endTime"
              type="datetime"
              placeholder="请选择结束时间"
              :disabled="isView"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :md="24">
          <el-form-item label="请假理由" prop="comment">
            <el-input v-model="form.comment" type="textarea" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :md="24">
          <el-form-item label="审批结果">
            <el-input v-model="form.result" type="textarea" :disabled="true" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="warning" @click="closeDialog">关闭</el-button>
        <el-button type="primary" @click="submitForm">保存</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, defineExpose, defineEmits } from 'vue';
import { ElMessage } from 'element-plus';
import useDict from '@/hooks/useDict';
import { addLeave } from '@/api/Leave';
import { useUserStore } from '@/store/modules/userStore';

const userStore = useUserStore();

const form = ref({
  // approverId: '', //审批人id
  // approver: '', //审批人
  // leaveApplicantId: '', //请假人id
  // leaveApplicant: '', //请假人
  // startTime: '', //请假开始时间
  // endTime: '', //请假结束时间
  // result: '', //审批结果
  // comment: '', //备注
  // approvalTime: '' //审批时间
});
const userInfo = userStore.getUser;

form.value.leaveApplicant = userInfo?.name;
form.value.leaveApplicantId = userInfo?.id;
console.log(form.value);

const emit = defineEmits(['refresh']);

const title = ref('请假申请');
const refForm = ref(null);
const dialogVisible = ref(false);
const rules = ref({
  approverId: [{ required: true, message: '请选择审批人', trigger: 'change' }],
  leaveApplicantId: [
    { required: true, message: '请输入请假人', trigger: 'blur' }
  ],
  leaveApplicant: [
    { required: true, message: '请输入请假人', trigger: 'blur' }
  ],
  startTime: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
  endTime: [{ required: true, message: '请选择结束时间', trigger: 'change' }],
  comment: [{ required: true, message: '请输入请假理由', trigger: 'blur' }]
});
const { getDict } = useDict();
const isView = ref(false);
const options = getDict('SPR');

const openDialog = (row) => {
  dialogVisible.value = true;
};

const closeDialog = () => {
  dialogVisible.value = false;
};
const handleApproverChange = (value) => {
  const approver = options.find((item) => item.itemValue === value);
  form.value.approver = approver?.itemText;
};

const submitForm = () => {
  refForm.value.validate((valid) => {
    if (valid) {
      emit('refresh');
      onSubmit();
    } else {
      ElMessage.warning('请填写完整信息');
    }
  });
};
const onSubmit = async () => {
  const res = await addLeave(form.value);
  if (res.success) {
    ElMessage.success('申请已提交');
    closeDialog();
  } else {
    ElMessage.error(res.message);
  }
};

defineExpose({
  openDialog,
  title,
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
