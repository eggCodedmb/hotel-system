<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="6">
        <el-form-item label="字典名称">
          <el-input v-model="form.dictName" placeholder="请输入" />
        </el-form-item>
      </el-col>
      <el-col :span="18">
        <el-button type="primary" @click="getTableData">查询</el-button>
        <el-button type="primary" @click="reset">重置</el-button>
      </el-col>
    </el-row>

    <el-col :span="21">
      <el-button type="primary" @click="addDict">新增</el-button>
      <el-button type="danger" @click="refreshCache">刷新缓存</el-button>
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
        <el-button type="primary" size="small" @click="handleDetail(row)"
          >详情</el-button
        >
        <el-button type="danger" size="small" @click="handleDelete(row)"
          >删除</el-button
        >
      </template>
    </c-table>
    <dict-form ref="dictForm" />
    <add-dict-form ref="addForm" @submit="getTableData" />
  </div>
</template>

<script>
import CTable from '@/components/CTable.vue';
import { useDictStore } from '@/store/modules/dictStore';
import DictForm from './components/DictForm.vue';
import addDictForm from './components/addDictForm.vue';
import {
  getDictList,
  getDictDetail,
  addDict,
  updateDict,
  deleteDict
} from '@/api/dict.js';
export default {
  components: {
    CTable,
    DictForm,
    addDictForm
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
    reset() {
      this.form = {};
      this.currentPage = 1;
      this.pageSize = 10;
      this.getTableData();
    },
    addDict() {
      this.$refs.addForm.title = '新增字典';
      this.$refs.addForm.openDialog();
    },

    handleEdit(row) {
      this.$refs.addForm.title = '编辑字典';
      this.$refs.addForm.openDialog(row);
    },

    handleDetail(row) {
      this.$refs.dictForm.title = '编辑字典';
      this.$refs.dictForm.openDialog(row.id);
    },

    handleDelete(row) {
      this.$confirm('确定删除该字典吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteDict(row.id).then((res) => {
            if (res.success) {
              this.$message.success('删除成功');
              this.getTableData();
            } else {
              this.$message.error(res.message);
            }
          });
        })
        .catch(() => {});
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
      const res = await getDictList(params);
      if (res.success) {
        this.tableData = res.result.records;
        this.total = res.result.total;
        this.currentPage = res.result.current;
        this.pageSize = res.result.size;
      }
    },

    async refreshCache() {
      try {
        const dictStore = useDictStore();
        dictStore.clearAllDicts(); // 清空 Pinia 存储

        // 2. 自动分页加载全部数据
        let currentPage = 1;
        const pageSize = 100; // 合理分页大小
        let allRecords = [];

        do {
          const params = {
            ...this.form,
            pageNumber: currentPage,
            pageSize
          };

          const { result, success } = await getDictList(params);
          if (!success) throw new Error('Failed to load dictionary list');

          allRecords = [...allRecords, ...result.records];
          currentPage = result.current < result.pages ? currentPage + 1 : 0;
        } while (currentPage > 0);

        // 3. 并行处理详情请求
        const detailRequests = allRecords.map((item) =>
          getDictDetail({ dictId: item.id })
            .then((res) => {
              if (!res.success) return null;
              return {
                dictCode: item.dictCode,
                data: res.result.records.filter(
                  (record) => record.status === '1'
                )
              };
            })
            .catch(() => null)
        );

        // 4. 等待所有请求完成
        const detailResults = await Promise.all(detailRequests);
        console.log(detailResults);

        // 5. 处理有效数据
        const validData = detailResults
          .filter(Boolean)
          .reduce((acc, { dictCode, data }) => {
            if (data?.length) {
              acc[dictCode] = data;
            }
            return acc;
          }, {});

        // 6. 批量更新存储
        dictStore.batchSetDicts(validData);

        // 7. 更新本地存储（按需）
        if (Object.keys(validData).length) {
          localStorage.setItem('dict', JSON.stringify(validData));
        }
        this.$message.success('刷新缓存成功');
      } catch (error) {
        this.$message.error('刷新缓存失败');
        throw error;
      }
    },
    initTable() {
      const columns = [
        {
          label: '序号',
          prop: 'id',
          render: (row, index, column) => {
            return (this.currentPage - 1) * this.pageSize + index + 1;
          }
        },
        {
          label: '字典名称',
          prop: 'dictName'
        },
        {
          label: '字典标识(唯一)',
          prop: 'dictCode'
        },
        {
          label: '字典描述',
          prop: 'dictDescription'
        },
        {
          label: '操作',
          slotName: 'action'
        }
      ];
      this.columns = columns;
    }
  }
};
</script>

<style></style>
