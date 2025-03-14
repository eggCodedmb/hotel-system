<template>
  <el-dialog
    :title="title"
    v-model="dialogVisible"
    :close-on-click-modal="false"
    max-Width="800px"
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
            />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :md="12">
          <el-form-item label="手机号" prop="phone">
            <el-input
              v-model="form.phone"
              placeholder="请输入联系电话"
              maxlength="11"
            />
          </el-form-item>
        </el-col>

        <!-- 第二行：房型 + 房间号 -->
        <el-col :xs="24" :md="12">
          <el-form-item label="房型" prop="type">
            <el-select
              v-model="form.type"
              placeholder="请选择房型"
              style="width: 100%"
            >
              <el-option
                v-for="(item, key) in typeOptions"
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
            >
              <el-option label="101" value="101" />
              <el-option label="102" value="102" />
              <el-option label="103" value="103" />
              <el-option label="104" value="104" />
              <el-option label="105" value="105" />
            </el-select>
          </el-form-item>
        </el-col>

        <!-- 第三行：入住人数 + 身份证号 -->
        <el-col :xs="24" :md="12">
          <el-form-item label="状态" prop="roomStatus">
            <el-select
              v-model="form.roomStatus"
              placeholder="请选择状态"
              style="width: 100%"
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
          <el-form-item label="身份证号" prop="idCard">
            <el-input
              v-model="form.idCard"
              placeholder="请输入18位身份证号码"
              maxlength="18"
              show-word-limit
            />
          </el-form-item>
        </el-col>

        <!-- 第四行：入住时间 -->
        <el-col :span="12">
          <el-form-item label="入住时间" prop="beginTime">
            <!-- 范围 -->
            <el-date-picker
              v-model="form.beginTime"
              type="datetime"
              placeholder="请选择入住时间"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="退房时间" prop="endTime">
            <el-date-picker
              v-model="form.endTime"
              type="datetime"
              placeholder="请选择退房时间"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <!-- remark -->
        <el-col :span="24">
          <el-form-item label="备注">
            <el-input
              v-model="form.remark"
              type="textarea"
              placeholder="请输入备注"
              maxlength="200"
              show-word-limit
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
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
import { ref, defineExpose, computed, defineEmits } from 'vue';
import { ElMessage } from 'element-plus';
import { useDictStore } from '@/store/modules/dictStore';

const form = ref({
  roomId: '',
  customerName: '',
  phone: '',
  roomStatus: '',
  beginTime: '', //入住时间
  endTime: '', //退房时间
  remark: '',
  status: '',
  idcard: ''
});
const rules = ref({
  roomId: [{ required: true, message: '请选择房间号', trigger: 'change' }],
  customerName: [
    { required: true, message: '请输入客户姓名', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    {
      pattern: /^1[3456789]\d{9}$/,
      message: '请输入正确的手机号码',
      trigger: 'blur'
    }
  ],
  idCard: [{ required: true, message: '请输入身份证号', trigger: 'blur' }],
  beginTime: [{ required: true, message: '请选择入住时间', trigger: 'change' }]
});
const title = ref('客房预订');
const dialogVisible = ref(false);
const refForm = ref(null);
const isView = ref(false);

const typeOptions = useDictStore().getDict('ROOMTYPE') || [];
const statusOptions = useDictStore().getDict('ROOMSTATUS') || [];

const emit = defineEmits(['submit']);

const openDialog = (row) => {
  dialogVisible.value = true;
  if (row) {
    form.value = row;
  }
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
  title
});
</script>

<style scoped>
.el-input-number :deep(.el-input__inner) {
  text-align: left;
}
</style>
