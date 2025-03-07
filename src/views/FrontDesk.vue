<template>
  <div class="app-container">
    <!-- 顶部导航 -->
    <el-header class="main-header">
      <div class="header-content">
        <h1 class="logo">蓝天酒店</h1>
      </div>
    </el-header>

    <!-- 主要内容区 -->
    <el-main>
      <!-- 公告轮播 -->
      <el-carousel :interval="5000" height="100px" class="announcement-carousel">
        <el-carousel-item v-for="(item, index) in announcements" :key="index">
          <div class="announcement-item">
            <el-alert :title="item.title" :description="item.content" type="info" show-icon />
          </div>
        </el-carousel-item>
      </el-carousel>

      <!-- 房间筛选 -->
      <div class="filter-container">
        <el-input placeholder="搜索房型" style="width: 300px" clearable v-model="searchKeyword">
          <template #append>
            <el-button :icon="Search" />
          </template>
        </el-input>
        <el-select v-model="roomType" placeholder="全部房型" clearable>
          <el-option v-for="item in roomTypes" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </div>

      <!-- 房间展示 -->
      <el-row :gutter="20" class="room-list">
        <el-col v-for="room in filteredRooms" :key="room.id" :xs="24" :sm="12" :md="8" :lg="6" class="room-item">
          <el-card class="room-card" shadow="hover">
            <el-image :src="room.image" fit="cover" class="room-image" :preview-src-list="[room.image]" />
            <div class="room-info">
              <h3 class="room-title">{{ room.name }}</h3>
              <div class="room-tags">
                <el-tag v-for="(tag, index) in room.tags" :key="index" type="info" size="small">
                  {{ tag }}
                </el-tag>
              </div>
              <div class="room-price">
                <span class="price">¥{{ room.price }}</span>
                <span class="unit">/ 晚</span>
              </div>
              <el-button type="primary" class="book-btn" @click="handleBook(room)">
                立即预订
              </el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
  </div>
  <CheckinForm ref="checkinForm" />
</template>

<script setup>
import { ref, computed } from "vue";
import { Search } from "@element-plus/icons-vue";
import CheckinForm from "./components/CheckinForm.vue";

// 公告数据
const announcements = ref([
  { title: "系统维护通知", content: "8月1日0:00-6:00进行系统升级维护" },
  { title: "优惠活动", content: "提前7天预订可享8折优惠" },
  { title: "节日问候", content: "中秋节期间赠送每位客人月饼礼盒" },
]);

const checkinForm = ref(null);

// 房间数据
const rooms = ref([
  {
    id: 1,
    name: "豪华海景套房",
    price: 1588,
    type: "suite",
    image: "https://via.placeholder.com/400x250",
    tags: ["65㎡", "海景阳台", "双人床"],
  },
  {
    id: 2,
    name: "行政商务房",
    price: 988,
    type: "business",
    image: "https://via.placeholder.com/400x250",
    tags: ["45㎡", "办公区", "高速WiFi"],
  },
]);

// 搜索条件
const searchKeyword = ref("");
const roomType = ref("");
const roomTypes = ref([
  { value: "suite", label: "套房" },
  { value: "business", label: "商务房" },
]);

// 过滤后的房间列表
const filteredRooms = computed(() => {
  return rooms.value.filter((room) => {
    const matchesSearch = room.name
      .toLowerCase()
      .includes(searchKeyword.value.toLowerCase());
    const matchesType = !roomType.value || room.type === roomType.value;
    return matchesSearch && matchesType;
  });
});

// 预订处理
const handleBook = (room) => {
  checkinForm.value.title = "预订房间";
  checkinForm.value.openDialog(room);
};
</script>

<style lang="scss" scoped>
.app-container {
  height: 100vh;
  background-color: #f5f7fa;
}

.main-header {
  background: linear-gradient(45deg, #1e3c72, #2a5298);
  color: white;
  height: 60px;
  padding: 0 20px;

  .header-content {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;

    .logo {
      font-size: 24px;
      margin: 0;
    }

    .user-info {
      display: flex;
      gap: 10px;
    }
  }
}

.announcement-carousel {
  margin-bottom: 30px;

  .announcement-item {
    padding: 20px;
  }
}

.filter-container {
  margin-bottom: 20px;
  display: flex;
  gap: 15px;
}

.room-list {
  margin-top: 20px;
}

.room-card {
  margin-bottom: 20px;
  transition: transform 0.3s;

  &:hover {
    transform: translateY(-5px);
  }

  .room-image {
    width: 100%;
    height: 200px;
    border-radius: 4px;
  }

  .room-info {
    padding: 15px;

    .room-title {
      margin: 0 0 10px;
      color: #1e3c72;
      font-size: 18px;
    }

    .room-tags {
      margin: 10px 0;
      display: flex;
      flex-wrap: wrap;
      gap: 5px;

      .el-tag {
        margin-right: 5px;
      }
    }

    .room-price {
      margin: 15px 0;

      .price {
        color: #e74c3c;
        font-size: 24px;
        font-weight: bold;
      }

      .unit {
        color: #999;
        font-size: 12px;
      }
    }

    .book-btn {
      width: 100%;
    }
  }
}
</style>
