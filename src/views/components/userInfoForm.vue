<template>
    <el-dialog :title="title" v-model="dialogVisible" :close-on-click-modal="false">
        <el-form ref="refForm" :model="form" :rules="rules" label-width="100px" label-position="right"
            class="custom-form">
            <el-row :gutter="20">
                <el-col :xs="24" :md="12">
                    <el-form-item label="账号" prop="username">
                        <el-input v-model="form.username" placeholder="请输入用户名" clearable />
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :md="12">
                    <el-form-item label="部门" prop="department">
                        <!-- 部门下拉框-->
                        <el-select v-model="form.department" placeholder="请选择部门" clearable>
                            <el-option v-for="item in departmentOptions" :key="item.value" :label="item.label"
                                :value="item.value" />
                        </el-select>
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
import { ref, defineExpose, defineOptions, defineEmits } from 'vue';
import { Plus } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import {
    addEmployee,
} from '@/api/user';

const form = ref({
    username: '',
    department: '',
});
const emit = defineEmits(['refresh']);

const title = ref('新增用户');
const refForm = ref(null);
const dialogVisible = ref(false);

const departmentOptions = ref([
    { label: '技术部', value: '技术部' },
    { label: '市场部', value: '市场部' },
    { label: '人事部', value: '人事部' },
    { label: '财务部', value: '财务部' },
    { label: '行政部', value: '行政部' }
]);

const rules = ref({
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        {
            min: 3,
            max: 15,
            message: '用户名长度在 3 到 15 个字符',
            trigger: 'blur'
        }
    ],
    department: [
        { required: true, message: '请选择部门', trigger: 'change' }
    ],
});

const openDialog = (row) => {
    dialogVisible.value = true;
    if (!row) return;
    form.value = { ...row };
};

const closeDialog = () => {
    dialogVisible.value = false;
    refForm.value.resetFields();
};

const handleAvatarSuccess = (res) => {
    form.value.avatar = res.url;
};

const beforeAvatarUpload = (file) => { };

const submitForm = () => {
    refForm.value.validate((valid) => {
        if (valid) {
            if (title.value === '新增用户') {
                saveUser();
            } else if (title.value === '编辑用户') {
                handleEdit();
            }
            emit('refresh');
            closeDialog();
        } else {
            ElMessage.warning('请填写完整信息');
        }
    });
};

const handleEdit = () => {
    updateEmployee(form.value).then((res) => {
        if (res.success) {
            ElMessage.success('修改成功');
        } else {
            ElMessage.error('修改失败');
        }
    });
};
const saveUser = () => {
    addEmployee(form.value).then((res) => {
        if (res.success) {
            ElMessage.success('添加成功');
        } else {
            ElMessage.error('添加失败');
        }
    });
};

defineExpose({
    openDialog,
    title
});
</script>

<style scoped>
.custom-form {
    max-width: 1000px;
    margin: 0 auto;
    padding: 20px;
}

.el-form-item {
    margin-bottom: 22px;
}

.avatar-uploader {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 100px;
    height: 100px;
    transition: border-color 0.3s;
}

.avatar-uploader:hover {
    border-color: var(--el-color-primary);
}

.avatar-uploader-icon {
    font-size: 24px;
    color: #8c939d;
    width: 100px;
    height: 100px;
    text-align: center;
}

.avatar {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.upload-tip {
    font-size: 12px;
    color: #909399;
    margin-top: 8px;
    padding-left: 10px;
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