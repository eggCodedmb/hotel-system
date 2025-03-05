<template>
  <div style="display: flex">
    <div style="max-width: 200px">
      <!-- 部门树 -->
      <dept-tree
        :data="treeData"
        :show-count="true"
        :lazy="true"
        @node-click="handleNodeClick"
        @check="handleCheck"
        @load="loadNode"
      />
    </div>
    <div class="right-main">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="姓名">
            <el-input v-model="form.name" placeholder="请输入姓名" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="状态">
            <el-select v-model="value" placeholder="请选择状态">
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
          <el-form-item label="职位">
            <el-input v-model="form.position" placeholder="请输入职位" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="search">查询</el-button>
          <el-button @click="resetForm">重置</el-button>
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
          <el-button type="primary" @click="handleEdit(row)">编辑</el-button>
          <el-button type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </c-table>
    </div>
  </div>
  <UserForm ref="refUserForm" />
</template>

<script>
import CTable from "@/components/CTable.vue";
import DeptTree from "@/components/DeptTree.vue";
import UserForm from "./components/UserForm.vue";
import CDialog from "@/components/CDialog.vue";
export default {
  name: "User",
  components: { CTable, DeptTree, UserForm, CDialog },
  data() {
    return {
      form: {
        name: "",
        state: 1,
        position: "",
      },
      stateOptions: [
        {
          value: 1,
          label: "正常",
        },
        {
          value: 2,
          label: "禁用",
        },
      ],
      columns: [],
      tableData: [],
      currentPage: 1,
      pageSize: 10,
      total: 100,
      treeData: [
        {
          id: 1,
          name: "总公司",
          count: 100,
          children: [
            {
              id: 2,
              name: "技术部",
              count: 50,
              isLeaf: false,
            },
          ],
        },
      ],
    };
  },
  methods: {
    search() {
      console.log(this.form);
    },
    resetForm() {
      this.form = {};
    },
    addUser() {
      this.$refs.refUserForm.openDialog();
    },
    // 处理分页变化
    handlePageChange({ currentPage, pageSize }) {
      this.currentPage = currentPage;
      this.pageSize = pageSize;
    },

    // 懒加载处理
    loadNode({ node, resolve }) {
      if (node.level === 0) return resolve(this.treeData);
      // 模拟异步加载
      setTimeout(() => {
        resolve([
          { id: 3, name: "前端组", count: 20, isLeaf: true },
          { id: 4, name: "后端组", count: 30, isLeaf: true },
        ]);
      }, 500);
    },

    // 节点点击处理
    handleNodeClick({ data }) {
      console.log("选中节点:", data);
    },

    // 复选框选中处理
    handleCheck({ checked }) {
      console.log("选中节点keys:", checked);
    },
    initTableData() {
      const columns = [
        {
          label: "日期",
          prop: "date",
        },
        {
          label: "姓名",
          prop: "name",
        },
        {
          label: "状态",
          prop: "status",
        },
        {
          label: "电话",
          prop: "phone",
        },
        {
          label: "操作",
          slotName: "action",
        },
      ];

      const tableData = [
        {
          date: "2016-05-02",
          name: "王小虎",
          status: "正常",
          phone: "13800138000",
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          status: "禁用",
          phone: "13800138000",
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          status: "禁用",
          phone: "13800138000",
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          status: "正常",
          phone: "13800138000",
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          status: "禁用",
          phone: "13800138000",
        },
      ];

      this.columns = columns;
      this.tableData = tableData;
    },
    handleEdit(row) {
      console.log("编辑", row);
    },
    handleDelete(row) {
      console.log("删除", row);
    },
  },
  mounted() {
    this.initTableData();
  },
};
</script>

<style lang="scss" scoped>
.right-main {
  width: 100%;
}
</style>
