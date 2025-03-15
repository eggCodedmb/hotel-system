<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="6">
        <el-form-item label="房间号">
          <el-input v-model="form.roomId" placeholder="请输入" />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="房间类型">
          <el-select v-model="form.type" placeholder="请选择">
            <el-option
              v-for="item in roomTypeOptions"
              :key="item.id"
              :label="item.itemText"
              :value="item.itemValue"
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
          <el-select v-model="form.status" placeholder="请选择">
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
      <el-col :span="21">
        <el-button type="primary" @click="addRoom">新增</el-button>
      </el-col>
      <el-col :span="3">
        <el-button type="primary" @click="search">查询</el-button>
        <el-button type="warning" @click="reset">重置</el-button>
      </el-col>
    </el-row>
    <c-table
      :columns="columns"
      :data="tableData"
      :total="total"
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      @page-change="handlePageChange"
    >
      <template #img="{ row }">
        <!-- 按钮查看图片 -->
        <el-button type="primary" size="small" @click="handleImg(row)"
          >查看图片</el-button
        >
      </template>
      <template #action="{ row }">
        <!-- 入住 -->
        <el-button
          type="primary"
          v-if="['0', '3'].includes(row.status)"
          size="small"
          @click="handleCheckin(row)"
          >入住</el-button
        >
        <el-button
          type="warning"
          v-if="['1', '2'].includes(row.status)"
          size="small"
          @click="handleCheckout(row)"
          >退房</el-button
        >
        <el-button type="primary" size="small" @click="handleDetail(row)"
          >详情</el-button
        >
        <el-button type="primary" size="small" @click="handleEdit(row)"
          >编辑</el-button
        >
        <el-button type="danger" size="small" @click="handleDelete(row)"
          >删除</el-button
        >
      </template>
      <template #state="{ row }">
        <!-- 已入住：红色、已预定：蓝色、空闲：绿色、退房：黄色 -->
        <el-tag v-if="row.status === '0'" type="success" effect="dark"
          >空闲</el-tag
        >
        <el-tag v-if="row.status === '1'" type="danger" effect="dark"
          >已入住</el-tag
        >
        <el-tag v-if="row.status === '2'" type="primary" effect="dark"
          >已预订</el-tag
        >
        <el-tag v-if="row.status === '3'" type="warning" effect="dark"
          >已退房</el-tag
        >
      </template>
      <template #image="{ row }">
        <el-image :src="row.img" style="width: 60px; height: 60px" />
      </template>
    </c-table>
  </div>
  <RoomForm ref="roomForm" @refresh="getTableData" />
  <image-preview ref="imagePreview" />
</template>

<script>
import ImagePreview from '@/views/components/ViewImage.vue';
import CTable from '@/components/CTable.vue';
import RoomForm from './components/RoomForm.vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useDictStore } from '@/store/modules/dictStore';
import {
  addRoom,
  getRoomList,
  updateRoom,
  deleteRoom,
  getRoomDetail
} from '@/api/room';
import useDict from '@/hooks/useDict';

export default {
  components: {
    CTable,
    RoomForm,
    ImagePreview
  },
  data() {
    return {
      form: {},
      stateOptions: useDictStore().getDict('ROOMSTATUS') || [],
      roomTypeOptions: useDictStore().getDict('ROOMTYPE') || [],
      columns: [],
      tableData: [],
      total: 0,
      currentPage: 1,
      pageSize: 10,
      previewVisible: false
    };
  },
  mounted() {
    this.initTable();
    this.getTableData();
  },
  methods: {
    reset() {
      this.form = {};
      this.getTableData();
    },
    search() {
      this.currentPage = 1;
      this.getTableData();
    },
    handleImg(row) {
      this.$refs.imagePreview.open(row.img);
    },
    addRoom() {
      this.$refs.roomForm.title = '新增客房';
      this.$refs.roomForm.openDialog();
    },
    handleEdit(row) {
      this.$refs.roomForm.title = '编辑房间';
      this.$refs.roomForm.openDialog(row);
    },
    handleCheckout(row) {
      this.$confirm('确定退房吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await updateRoom({
          id: row.id,
          status: '0'
        });
        if (res.success) {
          this.$message({
            type: 'success',
            message: '退房成功!'
          });
          this.getTableData();
        } else {
          this.$message({
            type: 'error',
            message: '退房失败!'
          });
        }
      });
    },
    handleDetail(row) {
      this.$refs.roomForm.title = '房间详情';
      this.$refs.roomForm.openDialog(row);
    },
    handleCheckin(row) {
      this.$confirm('确定入住吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await updateRoom({
          id: row.id,
          status: '1'
        });
        if (res.success) {
          this.$message({
            type: 'success',
            message: '入住成功!'
          });
          this.getTableData();
        } else {
          this.$message;
        }
      });
    },
    async handleDelete(row) {
      this.$confirm('确定删除该房间吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const ids = [row.id];
          const res = await deleteRoom(row.id);
          if (res.success) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.getTableData();
          } else {
            this.$message({
              type: 'error',
              message: '删除失败!'
            });
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    },
    handlePageChange(currentPage, pageSize) {
      this.currentPage = currentPage;
      this.pageSize = pageSize;
      this.getTableData();
    },
    getTableData() {
      const params = {
        ...this.form,
        pageNumber: this.currentPage,
        pageSize: this.pageSize
      };
      getRoomList(params).then((res) => {
        if (res.success) {
          this.tableData = res.result.records;
          this.currentPage = res.result.current | 1;
          this.pageSize = res.result.size | 10;
          this.total = res.result.total;
        } else {
          this.$message({
            type: 'error',
            message: res.message
          });
        }
      });
    },
    initTable() {
      const { getDictValue } = useDict();
      const columns = [
        {
          label: '序号',
          prop: 'id',
          width: 80,
          render: (row, index, column) => {
            return (this.currentPage - 1) * this.pageSize + index + 1;
          }
        },
        {
          label: '房间号',
          prop: 'roomId',
          width: 140
        },
        {
          label: '房间类型',
          prop: 'type',
          width: 140,
          render: (row, index, column) => {
            if (row.type === null) {
              return '--';
            }
            return getDictValue('ROOMTYPE', row.type);
          }
        },
        {
          label: '房间状态',
          prop: 'status',
          width: 140,
          render: (row, index, column) => {
            if (row.status === null) {
              return '--';
            }
            return getDictValue('ROOMSTATUS', row.status);
          }
        },
        {
          label: '房间价格',
          prop: 'price'
        },
        {
          label: '房间图片',
          slotName: 'img'
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
