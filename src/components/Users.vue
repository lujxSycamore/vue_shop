<template>
  <div class="Users">
    <span class="singal_text">user_area</span>

    <!-- 面包屑区域，显示当前页面路径 -->
    <el-card class="bread_crumb" shadow="always">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-card>

    <!-- user界面主体表单区域 -->
    <el-card class="user_list">
      <!-- 用户列表搜索区域 -->
      <el-row :gutter="20"
        ><!-- gutter让分栏之间存在间隔 -->
        <el-col :span="12">
          <!-- 搜索框 -->
          <el-input
            v-model="queryInfo.query"
            prefix-icon="el-icon-search"
            placeholder="请输入内容..."
            :clearable="true"
            @clear="getUserList()"
          >
            <!-- 搜索按钮 -->
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList()"
            ></el-button>
          </el-input>
        </el-col>

        <!-- 添加用户按钮 -->
        <el-col :span="4"
          ><el-button type="primary" @click="adduserDialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>

      <!-- 各用户数据表格区域 -->
      <el-table
        class="users_table"
        stripe
        :data="userList"
        border
        style="width: 100%"
      >
        <el-table-column prop="username" label="名称" width="180">
        </el-table-column>

        <el-table-column prop="role_name" label="角色" width="180">
        </el-table-column>

        <el-table-column prop="mobile" label="电话" width="180">
        </el-table-column>

        <el-table-column prop="email" label="邮箱"> </el-table-column>

        <el-table-column prop="" label="状态">
          <template slot-scope="tableData">
            <!-- 获取表格一行的数据 避免修改一个值而将表单中所有的值一起改变-->
            <el-switch
              v-model="tableData.row.mg_state"
              @change="stateChange(tableData.row)"
            >
            </el-switch>
          </template>
        </el-table-column>

        <el-table-column prop="" label="操作">
          <!-- 每一行用户相关操作按钮区域 -->

          <template slot-scope="scope"><!-- 获取该行的相关数据 -->
            <div class="operate_buttonArea">
              <!-- 修改用户记录 -->
              <el-tooltip
                class="item"
                effect="dark"
                content="修改记录"
                placement="top"
                :enterable="false"
              >
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  circle
                  @click="showEditUserDialog(scope.row.id)"
                ></el-button>
              </el-tooltip>

              <!-- 删除用户 -->
              <el-tooltip
                class="item"
                effect="dark"
                content="删除用户"
                placement="top"
                :enterable="false"
              >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  circle
                  @click="removeUserById(scope.row.id)"
                ></el-button>
              </el-tooltip>

              <!-- 分配角色 -->
              <el-tooltip
                class="item"
                effect="dark"
                content="分配角色"
                placement="top"
                :enterable="false"
              >
                <el-button
                  type="warning"
                  icon="el-icon-star-off"
                  circle
                ></el-button>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 用户表格下方 页码，翻页，页面跳转请求区域 -->
      <el-pagination
        style="width: 100%"
        class="el_pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 3, 4]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加用户_对话框 默认为不可见 -->
    <el-dialog
      title="添加用户"
      :visible.sync="adduserDialogVisible"
      width="30%"
      @close="clearAddUserForm()"
    >
      <!-- addUser表单 -->
      <el-form
        :model="addUserForm"
        :rules="addUserRules"
        ref="addUserRef"
        label-width="100px"
        class="addUser_form"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUserForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>

      <!-- addUser表单下方的按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="adduserDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户_对话框 默认不可见 -->
    <el-dialog
      title="修改用户"
      :visible.sync="EditUserDialogVisible"
      width="800px"
      @close="editUserDialogClose()"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
        class="editFormr_form"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editUserDialogClose()">取 消</el-button>
        <el-button type="primary" @click="editUser()"
          >确 定</el-button
        >
      </span>
      {{editForm}}
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    /* 自定义邮箱的校验规则 */
    var checkEmail = (rule, value, callback) => {
      const regEmail =
        /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/ /* 邮箱格式的正则表达式 */
      if (regEmail.test(value)) {
        return callback()
      }
      callback(new Error('输入邮箱不合法'))
    }

    /* 手机的自定义校验规则 */
    var checkMobile = (rule, value, callback) => {
      const regMobile = /^1[3456789]\d{9}$/ /* 手机格式的正则表达式 */
      if (regMobile.test(value)) {
        return callback()
      }
      callback(new Error('输入手机号不合法'))
    }

    return {
      /* getUserList()用户列表请求方法中的数据来源 */
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 3
      },

      /* 接收getUserList方法请求的resopnce */
      userList: [],

      /* 总记录的条数 */
      total: 0,

      /* 添加用户对话框的可见属性 */
      adduserDialogVisible: false,

      /* 添加用户操作，表单的数据 */
      addUserForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },

      /* 添加用户表单的数据验证规则 */
      addUserRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '长度在 3 到 10 个字符',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '长度在 6 到 15 个字符',
            trigger: 'blur'
          }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          /* 邮箱的自定义校验规则checkEmail */
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          /* 手机的自定义校验规则 */
          { validator: checkMobile, trigger: 'blur' }
        ]
      },

      /* 修改用户对话框的可见属性 */
      EditUserDialogVisible: false,

      /* 用户查询到的数据信息 */
      editForm: {},

      /* 修改用户_表单的验证规则 */
      editFormRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          /* 邮箱的自定义校验规则checkEmail */
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          /* 手机的自定义校验规则 */
          { validator: checkMobile, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    /* 获取用户列表 */
    getUserList () {
      this.$http.get('users', { params: this.queryInfo }).then((responce) => {
        if (responce.data.meta.status !== 200) {
          return this.$message({
            showClose: true,
            message: responce.data.meta.msg,
            type: 'error'
          })
        }
        this.$message({
          showClose: true,
          message: responce.data.meta.msg,
          type: 'success'
        })
        this.userList = responce.data.data.users
        this.total = responce.data.data.total
      })
    },

    /* 用户表格中一页显示数量改变 */
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      /* console.log(this.queryInfo.pagesize) */
      this.getUserList()
    },

    /* 翻页请求 */
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },

    /* switch控件指定用户状态改变 */
    stateChange (rowInfo) {
      this.$http
        .put('users/' + rowInfo.id + '/state/' + rowInfo.mg_state)
        .then((responce) => {
          if (responce.data.meta.status !== 200) {
            return this.$message({
              showClose: true,
              message: responce.data.meta.msg,
              type: 'error'
            })
          }
          this.$message({
            showClose: true,
            message: responce.data.meta.msg,
            type: 'success'
          })
        })
    },

    /* AddUser表单的清除事件 */
    clearAddUserForm () {
      /* 清除表单验证的结果与表单中的数据 */
      this.$refs.addUserRef.resetFields()
    },

    /* 添加用户事件 */
    addUser () {
      /* 表单的预验证通过之后才继续下一步 */
      this.$refs.addUserRef.validate((valid) => {
        if (!valid) {
          return this.$message({
            showClose: true,
            message: '填写数据不合法',
            type: 'error'
          })
        }
        this.$http.post('users', this.addUserForm).then((responce) => {
          if (responce.data.meta.status !== 201) {
            return this.$message({
              showClose: true,
              message: responce.data.meta.msg,
              type: 'error'
            })
          }
          this.$message({
            showClose: true,
            message: responce.data.meta.msg,
            type: 'success'
          })
          this.adduserDialogVisible = false
          this.getUserList()
        })
      })
    },

    /* 修改用户_对话框出现 id查询用户请求 */
    showEditUserDialog (value) {
      this.EditUserDialogVisible = true
      this.$http.get('users/' + value).then((responce) => {
        if (responce.data.meta.status !== 200) {
          return this.$message({
            showClose: true,
            message: responce.data.meta.msg,
            type: 'error'
          })
        }
        this.editForm = responce.data.data
      })
    },

    /* 取消_修改用户对话框关闭 */
    editUserDialogClose () {
      /* 清除表单验证的结果与表单中的数据 */
      this.EditUserDialogVisible = false
      this.$refs.editFormRef.resetFields()
    },

    /* 确认_修改用户信息数据 */
    editUser () {
      this.$refs.editFormRef.validate((vaild) => {
        console.log(vaild)
        if (!vaild) {
          return this.$message({
            showClose: true,
            message: '数据填写不合法',
            type: 'error'
          })
        }
        this.$http.put('users/' + this.editForm.id, {
          email: this.editForm.email,
          mobile: this.editForm.mobile
        }).then((responce) => {
          if (responce.data.meta.status !== 200) {
            return this.$message({
              showClose: true,
              message: responce.data.meta.msg,
              type: 'error'
            })
          }
          this.EditUserDialogVisible = false
          this.getUserList()
        })
      })
    },

    /* 移除用户 */
    removeUserById (value) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete('users/' + value).then((responce) => {
          if (responce.data.meta.status !== 200) {
            return this.$message({
              type: 'error',
              message: '删除失败'
            })
          }
          this.getUserList()
        })
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  },

  created () {
    /* 页面创建但网页未渲染时 */
    this.getUserList()
  }
}
</script>

<style lang="less" scoped>
.singal_text {
  color: gray;
}
.bread_crumb {
  padding: 1px;
  margin-bottom: 10px;
}
.users_table {
  margin-top: 40px;
  box-shadow: 0 0 5px #dcdfe6;
}
.el-pagination {
  margin-top: 5px;
}
.addUser_form {
  width: 90%;
}
</style>
