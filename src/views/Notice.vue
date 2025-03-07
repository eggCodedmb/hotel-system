<template>
  <div class="announcement-management">
    <!-- 操作栏 -->
    <div class="operation-bar">
      <el-button type="primary" @click="handleAdd" :icon="Plus">新增公告</el-button>
      
      <div class="search-area">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索公告标题"
          clearable
          style="width: 300px"
          @change="handleSearch"
        >
          <template #append>
            <el-button :icon="Search" />
          </template>
        </el-input>
        
        <el-date-picker
          v-model="publishDate"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="handleDateChange"
        />
      </div>
    </div>

    <!-- 数据表格 -->
    <el-table
      :data="filteredAnnouncements"
      v-loading="loading"
      style="width: 100%"
      :header-cell-style="{ background: '#f5f7fa' }"
      stripe
    >
      <el-table-column prop="title" label="公告标题" min-width="200" />
      <el-table-column prop="content" label="内容" min-width="300">
        <template #default="{ row }">
          <div class="content-preview">{{ row.content }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="publisher" label="发布人" width="120" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'info'" size="small">
            {{ row.status === 1 ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="publishTime" label="发布时间" width="180">
        <template #default="{ row }">
          {{ dayjs(row.publishTime).format('YYYY-MM-DD HH:mm') }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link @click="handleEdit(row)" :icon="Edit" />
          <el-button type="danger" link @click="handleDelete(row.id)" :icon="Delete" />
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
      />
    </div>

    <!-- 编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑公告' : '新增公告'"
      width="600px"
    >
      <el-form :model="formData" :rules="rules" ref="formRef" label-width="80px">
        <el-form-item label="公告标题" prop="title">
          <el-input v-model="formData.title" placeholder="请输入公告标题" />
        </el-form-item>
        
        <el-form-item label="公告内容" prop="content">
          <el-input
            v-model="formData.content"
            type="textarea"
            :rows="4"
            placeholder="请输入公告内容"
            show-word-limit
            maxlength="500"
          />
        </el-form-item>
        
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <el-form-item label="发布时间">
          <el-date-picker
            v-model="formData.publishTime"
            type="datetime"
            placeholder="选择发布时间"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Plus, Edit, Delete } from '@element-plus/icons-vue'
import dayjs from 'dayjs'

// 模拟数据
const mockData = Array.from({ length: 50 }).map((_, index) => ({
  id: index + 1,
  title: `系统公告 ${index + 1}`,
  content: `这里是第 ${index + 1} 条公告的详细内容，包含重要的系统更新信息...`,
  publisher: '管理员',
  status: index % 3 === 0 ? 0 : 1,
  publishTime: dayjs().subtract(index, 'day').format('YYYY-MM-DD HH:mm:ss')
}))

// 状态管理
const loading = ref(false)
const dialogVisible = ref(false)
const isEdit = ref(false)
const searchKeyword = ref('')
const publishDate = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(mockData.length)

const formData = reactive({
  id: null,
  title: '',
  content: '',
  status: 1,
  publishTime: dayjs().format('YYYY-MM-DD HH:mm:ss')
})

const rules = {
  title: [{ required: true, message: '请输入公告标题', trigger: 'blur' }],
  content: [{ required: true, message: '请输入公告内容', trigger: 'blur' }]
}

// 计算属性
const filteredAnnouncements = computed(() => {
  return mockData
    .filter(item => {
      const keywordMatch = item.title.includes(searchKeyword.value)
      const dateMatch = publishDate.value?.length === 2 
        ? dayjs(item.publishTime).isBetween(publishDate.value[0], publishDate.value[1])
        : true
      return keywordMatch && dateMatch
    })
    .slice((currentPage.value - 1) * pageSize.value, currentPage.value * pageSize.value)
})

// 方法
const handleAdd = () => {
  isEdit.value = false
  Object.assign(formData, {
    id: null,
    title: '',
    content: '',
    status: 1,
    publishTime: dayjs().format('YYYY-MM-DD HH:mm:ss')
  })
  dialogVisible.value = true
}

const handleEdit = (row) => {
  isEdit.value = true
  Object.assign(formData, row)
  dialogVisible.value = true
}

const handleSubmit = async () => {
  // 这里添加实际提交逻辑
  ElMessage.success(isEdit.value ? '修改成功' : '新增成功')
  dialogVisible.value = false
}

const handleDelete = (id) => {
  ElMessageBox.confirm('确定删除该公告吗？', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 这里添加实际删除逻辑
    ElMessage.success('删除成功')
  })
}

// 分页处理
const handleSizeChange = (val) => {
  pageSize.value = val
  currentPage.value = 1
}

const handlePageChange = (val) => {
  currentPage.value = val
}
</script>

<style lang="scss" scoped>
.announcement-management {
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);

  .operation-bar {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;

    .search-area {
      display: flex;
      gap: 15px;
    }
  }

  .content-preview {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.5;
    color: #666;
  }

  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }

  :deep(.el-table__row:hover) {
    cursor: pointer;
    background-color: #f5f7fa !important;
  }

  :deep(.el-dialog) {
    border-radius: 8px;
  }
}
</style>