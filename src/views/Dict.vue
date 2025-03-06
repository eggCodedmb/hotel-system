<template>
  <div class="page">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-form-item label="字典名称">
          <el-input v-model="form.roomName" placeholder="请输入" />
        </el-form-item>
      </el-col>
      <el-col :span="18">
        <el-button type="primary">查询</el-button>
        <el-button type="primary">重置</el-button>
      </el-col>
    </el-row>

    <el-col :span="21">
      <el-button type="primary" @click="addDict">新增</el-button>
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
import { useDictStore } from "@/store/modules/dictStore";
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
      total: 0,
      currentPage: 1,
      pageSize: 10,
    };
  },
  mounted() {
    this.initTable();
    this.getTableData();
    console.log(useDictStore);
  },
  methods: {
    addDict() {},
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
    },
    initTable() {
      const columns = [
        {
          label: "序号",
          prop: "index",
          render: (row, index, column) => {
            return index + 1;
          },
        },
        {
          label: "字典名称",
          prop: "name",
        },
        {
          label: "字典标识",
          prop: "type",
        },
        {
          label: "字典值",
          prop: "value",
        },
        {
          label: "字典描述",
          prop: "description",
        },
        {
          label: "状态",
          prop: "status",
        },
        {
          label: "操作",
          slot: "action",
        },
      ];
      //  字典数据
      const tableData = [];
      this.columns = columns;
    },
  },
};
</script>

<style></style>
