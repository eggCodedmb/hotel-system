<template>
  <div class="page">
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
      <el-button type="primary" @click="addRoom">新增</el-button>
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
        <el-button type="primary" size="small" @click="handleEdit(row)"
          >详情</el-button
        >
        <el-button type="primary" size="small" @click="addRoom(row)"
          >编辑</el-button
        >
        <el-button type="danger" size="small" @click="handleDelete(row)"
          >删除</el-button
        >
      </template>
      <template #state="{ row }">
        <el-tag :type="row.state === 0 ? 'success' : 'danger'">{{
          row.state === "空闲" ? "空闲" : "已预订"
        }}</el-tag>
      </template>
      <template #image="{ row }">
        <el-image :src="row.image" style="width: 60px; height: 60px" />
      </template>
    </c-table>
  </div>
  <RoomForm ref="roomForm" />
</template>

<script>
import CTable from "@/components/CTable.vue";
import RoomForm from "./components/RoomForm.vue";
export default {
  components: {
    CTable,
    RoomForm,
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
      // 获取pubilc图片
      image: "https://picsum.photos/200/100",
      total: 0,
      currentPage: 1,
      pageSize: 10,
    };
  },
  mounted() {
    this.initTable();
    this.getTableData();
    this.tableData = [
      {
        roomName: "101",
        type: "单人间",
        price: "100",
        state: "空闲",
        image: this.image,
      },
      {
        roomName: "102",
        type: "双人间",
        price: "200",
        state: "已预订",
        image: this.image,
      },
      {
        roomName: "103",
        type: "三人间",
        price: "300",
        state: "空闲",
        image: this.image,
      },
      {
        roomName: "104",
        type: "四人间",
        price: "400",
        state: "已预订",
        image: this.image,
      },
    ];
  },
  methods: {
    addRoom() {
      this.$refs.roomForm.openDialog();
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
          label: "房间号",
          prop: "roomName",
        },
        {
          label: "房间类型",
          prop: "type",
        },
        {
          label: "房间价格",
          prop: "price",
        },
        {
          label: "房间图片",
          slotName: "image",
        },
        {
          label: "房间状态",
          slotName: "state",
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
