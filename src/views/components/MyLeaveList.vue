<template>
  <el-dialog
    :title="title"
    v-model="dialogVisible"
    :close-on-click-modal="false"
    width="80%"
  >
    <c-table
      :columns="columns"
      :data="tableData"
      :total="total"
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      @page-change="handlePageChange"
    >
      <template #action="{ row }">
        <el-tag :type="row.result === '通过' ? 'success' : 'danger'" />
      </template>
    </c-table>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="warning" @click="closeDialog">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, defineExpose } from 'vue';
import { getPersonalLeaveList } from '@/api/leave';
const title = ref('我的请假记录');
const refForm = ref(null);
const dialogVisible = ref(false);
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);
const tableData = ref([]);
const leaveApplicantId = ref('');
const loading = ref(false);
const openDialog = (id) => {
  dialogVisible.value = true;
  if (!id) return;
  leaveApplicantId.value = id;
  fetchData();
};

const closeDialog = () => {
  dialogVisible.value = false;
};

const handlePageChange = () => {
  fetchData();
};
const fetchData = async () => {
  loading.value = true;
  const params = {
    leaveApplicantId: leaveApplicantId.value,
    pageNumber: currentPage.value,
    pageSize: pageSize.value
  };
  const res = await getPersonalLeaveList(params);
  if (res.success) {
    tableData.value = res.result.records;
    total.value = res.result.total;
    currentPage.value = res.result.current;
    pageSize.value = res.result.size;
    // loading.value = false;
  }
};
defineExpose({
  openDialog,
  title
});

const columns = [
  { label: '申请人', prop: 'leaveApplicant' },
  { label: '请假理由', prop: 'comment', width: 200 },
  { label: '结果', prop: 'result' },
  { label: '开始时间', prop: 'startTime', width: 180 },
  { label: '结束时间', prop: 'endTime', width: 180 },
  { label: '审批时间', prop: 'approvalTime', width: 180 },
  { label: '审批人', prop: 'approver' }
];
</script>

<style scoped>
.custom-form {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.el-form-item {
  margin-bottom: 22px;
}

.form-footer {
  text-align: center;
  margin-top: 30px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .custom-form {
    padding: 10px;
  }

  .el-form-item {
    margin-bottom: 18px;
  }
}
</style>
