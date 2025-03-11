<template>
  <div>
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
      <el-button type="danger" @click="refreshCache">刷新缓存</el-button>
    </el-col>
    <c-table :columns="columns" :data="tableData" :total="total" v-model:current-page="currentPage"
      v-model:page-size="pageSize" @page-change="handlePageChange">
      <template #action="{ row }">
        <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
        <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
      </template>
    </c-table>
    <dict-form ref="dictForm" @submit="getTableData" />
  </div>
</template>

<script>
import CTable from "@/components/CTable.vue";
import { useDictStore } from "@/store/modules/dictStore";
import DictForm from "./components/DictForm.vue";
import { getDictList, getDictDetail, addDict, addDictItem, updateDict, updateDictItem, deleteDict, deleteDictItem } from "@/api/dict.js";
export default {
  components: {
    CTable,
    DictForm,
  },
  data() {
    return {
      form: {},
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
    addDict() {
      this.$refs.dictForm.title = "新增字典";
      this.$refs.dictForm.openDialog();
    },
    handleEdit(row) {
      this.$refs.dictForm.title = "编辑字典";
      this.$refs.dictForm.openDialog(row);
    },
    handleDelete(row) {
      this.$confirm("确定删除该字典吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch(() => { });
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
    refreshCache() {

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
          label: "字典标识(唯一)",
          prop: "code",
        },
        {
          label: "操作",
          slotName: "action",
        },
      ];
      //  字典数据
      const tableData = [
        {
          name: "性别",
          code: "sex",
        },
        {
          name: "状态",
          code: "status",
        },
      ];
      this.columns = columns;
      this.tableData = tableData;
      this.total = tableData.length;
    },
  },
};
</script>

<style></style>
