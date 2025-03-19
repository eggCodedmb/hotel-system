<template>
  <el-dialog
    :title="title"
    v-model="dialogVisible"
    :close-on-click-modal="false"
    :show-close="false"
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
              :disabled="isEmployee || isView"
            />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :md="12">
          <el-form-item label="部门" prop="department">
            <el-select
              v-model="form.department"
              placeholder="请选择部门"
              style="width: 100%"
              :disabled="isView"
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
            <el-input
              v-model="form.name"
              placeholder="请输入姓名"
              clearable
              :disabled="isView"
            />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :md="12" v-if="isEmployee">
          <el-form-item label="密码" prop="password">
            <el-input
              v-model="form.password"
              type="password"
              placeholder="请输入密码"
              show-password
              :disabled="isView"
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
              :disabled="isView"
            />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :md="12" v-if="isEmployee">
          <el-form-item label="状态" prop="status">
            <el-select
              v-model="form.status"
              placeholder="请选择状态"
              style="width: 100%"
              :disabled="isView"
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
          <el-form-item label="邮箱" prop="email">
            <el-input
              v-model="form.email"
              placeholder="请输入邮箱"
              clearable
              :disabled="isView"
            />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :md="12">
          <el-form-item label="角色" prop="role">
            <el-select
              v-model="form.role"
              placeholder="请选择角色"
              style="width: 100%"
              :disabled="isEmployee || isView"
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
          <el-form-item label="地址" prop="address">
            <el-input
              v-model="form.address"
              placeholder="请输入地址"
              clearable
              :disabled="isView"
            />
          </el-form-item>
        </el-col>

        <el-col :span="24" v-if="isEmployee">
          <el-form-item label="头像">
            <el-upload
              class="avatar-uploader"
              :show-file-list="false"
              :auto-upload="false"
              :before-upload="beforeImageUpload"
              :on-change="handleChange"
              :disabled="isView"
            >
              <img v-if="form.picture" :src="getUrl" class="avatar" />
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
        <template v-if="isEmployee">
          <el-button type="primary" @click="submitForm">保存</el-button>
        </template>
        <template v-else>
          <el-button type="warning" @click="closeDialog">关闭</el-button>
          <el-button :disabled="isView" type="primary" @click="submitForm"
            >保存</el-button
          >
        </template>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, defineExpose, defineEmits, computed } from 'vue';
import { Plus } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { addEmployee, updateEmployee } from '@/api/user';
import { uploadFile } from '@/api/upload';
import useDict from '@/hooks/useDict';
import { useUserStore } from '@/store/modules/userStore';
const userStore = useUserStore();

const form = ref({});
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

const getUrl = computed(() => {
  return import.meta.env.VITE_APP_RESOURCE_URL + form.value.picture;
});

//是否是员工
const isEmployee = ref(false);
const isView = ref(false);

const items = getDict('Department');

const openDialog = (row) => {
  dialogVisible.value = true;
  if (!row) return;
  form.value = Object.assign({}, row);
  form.value.password = '';
  form.value.role = '0';
  if (title.value === '员工详情') {
    isView.value = true;
  }
};

const closeDialog = () => {
  dialogVisible.value = false;
  isEmployee.value = false;
  isView.value = false;
  form.value = {};
};

const submitForm = () => {
  refForm.value.validate((valid) => {
    if (valid) {
      if (title.value === '新增员工') {
        saveUser();
      } else if (title.value === '编辑信息' || title.value === '完善信息') {
        handleEdit();
      }
      emit('refresh');
    } else {
      ElMessage.warning('请填写完整信息');
    }
  });
};

const handleChange = (file, fileList) => {
  console.log(file, fileList);

  uploadFile({ multipartFiles: file.raw }).then((res) => {
    if (res.success) {
      form.value.picture = res.result;
    } else {
      ElMessage.error('上传失败');
    }
  });
};

const beforeImageUpload = (file) => {
  const isImage = file.type.startsWith('image/');
  const isLt5M = file.size / 1024 / 1024 < 5;

  if (!isImage) {
    ElMessage.error('只能上传图片文件!');
    return false;
  }
  if (!isLt5M) {
    ElMessage.error('图片大小不能超过5MB!');
    return false;
  }
  return true;
};

const handleEdit = () => {
  const params = {
    id: form.value.id,
    employeeId: userStore.getUser.employeeId,
    loginName: form.value.loginName,
    password: form.value.password,
    role: form.value.role,
    name: form.value.name,
    picture: form.value.picture,
    phone: form.value.phone,
    email: form.value.email,
    address: form.value.address,
    department: form.value.department,
    status: form.value.status
  };
  updateEmployee(params).then((res) => {
    if (res.success) {
      ElMessage.success('修改成功');
      closeDialog();
    } else {
      ElMessage.error('修改失败');
    }
  });
};
const saveUser = () => {
  const params = {
    loginName: form.value.loginName,
    department: form.value.department,
    role: form.value.role
  };
  addEmployee(params).then((res) => {
    if (res.success) {
      ElMessage.success('添加成功');
      closeDialog();
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
