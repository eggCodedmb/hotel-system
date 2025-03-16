<template>
  <div class="profile-container">
    <!-- 头部信息卡片 -->
    <el-card class="profile-card" shadow="hover">
      <div class="profile-header">
        <!-- 头像上传 -->
        <el-upload
          class="avatar-uploader"
          action="#"
          :show-file-list="false"
          :auto-upload="false"
          :on-change="handleAvatarChange"
        >
          <el-avatar :size="120" :src="getUrl">
            <img :src="getUrl" />
          </el-avatar>
          <div class="avatar-mask">
            <el-icon :size="24"><CameraFilled /></el-icon>
          </div>
        </el-upload>

        <!-- 用户信息 -->
        <div class="profile-info">
          <h2 class="username">{{ userInfo.loginName }}</h2>
          <div class="meta-info">
            <span
              ><el-icon><User /></el-icon>
              {{ getDictValue('ROLE', userInfo.role) }}</span
            >
            <el-divider direction="vertical" />
            <span
              ><el-icon><OfficeBuilding /></el-icon>
              {{ getDictValue('Department', userInfo.department) }}</span
            >
          </div>
          <div class="statistics">
            <!-- <el-statistic 
              title="项目数" 
              :value="userStats.projects" 
              class="stat-item"
            />
            <el-statistic
              title="获赞数"
              :value="userStats.likes"
              class="stat-item"
            />
            <el-statistic
              title="收藏数"
              :value="userStats.collections"
              class="stat-item"
            /> -->
          </div>
        </div>
      </div>
    </el-card>

    <!-- 详细信息卡片 -->
    <el-card class="info-card" shadow="never">
      <el-tabs v-model="activeTab" class="demo-tabs">
        <!-- 基本信息 -->
        <el-tab-pane label="基本信息" name="basic">
          <el-form
            ref="formRef"
            :model="userInfo"
            label-width="100px"
            label-position="left"
            :rules="formRules"
          >
            <el-row :gutter="40">
              <el-col :md="12" :sm="24">
                <el-form-item label="姓名" prop="name">
                  <el-input v-model="userInfo.name" />
                </el-form-item>
                <el-form-item label="状态" prop="status">
                  <el-select
                    v-model="userInfo.status"
                    placeholder="请选择状态"
                    disabled
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
              <el-col :md="12" :sm="24">
                <el-form-item label="手机号" prop="phone">
                  <el-input v-model="userInfo.phone" />
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                  <el-input v-model="userInfo.email" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item>
              <!-- <el-button type="primary" :icon="Edit" @click="handleSave">
                保存更改
              </el-button> -->
              <el-button type="primary" :icon="Edit" @click="onSubmit">
                我要请假
              </el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <!-- 安全设置 -->
        <el-tab-pane label="安全设置" name="security">
          <div class="security-item">
            <div class="security-info">
              <el-icon class="security-icon"><Lock /></el-icon>
              <div>
                <h4>重置密码</h4>
                <p>重置密码</p>
              </div>
            </div>
            <el-button type="warning" @click="reset">重置密码</el-button>
          </div>

          <el-divider />

          <!-- <div class="security-item">
            <div class="security-info">
              <el-icon class="security-icon"><Message /></el-icon>
              <div>
                <h4>安全邮箱</h4>
                <p>已绑定邮箱：example@domain.com</p>
              </div>
            </div>
            <el-button type="warning">更换邮箱</el-button>
          </div> -->
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
  <LeaveForm ref="LeaveRef" />
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { CameraFilled, Edit, Lock, Message } from '@element-plus/icons-vue';
import { useUserStore } from '@/store/modules/userStore';
import useDict from '@/hooks/useDict';
import LeaveForm from './components/LeaveForm.vue';
import { resetPassword } from '@/api/user';
import { ElMessage, ElMessageBox } from 'element-plus';

const getUrl = computed(() => {
  return import.meta.env.VITE_APP_RESOURCE_URL + userInfo.picture;
});

const { getDict, getDictValue } = useDict();

const userStore = useUserStore();
// 用户信息数据
const userInfo = reactive({
  ...userStore.getUser
});

const LeaveRef = ref(null);
const statusOptions = getDict('USER_STATUS');

// 表单验证规则
const formRules = reactive({
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码' }
  ]
});

// 头像上传处理
const handleAvatarChange = (file) => {
  const reader = new FileReader();
  reader.onload = () => {
    userInfo.avatar = reader.result;
  };
  reader.readAsDataURL(file.raw);
};

const reset = () => {
  ElMessageBox.confirm('确定要重置密码吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    const res = await resetPassword(userInfo.employeeId);
    if (res.success) {
      ElMessage.success('密码重置成功');
    } else {
      ElMessage.error('密码重置失败');
    }
  });
};

// 保存表单
const handleSave = () => {
  formRef.value.validate((valid) => {
    if (valid) {
    }
  });
};

const onSubmit = () => {
  LeaveRef.value.openDialog();
};
const activeTab = ref('basic');
const formRef = ref(null);
</script>

<style scoped lang="scss">
.profile-container {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;

  .profile-card {
    margin-bottom: 20px;
    border-radius: 12px;
    transition: box-shadow 0.3s;

    .profile-header {
      display: flex;
      align-items: center;
      padding: 24px;

      .avatar-uploader {
        position: relative;
        cursor: pointer;

        .avatar-mask {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          border-radius: 50%;
          opacity: 0;
          transition: opacity 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
        }

        &:hover .avatar-mask {
          opacity: 1;
        }
      }

      .profile-info {
        margin-left: 40px;

        .username {
          margin: 0 0 8px;
          font-size: 24px;
          color: var(--el-text-color-primary);
        }

        .meta-info {
          display: flex;
          align-items: center;
          color: var(--el-text-color-secondary);
          margin-bottom: 20px;

          span {
            display: flex;
            align-items: center;
            gap: 6px;
          }
        }

        .statistics {
          display: flex;
          gap: 30px;

          .stat-item {
            :deep(.el-statistic__content) {
              font-size: 20px;
              color: var(--el-color-primary);
            }
          }
        }
      }
    }
  }

  .info-card {
    border-radius: 12px;

    .security-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 0;

      .security-info {
        display: flex;
        align-items: center;
        gap: 16px;

        .security-icon {
          font-size: 24px;
          padding: 12px;
          background: var(--el-color-primary-light-9);
          border-radius: 8px;
          color: var(--el-color-primary);
        }

        h4 {
          margin: 0;
          font-weight: 500;
        }

        p {
          margin: 4px 0 0;
          color: var(--el-text-color-secondary);
          font-size: 14px;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .profile-header {
    flex-direction: column;
    text-align: center;

    .profile-info {
      margin-left: 0 !important;
      margin-top: 20px;
    }

    .statistics {
      flex-wrap: wrap;
      justify-content: center;
    }
  }
}
</style>
