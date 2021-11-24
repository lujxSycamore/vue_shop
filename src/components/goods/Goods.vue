<template>
    <div>
        <span class="symbol_text">goods_area</span>

        <!-- 面包屑区域，显示当前页面路径 -->
        <el-card class="bread_crumb" shadow="always">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>
        </el-card>
    </div>
</template>

<script>
export default {
  data () {
    return {

    }
  }
}
</script>

<style lang="less" scope="this api replaced by slot-scope in 2.5.0+">
.symbol_text {
  color: gray;
}
.bread_crumb{
    margin-bottom: 15px;
}
</style>
