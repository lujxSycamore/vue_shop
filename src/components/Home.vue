<template>
  <div class="home_container">
    <el-container class="el_homeContainer">

      <!-- 顶部head布局区域 -->
      <el-header>
        <div>
          <img src="../assets/portrait.jpg" />
          <font color="white">Home_area</font>
        </div>
        <el-button type="info" size="medium" @click="logOut()">登出</el-button>
      </el-header>

      <el-container>

        <!-- 侧边栏区域 -->
        <el-aside :width="collapseFlag ? '64px' : '300px'">

          <!-- 侧边栏折叠按钮区域 -->
          <div class="fold_div" @click="foldClick()">
            <span v-if="collapseFlag">|展开|</span>
            <span v-else>-折叠-</span>
          </div>

          <!-- 侧边栏区域 -->
          <el-menu
            background-color="#333744"
            text-color="#fff"
            active-text-color="#409EFF"
            :unique-opened="true"
            :collapse="collapseFlag"
            :router="true"
            :default-active="defaultActive"
          ><!-- router="true"开启菜单的路由跳转 -->

            <!-- 侧边栏菜单区域 -->
            <el-submenu
              :index="item.id + ''"
              v-for="item in menuList"
              :key="item.id"
              >
              <template slot="title">
                <i :class="iconObject[item.id]"></i>
                <span>{{ item.authName }}</span>
              </template>

              <!-- 二级菜单区域 -->
              <el-menu-item
                :index="'/'+subItem.path"
                v-for="subItem in item.children"
                :key="subItem.id"
                @click="menuClick('/'+subItem.path)"
              >
                <i class="el-icon-menu"></i>
                <span>{{ subItem.authName }}</span>
              </el-menu-item>

            </el-submenu>
          </el-menu>
        </el-aside>

        <!-- 主界面区域 -->
        <el-main>

          <!-- 路由占位符 -->
          <router-view></router-view>
        </el-main>

      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  data () {
    return {
      /* 通过接口获取的菜单栏数据 */
      menuList: [],

      /* 菜单栏的图标对象 */
      iconObject: {
        125: 'iconfont icon-morentouxiang',
        103: 'iconfont icon-3702mima',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },

      /* 是否折叠菜单 */
      collapseFlag: false,

      /* 当前激活的菜单 */
      defaultActive: ''
    }
  },
  methods: {
    /* 退出登录状态，回到登陆界面 */
    logOut () {
      window.sessionStorage.clear('token')
      this.$router.push('/login')
      this.$message({
        message: '登出成功',
        type: '',
        showClose: true,
        duration: 3000
      })
    },

    /* 获取侧边菜单栏 */
    getMenu () {
      this.$http.get('menus').then((responce) => {
        /* console.log(responce.data.data) */
        if (responce.data.meta.status !== 200) {
          return this.$message({
            message: responce.data.meta.msg,
            type: 'error',
            showClose: true,
            duration: 3000
          })
        }
        this.menuList = responce.data.data
      })
    },

    /* 菜单栏折叠 */
    foldClick () {
      /* collapseFlag菜单栏折叠属性 */
      this.collapseFlag = !this.collapseFlag
    },

    /* 保存当前选中的路径 */
    menuClick (receivedData) {
      window.sessionStorage.setItem('defaultActive', receivedData)
    },

    /* 获取保存的菜单路径 */
    getDefaultActive () {
      this.defaultActive = window.sessionStorage.getItem('defaultActive')
    }
  },
  created () {
    /* 在模板渲染成html前调用，即通常初始化某些属性值，然后再渲染成视图 */
    this.getMenu()
    this.getDefaultActive()
  },
  mounted () {
    /* 在html渲染完成之后调用 */
  }
}
</script>

<style lang="less" scope>
.iconfont {
  padding-right: 5px;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0px;
  align-items: center;
  > div {
    display: flex;
    align-items: center;
  }
  img {
    border-radius: 50%;
    width: 50px;
    height: 50px;
    margin-right: 15px;
  }
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: aliceblue;
}
.home_container {
  height: 100%;
  width: 100%;
  .el_homeContainer {
    width: 100%;
    height: 100%;
  }
}
.fold_div {
  height: 30px;
  background-color: #475163;
  cursor: pointer;
  :hover{/* 鼠标悬停事件 */
    background-color: #292C36;
  }
  span {
    width: 100%;
    height: 100%;
    font-size: 12px;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
