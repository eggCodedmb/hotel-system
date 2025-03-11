<template>
  <el-dialog :title="title" v-model="dialogVisible" :close-on-click-modal="false">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form ref="refForm" :model="formData" :rules="rules" label-width="80px">
          <el-form-item label="字典名称" prop="itemText">
            <el-input v-model="formData.itemText" placeholder="请输入字典名称"></el-input>
          </el-form-item>
          <el-form-item label="字典值" prop="itemValue">
            <el-input v-model="formData.itemValue" placeholder="请输入字典值"></el-input>
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
            <el-switch v-model="row.status" active-value="1" inactive-value="0" @change="switchStatus(row)" />
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
import { ElMessage, ElMessageBox } from "element-plus";
import CTable from "@/components/CTable.vue";
import { addDictItem, updateDictItem, deleteDictItem, getDictDetail } from "@/api/dict.js";
const formData = reactive({
  dictId: "",
  itemText: "",
  itemValue: "",
  description: "",
  status: "1"
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
const dictList = ref([]);

const title = ref("新增字典");
const refForm = ref(null);
const dialogVisible = ref(false);

const rules = ref({
  itemText: [
    { required: true, message: "请输入字典项名称", trigger: "blur" },
  ],
  itemValue: [
    { required: true, message: "请输入字典值", trigger: "blur" },
  ],
  status: [
    { required: true, message: "请选择字典状态", trigger: "change" },
  ],
});

const openDialog = (id) => {
  dialogVisible.value = true;
  if (!id) return;
  formData.dictId = id;
  getDictData(id);
};

const closeDialog = () => {
  dialogVisible.value = false;
  refForm.value.resetFields();
  dictList.value = [];
};

const submitForm = () => {
  refForm.value.validate(async (valid) => {
    if (valid) {
      const res = await addDictItem(formData);
      if (res.success) {
        ElMessage.success(res.message || "操作成功");
      } else {
        ElMessage.error(res.message || "操作失败");
      }
      refForm.value.resetFields();
      getDictData(formData.dictId);
    } else {
      ElMessage.warning("请填写完整信息");
    }
  });
};


const switchStatus = (row) => {
  updateDictItem({ id: row.id, status: row.status }).then(res => {
    if (res.success) {
      ElMessage.success(res.message || "操作成功");
    } else {
      ElMessage.error(res.message || "操作失败");
    }
    emit("switchStatus", row);
  });
};

const columns = [
  { label: "字典名称", prop: "itemText" },
  { label: "字典值", prop: "itemValue" },
  { label: "状态", prop: "status", slotName: "status" },
  { label: "操作", prop: "action", slotName: "action", },
];

const deleteDict = (row) => {
  ElMessageBox.confirm("确定删除该字典项吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      const res = await deleteDictItem(row.id);
      if (res.success) {
        ElMessage.success(res.message || "删除成功");
        getDictData(formData.dictId);
      } else {
        ElMessage.error(res.message || "删除失败");
      }
    })
    .catch(() => { });
};

const getDictData = async (dictId) => {
  const res = await getDictDetail({ id: dictId });
  if (res.success) {
    dictList.value = res.result.records;
  } else {
    ElMessage.error(res.message || "获取字典数据失败");
  }
}

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