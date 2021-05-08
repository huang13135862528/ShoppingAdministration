<template>
  <div id="login">
    <div class="login_container">
      <!--logo部分-->
      <div class="logoimg">
        <img  src="../../assets/1-7-2.png" />
      </div>
      <!--下面表单的部分-->
      <div class="loginform">
        <el-form ref="form" :model="form" label-width="0px" :rules="rules">
          <el-form-item label="" prop="username">
            <el-input v-model="form.username"></el-input>
            <i class="iconfont icon-usern"></i>
          </el-form-item>
          <el-form-item label="" prop="password">
            <el-input v-model="form.password"></el-input>
            <i class="iconfont icon-mima"></i>
          </el-form-item>
          <el-form-item class="item-button">
            <el-button type="primary" v-on:click="login()">登录</el-button>
            <el-button v-on:click="resetLoginForm()">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      form: {
        username: 'admin',
        password: '123456'
      },
      rules: {
        username: [
          { required: true, message: '请输入登录名称', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 进行表单重置
    resetLoginForm () {
      this.$refs.form.resetFields()
    },
    // 点击登录按钮进行表单的验证
    login () {
      this.$refs.form.validate(async valid => {
        if (!valid) return
        const result = await this.$http.post('login', this.form)
        console.log(result.data)
        // 判断返回的数据的状态码
        if (result.data.meta.status === 400) {
          // console.log(123)
          this.$message({
            message: result.data.meta.msg,
            type: 'error',
            duration: 1500
          })
          return
        }
        if (result.data.meta.status === 200) {
          // console.log(123)
          this.$message({
            message: result.data.meta.msg,
            type: 'success',
            duration: 1500
          })
          // 把表单数据保存到sessionstronge中
          // 保存token，使用键值对的方式
          window.sessionStorage.setItem('token', result.data.data.token)
          // 保存之后，就实现跳转，使用$router实现跳转
          this.$router.push('/home')
        }
      })
    }
  }
}
</script>

<style scoped>
  #login{
    height: 100%;
    background-color: #2b4b6b;
  }
  .login_container{
    width: 450px;
    height: 300px;
    border-radius: 3px;
    background-color: #ffffff;
    position: absolute;
    top: 50%;
    left: 50%;
    box-sizing: border-box;
    transform: translate(-50%,-50%);
  }
  .logoimg{
    width: 140px;
    height: 140px;
    top: -90px;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 50%;
    box-shadow: 0 0 10px #eee;
    background-color: #eee;
    border: 10px solid #ffffff;
  }
  .logoimg img{
    width: 200px;
    height: auto;
    margin-left: -30px;
    margin-top: -30px;
  }
  .loginform{
    width: 400px;
    margin-left: 25px;
    position: absolute;
    top: 35%;
  }
  .item-button{
    float: right;
  }
  .el-button--primary{
    color: #FFF;
    background-color: rgba(0, 128, 0, 1);
    border-color: rgba(0, 128, 0, 1);
  }
  .el-button:focus, .el-button:hover {
      color: #ffffff;
      border-color: rgba(144,147,153,0.5);
      background-color: rgba(144,147,153,0.5);
  }
  .el-button--primary.is-active, .el-button--primary:active,.el-button--primary:hover,.el-button--primary:focus {
    background-color: rgba(0, 128, 0, 0.7);
    border-color: rgba(0, 128, 0, 0.7);
    color: #FFF;
    border: 1px solid rgba(0, 128, 0, 0.7);
  }
  /deep/ .iconfont{
    color: #c0c4cc;
    display: block;
    height: 0px;
    position: absolute;
    top: 0px;
    left: 8px;
  }
  /deep/ .el-input__inner{
    padding: 0 30px;
  }
  /deep/ .el-input__inner:focus{
    border-color: #67c23a
  }
</style>
