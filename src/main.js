import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import axios from 'axios'
import './assets/css/global.css'/* 引入全局样式表css */
import './assets/fonts/iconfont.css'/* 引入阿里图标字体库 */
import VueQuillEditor from 'vue-quill-editor'/* 引入富文本编辑器 */
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

Vue.use(VueQuillEditor)/* 使用富文本编辑器 */

axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'/* 接口的基准地址 */
axios.interceptors.request.use(config => {
  /* 为请求头对象的Authorization挂载token令牌以调用除登录以外的API接口 */
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

/* 配置axios全局默认值,在每一个组件中不需要再import引入 */
Vue.prototype.$http = axios

/* 阻止启动生产消息,一般在项目上线之后改为true */
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

/* 设置过滤器 格式化时间 化为yy-mm-dd : hh:mm:ss格式 */
Vue.filter('dateFormate', function (originValue) {
  const datetime = new Date(originValue)
  const year = datetime.getFullYear()
  const month = (datetime.getMonth() + 1 + '').padStart(2, '0')
  const date = (datetime.getDate() + '').padStart(2, '0')
  const hour = (datetime.getHours() + '').padStart(2, '0')
  const min = (datetime.getMinutes() + '').padStart(2, '0')
  const seconds = (datetime.getSeconds() + '').padStart(2, '0')
  return `${year}-${month}-${date} : ${hour}:${min}:${seconds}`
})
