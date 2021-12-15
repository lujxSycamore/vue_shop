<template lang="">
  <div>
    <span class="symble_text">report_area</span>

    <!-- 面包屑区域，显示当前页面路径 -->
    <el-card class="bread_crumb" shadow="always">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>数据统计</el-breadcrumb-item>
        <el-breadcrumb-item>数据报表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-card>

    <el-card>
      <!-- 为 ECharts 准备一个定义了宽高的 DOM -->
      <div id="main" style="width: 900px;height:400px;"></div>
    </el-card>

  </div>
</template>
<script>
import _ from 'lodash'
/* import echarts from 'echarts'  下为正确引入echarts方法 */
const echarts = require('echarts')

export default {
  data () {
    return {
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  mounted () {
    /* 页面元素已经渲染完毕 */

    /* 基于引入的echarts 实例化 */
    var myChart = echarts.init(document.getElementById('main'))

    this.$http.get('reports/type/1').then(response => {
      if (response.data.meta.status !== 200) {
        return this.$message({
          type: 'error',
          message: response.data.meta.msg
        })
      }

      const result = _.merge(response.data.data, this.options)
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(result)
    })
  }
}
</script>
<style lang="less">
.symble_text{
  color: gray;
}
</style>
