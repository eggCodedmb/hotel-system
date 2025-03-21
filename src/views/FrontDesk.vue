<template>
  <div class="app-container">
    <!-- 顶部导航 -->
    <el-header class="main-header">
      <div class="header-content">
        <h1 class="logo">{{ TITLE }}</h1>
      </div>
    </el-header>

    <!-- 主要内容区 -->
    <el-main>
      <!-- 公告轮播 -->
      <el-carousel
        :interval="5000"
        height="100px"
        class="announcement-carousel"
      >
        <el-carousel-item v-for="(item, index) in announcements" :key="index">
          <div class="announcement-item">
            <el-alert
              :title="item.title"
              :description="item.content"
              type="info"
              show-icon
            />
          </div>
        </el-carousel-item>
      </el-carousel>

      <!-- 房间筛选 -->
      <div class="filter-container">
        <el-form-item label="房型">
          <el-select
            v-model="roomType"
            placeholder="全部房型"
            @change="onChange"
            clearable
            style="width: 200px"
          >
            <el-option
              v-for="(item, key) in roomTypes"
              :key="key"
              :label="item.itemText"
              :value="item.itemValue"
            />
          </el-select>
        </el-form-item>
      </div>

      <!-- 房间展示 -->
      <el-row :gutter="20" class="room-list">
        <el-col
          v-for="room in rooms"
          :key="room.id"
          :xs="24"
          :sm="12"
          :md="8"
          :lg="6"
          class="room-item"
        >
          <el-card class="room-card" shadow="hover">
            <el-image
              :src="`${URL}${room.img}`"
              fit="cover"
              class="room-image"
              :preview-src-list="[`${URL}${room.img}`]"
            />
            <div class="room-info">
              <h3 class="room-title">
                {{ getDictValue('ROOMTYPE', room.type) }}
              </h3>
              <div class="room-tags">
                <el-tag type="info" size="small">
                  {{ getDictValue('ROOMSTATUS', room.status) }}
                </el-tag>
              </div>
              <div class="room-price">
                <span class="price">¥{{ room.price }}</span>
                <span class="unit">/ 晚</span>
              </div>
              <el-button
                type="primary"
                class="book-btn"
                @click="handleBook(room)"
              >
                立即预订
              </el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
  </div>
  <CheckinForm ref="checkinForm" @submit="onSubmit" />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { Search } from '@element-plus/icons-vue';
import CheckinForm from './components/CheckinForm.vue';
import { getNoticeList } from '@/api/notice';
import useDict from '@/hooks/useDict';
import { getRoomList } from '@/api/room';
import { addCheckin } from '@/api/checkin';
import { ElMessage } from 'element-plus';

const getURL = computed(() => {
  return import.meta.env.VITE_APP_RESOURCE_URL + imageUrl.value;
});

const URL = import.meta.env.VITE_APP_RESOURCE_URL;
const TITLE = import.meta.env.VITE_APP_TITLE;

const { getDict, getDictValue } = useDict();

// 公告数据
const announcements = ref([]);
// 预订表单
const checkinForm = ref(null);

// 分页
const pagination = ref({
  pageNumber: 1,
  pageSize: 10
});

// 获取房间列表
const getRoomListData = async () => {
  const parmas = {
    type: roomType.value,
    pageNumber: pagination.value.pageNumber,
    pageSize: pagination.value.pageSize
  };
  // 删除空字段
  Object.keys(parmas).forEach((key) => {
    if (!parmas[key]) {
      delete parmas[key];
    }
  });
  const res = await getRoomList(parmas);
  if (res.success) {
    rooms.value = res.result.records;
  } else {
    ElMessage.error(res.message);
  }
};

// 房间数据
const rooms = ref([]);

// 搜索条件
const searchKeyword = ref('');
const roomType = ref('');
const roomTypes = getDict('ROOMTYPE') || [];

// 预订处理
const handleBook = (room) => {
  checkinForm.value.title = '预定客房';
  checkinForm.value.openDialog(room);
};

const onSearch = () => {
  getRoomListData();
};

const onChange = () => {
  getRoomListData();
};

const noticeList = async () => {
  const parmas = {
    pageNumber: 1,
    pageSize: 99
  };
  // 删除空字段
  Object.keys(parmas).forEach((key) => {
    if (!parmas[key]) {
      delete parmas[key];
    }
  });
  const res = await getNoticeList(parmas);

  if (res.success) {
    announcements.value = res.result.records;
  } else {
    ElMessage.error(res.message);
  }
};
const onSubmit = async (type, form) => {
  const { id, ...parmas } = form;
  const res = await addCheckin(parmas);
  if (res.success) {
    ElMessage.success('预订成功');
    noticeList();
  }
};

onMounted(() => {
  noticeList();
  getRoomListData();
});
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
