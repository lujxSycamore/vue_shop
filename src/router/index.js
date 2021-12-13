import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/Users.vue'
import Rights from '../components/authority/Rights.vue'
import Roles from '../components/authority/Roles.vue'
import Categories from '../components/goods/Categories.vue'
import Params from '../components/goods/Params.vue'
import Good from '../components/goods/Goods.vue'
import Add from '../components/goods/Add.vue'
import Order from '../order/Order.vue'

/* 引入第三方树状表格 vue-table-with-tree-grid */
import tableTree from 'vue-table-with-tree-grid'
/* 全局注册tableTree，自定义命名为table-tree */
Vue.component('table-tree', tableTree)

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome', /* home的子组件默认为welcome */
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/categories', component: Categories },
      { path: '/params', component: Params },
      { path: '/goods', component: Good },
      { path: '/goods/add', component: Add },
      { path: '/orders', component: Order }
    ]
  }
]

const router = new VueRouter({
  routes: routes
})

/* 挂载路由守卫 */
router.beforeEach((to, from, next) => {
  /*  to表示将要访问的路径，from表示从拿一个路径跳转，next()表示放行，next('/xxx')强制跳转 */
  if (to.path === '/login') {
    return next()
  }
  const token = sessionStorage.getItem('token')
  /* 如果存在后端给予的token，表明已经登录成功 */
  if (!token) {
    next('/login')
    alert('请先登录')
  }
  next()
})

export default router
