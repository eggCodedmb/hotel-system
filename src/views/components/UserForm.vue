<template>
  <el-dialog :title="title" v-model="dialogVisible" :close-on-click-modal="false">
    <el-form ref="refForm" :model="form" :rules="rules" label-width="100px" label-position="right" class="custom-form">
      <el-row :gutter="20">
        <!-- 第一行：用户名 + 密码 -->
        <el-col :xs="24" :md="12">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="form.username" placeholder="请输入用户名" clearable />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :md="12">
          <el-form-item label="密码" prop="password">
            <el-input v-model="form.password" type="password" placeholder="请输入密码" show-password />
          </el-form-item>
        </el-col>

        <!-- 第二行：手机号 + 性别 -->
        <el-col :xs="24" :md="12">
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="form.phone" placeholder="请输入手机号" maxlength="11" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :md="12">
          <el-form-item label="性别" prop="gender">
            <el-radio-group v-model="form.gender">
              <el-radio label="1">男</el-radio>
              <el-radio label="0">女</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>

        <!-- 第三行：入职日期 + 角色 -->
        <el-col :xs="24" :md="12">
          <el-form-item label="入职日期" prop="entryDate">
            <el-date-picker v-model="form.entryDate" type="date" placeholder="选择日期" value-format="YYYY-MM-DD"
              style="width: 100%" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :md="12">
          <el-form-item label="角色" prop="role">
            <el-select v-model="form.role" placeholder="请选择角色" style="width: 100%">
              <el-option label="管理员" value="admin" />
              <el-option label="普通用户" value="common" />
            </el-select>
          </el-form-item>
        </el-col>

        <!-- 头像上传 -->
        <el-col :span="24">
          <el-form-item label="头像">
            <el-upload class="avatar-uploader" action="/api/upload" :show-file-list="false"
              :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
              <img v-if="form.avatar" :src="form.avatar" class="avatar" />
              <el-icon v-else class="avatar-uploader-icon">
                <Plus />
              </el-icon>
            </el-upload>
            <div class="upload-tip">建议尺寸 200x200，支持 JPG/PNG 格式</div>
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
import { ref, defineExpose, defineOptions, defineEmits } from "vue";
import { Plus } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
const form = ref({
  username: "",
  password: "",
  phone: "",
  date: "",
  role: "",
  gender: "",
  avatar: "",
});
const emit = defineEmits(["refresh"]);

const title = ref("新增用户");
const refForm = ref(null);
const dialogVisible = ref(false);

const rules = ref({
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    {
      min: 3,
      max: 15,
      message: "用户名长度在 3 到 15 个字符",
      trigger: "blur",
    },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 6, max: 20, message: "密码长度在 6 到 20 个字符", trigger: "blur" },
  ],
  phone: [
    { required: true, message: "请输入手机号", trigger: "blur" },
    {
      pattern: /^1[3456789]\d{9}$/,
      message: "请输入正确的手机号",
      trigger: "blur",
    },
  ],
  entryDate: [{ required: true, message: "请选择入职日期", trigger: "change" }],
  role: [{ required: true, message: "请选择角色", trigger: "change" }],
  gender: [{ required: true, message: "请选择性别", trigger: "change" }],
});

const openDialog = (row) => {
  dialogVisible.value = true;
  if (!row) return;
  form.value = { ...row };
};

const closeDialog = () => {
  dialogVisible.value = false;
  refForm.value.resetFields();
};

const handleAvatarSuccess = (res) => {
  form.value.avatar = res.url;
};

const beforeAvatarUpload = (file) => { };

const submitForm = () => {
  refForm.value.validate((valid) => {
    if (valid) {
      emit("refresh");
      closeDialog();
    } else {
      ElMessage.warning("请填写完整信息");
    }
  });
};
defineExpose({
  openDialog,
  title,
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
