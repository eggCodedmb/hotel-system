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
    <dict-form ref="dictForm" />
    <add-dict-form ref="addForm" @submit="getTableData" />
  </div>
</template>

<script>
import CTable from "@/components/CTable.vue";
import { useDictStore } from "@/store/modules/dictStore";
import DictForm from "./components/DictForm.vue";
import addDictForm from "./components/addDictForm.vue";
import { getDictList, getDictDetail, addDict, updateDict, deleteDict } from "@/api/dict.js";
export default {
  components: {
    CTable,
    DictForm,
    addDictForm,
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
  },
  methods: {
    addDict() {
      this.$refs.addForm.title = "新增字典";
      this.$refs.addForm.openDialog();
    },
    handleEdit(row) {
      this.$refs.dictForm.title = "编辑字典";
      this.$refs.dictForm.openDialog(row.id);
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
    async getTableData() {
      const params = {
        ...this.form,
        currentPage: this.currentPage,
        pageSize: this.pageSize,
      };
      const res = await getDictList(params);
      if (res.success) {
        this.tableData = res.result.records;
        this.total = res.result.total;
        this.currentPage = res.result.current;
        this.pageSize = res.result.size;
      }
    },

    refreshCache() {

    },
    initTable() {
      const columns = [
        {
          label: "序号",
          prop: "id",
          render: (row, index, column) => {
            return (this.currentPage - 1) * this.pageSize + index + 1;
          },
        },
        {
          label: "字典名称",
          prop: "dictName",
        },
        {
          label: "字典标识(唯一)",
          prop: "dictCode",
        },
        {
          label: "字典描述",
          prop: "dictDescription",
        },
        {
          label: "操作",
          slotName: "action",
        },
      ];
      this.columns = columns;
    },
  },
};
</script>

<style></style>
