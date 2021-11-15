<template>
  <div class="categories">
    <span class="symbol_text">categories_area</span>

    <!-- 面包屑区域，显示当前页面路径 -->
    <el-card class="bread_crumb" shadow="always">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品分类</el-breadcrumb-item>
      </el-breadcrumb>
    </el-card>

    <!-- 商品分类主体区域 -->
    <el-card class="main_card">
      <!-- 添加分类 -->
      <el-row class>
        <el-col class="button_col" :span="6">
          <el-button type="primary" @click="showAddcateDialog()"
            >添加分类</el-button
          >
        </el-col>
      </el-row>

      <!-- 表格区域 -->
      <table-tree
        :data="cateList"
        :columns="colConfig"
        :show-index="true"
        index-text=""
        :border="true"
        :expand-type="false"
        :selection-type="false"
      >
        <!-- 是否有效 模板列 -->
        <template slot="isok" slot-scope="scope">
          <i
            v-if="scope.row.cat_deleted === false"
            class="el-icon-check"
            style="color: #409eff"
          ></i>
          <i v-else class="el-icon-close" style="color: red"></i>
        </template>

        <!-- 等级 模板列 -->
        <template slot="level" slot-scope="scope" class="col_level">
          <el-tag v-if="scope.row.cat_level === 0">等级一</el-tag>
          <el-tag v-else-if="scope.row.cat_level === 1" type="success"
            >等级二</el-tag
          >
          <el-tag v-else-if="scope.row.cat_level === 2" type="warning"
            >等级三</el-tag
          >
        </template>

        <!-- 操作 模板列 -->
        <template slot="operation" slot-scope="scope">

          <!-- 编辑分类操作 -->
          <el-button type="primary" size="mini" @click="showEditCateDialog(scope.row)">
            <i class="el-icon-edit"></i>编辑
          </el-button>

          <!-- 删除分类操作 -->
          <el-button type="danger" size="mini" @click="deleteCate(scope.row)">
            <i class="el-icon-delete"></i>删除</el-button
          >
        </template>
      </table-tree>

      <!-- 页码 分页 区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="cateListInfo.pagenum"
        :page-sizes="[1, 2, 4, 6, 8]"
        :page-size="cateListInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="cateListTotal"
      >
      </el-pagination>
    </el-card>

    <!-- 添加分类对话框 默认不可见 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addcateDialogVisible"
      width="40%"
      @close="addCateDialogClose()"
    >
      <el-form
        class="add_cate_form"
        ref="addCateFormRef"
        :model="addCateForm"
        :rules="addCateFormRules"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input
            v-model="addCateForm.cat_name"
            placeholder="输入分类名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="父类名称">
          <el-cascader
          class="cate_cascader"
          v-model="selectedKeys"
          :options="parentCateList"
          :props="cate_pros"
          :clearable="true"
          @change="SelectChange()"
          :change-on-select="true"
        ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addcateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate()"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 编辑分类 对话框 默认不可见 -->
    <el-dialog
      title="编辑分类"
      :visible.sync="editCateDialogVisiable"
      width="40%"
      @close="editCateDialogClose()"
    >
      <el-form
        :model="editCateForm"
        :rules="editCateFormRules"
        ref="editCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisiable = false">取 消</el-button>
        <el-button type="primary" @click="editCate()"
          >确 定</el-button
        >
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  data () {
    return {
      /* 商品分类列表数据 */
      cateList: [],

      /* 商品分类列表数据总数 */
      cateListTotal: 0,

      /* 商品分类列表请求参数 */
      cateListInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 6
      },

      /* table-tree各列的配置 */
      colConfig: [
        {
          label: '分类名称',
          prop: 'cat_name' /* 表示将当前属性的值直接显示在列表中 */
        },
        {
          label: '是否有效',
          type: 'template' /* 表示当前列为模板列 */,
          template: 'isok' /* 当前模板的名称 */,
          width: '100px'
        },
        {
          label: '等级',
          type: 'template',
          template: 'level'
        },
        {
          label: '操作',
          type: 'template',
          template: 'operation'
        }
      ],

      /* 添加分类对话框的可见属性 */
      addcateDialogVisible: false,

      /* 添加分类的表单属性 */
      addCateForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0
      },

      /* 添加分类的表单验证规则 */
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },

      /* 父节点的数据 */
      parentCateList: [],

      /* 级联选择器选中的数据 双向数据绑定 */
      selectedKeys: [],

      /* 级联选择器中的配置对象 */
      cate_pros: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        childern: 'childern'
      },

      /* 编辑商品分类中对话框的可见属性 */
      editCateDialogVisiable: false,

      /* 编辑商品分类表单对象数据 */
      editCateForm: {
        cat_name: ''
      },

      /* 编辑商品表单校验规则 */
      editCateFormRules: {
        cat_name: [
          { required: true, message: '请输入商品分类名称', trigger: 'blur' }
        ]
      },

      /* 需要操作的商品的分类的ID */
      operatrCateID: 0

    }
  },
  methods: {
    /* 获取商品分类列表 */
    getCateList () {
      this.$http
        .get('categories', { params: this.cateListInfo })
        .then((responce) => {
          if (responce.data.meta.status !== 200) {
            return this.$message({
              type: 'error',
              message: responce.data.meta.msg
            })
          }
          this.cateList = responce.data.data.result
          this.cateListTotal = responce.data.data.total
        })
    },

    /* 页面大小更改事件 */
    handleSizeChange (newSize) {
      this.cateListInfo.pagesize = newSize
      this.getCateList()
    },

    /* 当前页面更改事件 */
    handleCurrentChange (newPage) {
      this.cateListInfo.pagenum = newPage
      this.getCateList()
    },

    /* 显示添加分类对话框 */
    showAddcateDialog () {
      /* 获取所有当前的二级分类 */
      this.$http.get('categories', { params: { type: 2 } }).then((responce) => {
        if (responce.data.meta.status !== 200) {
          return this.$message({
            type: 'error',
            message: responce.data.meta.msg
          })
        }
        this.parentCateList = responce.data.data
        this.addcateDialogVisible = true
      })
    },

    /* 添加分类对话框关闭事件 */
    addCateDialogClose () {
      /* 重置表单数据 */
      this.$refs.addCateFormRef.resetFields()
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    },

    /* 级联选择器选项改变事件 */
    SelectChange () {
      if (this.selectedKeys.length > 0) {
        /* 最后一项当作父级分类,作为添加分类的pid */
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        /* 分类等级为选中数组长度 */
        this.addCateForm.cat_level = this.selectedKeys.length
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },

    /* 确认添加分类 */
    addCate () {
      this.$refs.addCateFormRef.validate(valid => {
        if (!valid) {
          return this.$message({
            type: 'error',
            message: '表单验证失败'
          })
        }
        this.$http.post('categories', this.addCateForm).then((responce) => {
          if (responce.data.meta.status !== 201) {
            return this.$message({
              type: 'error',
              message: responce.data.meta.msg
            })
          }
          this.getCateList()
          this.addcateDialogVisible = false
        })
      })
    },

    /* 显示编辑分类对话框 */
    showEditCateDialog (row) {
      this.editCateDialogVisiable = true
      this.operatrCateID = row.cat_id
    },

    /* 编辑分类操作 */
    editCate () {
      this.editCateDialogVisiable = true
      this.$http.put('categories/' + this.operatrCateID, { cat_name: this.editCateForm.cat_name }).then((responce) => {
        if (responce.data.meta.status !== 200) {
          return this.$message({
            type: 'error',
            message: responce.data.meta.msg
          })
        }
        this.getCateList()
        this.editCateDialogVisiable = false
      })
    },

    /* 编辑分类对话框关闭操作 */
    editCateDialogClose () {
      this.editCateID = 0
      this.$refs.editCateFormRef.resetFields()
    },
    deleteCate (roles) {
      this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http.delete('categories/' + roles.cat_id).then((responce) => {
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
            this.getCateList()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  },
  created () {
    this.getCateList()
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
.button_col {
  display: flex;
  /* justify-content: center; */
}
.el-pagination {
  margin-top: 20px;
}
.el-row {
  margin-bottom: 20px;
}
.cate_cascader{
  width: 100%;
}
</style>
