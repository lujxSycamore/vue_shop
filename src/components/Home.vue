<template>
  <div class="homeContainer">
    Home_area
    <el-button type="info" size="medium" @click="logOut()">登出</el-button>
  </div>
</template>

<script>
export default {
  data () {
    return {}
  },
  methods: {
    logOut () {
      window.sessionStorage.clear('token')
      this.$router.push('/login')
      this.$message({
        message: '登出成功',
        type: 'success',
        showClose: true,
        duration: 3000
      })
    }
  }
}
</script>

<style lang="less" scope>
</style>
