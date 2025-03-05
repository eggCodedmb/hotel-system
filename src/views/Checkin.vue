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
        <el-button type="primary">重置</el-button>
      </el-col>
    </el-row>
    <el-col :span="21">
      <el-button type="primary" @click="handleCheckin">预定客房</el-button>
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
        <!-- 查看 -->
        <el-button type="primary" size="small" @click="handleCheckin(row)"
          >查看</el-button
        >
        <el-button type="primary" size="small" @click="handleCheckin(row)"
          >编辑</el-button
        >
        <!-- 取消 -->
        <el-button type="warning" size="small" @click="handleCancel(row)"
          >取消</el-button
        >
        <el-button type="danger" size="small" @click="handleDelete(row)"
          >删除</el-button
        >
      </template>
    </c-table>
  </div>
  <CheckinForm ref="checkinForm" />
</template>

<script>
import CTable from "@/components/CTable.vue";
import CheckinForm from "./components/CheckinForm.vue";

export default {
  components: {
    CTable,
    CheckinForm,
  },
  data() {
    return {
      form: {
        roomName: "",
        type: "",
        price: "",
        state: null,
      },
      stateOptions: [
        {
          value: 0,
          label: "空闲",
        },
        {
          value: 1,
          label: "已预订",
        },
      ],
      roomTypeOptions: [
        {
          value: 0,
          label: "单人间",
        },
        {
          value: 1,
          label: "双人间",
        },
        {
          value: 2,
          label: "三人间",
        },
        {
          value: 3,
          label: "四人间",
        },
      ],
      columns: [],
      tableData: [],
    };
  },
  mounted() {
    this.initTable();
    this.getTableData();
  },
  methods: {
    // 预订客房
    handleCheckin() {
      this.$refs.checkinForm.openDialog();
    },

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
      const columns = [
        {
          label: "序号",
          prop: "index",
          key: "index",
          render: (row) => {},
        },
        {
          label: "姓名",
          prop: "name",
        },
        {
          label: "房间类型",
          prop: "type",
        },
        {
          label: "房间号",
          prop: "roomNum",
        },
        {
          label: "联系方式",
          prop: "phone",
        },
        {
          label: "人数",
          prop: "peopleNum",
        },
        {
          label: "入住时间",
          prop: "checkinTime",
        },
        {
          label: "操作",
          slotName: "action",
        },
      ];
      const tableData = [
        {
          name: "张三",
          type: "单人间",
          roomNum: "101",
          phone: "12345678901",
          peopleNum: 1,
          checkinTime: "2022-01-01 10:00:00",
        },
        {
          name: "李四",
          type: "双人间",
          roomNum: "102",
          phone: "12345678902",
          peopleNum: 2,
          checkinTime: "2022-01-02 14:00:00",
        },
        {
          name: "王五",
          type: "三人间",
          roomNum: "103",
          phone: "12345678903",
          peopleNum: 3,
          checkinTime: "2022-01-03 18:00:00",
        },
        {
          name: "赵六",
          type: "四人间",
          roomNum: "104",
          phone: "12345678904",
          peopleNum: 4,
          checkinTime: "2022-01-04 22:00:00",
        },
      ];
      this.columns = columns;
      this.tableData = tableData;
    },
  },
};
</script>

<style></style>
