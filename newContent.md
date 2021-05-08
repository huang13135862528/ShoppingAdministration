### 数字和字符串拼接会得到一个字符串

### 路由导航守卫控制访问权限

![](F:\web\web\ShoppingAdministration\images\搜狗截图20200730130356.jpg)

### 通过axios拦截，来添加token

![](F:\web\web\ShoppingAdministration\images\通过axios请求拦截添加token.jpg)

### 作用域插槽

这个在表格中非常的适用，适用作用于插槽可以，很清楚的显示出这个表格当前这一行的数据。

```vue
<!--作用域插槽-->
<template slot-scope="scope">
<!--这个可以拿到当前这一行的数据内容：score.row-->
<el-switch v-model="scope.row.mg_state"></el-switch>
</template>
```

catch()  函数可以用来监听之前的错误。

### vue-table-with-tree-grid依赖

使用这个组件，可以很好的完成树形分类。具体使用方法请详细观看官网的东西

### vue-quill-editor依赖

使用这个组件，可以实现文本编辑器。就例如qq日志中的那个文本编辑器一样，具体查看github上面

### lodash依赖，js实用工具库

cloneDeep（obj）可以实现深拷贝，把数据重新复制一次，然后对复制之后的数据来进行操作，更加方便。

### git操作

把创建的分支推送到github上面: git push -u origin 分支名称

切换到主分支：git checkout master

把创建的分支合并到master主分支上面： git merge 新创建的分支名称

把本地的master代码推送到github上面： git push

### 在vue中使用echarts

1. 导入echarts

   ```
   import echarts from 'echarts'
   ```

2. 使用echarts时候，我们需要对echarts来设置一个具有宽度和高度的DOM元素

   ```
   <div id="main" style="width: 600px;height: 400px;"></div>
   ```

3. 在mounted钩子函数中进行配置初始化等等操作

   - 基于准备好的dom，初始化echarts实例

     ```
     const myChart = echarts.init(document.getElementById('main'))
     ```

   - 指定图表的配置项和数据

     ```
     var option = {
                 title: {
                     text: 'ECharts 入门示例'
                 },
                 tooltip: {},
                 legend: {
                     data:['销量']
                 },
                 xAxis: {
                     data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
                 },
                 yAxis: {},
                 series: [{
                     name: '销量',
                     type: 'bar',
                     data: [5, 20, 36, 10, 10, 20]
                 }]
             };
     ```

   - 使用刚指定的配置项和数据显示图表

     ```
     myChart.setOption(option); 
     ```

### nprogress依赖，实现进度条

- 在点开一个网页，开始发送请求request我们需要开始进度条，一旦发送请求结束服务器返回响应response的时候我们就要结束进度条

  ```
  NProgress.start()
  ```

- 返回响应的时候，我们结束进度条

  ```
  NProgress.done()
  ```

```js
// 引入进度条的css
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
// 通过axios的request请求拦截器来添加token，保证拥有获取数据的权限
// 在请求头中添加一个Authorrization，来保存token的数值
// 在发送请求request我们需要开始进度条，一旦发送请求结束服务器返回响应response的时候我们就要结束进度条
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 开始进度条
  NProgress.start()
  // 必须要return config才行。这是固定的写法
  return config
})
// 返回响应的时候，我们结束进度条
axios.interceptors.response.use(config => {
  // 结束进度条
  NProgress.done()
  // 必须要return config才行。这是固定的写法
  return config
})
```

### babel-plugin-transform-remove-console依赖

去除项目中，所有console的内容

1. 找到`babel.config.js`文件，然后添加`'transform-remove-console'`到`plugins`数组中去
2. 再次进行编译时候，开发时候的console就会清除

当项目处于发布阶段的时候，我们就可以去向`plugins`中添加内容，如果处于开发阶段，我们就不用。

### 只在发布阶段移除所有的console

`process.env.NODE_ENV === ‘production’` 如果是true，那么就是处于发布阶段，否则处于开发阶段

```js
// 定义一个空数组
const proPlugins = []
// 判断项目是否是处于开发阶段或者是发布阶段
if (process.env.NODE_ENV === 'production') {
  // 如果是true，那么就直接向上面的那个数组中添加一个对象
  proPlugins.push('transform-remove-console')
}
plugins: [
    [
      'component',
      {
        libraryName: 'element-ui',
        styleLibraryName: 'theme-chalk'
      }
    ],
    // 引入proPlugins数组
    // 发布产品时候的数组。
    // ...的作用：就是把数组中的每一项全部罗列出来，而不是以数组的形式展现
    ...proPlugins
  ]
```

