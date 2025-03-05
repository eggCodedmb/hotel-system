<template>
  <div>
    <el-form :model="form" label-width="auto" ref="form" :rules="rules">
      <el-row>
        <el-col :span="12">
          <el-form-item label="字典名称" prop="name">
            <el-input v-model="form.name" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="字典标识">
            <el-input v-model="form.type" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="字典状态">
            <el-select v-model="form.status">
              <el-option label="启用" value="1" />
              <el-option label="禁用" value="0" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态">
            <el-switch v-model="form.status" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="字典描述">
            <el-input v-model="form.description" type="textarea" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script setup>
import { ref } from "vue";
const form = ref({
  name: "",
  type: "",
  status: "",
  description: "",
});
const rules = ref({});
</script>

<style></style>
