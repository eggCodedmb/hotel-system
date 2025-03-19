<template>
  <el-dialog
    :title="title"
    v-model="dialogVisible"
    :close-on-click-modal="false"
    max-width="800px"
  >
    <el-form
      ref="refForm"
      :model="form"
      :rules="rules"
      label-width="100px"
      label-position="right"
    >
      <el-row :gutter="20">
        <!-- 第一行：姓名 + 手机号 -->
        <el-col :xs="24" :md="12">
          <el-form-item label="姓名" prop="customerName">
            <el-input
              v-model="form.customerName"
              placeholder="请输入"
              clearable
              :disabled="isView"
            />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :md="12">
          <el-form-item label="手机号" prop="phone">
            <el-input
              v-model="form.phone"
              placeholder="请输入联系电话"
              maxlength="11"
              :disabled="isView"
            />
          </el-form-item>
        </el-col>

        <!-- 第二行：房间状态 + 房间号 -->
        <el-col :xs="24" :md="12">
          <el-form-item label="房间状态" prop="roomStatus">
            <el-select
              v-model="form.roomStatus"
              placeholder="请选择房间状态"
              style="width: 100%"
              :disabled="isView"
              default-value="0"
            >
              <el-option
                v-for="(item, key) in statusOptions"
                :key="key"
                :label="item.itemText"
                :value="item.itemValue"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :md="12">
          <el-form-item label="房间号" prop="roomId">
            <el-select
              v-model="form.roomId"
              placeholder="请选择房间号"
              style="width: 100%"
              :disabled="isView"
            >
              <el-option
                v-for="(item, key) in roomList"
                :key="key"
                :label="item.itemText"
                :value="item.itemText"
              />
            </el-select>
          </el-form-item>
        </el-col>

        <!-- 第三行：状态 + 身份证号 -->
        <el-col :xs="24" :md="12">
          <el-form-item label="状态" prop="status">
            <el-select
              v-model="form.status"
              placeholder="请选择状态"
              style="width: 100%"
              :disabled="isView"
              default-value="0"
            >
              <el-option
                v-for="(item, key) in statusOptions"
                :key="key"
                :label="item.itemText"
                :value="item.itemValue"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :md="12">
          <el-form-item label="身份证号" prop="idcard">
            <el-input
              v-model="form.idcard"
              placeholder="请输入18位身份证号码"
              maxlength="18"
              show-word-limit
              :disabled="isView"
            />
          </el-form-item>
        </el-col>

        <!-- 第四行：入住时间 + 退房时间 -->
        <el-col :xs="24" :md="12">
          <el-form-item label="入住时间" prop="beginTime">
            <el-date-picker
              v-model="form.beginTime"
              type="datetime"
              placeholder="请选择入住时间"
              value-format="YYYY-MM-DD HH:mm:ss"
              style="width: 100%"
              :disabled="isView"
            />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :md="12">
          <el-form-item label="退房时间" prop="endTime">
            <el-date-picker
              v-model="form.endTime"
              type="datetime"
              placeholder="请选择退房时间"
              value-format="YYYY-MM-DD HH:mm:ss"
              style="width: 100%"
              :disabled="isView"
            />
          </el-form-item>
        </el-col>

        <!-- 备注 -->
        <el-col :xs="24">
          <el-form-item label="备注">
            <el-input
              v-model="form.remark"
              type="textarea"
              placeholder="请输入备注"
              maxlength="200"
              show-word-limit
              :disabled="isView"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <!-- 底部按钮 -->
    <template #footer>
      <div class="dialog-footer">
        <el-button type="warning" @click="closeDialog">取消</el-button>
        <el-button type="primary" v-if="!isView" @click="submitForm">{{
          title === '客房预订' ? '确认预订' : '预订'
        }}</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, defineExpose, defineEmits } from 'vue';
import { ElMessage } from 'element-plus';
import { useDictStore } from '@/store/modules/dictStore';
import useDict from '@/hooks/useDict';

const { roomList, getRoomListData } = useDict();

const form = ref({});
const rules = ref({
  roomId: [{ required: true, message: '请选择房间号', trigger: 'change' }],
  customerName: [{ required: true, message: '请输入客户姓名', trigger: 'blur' }],
  phone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    {
      pattern: /^1[3456789]\d{9}$/,
      message: '请输入正确的手机号码',
      trigger: 'blur'
    }
  ],
  idcard: [{ required: true, message: '请输入身份证号', trigger: 'blur' }],
  beginTime: [{ required: true, message: '请选择入住时间', trigger: 'change' }],
  endTime: [{ required: true, message: '请选择退房时间', trigger: 'change' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
  roomStatus: [{ required: true, message: '请选择房间状态', trigger: 'change' }]
});

const title = ref('客房预订');
const dialogVisible = ref(false);
const refForm = ref(null);
const isView = ref(false);

const statusOptions = useDictStore().getDict('ROOMSTATUS') || [];

const emit = defineEmits(['submit']);

const openDialog = (row) => {
  form.value = {};
  dialogVisible.value = true;
  if (row) {
    form.value = { ...row };
    if (row.status) {
      form.value.roomStatus = row.status;
    }
  }
};

const closeDialog = () => {
  dialogVisible.value = false;
  refForm.value.resetFields();
};

const submitForm = () => {
  refForm.value.validate((valid) => {
    if (valid) {
      const type = title.value === '客房预订' ? 'add' : 'edit';
      emit('submit', type, form.value);
      closeDialog();
    } else {
      ElMessage.warning('请完善表单信息');
      return false;
    }
  });
};

defineExpose({
  openDialog,
  title,
  isView
});
</script>

<style scoped>
/* 让输入框在移动端全宽 */
.el-input-number :deep(.el-input__inner) {
  text-align: left;
}
</style>
