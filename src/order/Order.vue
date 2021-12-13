<template lang="">
  <div>
    <span class="symble_text">order_area</span>
      <!-- 面包屑区域，显示当前页面路径 -->
        <el-card class="bread_crumb" shadow="always">
          <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>订单管理</el-breadcrumb-item>
          <el-breadcrumb-item>订单列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-card>

    <!-- 界面主体区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8" :offset="0">
          <el-input size="normal" label="">
            <el-button icon="el-icon-search" slot="append"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 表格主体区域 -->
      <el-table :data="orderList" border stripe>
        <el-table-column prop="order_number" label="订单编号">
        </el-table-column>
        <el-table-column prop="order_price" label="订单价格">
        </el-table-column>
        <el-table-column prop="pay_status" label="是否付款">
          <template slot-scope="scope">
            <el-tag type="success" size="normal"  effect="dark" v-if="scope.row.pay_status === '1'">已付款</el-tag>
            <el-tag type="danger" size="normal"  effect="dark" v-else>未付款</el-tag>
          </template>
        </el-table-column>
          <template slot-scope="">
          </template>
        <el-table-column prop="is_send" label="是否发货">
        </el-table-column>
        <el-table-column prop="create_time" label="下单时间">
          <template slot-scope="scope">
            <template>
              {{scope.row.create_time | dateFormate}}
            </template>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template>

            <!-- 编辑按钮 -->
            <el-button
              class="edit_btn"
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="showEdit()"
            ></el-button>

            <!-- 显示物流进度 (后端接口问题)  -->
            <el-popover
              placement="top-start"
              title="警告"
              width="200"
              trigger="hover"
              content="功能未完善"
            >
              <el-button
                class="logist_btn"
                slot="reference"
                type="success"
                size="mini"
                icon="el-icon-s-flag"
                @click="showLogistics()"
              ></el-button>
            </el-popover>

          </template>
        </el-table-column>
      </el-table>

      <!-- 底部页码 页面跳转区域 -->
      <el-pagination
        style="width: 100%"
        class="el_pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 3, 6, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 编辑地址对话框 默认不可见 -->
    <el-dialog
      title="编辑地址"
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
        <el-form-item label="选择地址" prop="provice">
          <el-cascader
            class="edit_cascader"
            v-model="editForm.provice"
            :options="citydata"
            :props="{ expandTrigger: 'hover' }"
            :clearable="true"
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="detailAddress">
          <el-input v-model="editForm.detailAddress" placeholder="请输入详细地址" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editAddress()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 物流信息对话框 默认不显示 (后端接口问题) -->
    <el-dialog
      title="物流信息"
      :visible.sync="logisticsDialogVisible"
      width="40%"
    >

    <!-- 时间线 -->
      <el-timeline :reverse="true">
        <el-timeline-item
          v-for="(activity, index) in logisticsList"
          :key="index"
          :timestamplljk="activity.time">
          {{activity.context}}
        </el-timeline-item>
  </el-timeline>
    </el-dialog>
  </div>
</template>
<script>
import citydata from './citydata.js'
export default {
  data () {
    return {
      /* 表单的查询对象 */
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },

      /* orderList的数量 */
      total: 0,

      /* 请求的orderList数据 */
      orderList: [],

      /* 编辑地址对话框 */
      editDialogVisible: false,

      /* 编辑地址表单数据对象 */
      editForm: {
        provice: [],
        detailAddress: ''
      },

      /* 编辑地址表单验证对象 */
      editFormRules: {
        provice: [
          { required: true, message: '请选择省份', trigger: 'blur' }
        ],
        detailAddress: [
          { required: true, message: '请选择省份', trigger: 'blur' }
        ]
      },

      /* 引入的城市列表文件 */
      citydata: citydata,

      /* 显示物流信息对话框的可见属性 */
      logisticsDialogVisible: false,

      /* 物流信息列表 */
      logisticsList: []
    }
  },
  methods: {
    getOrderList () {
      this.$http
        .get('orders', { params: this.queryInfo })
        .then((response) => {
          if (response.data.meta.status !== 200) {
            return this.$message({
              type: 'error',
              message: response.data.meta.msg
            })
          }
          this.total = response.data.data.total
          this.orderList = response.data.data.goods
          /* console.log(this.orderList) */
        })
    },

    /* 当前页面大小更改事件 */
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },

    /* 当前页面切换事件 */
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrderList()
    },

    /* 显示编辑地址对话框事件 */
    showEdit () {
      this.editDialogVisible = true
    },

    /* 关闭编辑地址对话框事件 */
    closeEditDialog () {
      this.$refs.editFormRef.resetFields()
    },

    /* 确认编辑地址 */
    editAddress () {
      console.log(this.editForm)
    },

    /* 级联选择器的更改事件 */
    handleChange () {
      console.log(this.editForm.provice)
    },

    /* 显示物流信息 */
    showLogistics () {
      this.$http.get('/kuaidi/804909574412544580').then(response => {
        if (response.data.meta.status !== 200) {
          return this.$message({
            type: 'error',
            message: response.data.meta.msg
          })
        }
        this.logisticsList = response.data.data
        console.log(response)
        this.logisticsDialogVisible = true
      })
    }
  },
  created () {
    this.getOrderList()
  }
}
</script>
<style lang="less">
.symble_text {
  color: gray;
}
.edit_cascader{
  width: 100%;
}
.edit_btn{
  margin-right: 10px !important;
}
</style>
