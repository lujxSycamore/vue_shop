<template>
  <div class="loginContainer">
    login_area
    <div class="loginBox">
      <!-- 用户头像框 -->
      <div class="portraitBox">
        <img src="../assets/portrait.jpg" alt="" />
      </div>

      <!-- 登录页面主体表单 -->
      <el-form
        ref="loginFormRef"
        class="loginForm"
        :rules="login_formRules"
        v-bind:model="login_form"
      >
        <!-- 用户名输入框input -->
        <el-form-item label="用户名" prop="user_id">
          <!--  做表单验证时<el-form-item>必须添加prop属性，而且prop的名字必须和input框v-model绑定的值一致。
            否则的话，表单验证就会出错。
            v-model是vue.js中内置的双向数据绑定指令，用于表单控件以外的标签是不起作用的(即只对表单控件标签的数据双向绑定有效)。 -->
          <el-input
            v-model="login_form.user_id"
            prefix-icon="iconfont icon-user"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>

        <!-- 密码框输入input -->
        <el-form-item label="密 码" prop="user_password">
          <el-input
            type="password"
            v-model="login_form.user_password"
            prefix-icon="iconfont icon-lock_fill"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>

        <!-- 登陆界面按钮区域 -->
        <el-form-item class="elButton">
          <el-button type="primary" @click="login()">登录</el-button>
          <el-button type="info" @click="resetLoginForm()">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      /* 登录默认用户名与密码 */
      login_form: {
        user_id: 'admin',
        user_password: '123456'
      },
      /* 表单合法性验证的规则 */
      login_formRules: {
        user_id: [
          {
            required: true /* true */,
            message: '请输入用户名',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 5,
            message: '长度在 3 到 5 个字符',
            trigger: 'blur'
          }
        ],
        user_password: [
          {
            required: true /* true */,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 8,
            message: '密码长度在 3 到 8 个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    /* 对整个表单进行重置，将所有字段值重置为初始值并移除校验结果 */
    resetLoginForm () {
      /* console.log('resetLoginForm') */
      this.$refs.loginFormRef.resetFields()
      this.$message({
        showClose: true,
        message: '已重置'
      })
    },
    /* 登录 */
    login () {
      this.$refs.loginFormRef.validate((valid) => {
        /* console.log(valid) */
        if (!valid) {
          return this.$message({
            showClose: true,
            message: '填写不符合规范',
            type: 'warning'
          })
        }
        this.$http
          .post('/login', {
            username: this.login_form.user_id,
            password: this.login_form.user_password
          })
          .then((responce) => {
            if (responce.data.meta.status !== 200) {
              return this.$message({
                showClose: true,
                message: '登录失败:' + responce.data.meta.msg,
                type: 'error'
              })
            }
            this.$message({
              showClose: true,
              message: '登录成功',
              type: 'success'
            })
            /* tokenoken是服务端生成的一串字符串，以作客户端进行请求的一个令牌，
            当第一次登录后，服务器生成一个Token便将此Token返回给客户端，
            以后客户端只需带上这个Token前来请求数据即可，无需再次带上用户名和密码。 */
            window.sessionStorage.setItem('token', responce.data.data.token)
            this.$router.push('/home')
          })
          .catch((err) => {
            console.log(err)
          })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.loginContainer {
  background-color: #2b4b6b;
  height: 100%;
}
.loginBox {
  background-color: #eeeeee;
  border-radius: 3px;
  width: 500px;
  height: 350px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 8px #eeeeee;

  .portraitBox {
    height: 150px;
    width: 150px;
    border: 10px solid rgb(195, 193, 197);
    border-radius: 50%;
    box-shadow: 0 0 8px #eee;
    position: absolute;
    left: 50%;
    transform: (translate(-50%, -40%));
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}
.loginForm {
  position: absolute;
  bottom: 10px;
  padding: 20px;
  width: 100%;
  box-sizing: border-box;
}
.elButton {
  display: flex;
  justify-content: center;
  margin: 5px;
}
</style>
