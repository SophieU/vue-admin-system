<template>
    <div>
      <Card class="mb-15">
        <Spin fix v-show="loadingTime == true">加载中...</Spin>
        <p slot="title">服务时间提示</p>
        <div slot="extra">
          <div class="inner-center" style="margin-top: -5px;">
            <Button class="lang-btn" @click="getTips">刷新</Button>
            <Button @click="save" :loading="btnLoading" class="lang-btn" type="primary">保存</Button>
          </div>
        </div>
        <div>
          <tinymce @input="changeInputT" @on-upload-complete="uploadComplete" :content="serviceTime" @on-upload-fail="uploadFile" ref="editorT"></tinymce>
        </div>
      </Card>
      <Card class="mb-15">
        <Spin fix v-show="loadingFee == true">加载中...</Spin>
        <p slot="title">服务费用提示</p>
        <div>
          <tinymce initial-value="Once upon a time..." @input="changeInputF" @on-upload-complete="uploadComplete" :content="serviceFee" @on-upload-fail="uploadFile" ref="editorF"></tinymce>
        </div>
      </Card>
      <Card class="mb-15">
        <Spin fix v-show="loadingTip == true">加载中...</Spin>
        <p slot="title">其他提示</p>
        <div>
          <tinymce @input="changeInputO" @on-upload-complete="uploadComplete" :content="other" @on-upload-fail="uploadFile" ref="editorO"></tinymce>
        </div>
      </Card>
    </div>
</template>

<script>
  import tinymce from "../main-components/tinymce";
  import Editor from '@tinymce/tinymce-vue'
    export default {
        name: "tips-admin",
      components:{
        tinymce,Editor
      },
      data(){
        return {
          btnLoading:false,
          serviceTime:{data:'',index:0},
          serviceFee:{data:'',index:1},
          other:{data:'',index:2},
          secondGo:false,
          thirdGo:false,
          loadingTime:true,
          loadingFee:true,
          loadingTip:true,
        }
      },
      methods:{
        changeInputT(data){    //第一个editor
          this.serviceTime.data=data;
        },
        changeInputF(data){    //第一个editor
          this.serviceFee.data = data;
        },
        changeInputO(data){    //第一个editor
          this.other.data = data;
        },
        uploadFile(){  //图片上传失败事件
          this.$Message.warning('图片上传失败！')
        },
        uploadComplete(){
          this.$Message.success('图片上传成功！')
        },
          getTips(){
            this.loadingFee = true;
            this.loadingTime = true;
            this.loadingTip = true;
            this.$http.get('/yyht/v1/reminder/info')
              .then(res=>{
                if(res.data.code===0){
                  let data = res.data.data;
                  this.serviceTime.data = data.serviceTime;
                  this.serviceFee.data = data.serviceFee;
                  this.other.data = data.other;
                  this.loadingFee = false;
                  this.loadingTime = false;
                  this.loadingTip = false;
                }else{
                  this.$Message.error('获取信息失败')
                }
              })
          },
        save(){
            this.btnLoading = true;
            this.$http.post(`/yyht/v1/reminder/saveOrUpdate`,{
              serviceTime:this.serviceTime.data,
              serviceFee:this.serviceFee.data,
              other:this.other.data
            }).then(res=>{
              if(res.data.code===0){
                this.$Message.success('保存成功');
                this.btnLoading = false;
                this.getTips();
              }else{
                this.$Message.error(res.data.msg);
              }
            })
        }
      },
      mounted(){
        this.getTips();
      }
    }
</script>

<style scoped>
  .inner-center{
    text-align: center;
  }
</style>
