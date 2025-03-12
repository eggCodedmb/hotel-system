<template>
  <div class="leave-approval-container">
    <el-form :model="searchForm">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="申请人">
            <el-input
              v-model="searchForm.applicant"
              placeholder="请输入姓名"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="请假类型">
            <el-select
              v-model="searchForm.type"
              clearable
              placeholder="请选择请假类型"
            >
              <el-option
                v-for="item in leaveTypes"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="状态">
            <el-select
              v-model="searchForm.status"
              clearable
              placeholder="请选择状态"
            >
              <el-option
                v-for="item in statusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item>
            <el-button type="primary" @click="handleSearch">搜索</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- 数据表格 -->
    <c-table
      :columns="columns"
      :data="tableData"
      :total="total"
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      @page-change="handlePageChange"
    >
      <template #status="{ row }">
        <el-tag :type="statusMap[row.status].type">
          {{ statusMap[row.status].label }}
        </el-tag>
      </template>
      <template #action="{ row }">
        <el-button type="primary" size="small" @click="showDetail(row)"
          >详情</el-button
        >
        <el-button
          v-if="row.status === 0"
          type="success"
          size="small"
          @click="handleApprove(row, 1)"
        >
          通过
        </el-button>
        <el-button
          v-if="row.status === 0"
          type="danger"
          size="small"
          @click="handleApprove(row, 2)"
        >
          拒绝
        </el-button>
      </template>
    </c-table>

    <!-- 审批对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="`审批详情 - ${currentRow?.applicant}`"
      width="40%"
    >
      <el-descriptions :column="1" border>
        <el-descriptions-item label="申请人">{{
          currentRow?.applicant
        }}</el-descriptions-item>
        <el-descriptions-item label="请假类型">{{
          currentRow?.type
        }}</el-descriptions-item>
        <el-descriptions-item label="请假时间">
          {{ dayjs(currentRow?.startTime).format('YYYY-MM-DD HH:mm') }} 至
          {{ dayjs(currentRow?.endTime).format('YYYY-MM-DD HH:mm') }}
        </el-descriptions-item>
        <el-descriptions-item label="请假事由">{{
          currentRow?.reason
        }}</el-descriptions-item>
        <el-descriptions-item label="附件">
          <el-link
            v-if="currentRow?.attachment"
            :href="currentRow.attachment"
            target="_blank"
          >
            下载附件
          </el-link>
        </el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button @click="dialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import dayjs from 'dayjs';
import CTable from '@/components/CTable.vue';

// 模拟数据
const mockData = [
  {
    id: 1,
    applicant: '张三',
    type: '事假',
    startTime: '2024-03-01 09:00',
    endTime: '2024-03-03 18:00',
    duration: 3,
    reason: '家庭事务处理',
    status: 0, // 0-待审批 1-已通过 2-已拒绝
    createTime: '2024-02-28 14:30',
    attachment: '/api/file/1'
  }
];
const columns = [
  { label: '申请人', prop: 'applicant' },
  { label: '请假类型', prop: 'type', tag: true, tagType: 'type' },
  {
    label: '请假时间',
    prop: 'startTime',
    formatter: (row) => `${row.startTime} 至 ${row.endTime}`
  },
  { label: '申请时间', prop: 'createTime' },
  {
    label: '请假时长',
    prop: 'duration',
    formatter: (row) => `${row.duration}天`
  },
  { label: '状态', prop: 'status', slotName: 'status' },
  { label: '操作', prop: 'action', slotName: 'action', width: 300 }
];

// 状态配置
const statusMap = {
  0: { label: '待审批', type: 'warning' },
  1: { label: '已通过', type: 'success' },
  2: { label: '已拒绝', type: 'danger' }
};

// 搜索表单
const searchForm = reactive({
  applicant: '',
  type: '',
  status: ''
});

// 分页参数
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(100);

// 弹窗控制
const dialogVisible = ref(false);
const currentRow = ref(null);

// 静态选项
const leaveTypes = [
  { label: '事假', value: '事假' },
  { label: '病假', value: '病假' },
  { label: '年假', value: '年假' }
];

const statusOptions = [
  { label: '待审批', value: 0 },
  { label: '已通过', value: 1 },
  { label: '已拒绝', value: 2 }
];

// 表格数据
const tableData = ref(mockData);

// 标签类型映射
const getTagType = (type) => {
  const map = {
    事假: 'primary',
    病假: 'warning',
    年假: 'success'
  };
  return map[type] || 'info';
};

// 操作处理
const showDetail = (row) => {
  currentRow.value = row;
  dialogVisible.value = true;
};

const handleApprove = async (row, status) => {
  try {
    await ElMessageBox.confirm(
      `确定要${status === 1 ? '通过' : '拒绝'}该申请吗？`,
      '操作确认',
      { type: 'warning' }
    );

    // 这里调用API接口
    row.status = status;
    ElMessage.success('操作成功');
  } catch (error) {
    console.log('取消操作');
  }
};

const handlePageChange = (page) => {};

// 搜索
const handleSearch = () => {
  currentPage.value = 1;
  loadData();
};

const loadData = async () => {};
</script>

<style scoped>
.leave-approval-container {
  padding: 20px;
}

.search-box {
  margin-bottom: 20px;
}

.table-box {
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
