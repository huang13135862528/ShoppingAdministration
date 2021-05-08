<template>
  <div class="addgoods">
    <!--头部-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片-->
    <el-card class="box-card">
      <!--提示-->
      <el-alert
        title="添加商品信息"
        type="info"
        show-icon
        :closable='false'
        center>
      </el-alert>
      <!--步骤条-->
      <el-steps :space="200" :active="active - 0" finish-status="success" :align-center="true">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!--tab标签-->
      <el-form :model="adddata" ref="adddata" :rules="rule" :label-position="labelPosition">
      <el-tabs v-model="active" :tab-position="tabPosition" :before-leave='leaveTab'>
        <el-tab-pane label="基本信息" name="0">
          <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="adddata.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格" prop="goods_price">
            <el-input v-model="adddata.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量" prop="goods_weight">
            <el-input v-model="adddata.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量" prop="goods_number">
            <el-input v-model="adddata.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <el-cascader
            expandTrigger='hover'
            v-model="adddata.goods_cat"
            :options="classifiedData.options"
            :props="classifiedData.data"
            :clearable='true'
            @change="handleChange">
            </el-cascader>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品参数" name="1">持续更新中</el-tab-pane>
        <el-tab-pane label="商品属性" name="2">持续更新中</el-tab-pane>
        <el-tab-pane label="商品图片" name="3">
          <!--action表示将选择的图片上传到什么位置，查看api接口文档-->
          <el-upload
            action="http://127.0.0.1:8888/api/private/v1/upload"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-success="headerSuccess"
            list-type="picture"
            :headers="headerObj">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane label="商品内容" name="4">
          <quill-editor v-model='adddata.goods_introduce'></quill-editor>
          <el-button type="primary" @click='add()'>添加商品</el-button>
        </el-tab-pane>
      </el-tabs>
      </el-form>
    </el-card>
    <el-dialog
      title="图片浏览"
      :visible.sync="priviewShow"
      width="50%">
      <img :src="previewPath" alt="" class="priviewImg"/>
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  data () {
    return {
      active: '0',
      tabPosition: 'left',
      labelPosition: 'top',
      // 表单的数据，双向数据绑定
      adddata: {
        // 商品名称
        goods_name: '',
        // 价格
        goods_price: '',
        // 重量
        goods_weight: '',
        // 数量
        goods_number: '',
        goods_cat: [],
        // 上传的图片临时路径（对象）
        pics: [],
        // 介绍商品
        goods_introduce: '',
        // 商品的动态参数和静态属性
        attrs: ''
      },
      // 分类的数据
      classifiedData: {
        // 数据源
        options: [],
        // 父级分类需要显示的数据
        data: {
          value: 'cat_id',
          label: 'cat_name',
          children: 'children'
        }
      },
      // 表单的验证规则
      rule: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ]
      },
      // 为图片设置请求头
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      // 图片浏览的路径
      previewPath: '',
      // 是否弹出图片浏览dialog框框
      priviewShow: false
    }
  },
  created () {
    this.getcategories()
  },
  methods: {
    // 获取到商品分类的数据
    async getcategories () {
      const { data: res } = await this.$http.get('categories', { params: { type: 3 } })
      // console.log(res.data)
      this.classifiedData.options = res.data
      // console.log(this.addCategory.adddata.options)
    },
    // 监听选择发生变化的函数
    handleChange () {
      // 判断选择的是否是三级分类
      if (this.adddata.goods_cat.length !== 3) {
        // 如果选择的是三级分类，那么就不能被选上
        this.adddata.goods_cat = []
      }
    },
    // 切换标签之前的钩子,如果返回的是false，那么就无法进行标签的跳转。否则可以进行跳转
    leaveTab (activeName, oldActiveName) {
      // 判断是否选择了分类，选择了那就可以跳转，否则就不
      if (this.adddata.goods_cat.length === 0) {
        // console.log(123)
        // 并且弹框提示
        this.$message.error('请先选择商品分类！')
        return false
      }
    },
    // 图片浏览函数
    handlePreview (file) {
      // console.log(file.response.data)
      // 把图片的url路径给一个变量
      this.previewPath = file.response.data.url
      this.priviewShow = true
    },
    // 删除图片的函数
    handleRemove (file) {
      // console.log(123)
      // 1，拿到想要删除的图片的零时数值
      // 2，根据我们拿到的数值，使用indexof函数来找到所对应的索引
      // 3，通过这个索引，使用splice方法删除
      // console.log(file.response.data.tmp_path)
      // x表示的是，数组中的每一项
      var i = this.adddata.pics.findIndex(x => {
        // console.log(x)
        return x.pic.includes(file.response.data.tmp_path)
      })
      // 拿到了索引值
      this.adddata.pics.splice(i, 1)
      // console.log(this.adddata.pics)
    },
    // 上传成功的函数
    headerSuccess (response) {
      // 上传成功之后服务器返回的数据
      // console.log(response)
      this.adddata.pics.push({ pic: response.data.tmp_path })
      console.log(this.adddata)
    },
    // 添加商品函数
    add () {
      // 实现表单的预验证
      this.$refs.adddata.validate(async valid => {
        if (!valid) return false
        // console.log(123)
        // 使用_.cloneDeep深拷贝adddata这个对象。然后实现对goods_cat的数据类型的转换
        const form = _.cloneDeep(this.adddata)
        form.goods_cat = form.goods_cat.join(',')
        // 此时数据就是form这个表单了
        // console.log(form)
        // 完成之后，发送请求添加商品数据
        const { data: res } = await this.$http.post('goods', form)
        console.log(res)
      })
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
/deep/ .el-card__body{
  padding: 10px;
}
.el-input-group{
  width: 33.33%;
  margin-top: -10px;
  margin-right: 20px;
  margin-bottom: 20px;
}
/deep/ .el-step{
  margin: 15px 0px;
}
/deep/ .el-step__title{
  font-size: 12px;
}
.priviewImg{
  width: 100%;
}
/deep/ .ql-editor{
  min-height: 300px;
}
/deep/ .quill-editor{
  margin-bottom: 20px;
}
</style>
