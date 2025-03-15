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
              :label="item.itemText"
              :value="item.itemValue"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="部门">
          <el-select v-model="form.department" placeholder="请选择部门">
            <el-option
              v-for="(item, key) in depOptions"
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
  deleteEmployee,
  getEmployeeDetail
} from '@/api/user';
import useDict from '@/hooks/useDict';

export default {
  name: 'User',
  components: { CTable, UserForm },
  setup() {
    const { getDict, getDictValue } = useDict();

    const form = ref({});

    const depOptions = getDict('Department');
    const stateOptions = getDict('USER_STATUS');

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

    const handleDetail = async (row) => {
      const res = await getEmployeeDetail(row.id);
      if (res.success) {
        userForm.value.title = '员工详情';
        userForm.value.isEmployee = true;
        userForm.value.openDialog(res.result);
      } else {
        ElMessage.error(res.message);
      }
    };

    const handleEdit = async (row) => {
      const res = await getEmployeeDetail(row.id);
      if (res.success) {
        userForm.value.title = '编辑信息';
        userForm.value.isEmployee = true;
        userForm.value.openDialog(res.result);
      } else {
        ElMessage.error(res.message);
      }
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
    const handlePageChange = (currentPage, pageSize) => {
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
        currentPage.value = res.result.current | 1;
        pageSize.value = res.result.size | 10;
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
      {
        label: '状态',
        prop: 'status',
        render: (row) => {
          if (row.status === null) {
            return '--';
          }
          return getDictValue('USER_STATUS', row.status);
        }
      },
      {
        label: '部门',
        prop: 'department',
        render: (row) => {
          if (row.department === null) {
            return '--';
          }
          return getDictValue('Department', row.department);
        }
      },
      { label: '邮箱', prop: 'email' },
      { label: '电话', prop: 'phone' },
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
      getTableData,
      depOptions
    };
  }
};
</script>

<style scoped>
.right-main {
  width: 100%;
}
</style>
