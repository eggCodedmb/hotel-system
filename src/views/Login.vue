<template>
  <div class="login-container">
    <div class="animated-background"></div>

    <el-card class="login-box">
      <div class="logo">
        <img src="/public/img/logo/2103833.png" alt="Hotel Logo" />
        <h1>酒店管理系统</h1>
      </div>

      <el-form
        :model="loginForm"
        :rules="loginRules"
        ref="loginFormRef"
        @keyup.enter="handleLogin"
      >
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
            prefix-icon="User"
            size="large"
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            prefix-icon="Lock"
            size="large"
            show-password
          />
        </el-form-item>

        <el-form-item>
          <el-checkbox v-model="rememberMe">记住密码</el-checkbox>
        </el-form-item>

        <el-button
          type="primary"
          size="large"
          class="login-btn"
          :loading="loading"
          @click="handleLogin"
        >
          登录系统
        </el-button>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import { useUserStore } from "@/store/modules/userStore";

const loginFormRef = ref();
const rememberMe = ref(false);
const loading = ref(false);
const router = useRouter();
const userStore = useUserStore();

const loginForm = reactive({
  username: "",
  password: "",
});

const loginRules = reactive({
  username: [{ required: true, message: "用户名不能为空", trigger: "blur" }],
  password: [
    { required: true, message: "密码不能为空", trigger: "blur" },
    { min: 6, message: "密码长度不能少于6位", trigger: "blur" },
  ],
});

const handleLogin = async () => {
  loading.value = true;
  loginFormRef.value.validate((valid) => {
    if (!valid) return;
    // TODO: 登录逻辑
    if (loginForm.username === "admin" && loginForm.password === "123456") {
      ElMessage.success("登录成功");
      router.push("/home");
      loading.value = false;
      userStore.saveUser(loginForm);
      if (rememberMe.value) {
        userStore.saveRemember(...loginForm);
      } else {
        userStore.removeRemember();
      }
    } else {
      ElMessage.warning("用户名或密码错误");
      loading.value = false;
    }
  });
};
</script>

<style scoped lang="scss">
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;

  .animated-background {
    position: absolute;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      45deg,
      #409eff,
      #79bbff,
      #a0cfff,
      #c6e2ff,
      #d9ecff
    );
    background-size: 400% 400%;
    animation: gradientBG 15s ease infinite;
    z-index: 0;
  }

  .login-box {
    width: 420px;
    padding: 40px;
    border-radius: 12px;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
    position: relative;
    z-index: 1;
    background: rgba(255, 255, 255, 0.95);

    .logo {
      text-align: center;
      margin-bottom: 40px;

      img {
        width: 80px;
        margin-bottom: 16px;
      }

      h1 {
        font-size: 24px;
        color: #303133;
        margin: 0;
      }
    }

    .forgot-password {
      float: right;
    }

    .login-btn {
      width: 100%;
      margin-top: 10px;
      letter-spacing: 2px;
      font-weight: bold;
    }
  }
}

@keyframes gradientBG {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>
