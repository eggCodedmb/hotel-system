<template>
  <div class="announcement-management">
    <!-- 操作栏 -->
    <div class="operation-bar">
      <el-button type="primary" @click="handleAdd" :icon="Plus"
        >新增公告</el-button
      >

      <div class="search-area">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索公告标题"
          clearable
          style="width: 300px"
          @change="handleSearch"
        >
          <template #append>
            <el-button :icon="Search" />
          </template>
        </el-input>

        <el-date-picker
          v-model="publishDate"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="handleDateChange"
        />
      </div>
    </div>

    <!-- 数据表格 -->
    <CTable
      :data="filteredAnnouncements"
      :loading="loading"
      :columns="columns"
      :total="total"
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      @page-change="handlePageChange"
    >
      <template #action="{ row }">
        <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
        <el-button link type="danger" @click="handleDelete(row.id)"
          >删除</el-button
        >
      </template>
    </CTable>

    <!-- 编辑对话框 -->
    <NoticeForm ref="refNotice" @submit="handleSubmit" />
  </div>
</template>

<script setup>
import { ref, computed, render } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Plus, Search } from '@element-plus/icons-vue';
import dayjs from 'dayjs';
import NoticeForm from './components/NoticeForm.vue';
import CTable from '@/components/CTable.vue';
// 模拟数据
const mockData = Array.from({ length: 50 }).map((_, index) => ({
  id: index + 1,
  title: `系统公告 ${index + 1}`,
  content: `这里是第 ${index + 1} 条公告的详细内容，包含重要的系统更新信息...`,
  publisher: '管理员',
  status: index % 3 === 0 ? 0 : 1,
  publishTime: dayjs().subtract(index, 'day').format('YYYY-MM-DD HH:mm:ss')
}));

const refNotice = ref(null);

const columns = [
  { label: '标题', prop: 'title' },
  { label: '发布时间', prop: 'publishTime' },
  { label: '发布人', prop: 'publisher' },
  {
    label: '状态',
    prop: 'status',
    render: (row) => (row.status === 0 ? '已发布' : '未发布')
  },
  {
    label: '操作',
    width: 150,
    align: 'center',
    slotName: 'action'
  }
];

// 状态管理
const loading = ref(false);
const searchKeyword = ref('');
const publishDate = ref([]);
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(mockData.length);

const filteredAnnouncements = computed(() => {
  return mockData
    .filter((item) => {
      const keywordMatch = item.title.includes(searchKeyword.value);
      const dateMatch =
        publishDate.value?.length === 2
          ? dayjs(item.publishTime).isBetween(
              publishDate.value[0],
              publishDate.value[1]
            )
          : true;
      return keywordMatch && dateMatch;
    })
    .slice(
      (currentPage.value - 1) * pageSize.value,
      currentPage.value * pageSize.value
    );
});

// 方法
const handleAdd = () => {
  refNotice.value.title = '新增公告';
  refNotice.value.openDialog();
};

const handleEdit = (row) => {
  console.log(row);

  refNotice.value.title = '编辑公告';
  refNotice.value.openDialog(row);
};

const handleSubmit = async (type, data) => {
  if (type === 'add') {
  } else {
  }
};
const handleSearch = () => {};

const handleDateChange = (val) => {
  console.log(val);
};

const handleDelete = (id) => {
  ElMessageBox.confirm('确定删除该公告吗？', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 这里添加实际删除逻辑
    ElMessage.success('删除成功');
  });
};

const handlePageChange = () => {};
</script>

<style lang="scss" scoped>
.announcement-management {
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);

  .operation-bar {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;

    .search-area {
      display: flex;
      gap: 15px;
    }
  }

  .content-preview {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.5;
    color: #666;
  }

  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }

  :deep(.el-table__row:hover) {
    cursor: pointer;
    background-color: #f5f7fa !important;
  }

  :deep(.el-dialog) {
    border-radius: 8px;
  }
}
</style>
