<template>
  <div class="user">
    <!--头部的指引-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片-->
    <el-card class="box-card">
      <!--搜索-->
      <div>
        <el-input placeholder="请输入内容" v-model="queryInfo.query" class="input-with-select">
          <el-button slot="append" icon="el-icon-search" @click="getusers()"></el-button>
        </el-input>
        <el-button type="primary" @click="useradd()">添加用户</el-button>
      </div>
      <!--表格-->
      <el-table :data="userList" border style="width: 100%" stripe>
          <el-table-column type="index" label="#" width="50"></el-table-column>
          <el-table-column prop="username" label="姓名"></el-table-column>
          <el-table-column prop="email" label="邮箱"></el-table-column>
          <el-table-column prop="mobile" label="电话"></el-table-column>
          <el-table-column prop="role_name" label="角色"></el-table-column>
          <el-table-column prop="mg_state" label="状态">
            <!--作用域插槽-->
            <template slot-scope="scope">
              <!--这个可以拿到当前这一行的数据内容：score.row.mg_state-->
              <el-switch v-model="scope.row.mg_state" @change="changeUserStatus(scope.row)"></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180">
            <!--作用域插槽-->
            <template slot-scope="scope">
              <!--修改按钮-->
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="changeUser(scope.row)"></el-button>
              <!--删除按钮-->
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="deteleUser(scope.row)"></el-button>
              <!--分配角色按钮-->
              <el-tooltip content="分配角色" placement="top" :enterable="false">
                <el-button type="warning" icon="el-icon-setting" size="mini" @click="assignroles(scope.row)"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <!--分页-->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[1, 2, 5, 10]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
    </el-card>
      <!--修改用户的对话框-->
      <el-dialog title="修改用户信息" :visible.sync="dialogFormVisible" @close="changeClosed()">
        <el-form :model="ruleForm" ref="ruleForm" :rules="rule">
          <el-form-item label="用户名" :label-width="formLabelWidth" >
            <el-input autocomplete="off" v-model="ruleForm.username" :disabled='true'></el-input>
          </el-form-item>
          <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
            <el-input autocomplete="off" v-model="ruleForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" :label-width="formLabelWidth" prop="mobile">
            <el-input autocomplete="off" v-model="ruleForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancel()">取 消</el-button>
          <el-button type="primary" @click="determine()">确 定</el-button>
        </div>
      </el-dialog>
      <!--添加用户的对话框-->
      <el-dialog title="修改用户信息" :visible.sync="addUsers" @close="changeClosed()">
        <el-form :model="adduserRule" ref="adduserRule" :rules="rule" >
          <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
            <el-input autocomplete="off" v-model="adduserRule.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
            <el-input autocomplete="off" v-model="adduserRule.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
            <el-input autocomplete="off" v-model="adduserRule.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" :label-width="formLabelWidth" prop="mobile">
            <el-input autocomplete="off" v-model="adduserRule.mobile"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancelAddUsers()">取 消</el-button>
          <el-button type="primary" @click="determineAddUsers()">确 定</el-button>
        </div>
      </el-dialog>
      <!--分配角色的对话框-->
      <el-dialog title="分配权限" :visible.sync="assignUsers">
        <p>当前的用户：{{assignRolesRule.username}}</p>
        <p>当前的角色：{{assignRolesRule.role_name}}</p>
        <p>分配新角色：
          <el-select v-model="newroles" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
            </el-option>
          </el-select>
        </p>
        <div slot="footer" class="dialog-footer">
          <el-button @click="assignUsers = false">取 消</el-button>
          <el-button type="primary" @click="assignUsersDetermine()">确 定</el-button>
        </div>
      </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    // 邮箱验证规则
    var checkEmail = (rule, value, callback) => {
      const emailrule = /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/
      if (emailrule.test(value)) {
        // console.log(12345)
        return callback()
      }
      callback(new Error('请填写符合规范的邮箱地址'))
    }
    // 手机号码验证规则
    var checkMobile = (rule, value, callback) => {
      const mobilerule = /^1(3|4|5|6|7|8|9)\d{9}$/
      if (mobilerule.test(value)) {
        return callback()
      }
      callback(new Error('请输入正确的手机号码'))
    }
    return {
      // 获取用户列表的参数对象
      queryInfo: {
        query: '',
        // 当前的页数
        pagenum: 1,
        // 每页显示多少条数
        pagesize: 2
      },
      // 获取用户请求数据
      userList: [],
      // 开关
      value: true,
      // 搜索框
      input: '',
      total: 0,
      dialogFormVisible: false,
      addUsers: false,
      assignRoles: false,
      assignUsers: false,
      formLabelWidth: '80px',
      // 修改用户的表单
      ruleForm: {
        username: '',
        email: '',
        mobile: ''
      },
      rule: {
        username: [
          // 校验是否符合规范，用户名
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
        ],
        password: [
          // 校验是否符合规范，密码
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        email: [
          // 校验是否符合规范 指定的一个校验规则，当执行checkEmail校验之后，就会触发以下这个校验。
          { required: true, message: '请添加邮箱地址', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          // 跟上面一样，校验是否符合规范
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 添加用户的表单规则
      adduserRule: {
        username: '',
        email: '',
        mobile: '',
        password: ''
      },
      // 分配新角色的数据
      assignRolesRule: { },
      // 分配角色的数据
      newroles: '',
      // 角色的数据
      options: [],
      // 分配角色的id数值
      assignrolesId: ''
    }
  },
  created () {
    this.getusers()
  },
  methods: {
    // 请求用户
    async getusers () {
      const users = await this.$http.get('users', { params: this.queryInfo })
      // console.log(users.data.data.users)
      this.userList = users.data.data.users
      // console.log(this.userList)
      // console.log(users.data.data.total)
      this.total = users.data.data.total
    },
    // 监听每页显示的条数
    handleSizeChange (val) {
      // 把每页显示的条数动态的赋值给pagesize
      this.queryInfo.pagesize = val
      // 动态赋值之后，然后调用请求用户的函数，然后重新传递参数发送请求
      this.getusers()
    },
    // 监听当前位于第几页数
    handleCurrentChange (val) {
      // 把当前第几页动态赋值给pagenum
      this.queryInfo.pagenum = val
      // 动态赋值之后，然后调用请求用户的函数，然后重新传递参数发送请求
      this.getusers()
    },
    // 监听用户状态改变的函数
    async changeUserStatus (val) {
      this.changenum++
      // console.log(val)
      // 发送put请求修改用户的状态
      const { data: user } = await this.$http.put(`users/${val.id}/state/${val.mg_state}`)
      // console.log(user)
      if (user.meta.status !== 200) {
        this.$message({
          type: 'error',
          message: '更改用户状态失败',
          duration: 1000
        })
        // 弹出错误，之后强制更改用户的状态为之前的状态
        val.mg_state = !val.mg_state
      }
      this.$message({
        type: 'success',
        message: '更改用户状态成功',
        duration: 1000
      })
    },
    // 修改用户的函数
    async changeUser (val) {
      this.dialogFormVisible = !this.dialogFormVisible
      const { data: res } = await this.$http.get(`users/${val.id}`)
      // console.log(res.data)
      this.ruleForm = res.data
    },
    // 编辑用户点击取消按钮
    cancel () {
      this.dialogFormVisible = !this.dialogFormVisible
      this.$message({
        message: 'Cancel editing',
        duration: 1000
      })
    },
    // 编辑用户点击确定按钮
    determine () {
      this.$refs.ruleForm.validate(async valid => {
        if (!valid) return false
        // 如果通过了预验证，那就可以发起数据请求
        const { data: res } = await this.$http.put(`users/${this.ruleForm.id}`, { email: this.ruleForm.email, mobile: this.ruleForm.mobile })
        console.log(res)
        // 点击确定退出弹出框
        this.dialogFormVisible = false
        // 调用用户数据加载的函数
        this.getusers()
        // 成功提示
        this.$message({
          type: 'success',
          message: '更改用户信息成功',
          duration: 1000
        })
      })
    },
    // 重置校验
    changeClosed () {
      this.$refs.ruleForm.resetFields()
    },
    // 删除用户的函数
    async deteleUser (val) {
      const deteleconfirm = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch((err) => {
        return err
      })
      // confirm: 点击确定执行出来的
      // cancel: 出现报错使用catch来监听之前的所有错误
      console.log(deteleconfirm)
      // 通过deteleconfirm的数值，来进行判断。来执行确定和取消的相关操作
      // 如果点击确定删除按钮
      if (deteleconfirm === 'confirm') {
        const { data: res } = await this.$http.delete(`users/${val.id}`)
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
        this.getusers()
      }
      // 如果点击取消删除按钮
      if (deteleconfirm === 'cancel') {
        this.$message({
          type: 'info',
          message: '已取消删除',
          duration: 1000
        })
      }
    },
    // 添加用户的函数
    useradd () {
      this.addUsers = !this.addUsers
    },
    // 取消添加用户的函数
    cancelAddUsers () {
      this.addUsers = !this.addUsers
    },
    // 分配角色的函数
    async assignroles (val) {
      // 点击分配角色的时候，保存当前的id
      this.assignrolesId = val.id
      this.assignRolesRule = val
      // 发送请求，获取角色的数据
      const { data: res } = await this.$http.get('roles')
      console.log(res)
      this.options = res.data
      this.assignUsers = !this.assignUsers
      // console.log(this.assignRolesRule)
    },
    // 点击分配角色的确定按钮
    async assignUsersDetermine () {
      if (this.newroles === '') {
        this.$message({ type: 'warning', message: '请选择要分配的新角色！', duration: 1000 })
        return false
      }
      // console.log(this.assignrolesId)
      // console.log(this.newroles)
      const { data: res } = await this.$http.put(`users/${this.assignrolesId}/role`, { rid: this.newroles })
      console.log(res)
      // 重新请求获取用户的函数
      this.getusers()
      this.assignUsers = !this.assignUsers
      // 重置选择框中的内容
      this.newroles = ''
    },
    // 确定添加用户的函数
    determineAddUsers () {
      this.$refs.adduserRule.validate(async valid => {
        if (!valid) return false
        const res = await this.$http.post('users', this.adduserRule)
        console.log(res)
        this.addUsers = !this.addUsers
        // 调用用户数据加载的函数
        this.getusers()
        // 成功提示
        this.$message({
          type: 'success',
          message: '创建成功',
          duration: 1000
        })
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
.el-input-group{
  width: 33.33%;
  margin-top: -10px;
  margin-right: 20px;
  margin-bottom: 20px;
}
/deep/ .el-dialog{
  width: 46%;
}
/deep/ .el-dialog__body{
  padding-bottom: 0px;
  padding-left: 10px;
}
.el-pagination {
  margin-top: 15px;
}
.nowusers{
  display: block;
  margin-bottom: 15px;
}
.nowroles{
  display: block;
  margin-bottom: 15px;
}
</style>
