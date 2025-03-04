<template>
  <div class="pagination-table-container">
    <el-table
      :data="tableData"
      border
      stripe
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <!-- 动态生成列 -->
      <el-table-column
        v-for="column in columns"
        :key="column.prop"
        :prop="column.prop"
        :label="column.label"
        :width="column.width"
        :align="column.align || 'center'"
      >
        <!-- 自定义列模板 -->
        <template v-if="column.slotName" #default="{ row }">
          <slot :name="column.slotName" :row="row" />
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <el-pagination
      class="pagination"
      :current-page="currentPage"
      :page-sizes="pageSizes"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed } from "vue";

const props = defineProps({
  // 列配置
  columns: {
    type: Array,
    required: true,
    default: () => [],
  },
  // 表格数据
  data: {
    type: Array,
    required: true,
    default: () => [],
  },
  // 总条数
  total: {
    type: Number,
    required: true,
    default: 0,
  },
  // 当前页码
  currentPage: {
    type: Number,
    default: 1,
  },
  // 每页显示条数
  pageSize: {
    type: Number,
    default: 10,
  },
  // 每页显示条数选项
  pageSizes: {
    type: Array,
    default: () => [10, 20, 50, 100],
  },
});

const emit = defineEmits([
  "update:currentPage",
  "update:pageSize",
  "page-change",
  "selection-change",
]);

// 处理页码变化
const handleCurrentChange = (val) => {
  emit("update:currentPage", val);
  emitPageChange(val, props.pageSize);
};

// 处理每页数量变化
const handleSizeChange = (val) => {
  emit("update:pageSize", val);
  emit("update:currentPage", 1); // 切换每页数量时重置到第一页
  emitPageChange(1, val);
};

// 触发分页变化事件
const emitPageChange = (page, size) => {
  emit("page-change", {
    currentPage: page,
    pageSize: size,
  });
};

// 处理多选
const handleSelectionChange = (selection) => {
  emit("selection-change", selection);
};

// 计算表格数据（可根据需要处理分页数据）
const tableData = computed(() => props.data);
</script>

<style scoped>
.pagination-table-container {
  width: 100%;
  margin: 20px 0;
}
.pagination {
  margin-top: 20px;
  justify-content: flex-end;
}
</style>
