import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'/* 引入全局样式表 */
import './assets/fonts/iconfont.css'/* 引入阿里图标字体库 */
import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
Vue.prototype.$http = axios
/* 配置axios全局默认值 */

Vue.config.productionTip = false /* 阻止启动生产消息 */

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