### 生成打包报告

根据生成的打包报告来对项目进行优化

### 项目发布之前的步骤

1. 检查是否有警告，是否有项控制台打印出来数据

2. 生成打包报告，根据生成的打包报告来看那一块内容占空间很大，从而来进行优化

   项目优化策略

   - 优化-通过vue.config.js修改webpack的默认配置

     默认情况下，vue-cli 3.0生成的项目，隐藏了webpack配置项，如果我们需要配置webpack
     需要通过vue.config.js来配置。在项目根目录中创建vue.config.js文件

     1. 默认情况下，Vue项目的开发模式和发布模式，共用一个打包的入口文件（src/main.js）。为了将项目的开发过程与发布过程分离，我们可以为两种模式，各自指定打包的入口文件，即：
        - 开发模式的入口文件为src/main-dev.js
        - 发布模式的入口文件为src/main-prod.js
     2. 我们在修改webpack的配置文件的时候，了解两个webpack的属性
        - configurewebpack：通过操作对象的形式来修改
        - chainWebpack：通过链式编程的形式来修改
        - 在vue.config.js导出的配置对象中，新增configurewebpack或者chainWebpack节点，来自定义webpack的打包配置。
        - configurewebpack和chainWebpack的作用相同，唯一的却别就是它们修改webpack配置的方式不同。

     ```
     module.exports = {
         chainWebpack:config=>{
             //发布模式
             config.when(process.env.NODE_ENV === 'production',config=>{
                 //entry找到默认的打包入口，调用clear则是删除默认的打包入口
                 //add添加新的打包入口
                 config.entry('app').clear().add('./src/main-prod.js')
             })
             //开发模式
             config.when(process.env.NODE_ENV === 'development',config=>{
                 config.entry('app').clear().add('./src/main-dev.js')
             })
         }
     }
     ```

   - 通过`externals`加载外CDN资源

     默认情况下，通过import语法导入的第三方依赖包，最终会被打包合并到同一个问价中，从而导致打包成功之后，单文件体积过大的问题。

     为了解决上面这个问题，可以通过webpack的externals节点，来配置并且加载外部的CDN资源，凡是声明在externals中的第三方依赖包，都不会被打包。

     1. 在我们的vue.config.js文件中，需要配置

        ```js
        // 使用externals设置排除项
        config.set('externals',{
        vue:'Vue',
        'vue-router':'VueRouter',
        axios:'axios',
        lodash:'_',
        echarts:'echarts',
        nprogress:'NProgress',
        'vue-quill-editor':'VueQuillEditor'
        })
        ```

     2. 设置好排除之后，为了使我们可以使用vue，axios等内容，我们需要加载外部CDN的形式解决引入依赖项。
        打开开发入口文件main-prod.js,删除掉默认的引入代码

     3. 把引入代码添加到index.html中去

        ```js
        <!-- nprogress 的样式表文件 -->
        		<link rel="stylesheet" href="https://cdn.staticfile.org/nprogress/0.2.0/nprogress.min.css" />
        		<!-- 富文本编辑器 的样式表文件 -->
        		<link rel="stylesheet" href="https://cdn.staticfile.org/quill/1.3.4/quill.core.min.css" />
        		<link rel="stylesheet" href="https://cdn.staticfile.org/quill/1.3.4/quill.snow.min.css" />
        		<link rel="stylesheet" href="https://cdn.staticfile.org/quill/1.3.4/quill.bubble.min.css" />
        		<!-- element-ui 的样式表文件 -->
        		<link rel="stylesheet" href="https://cdn.staticfile.org/element-ui/2.8.2/theme-chalk/index.css" />
        		
        		<!--导入js文件-->
        		<script src="https://cdn.staticfile.org/vue/2.5.22/vue.min.js"></script>
        		<script src="https://cdn.staticfile.org/vue-router/3.0.1/vue-router.esm.js"></script>
        		<script src="https://cdn.staticfile.org/axios/0.18.0/axios.min.js"></script>
        		<script src="https://cdn.staticfile.org/lodash.js/4.17.11/lodash.min.js"></script>
        		<script src="https://cdn.staticfile.org/echarts/4.1.0/echarts.min.js"></script>
        		<script src="https://cdn.staticfile.org/nprogress/0.2.0/nprogress.min.js"></script>
        		<!-- 富文本编辑器的 js 文件 -->
        		<script src="https://cdn.staticfile.org/quill/1.3.4/quill.min.js"></script>
        		<script src="https://cdn.jsdelivr.net/npm/vue-quill-editor@3.0.4/dist/vue-quill-editor.js"></script>
        
        		<!-- element-ui 的 js 文件 -->
        		<script src="https://cdn.staticfile.org/element-ui/2.8.2/index.js"></script>
        
        ```

   - 通过CDN优化element-ui

