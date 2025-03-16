<template>
  <div class="leave-approval-container">
    <el-form :model="searchForm">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="申请人">
            <el-input
              v-model="searchForm.leaveApplicant"
              placeholder="请输入姓名"
              clearable
            />
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
import { ref, reactive, render } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import dayjs from 'dayjs';
import CTable from '@/components/CTable.vue';
import { addLeave, getLeaveList, updateLeave, deleteLeave } from '@/api/leave';

const columns = [
  {
    label: '序号',
    type: 'id',
    width: 120,
    render: (row, index, column) => {
      return (currentPage.value - 1) * pageSize.value + index + 1;
    }
  },
  { label: '申请人', prop: 'leaveApplicant' },
  { label: '结果', prop: 'result' },
  {
    label: '开始请假时间',
    prop: 'startTime',
    formatter: (row) => `${row.startTime} 至 ${row.endTime}`
  },
  { label: '结束请假时间', prop: 'endTime' },
  { label: '理由', prop: 'comment' },
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
  leaveApplicant: ''
});

// 分页参数
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

// 弹窗控制
const dialogVisible = ref(false);
const currentRow = ref(null);

// 表格数据
const tableData = ref([]);

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

const handlePageChange = (pagination) => {
  loadData();
};

// 搜索
const handleSearch = () => {
  currentPage.value = 1;
  loadData();
};

const loadData = async () => {
  const params = {
    pageNumber: currentPage.value,
    pageSize: pageSize.value,
    ...searchForm
  };
  const res = await getLeaveList(params);
  if (res.success) {
    tableData.value = res.result.records;
    currentPage.value = res.result.current | 1;
    pageSize.value = res.result.size | 10;
    total.value = res.result.total;
  } else {
    ElMessage.error(res.message);
  }
};
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
