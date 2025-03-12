<template>
  <div class="not-found-container">
    <div class="background-circles">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
      <div class="circle circle-3"></div>
    </div>

    <el-row class="content" justify="center" align="middle">
      <el-col :xs="24" :md="16" :lg="12">
        <div class="error-content">
          <div class="error-code animate__animated animate__pulse">404</div>
          <el-icon class="error-icon animate__animated animate__fadeIn">
            <Opportunity />
          </el-icon>
          <h1 class="title">页面消失在数字迷雾中</h1>
          <p class="description">
            我们尝试了所有可能的维度<br />
            依然没有找到您要访问的页面
          </p>
          <el-button type="primary" class="action-btn" round @click="goHome">
            <el-icon>
              <HomeFilled />
            </el-icon>
            <span>返回首页</span>
          </el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goHome = () => {
  router.push('/');
};
</script>

<style scoped>
.not-found-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  position: relative;
  overflow: hidden;
}

.background-circles {
  position: absolute;
  width: 100%;
  height: 100%;
}

.circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: float 15s infinite linear;
}

.circle-1 {
  width: 300px;
  height: 300px;
  top: -150px;
  left: -150px;
  animation-delay: 0s;
}

.circle-2 {
  width: 450px;
  height: 450px;
  bottom: -225px;
  right: -225px;
  animation-delay: -5s;
}

.circle-3 {
  width: 200px;
  height: 200px;
  top: 50%;
  left: 70%;
}

@keyframes float {
  0% {
    transform: translate(0, 0) rotate(0deg);
  }

  25% {
    transform: translate(10px, 10px) rotate(90deg);
  }

  50% {
    transform: translate(0, 20px) rotate(180deg);
  }

  75% {
    transform: translate(-10px, 10px) rotate(270deg);
  }

  100% {
    transform: translate(0, 0) rotate(360deg);
  }
}

.content {
  position: relative;
  height: 100vh;
  z-index: 1;
}

.error-content {
  text-align: center;
  color: white;
  padding: 20px;
}

.error-code {
  font-size: 8rem;
  font-weight: 800;
  opacity: 0.2;
  line-height: 1;
  margin-bottom: -2rem;
}

.error-icon {
  font-size: 6rem;
  margin-bottom: 1.5rem;
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
}

.title {
  font-size: 2rem;
  margin-bottom: 1rem;
  line-height: 1.3;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.description {
  font-size: 1.1rem;
  opacity: 0.9;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.action-btn {
  padding: 12px 32px;
  font-size: 1.1rem;
  background: rgba(255, 255, 255, 0.9);
  color: #6366f1;
  border: none;
  transition: all 0.3s ease;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

@media (max-width: 768px) {
  .error-code {
    font-size: 6rem;
  }

  .title {
    font-size: 1.5rem;
  }

  .description {
    font-size: 1rem;
  }
}
</style>
