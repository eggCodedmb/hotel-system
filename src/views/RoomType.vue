<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="8">
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
      <el-col :span="8">
        <el-form-item label="房间价格">
          <el-input v-model="form.price" placeholder="请输入" />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-button type="primary">查询</el-button>
        <el-button type="warning">重置</el-button>
      </el-col>
    </el-row>
    <el-col :span="21">
      <el-button type="primary" @click="addRoom">新增房型</el-button>
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
          >编辑</el-button
        >
        <el-button type="danger" size="small" @click="handleDelete(row)"
          >删除</el-button
        >
      </template>
    </c-table>
  </div>
  <RoomForm ref="roomForm" />
</template>

<script>
import CTable from '@/components/CTable.vue';
import RoomForm from './components/RoomTypeForm.vue';
export default {
  components: {
    CTable,
    RoomForm
  },
  data() {
    return {
      form: {},
      columns: [],
      tableData: [],
      total: 0,
      currentPage: 1,
      pageSize: 10
    };
  },
  mounted() {
    this.initTable();
    this.getTableData();
  },
  methods: {
    addRoom() {
      this.$refs.roomForm.openDialog();
    },
    handleEdit(row) {
      this.$refs.roomForm.title = '编辑房型';
      this.$refs.roomForm.openDialog(row);
    },
    handleDelete(row) {
      this.$confirm('确定删除该房型吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
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
        pageSize: this.pageSize
      };
      console.log(params);
    },
    initTable() {
      const columns = [
        {
          label: '序号',
          prop: 'index'
        },
        {
          label: '房间类型',
          prop: 'type'
        },
        {
          label: '房间价格',
          prop: 'price'
        },
        {
          label: '床数量',
          prop: 'bedNum',
          width: 90
        },
        {
          label: '操作',
          slotName: 'action',
          width: 300
        }
      ];

      const tableData = [
        {
          index: 1,
          type: '豪华大床房',
          price: '888元/晚',
          bedNum: 2
        },
        {
          index: 2,
          type: '标准双床房',
          price: '688元/晚',
          bedNum: 2
        },
        {
          index: 3,
          type: '家庭房',
          price: '1288元/晚',
          bedNum: 4
        }
      ];
      this.columns = columns;
      this.tableData = tableData;
    }
  }
};
</script>

<style></style>
