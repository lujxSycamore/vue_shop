<template>
  <div class="rights">
    <span class="symbol_text">rights_area</span>

    <!-- 面包屑区域，显示当前页面路径 -->
    <el-card class="bread_crumb" shadow="always">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>权限列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-card>

    <!-- rights组件主区域 -->
    <el-card shadow="always" class="table_card">
      <el-table :data="rightList" style="width: 100%" border>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="authName" label="权限名称">
        </el-table-column>
        <el-table-column prop="path" label="权限路径">
        </el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '0'">权限等级一</el-tag>
            <el-tag type="success" v-else-if="scope.row.level === '1'">权限等级二</el-tag>
            <el-tag type="warning" v-else-if="scope.row.level === '2'">权限等级三</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      /* 接口获取的用户权限列表 */
      rightList: []
    }
  },
  methods: {
    getRightsList () {
      this.$http.get('rights/list').then((responce) => {
        if (responce.data.meta.status !== 200) {
          return this.$message({
            message: responce.data.meta.message,
            type: 'error'
          })
        }
        this.rightList = responce.data.data
      })
    }
  },
  created () {
    this.getRightsList()
  }
}
</script>

<style lang="less" scoped>
.bread_crumb {
  margin-bottom: 20px;
}

.symbol_text {
  color: gray;
}

</style>
