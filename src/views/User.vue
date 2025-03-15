<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="6">
        <el-form-item label="姓名">
          <el-input v-model="form.name" placeholder="请输入姓名" />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="状态">
          <el-select v-model="form.status" placeholder="请选择状态">
            <el-option
              v-for="item in stateOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="部门">
          <el-select v-model="form.department" placeholder="请选择部门">
            <el-option
              v-for="(item, key) in items"
              :key="key"
              :label="item.itemText"
              :value="item.itemValue"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-button type="primary" @click="search">查询</el-button>
        <el-button type="warning" @click="resetForm">重置</el-button>
      </el-col>
    </el-row>

    <el-row>
      <el-button type="primary" @click="addUser">新增</el-button>
    </el-row>

    <c-table
      :columns="columns"
      :data="tableData"
      :total="total"
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      @page-change="handlePageChange"
    >
      <template #action="{ row }">
        <el-button type="primary" size="small" @click="handleDetail(row)"
          >详情</el-button
        >
        <el-button type="primary" size="small" @click="handleEdit(row)"
          >编辑</el-button
        >
        <el-button type="danger" size="small" @click="handleDelete(row)"
          >删除</el-button
        >
      </template>
    </c-table>
  </div>
  <UserForm ref="userForm" @refresh="getTableData" />
</template>

<script>
import { ref, reactive, onMounted, render } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import CTable from '@/components/CTable.vue';
import UserForm from './components/UserForm.vue';
import {
  addEmployee,
  updateEmployee,
  getEmployeeList,
  deleteEmployee
} from '@/api/user';

import useDict from '@/hooks/useDict';

export default {
  name: 'User',
  components: { CTable, UserForm },
  setup() {
    const { getDict } = useDict();

    const items = getDict('Department');
    const form = ref({
      name: '',
      status: '',
      department: ''
    });

    const stateOptions = ref([
      { value: 1, label: '正常' },
      { value: 2, label: '禁用' }
    ]);

    const tableData = ref([]);

    const currentPage = ref(1);
    const pageSize = ref(10);
    const total = ref(10);
    const userForm = ref(null);

    // 搜索
    const search = () => {
      getTableData();
    };

    // 重置表单
    const resetForm = () => {
      form.value = {};
      currentPage.value = 1;
      pageSize.value = 10;
      getTableData();
    };

    // 添加用户
    const addUser = () => {
      userForm.value.title = '新增员工';
      userForm.value.isEmployee = false;
      userForm.value.openDialog();
    };

    const handleDetail = (row) => {
      userForm.value.title = '员工详情';
      userForm.value.isEmployee = true;
      userForm.value.openDialog(row);
    };

    const handleEdit = (row) => {
      userForm.value.isEmployee = true;
      userForm.value.title = '编辑信息';
      userForm.value.openDialog(row);
    };

    const handleDelete = async (row) => {
      await ElMessageBox.confirm('确定删除该用户吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const res = await deleteEmployee(row.id);
          if (res.success) {
            ElMessage({
              type: 'success',
              message: '删除成功!'
            });
            getTableData();
          }
        })
        .catch(() => {
          ElMessage({
            type: 'info',
            message: '已取消删除'
          });
        });
    };

    // 处理分页
    const handlePageChange = ({ currentPage, pageSize }) => {
      currentPage.value = currentPage;
      pageSize.value = pageSize;
      getTableData();
    };

    const getTableData = async () => {
      const params = {
        pageNumber: currentPage.value,
        pageSize: pageSize.value,
        ...form.value
      };

      // 删除空值
      Object.keys(params).forEach((key) => {
        if (!params[key]) {
          delete params[key];
        }
      });

      const res = await getEmployeeList(params);
      if (res.success) {
        tableData.value = res.result.records;
        currentPage.value = res.result.pageNumber | 1;
        pageSize.value = res.result.pageSize | 10;
        total.value = res.result.total;
      } else {
        ElMessage.error(res.message);
      }
    };

    onMounted(() => {
      getTableData();
    });

    const columns = [
      {
        label: '序号',
        prop: 'id',
        width: 100,
        render: (row, index, column) => {
          return (currentPage.value - 1) * pageSize.value + index + 1;
        }
      },
      { label: '姓名', prop: 'name' },
      { label: '状态', prop: 'status' },
      { label: '部门', prop: 'department' },
      { label: '邮箱', prop: 'email' },
      { label: '电话', prop: 'phone' },
      // { label: '头像', prop: 'picture' },
      { label: '操作', slotName: 'action', width: 300 }
    ];

    return {
      form,
      stateOptions,
      columns,
      tableData,
      currentPage,
      pageSize,
      total,
      search,
      resetForm,
      addUser,
      handleDetail,
      handleEdit,
      handleDelete,
      handlePageChange,
      userForm,
      getTableData
    };
  }
};
</script>

<style scoped>
.right-main {
  width: 100%;
}
</style>
