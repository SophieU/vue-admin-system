<style scoped lang="scss">
  .upload-list{
    display: inline-block;
    width: 60px;
    height: 60px;
    text-align: center;
    line-height: 60px;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0,0,0,.2);
    margin-right: 4px;
    img{
      width: 100%;
      height: 100%;
    }

  }
  .upload-list-cover{
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0,0,0,.6);
  }
  .upload-list:hover .upload-list-cover{
    display: block;
  }
  .upload-list-cover i{
    color: #fff;
    font-size: 20px;
    cursor:pointer;
    margin:  0 2px;
  }

</style>
<template>
  <div>
    <div class="upload-list" v-for="item in uploadList">
      <template v-if="item.status==='finished'">
        <img :src="item.url">
        <div class="upload-list-cover">
          <Icon v-show="imgDisabled == false" type="ios-trash-outline" @click.native="handleRemove(item.name)"></Icon>
        </div>
      </template>
      <template v-else>
        <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
      </template>
    </div>
    <Upload
      ref="upload"
      :disabled="imgDisabled == true?true:false"
      :data="qiniuToken"
      :show-upload-list="false"
      :format="['jpg','jpeg','png']"
      :on-success="handleSuccess"
      :default-file-list="defaultList"
      :max-size="2048"
      :on-exceeded-size="handleMaxSize"
      :before-upload="handleBeforeUpload"
      type="drag"
      :action="uploadUrl"
      style="display: inline-block;width:58px;"
      :with-credentials="true"
    >
      <div style="width: 58px;height:58px;line-height: 58px;">
        <Icon type="ios-camera" size="20"></Icon>
      </div>
    </Upload>
  </div>
</template>

<script>
  /*
  * 	 show-upload-list : 是否显示已上传文件列表
  * 	 type:上传控件类型
  * */

  export default {
    props: {
      imgDisabled:{
        type:Boolean
      },
      /*prefix:{
        type:String,
        required: true,
      },*/
      eidtImg:{
        type:Array,
        required: false,
      },
      qiniuToken:{
        type: Object
      },
      domain:{
        type:String
      }
    },
    name: "upload-img",
    computed:{
      uploadUrl(){
        // let protocol = location.protocol;
        return this.$http.defaults.baseURL + '/base/qiniu/upload/image'

      }
    },
    data(){
      return {
        defaultList:[],
        uploadList:[],
        imgName:'',
        visible:false,
      }
    },
    watch:{
      eidtImg:{
        //使用watch值是对象的第三种情况
        handler:function(val){
          this.uploadList = val;
        },
        //getList里面通过searchValue去搜索数据库
        immediate:true
      }
    },
    methods:{
      // clearFiles(){
      //   this.$refs.upload.clearFiles();
      //   this.uploadList = [];
      // },
      handleSuccess(res,file){
        // file.url = this.domain + file.response.key;
        file.url=res.data.imageUrl;
        this.uploadList = [file];
        this.$emit('uploadCallback', res.data);
      },
      handleMaxSize(){
        this.$Message.warning(`超出图片大小范围，请重新选择图片`)
      },
      handleBeforeUpload(file){
        let randomNum = Math.floor(Math.random() * 1000); //随机数
        let name = Date.parse(new Date())+randomNum;
        this.qiniuToken.key = name;
        // this.qiniuToken.key = file.name;
      },
      handleRemove(file,list){
        this.uploadList = [];
        let res = {
          key:''
        };
        this.$emit('onUpload',res)
      },
      getToken(){
        this.$http.get(`/base/qiniu/token`).then(res=>{
          if (res.data.code === 0){
            this.domain = res.data.data.domain;
            sessionStorage.setItem('domain',res.data.data.domain);
            this.qiniuToken.token = res.data.data.token;
          }
        })
      }
    },
    mounted () {
      //this.getToken()
    }
  }
</script>


