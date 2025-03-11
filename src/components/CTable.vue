<template>
  <div class="pagination-table-container">
    <el-table
      :data="tableData"
      border
      stripe
      @selection-change="handleSelectionChange"
      v-bind="useAttrs()"
    >
      <el-table-column
        v-for="column in columns"
        :key="column.prop"
        :prop="column.prop"
        :label="column.label"
        :width="column.width"
        :align="column.align || 'center'"
      >
        <!-- 渲染自定义插槽 -->
        <template v-if="column.slotName" #default="{ row }">
          <slot :name="column.slotName" :row="row" />
        </template>

        <!-- 使用 Renderer 组件渲染 render 函数 -->
        <template v-else-if="column.render" #default="{ row, $index }">
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
      v-if="showPagination"
      class="pagination"
      :current-page="currentPage"
      :page-size="pageSize"
      :page-sizes="pageSizes"
      layout="prev, pager, next"
      :total="total"
      @update:current-page="handleCurrentChange"
      @update:page-size="handleSizeChange"
      background
      size="small"
      v-bind="useAttrs()"
    />
  </div>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits, defineComponent,useAttrs } from "vue";


const props = defineProps({
  columns: { type: Array, required: true, default: () => [] },
  data: { type: Array, required: true, default: () => [] },
  total: { type: Number, required: false, default: 0 },
  currentPage: { type: Number, default: 1 },
  pageSize: { type: Number, default: 10 },
  pageSizes: { type: Array, default: () => [10, 20, 50, 100] },
  showPagination: { type: Boolean, default: true },
});

const emit = defineEmits([
  "update:currentPage",
  "update:pageSize",
  "page-change",
  "selection-change",
]);

// ⚡️ 使用 ref 变量存储当前页码和每页大小，并同步更新
const currentPage = ref(props.currentPage);
const pageSize = ref(props.pageSize);

// 监听页码变化
const handleCurrentChange = (val) => {
  currentPage.value = val;
  emit("update:currentPage", val);
  emitPageChange(val, pageSize.value);
};

// 监听每页大小变化
const handleSizeChange = (val) => {
  pageSize.value = val;
  emit("update:pageSize", val);
  emit("update:currentPage", 1); // 切换每页大小后回到第一页
  emitPageChange(1, val);
};

// 触发分页事件
const emitPageChange = (page, size) => {
  emit("page-change", { currentPage: page, pageSize: size });
};

// 处理多选
const handleSelectionChange = (selection) => {
  emit("selection-change", selection);
};

// 计算表格数据
const tableData = computed(() => props.data);

// **创建用于执行 render 函数的组件**
const Renderer = defineComponent({
  props: {
    row: Object,
    index: Number,
    column: Object,
    render: Function,
  },
  render() {
    return typeof this.render === "function"
      ? this.render(this.row, this.index, this.column)
      : null;
  },
});
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
