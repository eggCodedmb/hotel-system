<template>
  <el-dialog
    :title="title"
    v-model="dialogVisible"
    :close-on-click-modal="false"
    width="800px"
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
          <el-form-item label="姓名" prop="name">
            <el-input
              v-model="form.name"
              placeholder="请输入入住人姓名"
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
              <el-option label="单人间" value="单人间" />
              <el-option label="双人间" value="双人间" />
              <el-option label="套房" value="套房" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :md="12">
          <el-form-item label="房间号" prop="roomNum">
            <!-- 下拉框 -->
            <el-select
              v-model="form.roomNum"
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
          <el-form-item label="入住人数" prop="peopleNum">
            <el-input-number
              v-model="form.peopleNum"
              :min="1"
              :max="4"
              controls-position="right"
              style="width: 100%"
            />
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
          <el-form-item label="入住时间" prop="checkinTime">
            <el-date-picker
              v-model="form.checkinTime"
              type="datetime"
              placeholder="选择日期和时间"
              value-format="YYYY-MM-DD HH:mm:ss"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="submitForm">确认预订</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, defineExpose } from "vue";
import { ElMessage } from "element-plus";

const form = ref({
  name: "",
  type: "",
  roomNum: "",
  phone: "",
  peopleNum: 1,
  idCard: "",
  checkinTime: "",
});

const rules = ref({
  name: [
    { required: true, message: "请输入姓名", trigger: "blur" },
    { min: 2, max: 10, message: "姓名长度为2-10个字符", trigger: "blur" },
  ],
  phone: [
    { required: true, message: "请输入手机号", trigger: "blur" },
    { pattern: /^1[3-9]\d{9}$/, message: "手机号格式不正确", trigger: "blur" },
  ],
  type: [{ required: true, message: "请选择房型", trigger: "change" }],
  roomNum: [
    { required: true, message: "请输入房间号", trigger: "blur" },
    { pattern: /^\d{3}$/, message: "房间号为3位数字", trigger: "blur" },
  ],
  peopleNum: [{ required: true, message: "请选择入住人数", trigger: "blur" }],
  idCard: [
    { required: true, message: "请输入身份证号", trigger: "blur" },
    {
      pattern: /^\d{17}[\dXx]$/,
      message: "身份证号格式不正确",
      trigger: "blur",
    },
  ],
  checkinTime: [
    { required: true, message: "请选择入住时间", trigger: "change" },
  ],
});

const title = ref("客房预订");
const dialogVisible = ref(false);
const refForm = ref(null);

const openDialog = () => {
  dialogVisible.value = true;
};

const closeDialog = () => {
  dialogVisible.value = false;
  refForm.value.resetFields();
  form.value.peopleNum = 1; // 重置为默认值
};

const submitForm = () => {
  refForm.value.validate((valid) => {
    if (valid) {
      // 这里添加实际提交逻辑
      console.log("预订信息:", form.value);
      ElMessage.success("预订成功");
      closeDialog();
    } else {
      ElMessage.warning("请完善表单信息");
      return false;
    }
  });
};

defineExpose({
  openDialog,
  title,
});
</script>

<style scoped>
.el-input-number :deep(.el-input__inner) {
  text-align: left;
}
</style>
