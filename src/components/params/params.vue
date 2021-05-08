<template>
  <div class="params">
    <!--头部-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片-->
    <el-card class="box-card">
      <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" show-icon></el-alert>
      <!--options是指定数据源-->
      <!--props是指定数据对象-->
      <span class="selectProduct">选择商品分类：</span>
      <el-cascader
      expandTrigger='hover'
      v-model="adddata.value"
      :options="adddata.options"
      :props="adddata.data"
      :clearable='true'
      @change="handleChange">
      </el-cascader>
      <!--tags标签页-->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" :disabled="isBtnDisaled" size="mini" @click='addparams()'>添加参数</el-button>
          <!--动态参数表格-->
          <el-table :data="manydata" border style="width: 100%" stripe>
            <el-table-column width="50" type="expand">
              <template slot-scope="scope">
                <el-tag
                  v-for="(item,index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="deletetags(scope.row, index)">
                  {{item}}
                </el-tag>
                <!--输入文本框-->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @blur="handleInputConfirm(scope.row)">
                </el-input>
                <!--添加按钮-->
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#" width="50"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作" width="300">
              <!--修改按钮-->
              <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
              <!--删除按钮-->
              <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" :disabled="isBtnDisaled" size="mini" @click='addattribute()'>添加属性</el-button>
          <!--静态属性表格-->
          <el-table :data="onlydata" border style="width: 100%" stripe>
            <el-table-column width="50" type="expand"></el-table-column>
            <el-table-column type="index" label="#" width="50"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作" width="300">
              <!--修改按钮-->
              <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
              <!--删除按钮-->
              <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        </el-tabs>
    </el-card>
    <!--添加动态参数-->
    <el-dialog title="添加动态参数" :visible.sync="ifshowParameter" >
      <el-form :model="dynamicParameter" ref="dynamicParameter" :rules="parameterRule" >
        <el-form-item label="动态参数" :label-width="formLabelWidth" prop="attr_name">
          <el-input autocomplete="off" v-model="dynamicParameter.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="ifshoweditroles = false">取 消</el-button>
        <el-button type="primary" @click='addDetermineParameter()'>确 定</el-button>
      </div>
    </el-dialog>
    <!--添加静态属性-->
    <el-dialog title="添加静态属性" :visible.sync="ifshowProperties" >
      <el-form :model="staticProperties" ref="staticProperties" :rules="propertiesRule" >
        <el-form-item label="静态属性" :label-width="formLabelWidth" prop="attr_name">
          <el-input autocomplete="off" v-model="staticProperties.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="ifshowProperties = false">取 消</el-button>
        <el-button type="primary" @click="addStaticProperties()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // tabs标签页区域
      activeName: 'many',
      // 角色表格的数据
      manydata: [],
      onlydata: [],
      ifshowParameter: false,
      ifshowProperties: false,
      dynamicParameter: {
        // 动态参数
        attr_name: ''
      },
      staticProperties: {
        attr_name: ''
      },
      formLabelWidth: '80px',
      parameterRule: {
        attr_name: [
          { required: true, message: '请填写参数名称', trigger: 'blur' }
        ]
      },
      propertiesRule: {
        attr_name: [
          { required: true, message: '请填写属性名称', trigger: 'blur' }
        ]
      },
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
      }
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
      this.adddata.options = res.data
      // console.log(this.addCategory.adddata.options)
    },
    // 获取表格数据的函数
    async getdata () {
      // console.log(this.cataId)
      // 当选择框发生变化的时候，我们就需要发起请求来获取数据
      const { data: res } = await this.$http.get(`categories/${this.cataId}/attributes`, { params: { sel: this.activeName } })
      // console.log(res.data)
      // this.paramsdata = res.data
      // 将attr_vals转换成一个数组
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        item.inputVisible = false
        item.inputValue = ''
      })
      if (this.activeName === 'many') {
        this.manydata = res.data
      }
      if (this.activeName === 'only') {
        // console.log(123)
        this.onlydata = res.data
      }
      // console.log(res.data)
      console.log(this.manydata)
    },
    // 监听选择发生变化的函数
    handleChange () {
      // 判断选择的是否是三级分类
      if (this.adddata.value.length !== 3) {
        this.adddata.value = []
      }
      // console.log(this.cataId)
      // 当选择框发生变化的时候，我们就需要发起请求来获取数据
      this.getdata()
    },
    // 当tabs发生变化的时候触发的函数
    async handleClick () {
      // console.log(this.activeName)
      // 当tabs发生变化的时候，我们也需要发起请求来获取数据
      this.getdata()
    },
    // 点击添加动态参数
    addparams () {
      this.ifshowParameter = true
    },
    // 点击确定添加参数按钮
    addDetermineParameter () {
      this.$refs.dynamicParameter.validate(async valid => {
        if (!valid) return false
        const { data: res } = await this.$http.post(`categories/${this.cataId}/attributes`, { attr_name: this.dynamicParameter.attr_name, attr_sel: this.activeName })
        console.log(res)
        this.ifshowParameter = false
        this.getdata()
      })
    },
    // 点击添加属性
    addattribute () {
      // console.log(123)
      this.ifshowProperties = true
    },
    // 点击确定添加属性按钮
    addStaticProperties () {
      this.$refs.staticProperties.validate(async valid => {
        if (!valid) return false
        const { data: res } = await this.$http.post(`categories/${this.cataId}/attributes`, { attr_name: this.staticProperties.attr_name, attr_sel: this.activeName })
        console.log(res)
        this.ifshowProperties = false
        this.getdata()
      })
    },
    showInput (val) {
      val.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 失去焦点的函数
    async handleInputConfirm (val) {
      val.inputVisible = false
      // trim() 去除字符串两端的空格
      // 判断文本框中输入的数据是否合法。
      if (val.inputValue.trim().length === 0) {
        val.inputValue = ''
        val.inputVisible = false
        return false
      }
      // 仅是在前端页面上面保存了
      val.attr_vals.push(val.inputValue)
      // 把添加的数据保存到数据库中,发送请求
      const { data: res } = await this.$http.put(`categories/${this.cataId}/attributes/${val.attr_id}`, { attr_name: val.attr_name, attr_sel: val.attr_sel, attr_vals: val.attr_vals.join(' ') })
      console.log(res)
      val.inputValue = ''
      val.inputVisible = false
    },
    // 点击tags中的删除按钮
    async deletetags (val, i) {
      // console.log(123)
      val.attr_vals.splice(i, 1)
      // const { data: res } = await this.$http.delete(`categories/${this.cataId}/attributes/${val.attr_id}`)
      // this.getdata()
      // console.log(res)
      // 在前台页面中删除了参数，也需要在后台数据库中删除对应的数据
      const { data: res } = await this.$http.put(`categories/${this.cataId}/attributes/${val.attr_id}`, { attr_name: val.attr_name, attr_sel: val.attr_sel, attr_vals: val.attr_vals.join(' ') })
      console.log(res)
    }
  },
  // computed可以用来计算属性
  computed: {
    // 如果按钮需要被禁用，那么就直接返回true，如果不需要被禁用就返回false
    isBtnDisaled () {
      if (this.adddata.value.length === 3) {
        return false
      }
      return true
    },
    // 计算计算的id
    cataId () {
      if (this.adddata.value.length === 3) {
        // 返回最后一项的id数值
        return this.adddata.value[2]
      }
      return false
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
/deep/ .el-alert{
  margin-bottom: 15px;
}
.selectProduct{
  margin-right: 5px;
}
.el-tabs{
  margin-top: 15px;
}
.el-table{
  margin-top: 15px;
}
/deep/ .el-tag{
  margin-right: 15px;
  margin-bottom: 15px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
