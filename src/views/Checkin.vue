<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="6">
        <el-form-item label="房间号">
          <el-input v-model="form.roomId" placeholder="请输入" />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="客户姓名">
          <el-input v-model="form.customerName" placeholder="请输入" />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="客户手机">
          <el-input v-model="form.phone" placeholder="请输入" />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="房间状态">
          <el-select v-model="form.roomStatus" placeholder="请选择">
            <el-option
              v-for="(item, key) in stateOptions"
              :key="key"
              :label="item.itemText"
              :value="item.itemValue"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="3" :offset="21">
        <el-button type="primary" @click="handleSearch">查询</el-button>
        <el-button type="warning" @click="handleReset">重置</el-button>
      </el-col>
    </el-row>
    <el-col :span="21">
      <el-button type="primary" @click="handleReserve">预定客房</el-button>
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
        <!-- 入住 -->
        <!-- <el-button type="primary" size="small" @click="handleCheckin(row)"
          >入住</el-button
        > -->
        <!-- 查看 -->
        <el-button type="primary" size="small" @click="handleDetail(row)"
          >查看</el-button
        >
        <el-button type="primary" size="small" @click="handleEdit(row)"
          >编辑</el-button
        >
        <!-- 取消 -->
        <!-- <el-button type="warning" size="small" @click="handleCancel(row)"
          >取消</el-button
        > -->
      </template>
    </c-table>
  </div>
  <CheckinForm ref="checkinForm" @submit="onSubmit" />
</template>

<script>
import CTable from '@/components/CTable.vue';
import CheckinForm from './components/CheckinForm.vue';
import {
  addCheckin,
  getCheckinList,
  updateCheckin,
  getCheckinDetail
} from '@/api/checkin';
import { useDictStore } from '@/store/modules/dictStore';
export default {
  components: {
    CTable,
    CheckinForm
  },
  data() {
    return {
      form: {
        roomId: '',
        customerName: '',
        phone: ''
      },
      stateOptions: useDictStore().getDict('ROOMSTATUS') || [],
      typeOptions: useDictStore().getDict('ROOMTYPE') || [],
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
    async onSubmit(type, data) {
      if (type === 'add') {
        const res = await addCheckin(data);
        if (res.success) {
          this.$message({
            type: 'success',
            message: '添加成功'
          });
          this.getTableData();
        }
      } else if (type === 'edit') {
        const res = await updateCheckin(data);
        if (res.success) {
          this.$message({
            type: 'success',
            message: '修改成功'
          });
          this.getTableData();
        }
      }
    },
    // 搜索
    handleSearch() {
      this.getTableData();
    },

    // 重置
    handleReset() {
      this.form = {};
      this.getTableData();
    },

    // 入住
    handleCheckin(row) {
      this.$confirm('是否入住该客房？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const params = {
          id: row.id,
          status: '1'
        };
        const res = await updateCheckin(params);
        this.$message({
          type: 'success',
          message: res.message
        });
        this.getTableData();
      });
    },

    // 查看
    handleDetail(row) {
      this.$refs.checkinForm.title = '详情';
      this.$refs.checkinForm.isView = true;
      this.$refs.checkinForm.openDialog(row);
    },

    // 取消
    handleCancel(row) {
      this.$confirm('取消预约吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const params = {
          id: row.id,
          status: '0'
        };
        const res = await updateCheckin(params);
        if (res.success) {
          this.$message({
            type: 'success',
            message: '取消成功'
          });
          s;
          this.getTableData();
        }
      });
    },
    // 预订客房
    handleReserve(row) {
      this.$refs.checkinForm.title = '预定客房';
      this.$refs.checkinForm.openDialog();
    },

    handleEdit(row) {
      this.$refs.checkinForm.title = '编辑';
      this.$refs.checkinForm.isView = false;
      this.$refs.checkinForm.openDialog(row);
    },
    handleDelete(row) {
      this.$confirm('确定删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {});
    },
    handlePageChange(currentPage, pageSize) {
      this.currentPage = currentPage;
      this.pageSize = pageSize;
      this.getTableData();
    },
    async getTableData() {
      const params = {
        ...this.form,
        pageNumber: this.currentPage,
        pageSize: this.pageSize
      };
      // 删除空值
      Object.keys(params).forEach((key) => {
        if (!params[key]) {
          delete params[key];
        }
      });
      const res = await getCheckinList(params);
      if (res.success) {
        this.tableData = res.result.records;
        this.currentPage = res.result.pageNumber || 1;
        this.pageSize = res.result.pageSize || 10
        this.total = res.result.total
      } else {
        this.$message.error(res.message);
      }
    },
    initTable() {
      const columns = [
        {
          label: '序号',
          width: '80',
          prop: 'id',
          render: (row, index, column) => {
            console.log(index);

            return (this.currentPage - 1) * this.pageSize + index + 1;
          }
        },
        {
          label: '房间号',
          prop: 'roomId'
        },
        {
          label: '客户姓名',
          prop: 'customerName'
        },
        {
          label: '联系方式',
          prop: 'phone'
        },
        {
          label: '入住时间',
          prop: 'beginTime'
        },
        {
          label: '退房时间',
          prop: 'endTime'
        },
        {
          label: '操作',
          slotName: 'action',
          width: 300
        }
      ];
      this.columns = columns;
    }
  }
};
</script>

<style></style>
