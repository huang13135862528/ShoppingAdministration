<template>
  <div>
    <!--头部-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片-->
    <el-card class="box-card">
      <!--2，使用echarts时候，我们需要对echarts来设置一个具有宽度和高度的DOM元素-->
      <div id="main" style="width: 600px;height: 400px;"></div>
    </el-card>
  </div>
</template>

<script>
// 1，导入echarts图标样式
import echarts from 'echarts'
import _ from 'lodash'
export default {
  data () {
    return {
      // 需要合并的数据
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
  created () {
  },
  // 3，此时，页面上的元素已经被渲染完毕
  async mounted () {
    // 基于准备好的dom，初始化echarts实例
    const myChart = echarts.init(document.getElementById('main'))
    // 获取到数据
    const { data: res } = await this.$http.get('reports/type/1')
    // console.log(res.data)
    // 4，指定图表的配置项和数据
    // 需要实现两个对象的合并，使用merge来实现对象的合并
    const newObj = _.merge(res.data, this.options)
    // 5，使用刚指定的配置项和数据显示图表。
    myChart.setOption(newObj)
  },
  methods: {
  }
}
</script>

<style scoped>
.text {
  font-size: 14px;
}
.item {
  padding: 18px 0;
}
.el-input-group{
  width: 33.33%;
  margin-top: -10px;
  margin-right: 20px;
  margin-bottom: 20px;
}
</style>
