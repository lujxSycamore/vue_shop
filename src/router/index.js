import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/Users.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome', /* 访问home的时候就重定向到welcome组件 */
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users }
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
  if (!token) {
    next('/login')
    alert('请先登录')
  }
  next()
})

export default router
