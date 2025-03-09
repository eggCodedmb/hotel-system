<template>
  <el-dialog
    :title="title"
    v-model="dialogVisible"
    :close-on-click-modal="false"
  >
    <el-form
      ref="refForm"
      :model="form"
      :rules="rules"
      label-width="100px"
      label-position="right"
      class="custom-form"
    >
      <el-row :gutter="20">
        <!-- 第一行：房间名称 + 房型 -->
        <el-col :xs="24" :md="12">
          <el-form-item label="房间名称" prop="roomName">
            <el-input
              v-model="form.roomName"
              placeholder="请输入房间名称"
              clearable
              :disabled="isView"
            />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :md="12">
          <el-form-item label="房型" prop="type">
            <el-select
              v-model="form.type"
              placeholder="请选择房型"
              style="width: 100%"
              :disabled="isView"
            >
              <el-option label="单人间" value="单人间" />
              <el-option label="双人间" value="双人间" />
              <el-option label="套房" value="套房" />
            </el-select>
          </el-form-item>
        </el-col>

        <!-- 第二行：价格 + 状态 -->
        <el-col :xs="24" :md="12">
          <el-form-item label="价格" prop="price">
            <el-input
              v-model.number="form.price"
              type="number"
              placeholder="请输入价格"
              :min="0"
              :disabled="isView"
            >
              <template #append>元/晚</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :md="12">
          <el-form-item label="状态" prop="state">
            <el-select
              v-model="form.state"
              placeholder="请选择状态"
              style="width: 100%"
              :disabled="isView"
            >
              <el-option label="空闲" value="空闲" />
              <el-option label="已预订" value="已预订" />
              <el-option label="清洁中" value="清洁中" />
            </el-select>
          </el-form-item>
        </el-col>

        <!-- 客房图片上传 -->
        <el-col :span="24">
          <el-form-item label="客房图片">
            <el-upload
              class="avatar-uploader"
              action="/api/upload"
              :show-file-list="false"
              :on-success="handleImageSuccess"
              :before-upload="beforeImageUpload"
              :disabled="isView"
            >
              <img v-if="form.image" :src="form.image" class="avatar" />
              <el-icon v-else class="avatar-uploader-icon">
                <Plus />
              </el-icon>
            </el-upload>
            <div class="upload-tip">建议尺寸 800x600，支持 JPG/PNG 格式</div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="房间简介" prop="description">
            <el-input
              v-model="form.description"
              type="textarea"
              placeholder="请输入房间简介"
              clearable
              :disabled="isView"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button type="warning" @click="closeDialog">关闭</el-button>
        <el-button type="primary" @click="submitForm">保存</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, defineExpose } from "vue";
import { Plus } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";

const form = ref({
  roomName: "",
  type: "",
  price: null,
  state: "空闲",
  image: "",
  description: "",
});

const refForm = ref(null);
const title = ref("新增客房");
const dialogVisible = ref(false);
const isView = ref(false);

const rules = ref({
  roomName: [{ required: true, message: "房间名称不能为空", trigger: "blur" }],
  type: [{ required: true, message: "请选择房型", trigger: "change" }],
  price: [
    { required: true, message: "价格不能为空", trigger: "blur" },
    { type: "number", message: "必须为数字值", trigger: "blur" },
    {
      validator: (_, value, callback) => {
        if (value < 0) callback(new Error("价格不能为负数"));
        else callback();
      },
      trigger: "blur",
    },
  ],
  state: [{ required: true, message: "请选择状态", trigger: "change" }],
  image: [{ required: true, message: "请上传图片", trigger: "change" }],
  description: [{ required: true, message: "请输入房间简介", trigger: "blur" }],
});

const openDialog = () => {
  dialogVisible.value = true;
};

const closeDialog = () => {
  dialogVisible.value = false;
  refForm.value.resetFields();
};

const handleImageSuccess = (res) => {
  form.value.image = res.url;
};

const beforeImageUpload = (file) => {
  const isImage = file.type.startsWith("image/");
  const isLt5M = file.size / 1024 / 1024 < 5;

  if (!isImage) {
    ElMessage.error("只能上传图片文件!");
    return false;
  }
  if (!isLt5M) {
    ElMessage.error("图片大小不能超过5MB!");
    return false;
  }
  return true;
};

const submitForm = () => {
  refForm.value.validate((valid) => {
    if (valid) {
      // 这里添加实际提交逻辑
      console.log("表单数据:", form.value);
      ElMessage.success("客房信息保存成功");
      closeDialog();
    } else {
      ElMessage.warning("请填写完整且正确的信息");
      return false;
    }
  });
};

defineExpose({
  openDialog,
  title,
});
</script>

<style scoped>
/* 保持原有样式不变 */
.avatar-uploader {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 250px;
  height: 150px;
  transition: border-color 0.3s;
}

.avatar {
  width: 100%;
  height: 100%;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 250px;
  height: 150px;
  text-align: center;
}

.upload-tip {
  font-size: 12px;
  color: #909399;
  margin-top: 8px;
  padding-left: 10px;
}
</style>
