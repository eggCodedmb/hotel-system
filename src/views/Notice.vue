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

        <!-- <el-date-picker
          v-model="publishDate"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="handleDateChange"
        /> -->
      </div>
    </div>

    <!-- 数据表格 -->
    <CTable
      :data="pageList"
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
import { ref, computed, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Plus, Search } from '@element-plus/icons-vue';
import dayjs from 'dayjs';
import NoticeForm from './components/NoticeForm.vue';
import CTable from '@/components/CTable.vue';
import {
  addNotice,
  updateNotice,
  deleteNotice,
  getNoticeList,
  getNoticeDetail
} from '@/api/notice';
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
  { label: '发布时间', prop: 'createTime' },
  { label: '发布人', prop: 'createPerson' },
  {
    label: '操作',
    width: 300,
    align: 'center',
    slotName: 'action'
  }
];

// 状态管理
const loading = ref(false);
const title = ref('');
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(mockData.length);
const pageList = ref([]);

// 方法
const handleAdd = () => {
  refNotice.value.title = '新增公告';
  refNotice.value.openDialog();
};

const handleEdit = (row) => {
  refNotice.value.title = '编辑公告';
  refNotice.value.openDialog(row);
};

const handleSubmit = async (type, data) => {
  if (type === 'add') {
    const res = await addNotice(data);
    if (res.success) {
      ElMessage.success('新增成功');
      noticeList();
    }
  } else {
    const res = await updateNotice(data);
    if (res.success) {
      ElMessage.success('编辑成功');
      noticeList();
    }
  }
};
const handleSearch = () => {
  noticeList();
};

const handleDelete = (id) => {
  ElMessageBox.confirm('确定删除该公告吗？', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    deleteNotice(id).then((res) => {
      if (res.success) {
        ElMessage.success('删除成功');
        noticeList();
      }
    });
  });
};

const noticeList = async () => {
  const parmas = {
    title: title.value,
    pageNumber: currentPage.value,
    pageSize: pageSize.value
  };
  const res = await getNoticeList(parmas);

  if (res.success) {
    pageList.value = res.result.records;
    total.value = res.result.total;
    pageSize.value = res.result.pageSize;
    currentPage.value = res.result.pageNumber;
  } else {
    ElMessage.error(res.message);
  }
};

const handlePageChange = () => {};

onMounted(() => {
  noticeList();
});
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
