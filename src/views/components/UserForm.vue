<template>
  <el-dialog
    :title="title"
    v-model="dialogVisible"
    :close-on-click-modal="false"
  >
    <el-form
      ref="refForm"
      :model="form"
      :rules="rules"
      label-width="100px"
      label-position="right"
      class="custom-form"
    >
      <el-row :gutter="20">
        <!-- 姓名、年龄 -->
        <el-col :xs="24" :md="12">
          <el-form-item label="账号" prop="loginName">
            <el-input
              v-model="form.loginName"
              placeholder="请输入账号"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :md="12">
          <el-form-item label="部门" prop="department">
            <el-select
              v-model="form.department"
              placeholder="请选择部门"
              style="width: 100%"
            >
              <el-option
                v-for="(item, key) in items"
                :key="key"
                :label="item.itemText"
                :value="item.itemValue"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :md="12" v-if="isEmployee">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="form.name" placeholder="请输入姓名" clearable />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :md="12" v-if="isEmployee">
          <el-form-item label="密码" prop="password">
            <el-input
              v-model="form.password"
              type="password"
              placeholder="请输入密码"
              show-password
            />
          </el-form-item>
        </el-col>

        <!-- 第二行：手机号 + 性别 -->
        <el-col :xs="24" :md="12" v-if="isEmployee">
          <el-form-item label="手机号" prop="phone">
            <el-input
              v-model="form.phone"
              placeholder="请输入手机号"
              maxlength="11"
            />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :md="12" v-if="isEmployee">
          <el-form-item label="状态" prop="status">
            <el-select
              v-model="form.status"
              placeholder="请选择状态"
              style="width: 100%"
            >
              <el-option
                v-for="(item, key) in getDict('USER_STATUS')"
                :key="key"
                :label="item.itemText"
                :value="item.itemValue"
              />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :xs="24" :md="12" v-if="isEmployee">
          <el-form-item label="入职日期" prop="entryDate">
            <el-date-picker
              v-model="form.entryDate"
              type="date"
              placeholder="选择日期"
              value-format="YYYY-MM-DD"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :md="12">
          <el-form-item label="角色" prop="role">
            <el-select
              v-model="form.role"
              placeholder="请选择角色"
              style="width: 100%"
            >
              <el-option
                v-for="item in getDict('ROLE')"
                :key="item.id"
                :label="item.itemText"
                :value="item.itemValue"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="isEmployee">
          <!-- <el-form-item label="头像">
            <el-upload
              class="avatar-uploader"
              :show-file-list="false"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="form.avatar" :src="form.avatar" class="avatar" />
              <el-icon v-else class="avatar-uploader-icon">
                <Plus />
              </el-icon>
            </el-upload>
            <div class="upload-tip">建议尺寸 200x200，支持 JPG/PNG 格式</div>
          </el-form-item> -->
          <!-- 地址 -->
          <el-form-item label="地址" prop="address">
            <el-input
              v-model="form.address"
              placeholder="请输入地址"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="isEmployee">
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="form.email" placeholder="请输入邮箱" clearable />
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
  employeeId: '',
  loginName: '',
  password: '',
  name: '',
  picture: '',
  phone: '',
  email: '',
  address: '',
  department: '',
  status: '',
  role: '0'
});
const emit = defineEmits(['refresh']);

const title = ref('新增员工');
const refForm = ref(null);
const dialogVisible = ref(false);

const rules = ref({
  loginName: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    {
      min: 3,
      max: 15,
      message: '用户名长度在 3 到 15 个字符',
      trigger: 'blur'
    }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    {
      pattern: /^1[3456789]\d{9}$/,
      message: '请输入正确的手机号',
      trigger: 'blur'
    }
  ],
  entryDate: [{ required: true, message: '请选择入职日期', trigger: 'change' }],
  role: [{ required: true, message: '请选择角色', trigger: 'change' }],
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      message: '请输入正确的邮箱',
      trigger: 'blur'
    }
  ],
  address: [{ required: true, message: '请输入地址', trigger: 'blur' }],
  department: [{ required: true, message: '请输入部门', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }]
});

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
    department: form.value.department,
    role: form.value.role,
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
