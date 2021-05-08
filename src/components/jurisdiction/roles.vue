<template>
  <div>
    <!--头部的指引-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片-->
    <el-card class="box-card">
      <el-button type="primary" @click="roleadd()">添加角色</el-button>
      <!--表格-->
      <el-table :data="rolesdata" border style="width: 100%" stripe>
        <el-table-column width="50" type="expand">
          <template slot-scope="scope">
            <el-row  v-for="(item1, i1) in scope.row.children" :key="item1.id" :class="[i1 === 0 ? 'dbtop' : '', 'dbbottom']">
              <el-col :span="5">
                <el-tag closable @close="deleteroles(scope.row, item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row v-for="(item2, i2) in item1.children" :key="item2.id" :class="[i2 === 0 ? '' : 'dbtop']">
                  <el-col :span="6">
                    <el-tag type="success" closable @close="deleteroles(scope.row, item2.id)">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag closable v-for="(item3, i3) in item2.children" :key="item3.id" @close="deleteroles(scope.row, item3.id)" type="warning" :class="[i3 === 0 ? '' : 'dbtop']">{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#" width="50"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <!--修改按钮-->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="edit(scope.row)">编辑</el-button>
            <!--删除按钮-->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deletepeople(scope.row)">删除</el-button>
            <!--分配角色按钮-->
            <el-button type="warning" icon="el-icon-setting" size="mini" @click="assign(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!--修改用户信息-->
    <el-dialog title="修改用户信息" :visible.sync="ifshoweditroles" @close="changeeditClosed()">
      <el-form :model="editroles" ref="editroles" :rules="rule" >
        <el-form-item label="角色名称" :label-width="formLabelWidth" prop="roleName">
          <el-input autocomplete="off" v-model="editroles.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" :label-width="formLabelWidth" prop="roleDesc">
          <el-input autocomplete="off" v-model="editroles.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel()">取 消</el-button>
        <el-button type="primary" @click="determine()">确 定</el-button>
      </div>
    </el-dialog>
    <!--添加角色-->
    <el-dialog title="添加角色" :visible.sync="ifshowaddroles" @close="changeaddClosed()">
      <el-form :model="addroles" ref="addroles" :rules="rule" >
        <el-form-item label="角色名称" :label-width="formLabelWidth" prop="roleName">
          <el-input autocomplete="off" v-model="addroles.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" :label-width="formLabelWidth" prop="roleDesc">
          <el-input autocomplete="off" v-model="addroles.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="canceladd()">取 消</el-button>
        <el-button type="primary" @click="determineadd()">确 定</el-button>
      </div>
    </el-dialog>
    <!--分配权限-->
    <el-dialog title="分配权限" :visible.sync="AssignPermissions" @close="setRightclose()">
      <el-tree :data="allPermissions"
      :props="treeProps"
      show-checkbox
      :default-expand-all='true'
      node-key='id'
      :default-checked-keys='allid'
      ref="treeRef"></el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="AssignPermissions = false">取 消</el-button>
        <el-button type="primary" @click="addrolesdetermine()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      // 角色表格数据
      rolesdata: [],
      // 编辑权限
      ifshoweditroles: false,
      ifshowaddroles: false,
      AssignPermissions: false,
      formLabelWidth: '80px',
      roleid: '',
      // 修改用户的数据
      editroles: {
        roleName: '',
        roleDesc: ''
      },
      // 添加角色的数据
      addroles: {
        roleName: '',
        roleDesc: ''
      },
      rule: {
        roleName: [
          { required: true, message: '请填写角色名称', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请填写角色描述', trigger: 'blur' }
        ]
      },
      // 所有的权限
      allPermissions: [],
      // 所有权限的id
      allid: [],
      // 分配权限的数据
      treeProps: {
        label: 'authName',
        children: 'children'
      }
    }
  },
  created () {
    this.getroles()
  },
  methods: {
    // 获取角色列表的函数
    async getroles () {
      const { data: res } = await this.$http.get('roles')
      // console.log(res.data)
      this.rolesdata = res.data
      // console.log(this.$echarts)
    },
    // 点击角色按钮的那个×的函数
    // 删除用户的函数
    async deleteroles (role, rightId) {
      const deteleconfirm = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
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
        const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
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
        role.children = res.data
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
    // 编辑角色的函数
    edit (val) {
      // console.log(123)\
      this.ifshoweditroles = !this.ifshoweditroles
      this.editroles = val
    },
    // 编辑角色取消按钮
    cancel () {
      this.ifshoweditroles = false
    },
    // 编辑角色确认按钮
    determine () {
      // console.log(123)
      this.$refs.editroles.validate(async valid => {
        if (!valid) return false
        // 如果与验证通过那就发起请求
        const { data: res } = await this.$http.put(`roles/${this.editroles.id}`, { roleName: this.editroles.roleName, roleDesc: this.editroles.roleDesc })
        console.log(res)
        this.ifshoweditroles = false
        this.getroles()
      })
    },
    // 删除角色按钮
    async deletepeople (val) {
      console.log(123)
      const deteleconfirm = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
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
        const { data: res } = await this.$http.delete(`roles/${val.id}`)
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
        this.getroles()
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
    // 添加角色
    roleadd () {
      this.ifshowaddroles = !this.ifshowaddroles
    },
    // 添加用户取消按钮
    canceladd () {
      this.ifshowaddroles = false
    },
    // 添加用户确认按钮
    determineadd () {
      // console.log(123)
      this.$refs.addroles.validate(async valid => {
        if (!valid) return false
        // 如果与验证通过那就发起请求
        const { data: res } = await this.$http.post('roles', { roleName: this.addroles.roleName, roleDesc: this.addroles.roleDesc })
        console.log(res)
        this.ifshowaddroles = false
        this.getroles()
      })
    },
    // 分配权限的函数
    async assign (val) {
      const { data: res } = await this.$http.get('rights/tree')
      console.log(res.data)
      this.roleid = val.id
      this.allPermissions = res.data
      this.permissionsId(val, this.allid)
      // console.log(this.allid)
      this.AssignPermissions = true
    },
    // 获取所有三级权限的id,使用递归的方式来进行
    permissionsId (node, arr) {
      // 如果该节点没有了children属性的话，那么就是最后一个层级。那就直接把该节点的id存放到数组中去
      if (!node.children) return arr.push(node.id)
      // 如果不是三级节点那就对这个三级节点的children属性进行循环。然后再次调用获取所有三级权限id的函数
      node.children.forEach(item => {
        this.permissionsId(item, arr)
      })
    },
    // 用来监听对话框的关闭
    setRightclose () {
      this.allid = []
    },
    // 分配角色确定按钮
    addrolesdetermine () {
      const newarr = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const keyarr = newarr.join(',')
      // console.log(keyarr)
      // 发送角色授权的请求
      const { data: res } = this.$http.post(`roles/${this.roleid}/rights`, { rids: keyarr })
      console.log(res)
      this.AssignPermissions = false
      this.getroles()
      // console.log(this.roleid)
    },
    // 重置校验
    changeeditClosed () {
      this.$refs.editroles.resetFields()
      // console.log(refsDome)
    },
    // 重置添加用户校验
    changeaddClosed () {
      this.$refs.addroles.resetFields()
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
/deep/ .el-table{
  margin-top: 15px;
}
/deep/ .el-tag{
  margin: 7px;
}
.dbtop{
  border-top:1px solid #EEEEEE ;
}
.dbbottom{
  border-bottom: 1px solid #EEEEEE;
}
</style>