3. 根据不同的打包环境来渲染不同的首页内容

   在vue.config.js中，进行配置。

   获取到html这个插件，然后进行回调。根据isProd属性值来进行不同的首页内容渲染

   - 发布模式

     ```js
     config.plugin('html').tap(args => {
     	args[0].isProd = true 
     	return args
     })
     ```

   - 开发模式

     ```
     config.plugin('html').tap(args => {
     	args[0].isProd = false 
     	return args
     })
     ```

   - 然后在public/index.html中使用插件判断是否为发布环境并定制首页内容

     ```js
     <!DOCTYPE html>
     <html lang="en">
       <head>
         <meta charset="utf-8">
         <meta http-equiv="X-UA-Compatible" content="IE=edge">
         <meta name="viewport" content="width=device-width,initial-scale=1.0">
         <link rel="icon" href="<%= BASE_URL %>favicon.ico">
         <title><%= htmlWebpackPlugin.options.isProd ? '' : 'dev - ' %>电商后台管理系统</title>
     
         <% if(htmlWebpackPlugin.options.isProd){ %>
         <!-- nprogress 的样式表文件 -->
         <link rel="stylesheet" href="https://cdn.staticfile.org/nprogress/0.2.0/nprogress.min.css" />
         ........
         <!-- element-ui 的 js 文件 -->
         <script src="https://cdn.staticfile.org/element-ui/2.8.2/index.js"></script>
         <% } %>
       </head>
       .......
     ```

4. 实现路由懒加载，可以提高速度

   - 安装@babel/plugin-syntax-dynamic-import包
   - 在babel.config.js配置文件中声明该插件
   - 将路由改为按需加载的形式。实例代码如下

   <https://router.vuejs.org/zh/guide/advanced/lazy-loading.html> 

### 项目上线

1. 通过node来创建服务器

   在code同级创建一个文件夹code_server存放node服务器
   使用终端打开code_server文件夹，输入命令 npm init -y
   初始化包之后，输入命令 npm i express -S
   打开code目录，复制dist文件夹，粘贴到code_server中
   在code_server文件夹中创建app.js文件,编写代码如下：

   ```
   const express = require('express')
   
   const app = express()
   
   app.use(express.static('./dist'))
   
   app.listen(8998,()=>{
       console.log("server running at http://127.0.0.1:8998")
   })
   ```

   然后再次在终端中输入  node app.js

2. 开启gzip压缩

   使用gzip可以缩小文件体积，是传输速度更快

   - 安装响应的包

     `npm install --save compression -D`

   - 在code_serve中的app.js中引入包

     `const compression = require('compression')`

   - 启用中间件

     `app.use(compression())`

3. 配置http服务

   配置https服务，对数据进行了加密处理，可以防止数据被中间人拿走，使用更加安全。

   - 首先，需要申请SSL证书，进入https://freessl.cn官网

   - 按照步骤进行之后，配置https服务

   - 在后台导入证书，打开今天资料/素材，复制素材中的两个文件到vue_shop_server中打开app.js文件，编写代码导入证书，并开启https服务

   - ```
     const express = require('express')
     const compression = require('compression')
     const https = require('https')
     const fs = require('fs')
     
     const app = express()
     //创建配置对象设置公钥和私钥
     const options = {
         cert:fs.readFileSync('./full_chain.pem'),
         key:fs.readFileSync('./private.key')
     }
     
     app.use(compression())
     app.use(express.static('./dist'))
     
     // app.listen(8998,()=>{
     //     console.log("server running at http://127.0.0.1:8998")
     // })
     
     //启动https服务
     https.createServer(options,app).listen(443)
     ```

4. 使用pm2管理应用

   打开vue_shop_server文件夹的终端，输入命令：npm i pm2 -g
   使用pm2启动项目，在终端中输入命令：pm2 start app.js --name 自定义名称
   查看项目列表命令：pm2 ls
   重启项目：pm2 restart 自定义名称
   停止项目：pm2 stop 自定义名称
   删除项目：pm2 delete 自定义名称

