<template>
  <div class="Roles">
    <span class="symbol_text">roles_area</span>

    <!-- 面包屑区域，显示当前页面路径 -->
    <el-card class="bread_crumb" shadow="always">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-card>

    <!-- 组件主区域 -->
    <el-card>
      <!-- 添加角色按钮 -->
      <el-button @click="showAddRolesDialog()" type="primary" size="default"
        >添加角色</el-button
      >

      <!-- 角色列表 -->
      <el-table :data="rolesList" border :stripe="true" class="roles_table">
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['table_row', 'row_center']"
              v-for="item in scope.row.children"
              :key="item.id"
            >
              <!-- 一级权限 -->
              <el-col :span="6">
                <el-tag>{{ item.authName }}</el-tag>
                <i class="el-icon-right"></i>
              </el-col>

              <!-- 二级与三级权限总占18格 -->
              <el-col :span="16">
                <!-- 二级权限 18格中，再划分，占10格 -->
                <el-row
                  class="row_center"
                  v-for="item1 in item.children"
                  :key="item1.id"
                >
                  <el-col :span="10">
                    <el-tag type="success">{{ item1.authName }}</el-tag>
                    <i class="el-icon-right"></i>
                  </el-col>

                  <!-- 三级权限 -->
                  <el-col :span="14">
                    <el-tag
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                      type="warning"
                      v-for="item2 in item1.children"
                      :key="item2.id"
                    >
                      {{ item2.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!-- <pre>{{ scope.row }}</pre> -->
          </template>
        </el-table-column>

        <!-- 序号列 -->
        <el-table-column type="index"></el-table-column>

        <!-- 角色名称列 -->
        <el-table-column label="角色名称" prop="roleName"></el-table-column>

        <!-- 角色描述列 -->
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>

        <!-- 角色操作列 -->
        <el-table-column label="角色操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="showEditRoleDialog(scope.row)"
              >编辑</el-button
            >
            <el-button size="mini" type="danger" @click="deleteRoles(scope.row)"
              >删除</el-button
            >
            <el-button
              size="mini"
              type="warning"
              @click="showSetRightDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分配权限_对话框 默认不可见 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="40%"
      @close="closeSetRightDialog()"
    >
      <!-- 树形控件表单 -->
      <el-tree
        :data="rightsList"
        :props="roleTreeProps"
        :show-checkbox="true"
        node-key="id"
        :default-checked-keys="DefaulcheckedKeys"
        :default-expanded-keys="DefaulcheckedKeys"
        ref="setRightTreeRef"
      ></el-tree>
      <!--对话框下方的按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRight()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加角色对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addRolesDialogVisible"
      width="40%"
      @close="closeAddRolesDialog()"
    >
      <el-form
        :model="addRolesForm"
        :rules="addRolesFormRules"
        ref="addRolesFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="addRolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRolesDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoles()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑角色_对话框 默认不可见 -->
    <el-dialog
      title="编辑角色"
      :visible.sync="editRoleDialogVisible"
      width="30%"
    >
      <el-form
        :model="editRoleForm"
        :rules="editRoleFormRules"
        ref="editRolesFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="editRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      /* getRolesList()请求的,所有角色的权限列表 */
      rolesList: [],

      /* 分配权限对话框的可见属性 */
      setRightDialogVisible: false,

      /* 需要分配权限的用户ID */
      SetRightRoleId: '',

      /* 所有的权限（树型） */
      rightsList: [],

      /* 树形控件结构绑定对象 */
      roleTreeProps: {
        children: 'children',
        label: 'authName'
      },

      /* 默认展开的节点的 key 的数组 */
      DefaulcheckedKeys: [],

      /* 添加角色对话框的可见属性 */
      addRolesDialogVisible: false,

      /* 添加角色表单数据 */
      addRolesForm: {
        roleName: '',
        roleDesc: ''
      },

      /* 添加角色表单验证规则 */
      addRolesFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ]
      },

      /* 编辑角色对话框的可见属性 */
      editRoleDialogVisible: false,

      /* 编辑角色表单数据 */
      editRoleForm: {
        roleName: '',
        roleDesc: '',
        roleId: ''
      },

      /* 编辑角色对话框的表单验证规则 */
      editRoleFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    /* 获取用户的角色列表 */
    getRolesList () {
      this.$http.get('roles').then((responce) => {
        if (responce.data.meta.status !== 200) {
          return this.$message({
            type: 'error',
            message: responce.data.meta.msg
          })
        }
        this.rolesList = responce.data.data
      })
    },

    /* 根据角色的ID删除权限 */
    removeRightById (role, rightId) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http
            .delete('roles/' + role.id + '/rights/' + rightId)
            .then((responce) => {
              if (responce.data.meta.status !== 200) {
                this.$message({
                  type: 'error',
                  message: '删除失败!'
                })
              }
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              /* this.getRolesList() 会刷新整个list，没必要，而且展开列会关闭，不推荐 没有必要为了一个tag中的权限刷新整个列表 */

              role.children = responce.data.data
              /* 此接口返回的data, 是当前角色下最新的权限数据，只需要将当前角色的children属性更新即可，双向绑定 */
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },

    /* 显示 分配权限_对话框 */
    showSetRightDialog (role) {
      this.$http.get('rights/tree').then((responce) => {
        /* 获取当前所有权限的树形列表 */
        if (responce.data.meta.status !== 200) {
          return this.$message({
            type: 'error',
            message: '数据获取失败'
          })
        }
        this.rightsList = responce.data.data

        this.getDefaulcheckedKeys(
          role,
          this.DefaulcheckedKeys
        ) /* 获取当前角色已有的权限 */
        this.setRightDialogVisible = true
        this.SetRightRoleId = role.id
      })
    },

    /* 确认 分配权限 */
    setRight () {
      const keys = [
        ...this.$refs.setRightTreeRef.getCheckedKeys(),
        ...this.$refs.setRightTreeRef.getHalfCheckedKeys()
      ] /* "..."为展开运算符，将数组展开 */
      const idstr = keys.join(',')
      this.$http
        .post('roles/' + this.SetRightRoleId + '/rights', {
          rids: idstr
        })
        .then((responce) => {
          if (responce.data.meta.status !== 200) {
            return this.$message({
              type: 'error',
              message: responce.data.meta.msg
            })
          }
          this.$message({
            type: 'success',
            message: '角色分配成功'
          })
          this.getRolesList()
          this.setRightDialogVisible = false
        })
    },

    /* 通过递归children获取当前角色的三级权限 */
    getDefaulcheckedKeys (node, arr) {
      /* 若为三级权限则将权限id存入数组 */
      if (!node.children) {
        return arr.push(node.id)
      }
      /* 不为三级权限的节点 */
      node.children.forEach((element) => {
        this.getDefaulcheckedKeys(element, arr)
      })
    },

    /* 设置用户权限对话框关闭 */
    closeSetRightDialog () {
      this.DefaulcheckedKeys = []
    },

    /* 显示添加角色对话框 */
    showAddRolesDialog () {
      this.addRolesDialogVisible = true
    },

    /* 关闭添加角色对话框 */
    closeAddRolesDialog () {
      this.$refs.addRolesFormRef.resetFields() /* 重置表单 */
    },

    /* 确认添加角色 */
    addRoles () {
      this.$http
        .post('roles', {
          roleName: this.addRolesForm.roleName,
          roleDesc: this.addRolesForm.roleDesc
        })
        .then((responce) => {
          if (responce.data.meta.status !== 201) {
            return this.$message({
              type: 'error',
              message: responce.data.meta.msg
            })
          }
          this.$message({
            type: 'success',
            message: '添加成功'
          })
          this.getRolesList()
          this.addRolesDialogVisible = false
        })
    },

    /* 删除角色 */
    deleteRoles (roles) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http.delete('roles/' + roles.id).then((responce) => {
            if (responce.data.meta.status !== 200) {
              return this.$message({
                type: 'error',
                message: responce.data.meta.msg
              })
            }
            this.$message({
              type: 'success',
              message: responce.data.meta.msg
            })
            this.getRolesList()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },

    /* 显示编辑角色对话框 */
    showEditRoleDialog (role) {
      this.editRoleDialogVisible = true
      this.$http.get('roles/' + role.id).then((responce) => {
        if (responce.data.meta.status !== 200) {
          return this.$message({
            type: 'error',
            message: responce.data.meta.msg
          })
        }
        this.editRoleForm.roleId = role.id
        this.editRoleForm.roleName = responce.data.data.roleName
        this.editRoleForm.roleDesc = responce.data.data.roleDesc
      })
    },

    /* 确认编辑角色 */
    editRole () {
      this.$refs.editRolesFormRef.validate((vaild) => {
        if (!vaild) {
          return this.message({
            type: 'error',
            message: '表单验证未通过'
          })
        }
        this.$http
          .put('roles/' + this.editRoleForm.roleId, {
            roleName: this.editRoleForm.roleName,
            roleDesc: this.editRoleForm.roleDesc
          })
          .then((responce) => {
            if (responce.data.meta.status !== 200) {
              return this.$message({
                type: 'error',
                message: responce.data.meta.msg
              })
            }
            this.$message({
              type: 'success',
              message: '修改成功'
            })
            this.getRolesList()
            this.editRoleDialogVisible = false
          })
      })
    }
  },
  created () {
    this.getRolesList()
  }
}
</script>

<style lang="less" scoped>
.symbol_text {
  color: gray;
}
.bread_crumb {
  margin-bottom: 20px;
}
.roles_table {
  margin-top: 20px;
  box-shadow: 0 0 3px #dcdfe6;
}
.el-tag {
  margin: 10px;
}
.table_row {
  transform: (translate(50px));
  width: 85%;
  border-bottom: 1px solid #eeeeee;
}
.el-icon-right {
  margin-left: 80px;
}
.row_center {
  display: flex;
  align-items: center;
}
.el-form-item {
  width: 90%;
}
</style>
