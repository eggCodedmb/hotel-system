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
          <el-form-item label="房间号" prop="roomId">
            <el-input
              v-model="form.roomId"
              placeholder="请输入房间号"
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
              <el-option
                v-for="(item, key) in typeOptions"
                :key="key"
                :label="item.itemText"
                :value="item.itemValue"
              />

            </el-select>
          </el-form-item>
        </el-col>

        <!-- 第二行：价格 + 状态 -->
        <el-col :xs="24" :md="12">
          <el-form-item label="价格" prop="price">
            <el-input
              v-model="form.price"
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
          <el-form-item label="状态" prop="status">
            <el-select
              v-model="form.status"
              placeholder="请选择状态"
              style="width: 100%"
              :disabled="isView"
            >
              <el-option
                v-for="(item, key) in statusOptions"
                :key="key"
                :label="item.itemText"
                :value="item.itemValue"
              />
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
              <img v-if="form.img" :src="form.image" class="avatar" />
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
          <el-form-item label="房间简介" prop="intro">
            <el-input
              v-model="form.intro"
              type="textarea"
              placeholder="请输入房间简介"
              clearable
              :disabled="isView"
              :rows="6"
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
import { ref, defineExpose, defineEmits } from 'vue';
import { Plus } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import {
  addRoom,
  getRoomList,
  updateRoom,
  deleteRoom,
  getRoomDetail
} from '@/api/room';

import { useDictStore } from '@/store/modules/dictStore';
const form = ref({
  id: '',
  roomId: '',
  type: '',
  price: '',
  intro: '',
  img: '',
  status: ''
});

const refForm = ref(null);
const title = ref('新增客房');
const dialogVisible = ref(false);
const isView = ref(false);
const typeOptions = useDictStore().getDict('ROOMTYPE') || [];
const statusOptions = useDictStore().getDict('ROOMSTATUS') || [];

const rules = ref({
  roomId: [
    { required: true, message: '请输入房间号', trigger: 'blur' },
    {
      min: 3,
      max: 10,
      message: '房间号长度在 3 到 10 个字符',
      trigger: 'blur'
    }
  ],
  type: [{ required: true, message: '请选择房型', trigger: 'change' }],
  price: [{ required: true, message: '请输入价格', trigger: 'blur' }]
});

const emit = defineEmits(['refresh']);

const openDialog = (data) => {
  dialogVisible.value = true;
  if (data) {
    form.value = { ...data };
  }
};

const closeDialog = () => {
  dialogVisible.value = false;
  refForm.value.resetFields();
};

const handleImageSuccess = (res) => {
  form.value.img = res.url;
};

const beforeImageUpload = (file) => {
  const isImage = file.type.startsWith('image/');
  const isLt5M = file.size / 1024 / 1024 < 5;

  if (!isImage) {
    ElMessage.error('只能上传图片文件!');
    return false;
  }
  if (!isLt5M) {
    ElMessage.error('图片大小不能超过5MB!');
    return false;
  }
  return true;
};

const submitForm = () => {
  refForm.value.validate((valid) => {
    if (valid) {
      if (title.value === '新增客房') {
        saveRoom();
      } else if (title.value === '修改客房') {
        updateRoomById();
      }
      closeDialog();
      emit('refresh');
    } else {
      ElMessage.warning('请填写完整且正确的信息');
      return false;
    }
  });
};

const saveRoom = async () => {
  const params = {
    roomId: form.value.roomId,
    type: form.value.type,
    price: form.value.price,
    intro: form.value.intro,
    img: form.value.img,
    status: form.value.status
  };

  const res = await addRoom(params);
  if (res.success) {
    ElMessage.success('添加成功');
    closeDialog();
  } else {
    ElMessage.error('添加失败');
  }
};

const updateRoomById = async () => {
  const params = {
    id: form.value.id,
    roomId: form.value.roomId,
    type: form.value.type,
    price: form.value.price,
    intro: form.value.intro,
    img: form.value.img,
    status: form.value.status
  };

  const res = await updateRoom(params);
  if (res.success) {
    ElMessage.success('修改成功');
    closeDialog();
  } else {
    ElMessage.error('修改失败');
  }
};

defineExpose({
  openDialog,
  title
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
