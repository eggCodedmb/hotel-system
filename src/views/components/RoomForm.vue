<template>
  <div>
    <el-form :model="form" label-width="auto" ref="form" :rules="rules">
      <el-row>
        <el-col :span="14">
          <el-form-item label="房间号" prop="name">
            <el-input v-model="form.name" />
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item>
            <img src="" alt="" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row> </el-row>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "RoomForm",
  data() {
    return {
      form: {
        name: "",
        region: "",
      },
      rules: {
        name: [
          {
            required: true,
            message: "Please input Activity name",
            trigger: "blur",
          },
        ],
      },
    };
  },
};
</script>

<style></style>
