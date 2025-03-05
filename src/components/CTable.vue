<template>
  <div class="pagination-table-container">
    <el-table
      :data="tableData"
      border
      stripe
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        v-for="column in columns"
        :key="column.prop"
        :prop="column.prop"
        :label="column.label"
        :width="column.width"
        :align="column.align || 'center'"
      >
        <template v-if="column.slotName" #default="{ row }">
          <slot :name="column.slotName" :row="row" />
        </template>
        <template v-if="column.render" #render="{ row, $index }">
          <Renderer
            v-if="column.render"
            :row="row"
            :index="$index"
            :column="column"
            :render="column.render"
          />
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
import { defineProps, defineEmits, computed, defineComponent } from "vue";

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

// 创建用于执行render函数的组件
const Renderer = defineComponent({
  props: {
    row: Object, // 行数据
    index: Number, // 行索引
    column: Object, // 列配置
    render: Function, // 渲染函数
  },
  render() {
    return this.render(this.row, this.index, this.column);
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
  emit("update:currentPage", 1);
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
