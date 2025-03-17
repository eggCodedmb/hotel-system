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
      <template #action="{ row }">
        <el-button
          v-if="row.result !== '拒绝'"
          type="success"
          size="small"
          @click="handleApprove(row, 1)"
          :disabled="row.result === '通过'"
        >
          通过
        </el-button>
        <el-button
          v-if="row.result !== '通过'"
          type="danger"
          size="small"
          @click="handleApprove(row, 2)"
          :disabled="row.result === '拒绝'"
        >
          拒绝
        </el-button>
      </template>
    </c-table>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import CTable from '@/components/CTable.vue';
import { getLeaveList, updateLeave } from '@/api/leave';
import { dayjs } from 'element-plus';
import { useUserStore } from '@/store/modules/userStore';

const userStore = useUserStore();
const columns = [
  {
    label: '序号',
    type: 'id',
    width: 100,
    render: (row, index, column) => {
      return (currentPage.value - 1) * pageSize.value + index + 1;
    }
  },
  { label: '申请人', prop: 'leaveApplicant' },
  { label: '请假理由', prop: 'comment', width: 200 },
  { label: '结果', prop: 'result' },
  { label: '开始时间', prop: 'startTime', width: 180 },
  { label: '结束时间', prop: 'endTime', width: 180 },
  { label: '审批人', prop: 'approver' },
  { label: '审批时间', prop: 'approvalTime', width: 180 },
  { label: '操作', prop: 'action', slotName: 'action', width: 200 }
];

// 搜索表单
const searchForm = reactive({});

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
      { type: 'warning', confirmButtonText: '确定', cancelButtonText: '取消' }
    );
    const data = { ...row };
    data.result = status === 1 ? '通过' : '拒绝';
    data.approvalTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
    const res = await updateLeave(data);
    if (res.success) {
      loadData();
      ElMessage.success('操作成功');
    }
  } catch (error) {
    console.log('取消操作');
  }
};

const handlePageChange = (pagination) => {
  loadData();
};

// 搜索
const handleSearch = () => {
  loadData();
};

const loadData = async () => {
  const params = {
    approverId: userStore.user.employeeId,
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

onMounted(() => {
  loadData();
});
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
