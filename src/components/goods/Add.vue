<template>
  <div>
    <span class="symbol_text">addGoods_area</span>
    <!-- 面包屑区域，显示当前页面路径 -->
    <el-card class="bread_crumb" shadow="always">
      <el-row>
        <el-col :span="22">
          <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>商品管理</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/goods' }"
            >商品列表</el-breadcrumb-item
          >
          <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>
        </el-col>
        <el-col :span="2">
          <el-button plain size="mini" @click="goBack()" type="info">返回</el-button>
        </el-col>
      </el-row>
    </el-card>

    <!-- card顶部的消息提示信息 -->
    <el-card>
      <el-alert
        title="添加商品信息"
        :center="true"
        type="info"
        :closable="false"
        :show-icon="true"
      ></el-alert>

      <!-- 页面填写进度条 -->
      <el-steps
        :active="activeIndex - '0'"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"> </el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- 标签页的表单区 -->
      <el-form
        ref="addFormRef"
        :model="addForm"
        label-width="80px"
        label-position="top"
        :rules="addFormRules"
      >

      <!-- 表单内部的标签页 -->
        <el-tabs :tab-position="'left'"
          v-model="activeIndex"
         :before-leave="beforeLeave"
         @tab-click="tabClick()"
        >

          <!-- 基本信息标签页 -->
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input
                style="width: 90%"
                v-model="addForm.goods_name"
                placeholder="请输入..."
              ></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input
                style="width: 90%"
                v-model="addForm.goods_price"
                placeholder="请输入..."
              ></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input
                style="width: 90%"
                v-model="addForm.goods_weight"
                placeholder="请输入..."
              ></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input
                style="width: 90%"
                v-model="addForm.goods_number"
                placeholder="请输入..."
              ></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                class="cate_cascader"
                v-model="addForm.goods_cat"
                :options="CateList"
                :props="cascader_pros"
                :clearable="true"
                @change="SelectChange()"
          ></el-cascader>
            </el-form-item>
            <el-button type="info" @click="clearInput()">清空</el-button>
          </el-tab-pane>

          <!-- 1 商品参数标签页 -->
          <el-tab-pane label="商品参数" name="1">
            <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
              <!-- 复选框组 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :border="true" :label="subItem" v-for="(subItem,index) in item.attr_vals" :key="index"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>

          <!-- 2 商品属性标签页 -->
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
              <el-input :value="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>

          <!-- 3 商品图片标签页 -->
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              action="http://127.0.0.1:8888/api/private/v1/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="uploadHeaders"
              :on-success="handelSuccess"
              >
              <el-button size="small" type="primary">点击上传</el-button>
              <div>
                <el-alert
                title="只能上传jpg/png文件，且不超过500kb"
                :center="true"
                type="warning"
                :closable="false"
                :show-icon="true"
              ></el-alert>
              </div>
            </el-upload>
          </el-tab-pane>

          <!-- 4 商品内容标签页 -->
          <el-tab-pane label="商品内容" name="4">
            <quill-editor
              ref="quillEditorRef"
              v-model="addForm.goods_introduce"
            ></quill-editor>
            <el-button class="add_goods_button" type="primary" @click="addGoods">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片预览框的对话框 默认不可见 -->
    <el-dialog
      class="img_dialog"
      title="图片预览"
      :visible.sync="imgPreviewDialogVisible"
      width="50%"
      :fullscreen="false"
      >
      <img :src="imgUrl" class="Dialog_img">
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  data () {
    return {
      /* 当前进度条活跃的值与tab标签选中的值 */
      activeIndex: '',

      /* 添加商品表单的数据对象 */
      addForm: {
        goods_name: '',
        goods_price: 0, /* 字符串,最后需要减去'0'得到数字 */
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [], /* 添加商品表单商品分类级联选择器数据源 */
        pics: [], /* 上传图片的临时路径 */
        goods_introduce: '',
        attrs: [] /* 商品的参数,动态与静态 */
      },

      /* addFrom的表单校验对象 */
      addFormRules: {
        goods_name: [
          {
            required: true,
            message: '请输入商品名称',
            trigger: 'blur'
          }
        ],
        goods_price: [
          {
            required: true,
            message: '请输入商品价格',
            trigger: 'blur'
          }
        ],
        goods_weight: [
          {
            required: true,
            message: '请输入商品重量',
            trigger: 'blur'
          }
        ],
        goods_number: [
          {
            required: true,
            message: '请输入商品数量',
            trigger: 'blur'
          }
        ],
        goods_cat: [
          {
            required: true,
            message: '请选择商品分类',
            trigger: 'blur'
          }
        ]
      },

      /* 级联选择器的数据对象 */
      CateList: [],

      /* 级联选择器的规则对象 */
      cascader_pros: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        childern: 'childern',
        checkStrictly: 'true'
      },

      /* 动态参数列表的数据 */
      manyTableData: [],

      /* 静态属性列表的数据 */
      onlyTableData: [],

      /* upload请求头对象 */
      uploadHeaders: {

        /* 为upload内置的阿贾克斯请求配置请求头 */
        Authorization: window.sessionStorage.getItem('token')/* 在login组件中储存的token */
      },

      /* 网络返回的服务器暂存地址 */
      tmp_path: '',

      /* 预览图片的实际物理地址 */
      imgUrl: '',
      /* 图片预览对话框的可见属性 */
      imgPreviewDialogVisible: false
    }
  },
  methods: {
    /* 获取商品分类列表 */
    getCateList () {
      this.$http
        .get('categories')
        .then((response) => {
          if (response.data.meta.status !== 200) {
            return this.$message({
              type: 'error',
              message: response.data.meta.msg
            })
          }
          this.CateList = response.data.data
        })
    },

    /* 级联选择器的选项更改事件 */
    SelectChange () {
      if (this.addForm.goods_cat.length !== 3) {
        this.$message({
          type: 'warning',
          message: '请选择三级分类'
        })
        this.addForm.goods_cat = []
      }
    },

    /* 在满足一定有条件时才能跳转tab */
    beforeLeave (to, from) {
      if (from === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message({
          type: 'warning',
          message: '请先选择商品分类'
        })
        return false
      }
    },

    /* 清空表单 */
    clearInput () {
      this.$refs.addFormRef.resetFields()
      this.$message({
        showClose: true,
        message: '已重置'
      })
    },

    /* 标签页的点击事件 */
    tabClick () {
      /* '1'号页面获取分类的动态属性 */
      if (this.activeIndex === '1') {
        this.$http.get(`categories/${this.getCateID}/attributes`,
          {
            params: { sel: 'many' }
          }).then((response) => {
          if (response.data.meta.status !== 200) {
            return this.$message({
              type: 'error',
              message: response.data.meta.msg
            })
          }
          response.data.data.forEach(element => {
            if (element === '') {
              element = []
            } else {
              element.attr_vals = element.attr_vals.split(' ')
            }
          })
          this.manyTableData = response.data.data
        })
      } else if (this.activeIndex === '2') {
        /* '2'号页面获取分类的静态参数 */
        this.$http.get(`categories/${this.getCateID}/attributes`, {
          params: { sel: 'only' }
        }).then((response) => {
          if (response.data.meta.status !== 200) {
            return this.$message({
              type: 'error',
              message: response.data.meta.msg
            })
          }
          this.onlyTableData = response.data.data
        })
      }
    },

    /* 点击文件列表中已上传的文件时的钩子 */
    handlePreview (file) {
      console.log(file)
      this.imgUrl = file.response.data.url
      this.imgPreviewDialogVisible = true
    },

    /* 移除图片的钩子函数 */
    handleRemove (file) {
      const filePath = file.response.data.tmp_path
      const location = this.addForm.pics.findIndex(item => item.pic === filePath)
      this.addForm.pics.splice(location, 1)
      console.log(this.addForm.pics)
    },

    /* 图片上传成功的钩子函数 */
    handelSuccess (response) {
      /* 获取图片的临时暂存路径response.data.tmp_path */
      const temObject = { pic: response.data.tmp_path }
      this.addForm.pics.push(temObject)
      console.log(this.addForm.pics)
    },

    /* 添加商品 */
    addGoods () {
      this.$refs.addFormRef.validate(valid => {
        if (!valid) {
          return this.$message({
            type: 'error',
            message: '请填写必要信息'
          })
        }
        const from = _.cloneDeep(this.addForm)
        from.goods_cat = from.goods_cat.join(',')
        /* 处理动态参数 */
        this.manyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          }
          this.addForm.attrs.push(newInfo)
        })
        /* 处理静态属性 */
        this.onlyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.addForm.attrs.push(newInfo)
        })
        from.attrs = this.addForm.attrs
        console.log(from)
        this.$http.post('goods', from).then(response => {
          if (response.data.meta.status !== 201) {
            return this.$message({
              type: 'error',
              message: response.data.meta.msg
            })
          }
          this.$message({
            type: 'success',
            message: '添加成功'
          })
          this.$router.push('/goods')
        })
      })
    },
    goBack () {
      this.$router.push('/goods')
    }
  },
  created () {
    this.getCateList()
  },
  computed: {
    /* 获取商品分类的三级分类ID */
    getCateID () {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  }
}
</script>

<style lang="less" scoped>
.el-card {
  margin-bottom: 15px;
}
.el-steps {
  margin-top: 15px;
  margin-bottom: 15px;
}
.el-steps {
  margin-top: 15px;
  margin-bottom: 15px;
}
.symbol_text {
  color: gray;
}
.el-checkbox{
  margin: 0px 5px 0px 0px !important; /* !important将前面的样式置于最高层级  四边顺序上右下左*/
}
.img_dialog{
  .el-dialog__body{
    padding: 0px 0px;
  }
}
.Dialog_img{
  width: 100%;
  border-radius: 10px;
}
.ql-editor{
  min-height: 300px;
  /* 富文本编辑器的最小高度 */
}
.add_goods_button{
  margin: 15px;
}
</style>
