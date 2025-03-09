<template>
    <el-dialog :title="title" v-model="dialogVisible" :close-on-click-modal="false">
        <el-form ref="refForm" :model="form" :rules="rules" label-width="100px" label-position="right"
            class="custom-form">
            <el-row :gutter="20">
                <el-col :xs="24" :md="12">
                    <el-form-item label="房型" prop="type">
                        <el-select v-model="form.type" placeholder="请选择房型" style="width: 100%" :disabled="isView">
                            <el-option label="单人间" value="单人间" />
                            <el-option label="双人间" value="双人间" />
                            <el-option label="套房" value="套房" />
                        </el-select>
                    </el-form-item>
                </el-col>
                <!-- 第二行：价格 + 状态 -->
                <el-col :xs="24" :md="12">
                    <el-form-item label="价格" prop="price">
                        <el-input v-model.number="form.price" type="number" placeholder="请输入价格" :min="0"
                            :disabled="isView">
                            <template #append>元/晚</template>
                        </el-input>
                    </el-form-item>
                </el-col>
                <el-col :xs="24" :md="12">
                    <el-form-item label="床数" prop="bedNum">
                        <el-input v-model.number="form.bedNum" type="number" placeholder="请输入床数" :min="0"
                            :disabled="isView">
                            <template #append>张</template>
                        </el-input>
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
    type: "家庭房",
    price: 500,
    bedNum: 4,
});

const refForm = ref(null);
const title = ref("新增房型");
const dialogVisible = ref(false);
const isView = ref(false);

const rules = ref({
    type: [
        { required: true, message: "请选择房型", trigger: "change" },
    ],
    price: [
        { required: true, message: "请输入价格", trigger: "blur" },
        { type: "number", message: "价格必须为数字值", trigger: "blur" },
    ],
    bedNum: [
        { required: true, message: "请输入床数", trigger: "blur" },
        { type: "number", message: "床数必须为数字值", trigger: "blur" },
    ],
});

const openDialog = () => {
    dialogVisible.value = true;
};

const closeDialog = () => {
    dialogVisible.value = false;
    refForm.value.resetFields();
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

<style scoped></style>