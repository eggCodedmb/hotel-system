<!-- DeptTree.vue -->
<template>
  <div class="dept-tree-container">
    <!-- 搜索框 -->
    <el-input
      v-model="filterText"
      placeholder="输入关键字过滤"
      clearable
      @clear="handleSearchClear"
    >
      <template #prefix>
        <el-icon><search /></el-icon>
      </template>
    </el-input>

    <!-- 树形组件 -->
    <el-tree
      ref="treeRef"
      class="tree-content"
      :data="treeData"
      :props="treeProps"
      :filter-node-method="filterNode"
      :highlight-current="highlightCurrent"
      :expand-on-click-node="expandOnClickNode"
      :default-expand-all="defaultExpandAll"
      :node-key="nodeKey"
      :show-checkbox="showCheckbox"
      :check-strictly="checkStrictly"
      :lazy="lazy"
      :load="loadNode"
      @node-click="handleNodeClick"
      @check="handleCheck"
    >
      <!-- 自定义节点内容 -->
      <template #default="{ node, data }">
        <span class="custom-tree-node">
          <el-icon v-if="showIcon"><office-building /></el-icon>
          <span class="label">{{ node.label }}</span>
          <span v-if="showCount" class="count">({{ data.count || 0 }})</span>
        </span>
      </template>
    </el-tree>
  </div>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits, defineExpose } from "vue";
import { Search, OfficeBuilding } from "@element-plus/icons-vue";

const props = defineProps({
  // 树形数据
  data: {
    type: Array,
    default: () => [],
  },
  // 树形配置项
  treeProps: {
    type: Object,
    default: () => ({
      label: "name",
      children: "children",
      isLeaf: "isLeaf",
    }),
  },
  // 是否显示图标
  showIcon: {
    type: Boolean,
    default: true,
  },
  // 是否显示人数统计
  showCount: {
    type: Boolean,
    default: false,
  },
  // 是否高亮当前选中节点
  highlightCurrent: {
    type: Boolean,
    default: true,
  },
  // 是否点击节点自动展开
  expandOnClickNode: {
    type: Boolean,
    default: false,
  },
  // 是否默认展开所有节点
  defaultExpandAll: {
    type: Boolean,
    default: false,
  },
  // 节点唯一标识字段
  nodeKey: {
    type: String,
    default: "id",
  },
  // 是否显示复选框
  showCheckbox: {
    type: Boolean,
    default: false,
  },
  // 是否严格模式（父子不关联）
  checkStrictly: {
    type: Boolean,
    default: false,
  },
  // 是否开启懒加载
  lazy: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["node-click", "check", "load"]);

const treeRef = ref(null);
const filterText = ref("");
const treeData = ref([...props.data]);

// 暴露给父组件的方法
defineExpose({
  getCheckedNodes: () => treeRef.value?.getCheckedNodes(),
  getCheckedKeys: () => treeRef.value?.getCheckedKeys(),
  setCheckedKeys: (keys) => treeRef.value?.setCheckedKeys(keys),
  updateTreeData: (data) => {
    treeData.value = data;
  },
});

// 搜索过滤
watch(filterText, (val) => {
  treeRef.value?.filter(val);
});

// 节点过滤方法
const filterNode = (value, data) => {
  if (!value) return true;
  return data[props.treeProps.label].includes(value);
};

// 节点点击事件
const handleNodeClick = (data, node) => {
  emit("node-click", { data, node });
};

// 复选框选中事件
const handleCheck = (data, checked) => {
  emit("check", { data, checked: checked.checkedKeys });
};

// 懒加载节点
const loadNode = (node, resolve) => {
  emit("load", { node, resolve });
};

// 处理搜索框清空
const handleSearchClear = () => {
  treeRef.value?.filter("");
};

// 监听外部数据变化
watch(
  () => props.data,
  (val) => {
    treeData.value = [...val];
  }
);
</script>

<style lang="scss" scoped>
.dept-tree-container {
  padding: 10px;
}

.tree-content {
  margin-top: 10px;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  font-size: 14px;
  padding-right: 8px;

  .el-icon {
    margin-right: 8px;
    color: #409eff;
  }

  .label {
    flex: 1;
  }

  .count {
    color: #999;
    font-size: 12px;
    margin-left: 8px;
  }
}
</style>
