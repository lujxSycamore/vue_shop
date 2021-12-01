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

    <!-- 主体区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="10">

          <!-- 搜索框 -->
          <el-input placeholder="请输入内容" v-model="requestInfo.query" :clearable="true" @clear="getGoodList()">
            <el-button slot="append" icon="el-icon-search" @click="getGoodList()"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">

          <!-- 添加商品 -->
          <router-link to="/goods/add">
            <el-button type="primary">添加商品</el-button>
          </router-link>
        </el-col>
      </el-row>

      <!-- 商品列表 -->
      <el-table :data="goodList">
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column label="商品价格" prop="goods_price"></el-table-column>
        <el-table-column label="创建时间" prop="add_time">
          <template slot-scope="scope">
            {{scope.row.add_time | dateFormate}}
          </template>
        </el-table-column>
        <el-table-column label="商品重量" prop="goods_weight"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 编辑角色按钮 -->
            <el-button type="primary" icon="el-icon-edit" @click="showEditGoodsDialog(scope.row)"></el-button>

            <!-- 删除角色按钮 -->
            <el-button type="danger" icon="el-icon-delete" @click="deleteGoods(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 底部页码 页面跳转区域 -->
      <el-pagination
        style="width: 100%"
        class="el_pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="requestInfo.pagenum"
        :page-sizes="[6, 10, 15, 20]"
        :page-size="requestInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 编辑商品对话框 默认不可见 -->
    <el-dialog
      title="编辑商品"
      :visible.sync="editGoodsDialogVisible"
      width="30%"
      >
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
</el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {

      /* 请求商品数据的参数 */
      requestInfo: {
        query: '',
        pagenum: 1,
        pagesize: 6
      },

      /* 商品列表数据 */
      goodList: [],

      /* 当前商品列表的总记录 */
      total: 0,

      /* 编辑商品对话框的可见属性 */
      editGoodsDialogVisible: false
    }
  },
  methods: {
    /* 获取当前的商品列表数据 */
    getGoodList () {
      this.$http
        .get('goods', {
          params: this.requestInfo
        })
        .then((responce) => {
          console.log(responce)
          if (responce.data.meta.status !== 200) {
            return this.$message({
              type: 'error',
              message: responce.data.meta.msg
            })
          }
          this.goodList = responce.data.data.goods
          this.total = responce.data.data.total
        })
    },

    /* 当前的页面大小更改事件 */
    handleSizeChange (newSize) {
      this.requestInfo.pagesize = newSize
      this.getGoodList()
    },

    /* 页面跳转事件 */
    handleCurrentChange (newPage) {
      this.requestInfo.pagenum = newPage
      this.getGoodList()
    },

    /* 编辑商品 */
    showEditGoodsDialog (value) {
      this.editGoodsDialogVisible = true
    },

    /* 删除商品 */
    deleteGoods (value) {
      console.log(value)
      this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http.delete('goods/' + value.goods_id).then((responce) => {
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
            this.getGoodList()
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
    this.getGoodList()
  }
}
</script>

<style lang="less" scope="this api replaced by slot-scope in 2.5.0+">
.symbol_text {
  color: gray;
}
.bread_crumb {
  margin-bottom: 15px;
}
.el_table {
  margin-top: 15px;
  margin-bottom: 15px;
}
</style>
