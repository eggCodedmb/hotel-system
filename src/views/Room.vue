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
            <el-option v-for="item in roomTypeOptions" :key="item.value" :label="item.label" :value="item.value">
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
            <el-option v-for="item in stateOptions" :key="item.value" :label="item.label" :value="item.value">
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
      <el-button type="primary" @click="addRoom">新增</el-button>
    </el-col>
    <c-table :columns="columns" :data="tableData" :total="total" v-model:current-page="currentPage"
      v-model:page-size="pageSize" @page-change="handlePageChange">
      <template #action="{ row }">
        <el-button type="warning" size="small" @click="handleCheckout(row)">退房</el-button>
        <el-button type="primary" size="small" @click="handleDetail(row)">详情</el-button>
        <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
        <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
      </template>
      <template #state="{ row }">
        <!-- 已入住：红色、已预定：蓝色、空闲：绿色、退房：黄色 -->
        <el-tag v-if="row.state === '已入住'" type="danger" effect="dark">已入住</el-tag>
        <el-tag v-if="row.state === '已预订'" type="primary" effect="dark">已预订</el-tag>
        <el-tag v-if="row.state === '空闲'" type="success" effect="dark">空闲</el-tag>
        <el-tag v-if="row.state === '已退房'" type="warning" effect="dark">已退房</el-tag>
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
import { ElMessage, ElMessageBox } from "element-plus";
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
        {
          value: 2,
          label: "已入住",
        },
        {
          value: 3,
          label: "已退房",
        }
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
      {
        roomName: "105",
        type: "单人间",
        price: "100",
        state: "已入住",
        image: this.image,
      },
      {
        roomName: "106",
        type: "双人间",
        price: "200",
        state: "已退房",
        image: this.image,
      },
      {
        roomName: "108",
        type: "四人间",
        price: "400",
        state: "已退房",
        image: this.image,
      },
    ];
  },
  methods: {
    addRoom() {
      this.$refs.roomForm.openDialog();
    },
    handleEdit(row) {
      this.$refs.roomForm.title = "编辑房间";
      this.$refs.roomForm.openDialog(row);
    },
    handleCheckout(row) {
      this.$confirm("确定退房吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
    },
    handleDetail(row) {
      this.$refs.roomForm.title = "房间详情";
      this.$refs.roomForm.openDialog(row);
    },
    handleDelete(row) {
      this.$confirm("确定删除该房间吗？", "提示", {
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
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
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
          width: 100,
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
          width: 90,
        },
        {
          label: "操作",
          slotName: "action",
          width: 300,
        },
      ];
      this.columns = columns;
    },
  },
};
</script>

<style></style>
