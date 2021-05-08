<template>
  <div>
    <!--头部-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片-->
    <el-card class="box-card">
      <!--搜索-->
      <div>
        <el-input placeholder="请输入内容" v-model="queryInfo.query" class="input-with-select" clearable @clear="getOrders()">
          <el-button slot="append" icon="el-icon-search" @click='getOrders()'></el-button>
        </el-input>
      </div>
      <!--表格-->
      <el-table :data="userList" border style="width: 100%" stripe>
        <el-table-column type="index" label="#" width="50"></el-table-column>
        <el-table-column prop="order_number" label="订单编号"></el-table-column>
        <el-table-column prop="order_price" label="订单价格" width="90"></el-table-column>
        <el-table-column prop="pay_status" label="是否付款" width="90">
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.pay_status === '0'">未付款</el-tag>
            <el-tag type="success" v-else>已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" width="90"></el-table-column>
        <el-table-column prop="create_time" label="下单时间" width="200">
          <template slot-scope="scope">
            {{scope.row.create_time | dataFormat}}
          </template>
        </el-table-column>
        <el-table-column prop="goods_name" label="操作" width="130">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click='address()'></el-button>
          <el-button type="success" size="mini" icon="el-icon-location" @click='logistics()'></el-button>
        </el-table-column>
      </el-table>
      <!--分页-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <el-dialog
      title="提示"
      :visible.sync="addressVisible"
      width="50%">
      <el-form :model="addressForm" :rules="addressRule" ref='addressRef' label-width="100px">
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader
            v-model="addressForm.address1"
            :options="cityData"
            clearable
            placeholder='请选择'
            class="inputWidth">
          </el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="物流详情"
      :visible.sync="logisticsVisible"
      width="50%">
      <el-timeline :reverse="true">
        <el-timeline-item
          v-for="(activity, index) in logisticsData"
          :key="index"
          :timestamp="activity.time">
          {{activity.context}}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import cityData from '../../assets/js/citydata.js'
export default {
  data () {
    return {
      // 获取用户列表的参数对象
      queryInfo: {
        query: '',
        // 当前的页数
        pagenum: 1,
        // 每页显示多少条数
        pagesize: 10
      },
      // 获取到的商品数据
      userList: [],
      // 总数据条数
      total: 0,
      addressVisible: false,
      addressForm: {
        address1: '',
        address2: ''
      },
      addressRule: {
        address1: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        address2: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ]
      },
      cityData,
      // 物流详情
      logisticsVisible: false,
      // 查询到的物流数据
      logisticsData: []
    }
  },
  created () {
    this.getOrders()
  },
  methods: {
    // 获取商品列表数据
    async getOrders () {
      const { data: res } = await this.$http.get('orders', { params: this.queryInfo })
      this.userList = res.data.goods
      this.total = res.data.total
      console.log(this.userList)
    },
    // 监听每页显示的条数
    handleSizeChange (val) {
      // 把每页显示的条数动态的赋值给pagesize
      this.queryInfo.pagesize = val
      // 动态赋值之后，然后调用请求用户的函数，然后重新传递参数发送请求
      this.getOrders()
    },
    // 监听当前位于第几页数
    handleCurrentChange (val) {
      // 把当前第几页动态赋值给pagenum
      this.queryInfo.pagenum = val
      // 动态赋值之后，然后调用请求用户的函数，然后重新传递参数发送请求
      this.getOrders()
    },
    // 修改地址
    address () {
      this.addressVisible = true
    },
    // 物流详情
    logistics () {
      this.logisticsVisible = true
      this.getLogistics()
    },
    // 获取到物流进度的函数
    async getLogistics () {
      const { data: res } = await this.$http.get(`kuaidi/${1106975712662}`)
      console.log(res.data)
      this.logisticsData = res.data
    }
  }
}
</script>

<style scoped>
@import url("../../plugins/timeline-item/timeline-item.css");
@import url("../../plugins/timeline/timeline.css");
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
/deep/ .el-table th>.cell{
  font-size: 12px;
}
/deep/ .el-table .cell {
  font-size: 12px;
}
.el-pagination {
  margin-top: 15px;
}
.inputWidth{
  width: 100%;
}
</style>
