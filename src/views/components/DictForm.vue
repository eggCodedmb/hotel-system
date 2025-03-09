<template>
  <el-dialog :title="title" v-model="dialogVisible" :close-on-click-modal="false">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form ref="refForm" :model="formData" :rules="rules" label-width="80px">
          <el-form-item label="字典名称" prop="label">
            <el-input v-model="formData.label" placeholder="请输入字典名称"></el-input>
          </el-form-item>
          <el-form-item label="字典值" prop="value">
            <el-input v-model="formData.value" placeholder="请输入字典值"></el-input>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select v-model="formData.status" placeholder="请选择字典状态">
              <el-option label="启用" value="1"></el-option>
              <el-option label="禁用" value="0"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="12">
        <c-table :data="dictList" :columns="columns" :show-pagination="false" height="250">
          <template #status="{ row }">
            <el-switch v-model="row.status" @change="switchStatus(row)" />
          </template>
          <template #action="{ row }">
            <el-button type="danger" link @click="deleteDict(row)">删除</el-button>
          </template>
        </c-table>

      </el-col>
    </el-row>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="warning" @click="closeDialog">关闭</el-button>
        <el-button type="primary" @click="submitForm">新增</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, defineExpose, defineEmits, reactive, defineProps } from "vue";
import { ElMessage } from "element-plus";
import CTable from "@/components/CTable.vue";

const formData = reactive({
  label: "",
  value: "",
})
const emit = defineEmits(["submit", "switchStatus"]);
const props = defineProps({
  // 自定义新增方法
  customAdd: {
    type: Function,
    default: () => { },
  },
})
// 字典列表
const dictList = ref([
  { label: "字典名称1", value: "字典值1", status: "启用" },
  { label: "字典名称2", value: "字典值2", status: "禁用" },
  { label: "字典名称3", value: "字典值3", status: "启用" },
  { label: "字典名称4", value: "字典值4", status: "禁用" },
  { label: "字典名称5", value: "字典值5", status: "启用" },
  { label: "字典名称6", value: "字典值6", status: "禁用" },
  { label: "字典名称7", value: "字典值7", status: "启用" },
  { label: "字典名称8", value: "字典值8", status: "禁用" },
  { label: "字典名称9", value: "字典值9", status: "启用" },
  { label: "字典名称10", value: "字典值10", status: "禁用" },
]);

const title = ref("新增字典");
const refForm = ref(null);
const dialogVisible = ref(false);

const rules = ref({
  label: [{ required: true, message: "请输入字典名称", trigger: "blur" }],
  value: [{ required: true, message: "请输入字典值", trigger: "blur" }],
  status: [{ required: true, message: "请选择字典状态", trigger: "change" }],
});

const openDialog = (row) => {
  dialogVisible.value = true;
  if (!row) return;
  Object.assign(formData, row);
};

const closeDialog = () => {
  dialogVisible.value = false;
  refForm.value.resetFields();
};

const submitForm = () => {
  refForm.value.validate((valid) => {
    if (valid) {
      if (props.customAdd && typeof props.customAdd === "function") {
        props.customAdd(formData);
      }
      emit("submit", title.value === "新增字典" ? "add" : "update", formData);
    } else {
      ElMessage.warning("请填写完整信息");
    }
  });
};

const switchStatus = (row) => {
  console.log(row);

  emit("switchStatus", row);
}

const columns = [
  { label: "字典名称", prop: "label" },
  { label: "字典值", prop: "value" },
  { label: "状态", prop: "status", slotName: "status" },
  { label: "操作", prop: "action", slotName: "action", },
];

const deleteDict = (row) => {
  ElMessage.success("删除成功");
  dictList.value = dictList.value.filter((item) => item !== row);
};
defineExpose({
  openDialog,
  title,
});
</script>

<style scoped>
.custom-form {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.pagination-table-container {
  padding: 0 !important;
  margin: 0 !important;
}

.el-form-item {
  margin-bottom: 22px;
}

.form-footer {
  text-align: center;
  margin-top: 30px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .custom-form {
    padding: 10px;
  }

  .el-form-item {
    margin-bottom: 18px;
  }
}
</style>