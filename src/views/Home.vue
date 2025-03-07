<template>
  <el-container>
    <el-main>
      <!-- 顶部数据展示 -->
      <el-row :gutter="10">
        <el-col :span="6">
          <el-card class="data-card">
            <div class="data-title">今日预定</div>
            <div class="data-value">128</div>
            <div class="data-change">较昨日 +12.5%</div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="data-card">
            <div class="data-title">销售额</div>
            <div class="data-value">¥25,648</div>
            <div class="data-change">较昨日 +8.2%</div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="data-card">
            <div class="data-title">新增预定</div>
            <div class="data-value">356</div>
            <div class="data-change">较上月 +15.8%</div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="data-card">
            <div class="data-title">活跃度</div>
            <div class="data-value">89%</div>
            <div class="data-change">较上周 +2.3%</div>
          </el-card>
        </el-col>
      </el-row>

      <!-- 销售趋势和销售分布 -->
      <el-row :gutter="10" class="charts-container">
        <el-col :span="16">
          <el-card>
            <div class="chart-title">
              <strong>销售趋势</strong>
              <el-radio-group v-model="radio" @change="lineChartChange">
                <el-radio-button label="周" value="周" />
                <el-radio-button label="月" value="月" />
                <el-radio-button label="年" value="年" />
              </el-radio-group>
            </div>
            <LineChart />
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card>
            <PieChar />
          </el-card>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
import LineChart from "@/components/lineChart.vue";
import PieChar from "@/components/pieChar.vue";
import { ref } from "vue";
export default {
  name: "Home",
  components: { LineChart, PieChar },
  setup() {
    const radio = ref("周");
    return {
      radio,
    };
  },
  methods: {
    lineChartChange() {
      console.log(this.radio);
    },
  },
};
</script>

<style scoped>
.data-card {
  text-align: center;
  padding: 20px;
}

.data-title {
  font-size: 16px;
  color: #666;
}

.data-value {
  font-size: 28px;
  font-weight: bold;
  margin: 10px 0;
}

.data-change {
  font-size: 14px;
  color: #67c23a;
}

.charts-container {
  margin-top: 20px;
}

.chart-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
