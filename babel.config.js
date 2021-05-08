// 定义一个空数组
const proPlugins = []
// 判断项目是否是处于开发阶段或者是发布阶段
if (process.env.NODE_ENV === 'production') {
  // 如果是true，那么就直接向上面的那个数组中添加一个对象
  proPlugins.push('transform-remove-console')
}
module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    [
      'component',
      {
        libraryName: 'element-ui',
        styleLibraryName: 'theme-chalk'
      }
    ],
    // 发布产品时候的插件
    // ...的作用：就是把数组中的每一项全部罗列出来，而不是以数组的形式展现
    ...proPlugins
    // 'babel-plugin-syntax-dynamic-import'
  ]
}
