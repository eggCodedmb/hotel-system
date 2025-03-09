<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="6">
        <el-form-item label="房间号">
          <el-input v-model="form.roomName" placeholder="请输入" />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="房间类型">
          <el-select v-model="form.type" placeholder="请选择">
            <el-option
              v-for="item in roomTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="房间价格">
          <el-input v-model="form.price" placeholder="请输入" />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="房间状态">
          <el-select v-model="form.state" placeholder="请选择">
            <el-option
              v-for="item in stateOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="3" :offset="21">
        <el-button type="primary">查询</el-button>
        <el-button type="warning">重置</el-button>
      </el-col>
    </el-row>
    <el-col :span="21">
      <el-button type="primary">新增</el-button>
    </el-col>
    <c-table
      :columns="columns"
      :data="tableData"
      :total="total"
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      @page-change="handlePageChange"
    >
      <template #action="{ row }">
        <el-button type="primary" @click="handleEdit(row)">编辑</el-button>
        <el-button type="danger" @click="handleDelete(row)">删除</el-button>
      </template>
    </c-table>
  </div>
</template>

<script>
import CTable from "@/components/CTable.vue";
export default {
  components: {
    CTable,
  },
  data() {
    return {
      form: {
        roomName: "",
        type: "",
        price: "",
        state: null,
      },
      columns: [],
      tableData: [],
    };
  },
  mounted() {
    this.initTable();
    this.getTableData();
  },
  methods: {
    handleEdit(row) {
      console.log(row);
    },
    handleDelete(row) {
      console.log(row);
    },
    handlePageChange() {
      this.getTableData();
    },
    getTableData() {
      const params = {
        ...this.form,
        currentPage: this.currentPage,
        pageSize: this.pageSize,
      };
      console.log(params);
    },
    initTable() {
      // 财务管理
      const columns = [];
      const tableData = [];
      this.columns = columns;
      this.tableData = tableData;
    },
  },
};
</script>

<style></style>
