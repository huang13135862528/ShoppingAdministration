<template>
  <div class="classification">
    <!--头部-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片-->
    <el-card class="box-card">
      <!--添加商品-->
      <el-button type="primary" @click="productadd()">添加分类</el-button>
      <tree-table
      :data="productdata.data"
      :columns="productdata.columns"
      :show-index='true'
      :selection-type='false'
      :expand-type='false'
      index-text='#'
      :border='true'>
        <template slot='isok' slot-scope="scope1">
          <i class="el-icon-success" v-if="scope1.row.cat_deleted === false"></i>
          <i class="el-icon-error" v-else></i>
        </template>
        <template slot="sort" slot-scope="scope2">
          <el-tag size="mini" v-if="scope2.row.cat_level === 0">一级</el-tag>
          <el-tag size="mini" type="success" v-else-if="scope2.row.cat_level === 1">二级</el-tag>
          <el-tag size="mini" type="warning" v-else>三级</el-tag>
        </template>
        <template slot="operation" slot-scope="scope3">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="classification(scope3.row)">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteclassification(scope3.row)">删除</el-button>
        </template>
      </tree-table>
      <!--分页-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="categories.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="categories.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="productdata.total">
      </el-pagination>
    </el-card>
    <!--编辑-->
    <el-dialog title="修改分类" :visible.sync="revise.modifyClassification" @close="changeClosed()">
      <el-form :model="revise.modify" ref="reviseModify" :rules="revise.rule">
        <el-form-item label="分类名称" :label-width="revise.formLabelWidth" prop="cat_name">
          <el-input autocomplete="off" v-model="revise.modify.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="revise.modifyClassification = false">取 消</el-button>
        <el-button type="primary" @click="confirmEdit()">确 定</el-button>
      </div>
    </el-dialog>
    <!--添加分类-->
    <el-dialog title="添加分类" :visible.sync="addCategory.ifAddCategory" @close="addchangeClosed()">
      <el-form :model="addCategory.adddata.addCateForm" ref="addCategoryData" :rules="addCategory.rule" :label-width="addCategory.formLabelWidth">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input autocomplete="off" v-model="addCategory.adddata.addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <!--options是指定数据源-->
          <!--props是指定数据对象-->
          <el-cascader
          expandTrigger='hover'
          v-model="addCategory.adddata.value"
          :options="addCategory.adddata.options"
          :props="addCategory.adddata.data"
          :clearable='true'
          @change="handleChange">
          </el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addCategory.ifAddCategory = false">取 消</el-button>
        <el-button type="primary" @click="addCate()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 请求商品分类的参数
      categories: {
        // 获取数据的当前页码数值
        pagenum: 1,
        // 每页显示多少条数据
        pagesize: 5
      },
      // 商品分类的数据
      productdata: {
        data: [],
        // 为table指定列的定义
        columns: [
          {
            // 列的标题名称
            label: '分类名称',
            // 对应标题的名称
            prop: 'cat_name'
          },
          // 自定义模板列
          {
            label: '是否有效',
            type: 'template',
            template: 'isok'
          },
          {
            label: '排序',
            type: 'template',
            template: 'sort'
          },
          {
            label: '操作',
            type: 'template',
            template: 'operation'
          }
        ],
        // 总条数数据
        total: 0
      },
      // 编辑分类
      revise: {
        formLabelWidth: '80px',
        modifyClassification: false,
        // 数据
        modify: {
          cat_name: ''
        },
        rule: {
          // 校验是否填写分类名称
          cat_name: [
            { required: true, message: '请填写角色名称', trigger: 'blur' }
          ]
        },
        modifyId: ''
      },
      // 添加分类
      addCategory: {
        formLabelWidth: '80px',
        ifAddCategory: false,
        // 添加分类的数据
        adddata: {
          // 双向绑定的数据
          value: [],
          // 数据源
          options: [],
          // 父级分类需要显示的数据
          data: {
            value: 'cat_id',
            label: 'cat_name',
            children: 'children'
          },
          // 添加数据的表单数据对象
          addCateForm: {
            // 添加分类的名称
            cat_name: '',
            // 父级分类的id
            cat_pid: 0,
            // 分类的当前层级
            cat_level: 0
          }
        },
        rule: {
          // 校验是否填写分类名称
          cat_name: [
            { required: true, message: '请填写分类名称', trigger: 'blur' }
          ]
        }
      }
    }
  },
  created () {
    this.getCategories()
  },
  methods: {
    // 获取商品分类的数据
    async getCategories () {
      const { data: res } = await this.$http.get('categories', { params: this.categories })
      // console.log(res.data.result)
      this.productdata.data = res.data.result
      this.productdata.total = res.data.total
      console.log(res.data)
    },
    // 监听每页显示的条数
    handleSizeChange (val) {
      // 把每页显示的条数动态的赋值给pagesize
      this.categories.pagesize = val
      // 动态赋值之后，然后调用请求用户的函数，然后重新传递参数发送请求
      this.getCategories()
    },
    // 监听当前位于第几页数
    handleCurrentChange (val) {
      // 把当前第几页动态赋值给pagenum
      this.categories.pagenum = val
      // 动态赋值之后，然后调用请求用户的函数，然后重新传递参数发送请求
      this.getCategories()
    },
    // 编辑分类
    classification (val) {
      // console.log(val)
      this.revise.modify = val
      this.revise.modifyId = val.cat_id
      this.revise.modifyClassification = true
    },
    // 点击确定分类
    confirmEdit () {
      this.$refs.reviseModify.validate(async valid => {
        if (!valid) return false
        const { data: res } = await this.$http.put(`categories/${this.revise.modifyId}`, { cat_name: this.revise.modify.cat_name })
        console.log(res)
        this.revise.modifyClassification = false
        this.getCategories()
      })
    },
    // 删除分类
    async deleteclassification (val) {
      console.log(123)
      const deteleconfirm = await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch((err) => {
        return err
      })
      // confirm: 点击确定执行出来的
      // cancel: 出现报错使用catch来监听之前的所有错误
      // console.log(deteleconfirm)
      // 通过deteleconfirm的数值，来进行判断。来执行确定和取消的相关操作
      // 如果点击确定删除按钮
      if (deteleconfirm === 'confirm') {
        const { data: res } = await this.$http.delete(`categories/${val.cat_id}`)
        // console.log(res)
        // 请求删除用户接口失败
        if (res.meta.status !== 200) {
          this.$message({
            type: 'warning',
            message: res.meta.msg,
            duration: 1000
          })
          return
        }
        // 请求成功
        // 重新发送获取用户的请求函数
        // this.getroles()
        // 为了防止每次删除权限之后都会重新刷新页面，所以只需要对role来进行赋值就可以了
        this.getCategories()
      }
      // 如果点击取消删除按钮
      if (deteleconfirm === 'cancel') {
        this.$message({
          type: 'info',
          message: '已取消删除',
          duration: 1000
        })
        // console.log(rightId.id)
      }
    },
    // 添加分类的函数
    productadd () {
      // console.log(123)
      this.getproduct()
      this.addCategory.ifAddCategory = true
    },
    // 获取到商品分类数据列表
    async getproduct () {
      const { data: res } = await this.$http.get('categories', { params: { type: 2 } })
      // console.log(res.data)
      this.addCategory.adddata.options = res.data
      // console.log(this.addCategory.adddata.options)
    },
    // 表单的重置
    changeClosed () {
      this.$refs.reviseModify.resetFields()
    },
    // 重置
    addchangeClosed () {
      this.$refs.addCategoryData.resetFields()
      this.addCategory.adddata.value = []
      this.addCategory.adddata.addCateForm.cat_pid = 0
      this.addCategory.adddata.addCateForm.cat_level = 0
    },
    // 选择项发生变化的时候，触发的事件
    handleChange () {
      // console.log(this.addCategory.adddata.value)
      // 当选择项发生变化的时候，需要监听到数据发生改变。
      if (this.addCategory.adddata.value.length === 0) {
        // console.log(123)
        this.addCategory.adddata.addCateForm.cat_pid = 0
        this.addCategory.adddata.addCateForm.cat_level = 0
      } else {
        this.addCategory.adddata.addCateForm.cat_pid = this.addCategory.adddata.value[this.addCategory.adddata.value.length - 1]
        this.addCategory.adddata.addCateForm.cat_level = this.addCategory.adddata.value.length
      }
    },
    // 点击添加分类的确定按钮的函数
    addCate () {
      console.log(this.addCategory.adddata.addCateForm)
      // 发送请求
      this.$refs.addCategoryData.validate(async valid => {
        if (!valid) return false
        const { data: res } = await this.$http.post('categories', this.addCategory.adddata.addCateForm)
        console.log(res)
        this.getCategories()
        this.addCategory.ifAddCategory = false
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
/deep/ .el-icon-success{
  color: #409EFF;
}
/deep/ .el-icon-error{
  color: #F56C6C;
}
/deep/ .zk-table{
  margin-top: 15px;
}
.el-pagination {
  margin-top: 15px;
}
.el-cascader{
  width: 100%;
}
</style>
