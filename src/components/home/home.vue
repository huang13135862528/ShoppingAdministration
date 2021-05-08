<template>
  <div class="home">
    <!--头部区域-->
    <div class="homeheader">
      <img src="../../assets/黑马logo.png" class="headerlogo"/>
      <span class="logoname">电商后台管理系统</span>
      <div class="loginform">
        <el-form label-width="0px">
          <el-form-item class="item-button">
            <el-button v-on:click="signOut()">退出</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <!--左侧区域-->
      <div class="homeleft">
      <span class="homeindent" v-on:click="ifcollapse()">|||</span>
      <el-menu
        :default-active="activePath"
        class="el-menu-vertical-demo"
        background-color="#333744"
        text-color="#fff"
        :unique-opened='true'
        :collapse='ifshow = ifshow'
        :collapse-transition='false'
        :style="width=ifshow ? '64px' : '200px'"
        :router='true'>
        <!--一级菜单-->
        <el-submenu
        :index="item.id + ''"
        v-for="(item) in menulist"
        v-bind:key="item.id">
          <template slot="title">
            <i :class="iconObj[item.id]"></i>
            <span>{{item.authName}}</span>
          </template>
          <!--二级菜单-->
          <el-menu-item
          :index="'/' + item.path + ''"
          v-for="item in item.children"
          v-bind:key="item.id"
          v-on:click="saveNavstate('/' + item.path + '')">
            <i class="iconfont icon-fangkuai"></i>
            <span>{{item.authName}}</span>
          </el-menu-item>
        </el-submenu>

      </el-menu>
    </div>
    <!--右侧区域-->
    <div class="homeright">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      isCollapse: true,
      menulist: '',
      // 可以通过唯一的id来确定icon图标
      iconObj: {
        125: 'iconfont icon-users',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      // 是否展开和折叠的动态
      ifshow: false,
      // 保存左侧二级菜单的状态
      activePath: ''
    }
  },
  created () {
    this.getMenulist()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    signOut () {
      window.sessionStorage.clear('token')
      this.$router.push('/login')
    },
    // 获取左边的导航
    async getMenulist () {
      const menulist = await this.$http.get('menus')
      if (menulist.data.meta.status !== 200) {
        this.$message.error('请求失败')
      }
      this.menulist = menulist.data.data
      // console.log(this.menulist)
    },
    // 是否折叠收起菜单
    ifcollapse () {
      // 点击就让数据发生改变
      this.ifshow = !this.ifshow
    },
    // 激活左侧二级菜单的状态
    saveNavstate (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style scoped>
.el-button{
  float: right;
  color: #FFFFFF;
  border-color: #909399;
  background-color: #909399;
  margin-top: -50px;
  margin-right: 20px;
}
.el-button:focus, .el-button:hover {
  color: #ffffff;
  border-color: rgba(144,147,153,0.7);
  background-color: rgba(144,147,153,0.7);
}
.homeheader{
  width: 100%;
  height: 60px;
  background-color: #373d41;
}
.logoname{
  display: block;
  font-size: 22px;
  color: #FFFFFF;
  position: absolute;
  top: 15px;
  left: 65px;
}
.headerlogo{
  display: block;
  width: 50px;
  height: 50px;
  padding: 5px;
}
.home{
  width: 1280px;
  height: 100%;
}
.homeleft{
  height: 90%;
  float: left;
  background-color: #333744;
  margin-right: 20px;
}
.homeright{
  height: auto;
  padding-top: 15px;
  box-sizing: border-box;
}
.homeindent{
  display: block;
  line-height: 25px;
  font-size: 12px;
  color: #FFFFFF;
  text-align: center;
  background-color: #4a5064;
  letter-spacing: 0.2em;
  cursor: pointer;
}
.el-submenu__title i,.el-menu-item i{
  font-size: 18px;
  margin-right: 5px;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
</style>
