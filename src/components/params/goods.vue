<template>
  <div class="goods">
    <!--头部-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片-->
    <el-card class="box-card">
      <!--搜索-->
      <div>
        <el-input placeholder="请输入内容" v-model="queryInfo.query" class="input-with-select" clearable @clear="getGoods()">
          <el-button slot="append" icon="el-icon-search" @click="getGoods()"></el-button>
        </el-input>
        <el-button type="primary" @click="usergoods()">添加商品</el-button>
      </div>
      <!--表格-->
      <el-table :data="userList" border style="width: 100%" stripe>
        <el-table-column type="index" label="#" width="50"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="95"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="70"></el-table-column>
        <el-table-column prop="upd_time" label="创建时间" width="140">
          <template slot-scope="scope">
            {{scope.row.upd_time | dataFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130">
            <!--修改按钮-->
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <!--删除按钮-->
            <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
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
  </div>
</template>

<script>
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
      total: 0
    }
  },
  created () {
    this.getGoods()
  },
  methods: {
    // 获取商品列表数据
    async getGoods () {
      const { data: res } = await this.$http.get('goods', { params: this.queryInfo })
      this.userList = res.data.goods
      this.total = res.data.total
      // console.log(this.userList)
    },
    // 监听每页显示的条数
    handleSizeChange (val) {
      // 把每页显示的条数动态的赋值给pagesize
      this.queryInfo.pagesize = val
      // 动态赋值之后，然后调用请求用户的函数，然后重新传递参数发送请求
      this.getGoods()
    },
    // 监听当前位于第几页数
    handleCurrentChange (val) {
      // 把当前第几页动态赋值给pagenum
      this.queryInfo.pagenum = val
      // 动态赋值之后，然后调用请求用户的函数，然后重新传递参数发送请求
      this.getGoods()
    },
    // 添加商品
    usergoods () {
      // 编程式导航路由跳转
      this.$router.push('/goods/add')
    }
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
/deep/ .el-table th>.cell{
  font-size: 12px;
}
/deep/ .el-table .cell {
  font-size: 12px;
}
.el-pagination {
  margin-top: 15px;
}
</style>
