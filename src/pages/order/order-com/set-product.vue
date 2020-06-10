<template>
  <div>
    <Card>
      <Spin fix v-show="loadingTable == true">加载中...</Spin>
      <div class="pull-right">
        <Button type="primary" @click="saveFn" :loading="btnload">保存</Button>
        <Button type="default" @click="$router.back()" style="margin-left: 8px">返回上一页</Button>
      </div>
      <Form ref="productRef" :model="productForm" :label-width="100">
      <div class="detail-goods">
          <div>
            <Divider type="vertical" style="width: 5px;height:18px;background: #2d8cf0"/>商品信息
            <div class="left">
                <FormItem label="商品名称：">
                  <Input type="text" v-model="productForm.productName" style="width:500px"></Input>
                </FormItem>
                <FormItem label="商品广告词：">
                  <Input type="text" v-model="productForm.productJingle" style="width:500px"></Input>
                </FormItem>
                <FormItem label="商品主图：">
                  <UploadImg :imgDisabled="imgDisabled" :eidtImg="eidtImg" :flag="0" @uploadCallback="uploadCallback"></UploadImg>
                </FormItem>
                <FormItem label="商品详情图：">
                  <UploadImg :multipImg="multipImg" :flag="2" @multipCallback="multipCallback"></UploadImg>
                </FormItem>
                <FormItem label="商品内容介绍：">
                  <Tinymce @input="changeInput" @on-upload-complete="uploadComplete" :content="{data:productForm.productBody,index:0}" @on-upload-fail="uploadFile" ref="editor"></Tinymce>
                </FormItem>
            </div>
          </div>
          <div>
            <Divider type="vertical" style="width: 5px;height:18px;background: #2d8cf0"/>价格信息
            <div class="left">
              <FormItem label="销售价：">
                <Input type="text" v-model="productForm.productPrice" style="width:200px"></Input>
              </FormItem>
              <FormItem label="成本价：">
                <Input type="text" v-model="productForm.productCostPrice" style="width:200px"></Input>
              </FormItem>
              <FormItem label="市场价：">
                <Input type="text" v-model="productForm.productMarketPrice" style="width:200px"></Input>
              </FormItem>
              <FormItem label="是否推荐：">
                <RadioGroup v-model="productForm.isCommend">
                  <Radio label="Y">是</Radio>
                  <Radio label="N">否</Radio>
                </RadioGroup>
              </FormItem>
            </div>
          </div>
      </div>
      </Form>
    </Card>
  </div>
</template>

<script>
  import UploadImg from '../../main-components/upload-img'
  import Tinymce from '../../main-components/tinymce'
    export default {
        name: "set-product",
      components:{
        UploadImg,
        Tinymce
      },
      data(){
          return{
            btnload:false,
            loadingTable:true,
            multipImg:[],//详情图（多张）
            imgDisabled:false, //设置图片的上传数量
            eidtImg:null,//图片显示（主图一张）
            productForm:{
              productName:'', //商品名称
              productImage:'',//商品主图
              productListImageList:[],//商品详情图
              productJingle:'', //商品广告词
              productPrice:'',  //销售价
              productCostPrice:'', //成本价
              productMarketPrice:'', //成本价
              isCommend:'',  //是否推荐
              productBody:''  //富文本
            }
          }
      },
      methods:{
        uploadCallback(data){  //主图子组件传过来的方法
            this.productForm.productImage = data.imageUrl
        },
        multipCallback(data){  //详情图子组件传过来的值\
          this.productForm.productListImageList = [];
          data.forEach(ele=>{
            this.productForm.productListImageList.push(ele.url)
          })
        },
        uploadFile(){  //图片上传失败事件
          this.$Message.warning('图片上传失败！')
        },
        uploadComplete(){
          this.$Message.success('图片上传成功！')
        },
        changeInput(data){    //子组件上传的值
          this.productForm.productBody = data;
        },
        getDetail(){
          this.loadingTable = true;
          this.$http.get(`/yyht/v1/product/getProductInfo?productId=${this.$route.query.id}`).then(res=>{
            if(res.data.code == 0){
              this.productForm = res.data.data;
              this.eidtImg = [{name:'',url:res.data.data.productImage,status:'finished'}];
              this.multipImg = [];
              res.data.data.productListImageList.forEach(ele=>{
                this.multipImg.push({name:'',url:ele,status:'finished'})
              });
              this.loadingTable = false;
            }else{
              this.$Message.error(res.data.msg)
            }
          })
        },
        saveFn(){
        this.btnload = true;
        delete this.productForm.productId;
         let data = Object.assign({},{id:this.$route.query.id},this.productForm);
         this.$http.post(`/yyht/v1/product/addOrUpdate`,data).then(res=>{
           if(res.data.code == 0){
              this.$Message.success('操作成功！');
              this.getDetail();
           }else{
             this.$Message.error(res.data.msg)
           }
           this.btnload = false;
         })
        }
      },
      mounted() {
          this.getDetail();
      }
    }
</script>

<style scoped lang="scss">
.detail-goods{
  display: flex;
  margin-top: 2%;
  &>div{
    width: 50%;
    flex: 50% 0;
  }
  .left{
    margin: 10px auto auto 20px;
  }
}
</style>
