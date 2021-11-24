<template>
  <div>
    <span style="color: gray">Params_area</span>

    <!-- 面包屑区域，显示当前页面路径 -->
    <el-card class="bread_crumb" shadow="always">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>分类参数</el-breadcrumb-item>
      </el-breadcrumb>
    </el-card>

    <!-- 页面主图区域 -->
    <el-card>
      <!-- 顶部警告提示框 -->
      <el-alert
        title="注意： 只允许为第三级分类设置相关参数"
        type="warning"
        :show-icon="true"
        :closable="false"
        style="margin-bottom: 15px"
      >
      </el-alert>
      <el-row>
        <el-col class="choose_cate" :span="10">
          选择商品分类：
          <el-cascader
            class="cate_cascader"
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascader_pros"
            :clearable="true"
            @change="SelectChange()"
          ></el-cascader>
        </el-col>
      </el-row>

      <!-- 标签页区域 -->
      <el-tabs v-model="activeName" @tab-click="tabClick()">
        <!-- 动态参数标签页 -->
        <el-tab-pane label="动态参数" name="many">
          <!-- 添加参数按钮 -->
          <el-button
            type="primary"
            size="mini"
            :disabled="tabButtonDisabled"
            @click="showAddDialog()"
            >添加参数</el-button
          >
          <!-- 动态参数表格 -->
          <el-table :data="manyParamsList" border style="width: 100%">
            <!-- 扩展列 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  :closable="true"
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  @close="handleTagClose(scope.row,index)"
                  :disable-transitions="true"
                  >{{ item }}
                </el-tag>
                <el-input
                  style="width: 100px; margin: 5px"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  style="margin: 5px"
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>

            <!-- 参数名称列 -->
            <el-table-column prop="attr_name" label="参数" width="400">
            </el-table-column>

            <!-- 操作列 -->
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  @click="showEditDialog(scope.row)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  size="mini"
                  @click="removeParams(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- 静态属性参数 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            size="mini"
            :disabled="tabButtonDisabled"
            @click="showAddDialog()"
            >添加属性</el-button
          >
          <!-- 静态属性表格 -->
          <el-table :data="onlyParmasList" border style="width: 100%">
            <!-- 扩展列 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  :closable="true"
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  @close="handleTagClose(scope.row,index)"
                  :disable-transitions="true"
                  >{{ item }}
                </el-tag>
                <el-input
                  style="width: 100px; margin: 5px"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  style="margin: 5px"
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>

            <!-- 参数名称列 -->
            <el-table-column prop="attr_name" label="参数" width="400">
            </el-table-column>

            <!-- 操作列 -->
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  @click="showEditDialog(scope.row)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  size="mini"
                  @click="removeParams(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加参数 对话框 默认不可见 -->
    <el-dialog
      :title="'添加' + getTitle"
      :visible.sync="addDialogVisible"
      width="40%"
      @close="closeAddDialog()"
    >
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="15%"
      >
        <el-form-item :label="getTitle" prop="attr_name">
          <el-input style="width: 90%" v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改对话框 默认不可见 -->
    <el-dialog
      :title="'修改' + getTitle"
      :visible.sync="editDialogVisible"
      width="40%"
      @close="closeEditDialog()"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="15%"
      >
        <el-form-item :label="getTitle" prop="attr_name">
          <el-input style="width: 90%" v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      /* 级联选择器选中的数值数组 */
      selectedKeys: [],

      /* 级联选择器的数据数组 */
      parentCateList: [],

      /* 级联选择器的规则对象 */
      cascader_pros: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        childern: 'childern',
        checkStrictly: 'true'
      },

      /* 被激活的标签页名称 */
      activeName: 'many',

      /* 标签页中按钮的禁止单击属性 */
      tabButtonDisabled: true,

      /* 动态参数列表的数据 */
      manyParamsList: [],

      /* 静态属性列表的数据 */
      onlyParmasList: [],

      /* 添加参数/属性对话框可见属性 */
      addDialogVisible: false,

      /* 添加参数 表单的数据 */
      addForm: {
        attr_name: ''
      },

      /* 添加参数 表单的校验规则 */
      addFormRules: {
        attr_name: [
          { required: true, message: `输入${this.getTitle}`, trigger: 'blur' }
        ]
      },

      /* 编辑对话框的可见属性 */
      editDialogVisible: false,

      /* 编辑表单的数据对象 */
      editForm: {
        attr_name: '',
        attr_id: ''
      },

      /* 编辑表单的校验规则 */
      editFormRules: {
        attr_name: [
          { required: true, message: `输入${this.getTitle}`, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    /* 级联选择器的选项更改事件 */
    SelectChange () {
      if (this.selectedKeys.length !== 3) {
        this.$message({
          type: 'warning',
          message: '只允许为第三级分类设置相关参数'
        })
        this.selectedKeys = []
        this.tabButtonDisabled = true
        this.manyParamsList = []
        this.onlyParmasList = []
      } else {
        this.getParamsList()
        this.tabButtonDisabled = false
      }
    },

    /* 获取所有的商品分类 */
    getCateList () {
      this.$http.get('categories').then((responce) => {
        if (responce.data.meta.status !== 200) {
          return this.$message({
            type: 'error',
            message: responce.data.meta.msg
          })
        }
        /* 将所有商品的分类放入级联选择器的备选项中 */
        this.parentCateList = responce.data.data
      })
    },

    /* 标签页的单击事件 */
    tabClick () {
      if (!this.tabButtonDisabled) {
        this.getParamsList()
      }
    },

    /* 获取商品分类参数列表 */
    getParamsList () {
      this.$http
        .get(`categories/${this.getCateId}/attributes`, {
          params: { sel: this.activeName }
        })
        .then((responce) => {
          if (responce.data.meta.status !== 200) {
            return this.$message({
              type: 'error',
              message: responce.data.meta.msg
            })
          }
          responce.data.data.forEach((element) => {
            /* 在每一个标签属性中添加两个新的属性用于一一对应input输入 */
            element.inputVisible = false
            element.inputValue = ''

            /* 对返回值的attr_val属性进行数据结构处理 使其成为一个数组 */
            if (element.attr_vals === '') {
              element.attr_vals = []
            } else {
              element.attr_vals = element.attr_vals.split(' ')
            }
          })

          console.log(responce.data.data)
          if (this.activeName === 'many') {
            this.manyParamsList = responce.data.data
          } else {
            this.onlyParmasList = responce.data.data
          }
        })
    },

    /* 显示添加参数 对话框 */
    showAddDialog () {
      this.addDialogVisible = true
    },

    /* 添加参数对话框关闭 */
    closeAddDialog () {
      this.$refs.addFormRef.resetFields()
    },

    /* 确认添加参数 */
    addParams () {
      this.addDialogVisible = false
      this.$http
        .post(`categories/${this.getCateId}/attributes`, {
          attr_name: this.addForm.attr_name,
          attr_sel: this.activeName
        })
        .then((responce) => {
          console.log(responce)
          if (responce.data.meta.status !== 201) {
            return this.$message({
              type: 'error',
              message: responce.data.meta.msg
            })
          }
          this.addDialogVisible = false
          this.getParamsList()
        })
    },

    /* 显示添加对话框 */
    showEditDialog (value) {
      this.editForm.attr_name = value.attr_name
      this.editForm.attr_id = value.attr_id
      this.editDialogVisible = true
    },

    /* 确认编辑 */
    editParams () {
      this.$http
        .put(
          `categories/${this.getCateId}/attributes/${this.editForm.attr_id}`,
          {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeName
          }
        )
        .then((responce) => {
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
          this.getParamsList()
          this.editDialogVisible = false
        })
    },

    /* 关闭编辑对话框 */
    closeEditDialog () {
      this.$refs.editFormRef.resetFields()
    },

    /* 删除参数 */
    removeParams (value) {
      this.$confirm(`此操作将永久删除该${this.getTitle}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http
            .delete(`categories/${this.getCateId}/attributes/${value.attr_id}`)
            .then((responce) => {
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
              this.getParamsList()
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },

    /* 添加tag的input框确认事件 */
    handleInputConfirm (value) {
      if (value.inputValue.trim().length === 0) {
        value.inputValue = ''/* 排除输入全为空格 */
        value.inputVisible = false
        return false
      }
      value.attr_vals.push(value.inputValue.trim())
      value.inputValue = ''
      this.changeAttrVal(value)
    },

    /* tag标签关闭事件 */
    handleTagClose (value, index) {
      value.attr_vals.splice(index, 1)
      this.changeAttrVal(value)
    },
    /* tag标签的更改事件 */
    changeAttrVal (value) {
      var strAttrVals = value.attr_vals.join(' ')/* 将数组化的参数列表拼接回字符串 */
      this.$http.put(`categories/${this.getCateId}/attributes/${value.attr_id}`,
        {
          attr_name: value.attr_name,
          attr_sel: this.activeName,
          attr_vals: strAttrVals
        }).then((responce) => {
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
      })
    },
    /* 显示添加tag的input输入框 */
    showInput (value) {
      value.inputVisible = true
      /* nextTick在页面重新渲染之后执行回调函数 */
      this.$nextTick(_ => {
        /* input获得焦点 */
        this.$refs.saveTagInput.$refs.input.focus()
      })
    }
  },
  created () {
    this.getCateList()
  },

  computed: {
    /* 系统计算函数，具有返回值的函数区域 */

    /* 获取当前被选中的三级分类ID */
    getCateId () {
      if (this.selectedKeys.length === 3) {
        return this.selectedKeys[2]
      } else {
        return null
      }
    },

    /* 获取当前选中的对话框的标题 */
    getTitle () {
      if (this.activeName === 'many') {
        return '动态参数'
      } else {
        return '静态属性'
      }
    }
  }
}
</script>

<style lang="less" scope>
.bread_crumb {
  margin-bottom: 15px;
}
.el-table {
  margin-top: 15px;
  margin-bottom: 15px;
}
.el-tag {
  margin: 10px;
}

</style>
