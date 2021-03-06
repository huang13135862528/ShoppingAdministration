import Vue from 'vue'
import VueRouter from 'vue-router'
const Login = () => import(/* webpackChunkName: "login" */ '../components/login/login.vue')
// import Login from '../components/login/login.vue'
const Home = () => import(/* webpackChunkName: "home" */ '../components/home/home.vue')
const Welcome = () => import(/* webpackChunkName: "home" */ '../components/home/welcome/welcome.vue')
const User = () => import(/* webpackChunkName: "home" */ '../components/home/user/user.vue')
// import Home from '../components/home/home.vue'
// import Welcome from '../components/home/welcome/welcome.vue'
// import User from '../components/home/user/user.vue'
const Power = () => import(/* webpackChunkName: "jurisdiction" */ '../components/jurisdiction/power.vue')
const Roles = () => import(/* webpackChunkName: "jurisdiction" */ '../components/jurisdiction/roles.vue')
// import Power from '../components/jurisdiction/power.vue'
// import Roles from '../components/jurisdiction/roles.vue'
const Classification = () => import(/* webpackChunkName: "params" */ '../components/params/classification.vue')
const Params = () => import(/* webpackChunkName: "params" */ '../components/params/params.vue')
const Goods = () => import(/* webpackChunkName: "params" */ '../components/params/goods.vue')
const AddGoods = () => import(/* webpackChunkName: "params" */ '../components/params/params.vue')
// import Classification from '../components/params/classification.vue'
// import Params from '../components/params/params.vue'
// import Goods from '../components/params/goods.vue'
// import AddGoods from '../components/params/add.vue'
const Order = () => import(/* webpackChunkName: "order" */ '../components/order/order.vue')
// import Order from '../components/order/order.vue'
const Reports = () => import(/* webpackChunkName: "order" */ '../components/reports/reports.vue')
const Report = () => import(/* webpackChunkName: "order" */ '../components/report/report.vue')
// import Reports from '../components/reports/reports.vue'
// import Report from '../components/report/report.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/login', component: Login },
    { path: '/', redirect: '/login' },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        { path: '/welcome', component: Welcome },
        { path: '/users', component: User },
        { path: '/rights', component: Power },
        { path: '/roles', component: Roles },
        { path: '/categories', component: Classification },
        { path: '/params', component: Params },
        { path: '/goods', component: Goods },
        { path: '/goods/add', component: AddGoods },
        { path: '/orders', component: Order },
        { path: '/reports', component: Reports },
        { path: '/reports', component: Report }
      ]
    }
  ]
})

// ?????????????????????????????????????????????
router.beforeEach((to, from, next) => {
  // to?????????????????????
  // from?????????????????????
  // next???????????????????????????????????????
  // next()?????????next('login')????????????
  // ???????????????????????????/login?????????????????????????????????????????????
  if (to.path === '/login') return next()
  // ??????token?????????????????????????????????????????????????????????token????????????
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
