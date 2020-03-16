<template>
    <div class="template-tab">
        <div class="card-header">
            <span style="flex: 9">设置推荐</span>
            <Button style="flex: 1" class="pull-right" :disabled="disabledBtn" @click="commitSet" type="primary" v-if="viewSetting.details">保存设置</Button>
        </div>
        <div >
            <ul class="set-list">
                <li v-for="(image,index) in viewSetting.details" :key="index">
                  <div class="set-item-block">
                    <div style="">
                      <div class="grid-content bg-purple set-left">
                        <div class="push-title">推荐{{index+1}}</div>
                        <div class="push-tips">
                          <p>点击添加图片</p>
                          <p>图片大小{{image.adviseSizeDes}}</p>
                          <p>图片比例{{image.adviseScaleDes}}</p>
                        </div>
                        <img :src="domain+image.targetImage" v-if="image.targetImage && image.targetImage.length>0">
                        <input type="file" @change="uploadInputchange($event,index)" :id="'imgInput'+index" accept="image/png, image/jpeg, image/jpg" class="upload-hide-input" >
                        <!--<UploadImg ref="upImg" :eidtImg="eidtImg" :image="image" @onUpload="onUpload" class="setUpImg"></UploadImg>-->
                      </div>
                    </div>
                    <div style="flex: 1;margin: 0 30px;"><div class="grid-content bg-purple set-mid">
                      <Form :model="image" :rules="imageFormRules" ref="imageForm" label-position="right" class="demo-ruleForm">
                        <FormItem label="设置跳转目标" prop="recommendCategoryName" style="margin-top: 5px;" class="set-formItem">
                          <Row>
                            <Col span="9">
                              <Select :transfer="true" style="width:100%"
                                      v-model="image.recommendCategoryName"
                                      placeholder="请选择跳转类型"
                                      @on-change="chooseCategory($event,index)">
                                <Option  v-for="categor in categoriList" :value="categor.id" :key="categor.code">
                                  {{categor.name}}
                                </Option>
                              </Select>
                            </Col>
                            <Col span="8">
                              <Input v-model="image.target" placeholder="请输入链接地址" style="max-width: 300px;width: 60%;height: 30px;margin-left: 20px" v-if="image.recommendCategoryCode === 'H5'"></Input>
                              <Button type="primary" style="padding: 0 12px;max-width: 300px;width: 60%;height: 30px;margin-left: 20px" v-if="image.showTargetBtn === 'Y'" @click="initServeList(image.recommendCategoryCode,index)">
                                {{image.targetBtnName}}</Button>
                            </Col>
                          </Row>
                        </FormItem>
                        <FormItem label="广告标题" prop="title" style="margin-top: 5px">
                          <Row>
                            <Col span="9">
                              <Input v-model="image.title" style="width: 100%;margin-left: 8%" :maxlength="10"></Input>
                            </Col>
                            <Col span="8">
                              <span class="title-tips" style="margin-left: 20%">最多10个字</span>
                            </Col>
                          </Row>
                        </FormItem>
                        <FormItem label="广告主" prop="adOwnerId" style="margin-top: 5px">
                          <Row>
                            <Col span="9">
                              <Select :transfer="true" style="width: 100%;margin-left: 12%" v-model="image.adOwnerId" placeholder="请选择广告主" @change="chooseCategory(index)">
                                <Option v-for="owner in advertiserList" :label="owner.ownerName" :value="owner.id" :key="owner.id"></Option>
                              </Select>
                            </Col>
                          </Row>
                        </FormItem>
                         <FormItem prop="needLogin"  label="是否登录APP:" v-show="$route.name == 'eRecommend'">
                            <RadioGroup v-model="image.needLogin">
                                 <Radio label="Y"  :disabled="image.isLogin">是</Radio>
                                 <Radio label="N"  :disabled="image.isLogin">否</Radio>
                            </RadioGroup>
                         </FormItem>
                      </Form>
                    </div></div>
                    <div style="">
                      <div class="grid-content bg-purple set-right push-layout" v-if="viewSetting.recommendFormatCode === '1'">
                        <div class="item-content">
                          <div class="item-1">
                          </div>
                        </div>
                      </div>
                      <div class="grid-content bg-purple set-right push-layout" v-if="viewSetting.recommendFormatCode === '2'">
                        <div class="item-content">
                          <div class="item-1 item-2">
                            <div class="item-2-1" :class="{'active-imageItem':image.sortIndex===1}"></div>
                            <div class="item-2-2" :class="{'active-imageItem':image.sortIndex===2}"></div>
                          </div>
                        </div>
                      </div>
                      <div class="grid-content bg-purple set-right push-layout" v-if="viewSetting.recommendFormatCode === '3'">
                        <div class="item-content">
                          <div class="item-1 item-3">
                            <div class="big-item" :class="{'active-imageItem':image.sortIndex===1}">
                            </div>
                            <div class="big-item">
                              <div class="item-3-2" :class="{'active-imageItem':image.sortIndex===2}"></div>
                              <div class="item-3-2" :class="{'active-imageItem':image.sortIndex===3}"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="grid-content bg-purple set-right push-layout" v-if="viewSetting.recommendFormatCode === '4'">
                        <div class="item-content">
                          <div class="item-1 item-3">
                            <div class="big-item">
                              <div class="item-3-2" :class="{'active-imageItem':image.sortIndex===1}"></div>
                              <div class="item-3-2" :class="{'active-imageItem':image.sortIndex===3}"></div>
                            </div>
                            <div class="big-item" :class="{'active-imageItem':image.sortIndex===2}">
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="grid-content bg-purple set-right push-layout" v-if="viewSetting.recommendFormatCode === '5'">
                        <div class="item-content">
                          <div class="item-1 item-5">
                            <div class="item-5-line">
                              <div class="item-5-1" :class="{'active-imageItem':image.sortIndex===1}"></div>
                              <div class="item-5-2" :class="{'active-imageItem':image.sortIndex===2}"></div>
                            </div>
                            <div class="item-5-line">
                              <div class="item-5-3" :class="{'active-imageItem':image.sortIndex===3}"></div>
                              <div class="item-5-4" :class="{'active-imageItem':image.sortIndex===4}"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="grid-content bg-purple set-right push-layout" v-if="viewSetting.recommendFormatCode === '6'">
                        <div class="item-content">
                          <div class="item-1 item-6">
                            <div class="item-6-1" :class="{'active-imageItem':image.sortIndex===1}"></div>
                            <div class="item-6-1" :class="{'active-imageItem':image.sortIndex===2}"></div>
                            <div class="item-6-1" :class="{'active-imageItem':image.sortIndex===3}"></div>
                          </div>
                        </div>
                      </div>
                      <div class="grid-content bg-purple set-right push-layout" v-if="viewSetting.recommendFormatCode === '7'">
                        <div class="item-content">
                          <div class="item-1 item-7">
                            <div class="item-7-1" :class="{'active-imageItem':image.sortIndex===1}"></div>
                            <div class="item-7-1" :class="{'active-imageItem':image.sortIndex===2}"></div>
                            <div class="item-7-1" :class="{'active-imageItem':image.sortIndex===3}"></div>
                            <div class="item-7-1" :class="{'active-imageItem':image.sortIndex===4}"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
            </ul>
        </div>
      <Modal
        v-model="chooseServeModal.show"
        @on-visible-change="onServeCh"
        :mask-closable="false"
        :title="serverTitle"
        width="30%"
      >
        <Form :model="chooseServeModal" :label-width="130">
          <FormItem :label="label">
              <Select
                v-model="chooseServeModal.selectForm.serviceId"
                :filterable="true"
                :remote="true"
                :remote-method="serveListRemote"
                @on-query-change="changeQuery"
                @on-change="changeOnServe"
                @on-open-change="openChange"
                :loading="false">
                <Option v-for="(serve, index) in serveList" :value="serve.serviceId" :key="serve.serviceId">{{serve.title}}</Option>
              </Select>
          </FormItem>
          <div class="gap"></div>
          <FormItem label="请选择服务项目:" v-show="serverFlag == true">
              <Select v-model="chooseServeModal.selectForm.item" @on-change="changeItem">
                 <Option v-for="item in secondList" :value="item.id" :key="item.id">{{ item.name }}</Option>
              </Select>
          </FormItem>
          <FormItem label="">
            <div style="color:#CD0000">
              <p>*请输入搜索或点击选择</p><p v-show="serverFlag == true">*请先选择服务类型再选择服务项目</p>
            </div>
          </FormItem>
         </Form>
        <span slot="footer" class="dialog-footer">
          <Button @click="chooseServeModal.show = false">取 消</Button>
          <Button type="primary" @click="selectServe">完成</Button>
        </span>
      </Modal>
    </div>
</template>

<script>
  import UploadImg from '../../main-components/upload-img.vue'
  import Util from '../../../libs/util'
    export default {
        name: "recommendSet",
        props:{
          viewSetting:{
              type:Object
          },
          categoriList:{
              type: Array
          },
          disabledBtn:{
              type:Boolean
          },
          qiniuToken:{
              type:Object
          },
          domain:{
              type:String
          }
        },
      components:{
        UploadImg
      },
        data(){
            return{
              serverTitle:'请选择服务项目',
              targetCategories:[],
              advertiserList:[],
              detailIndex:'',
                imageFormRules:{
                  recommendCategoryName: [
                        { required: true, message: '请选择跳转目标', trigger: 'blur' }
                    ],
                  title: [
                      { required: true, message: '跳转目标', trigger: 'blur' },
                      { max: 10, message: '长度不超过个字符', trigger: 'blur' }
                  ],
                  adOwnerId: [
                      { required: true, message: '请选择广告主', trigger: 'blur' },
                  ],
                  needLogin:[
                    { required: true, message: '请选择是否登录APP', trigger: 'blur' }
                  ]
                },
              eidtImg:null,
              serverFlag:false,
              targetTypeName:'',
              label:'',
              secondList:[],
              chooseServeModal:{
                show:false,
                searchForm:{
                  code:'',
                  name:'',
                },
                selectForm:{
                  needLogin:'',
                  target:'',
                  title:'',
                  // idServiceCategory:'',
                  item:'',
                  itemName:'',
                  secondTitle:'',
                }
              },
              serveList:[]
            }
        },
        methods:{
          openChange(flag){ //下拉框展开收起时的方法
           if(flag == true){
             this.serveListRemote("")
           }
          },
          changeQuery(e){  //远程搜索query变化时触发
           if(e == ''){
             this.serveListRemote(e)
           }
          },
          chooseCategory(id,index){
            for (let i = 0; i < this.categoriList.length; i++) {
              if (this.categoriList[i].id == id) {
                this.viewSetting.details[index].needLogin = 'Y';
                this.viewSetting.details[index].isLogin = false;
                this.chooseServeModal.searchForm.name = this.categoriList[i].name;
                this.chooseServeModal.searchForm.code = this.categoriList[i].code;
                this.viewSetting.details[index].recommendCategoryCode = this.categoriList[i].code;
                  switch (this.categoriList[i].code) {
                   case 'MALL_PRODUCT':
                       this.targetTypeName = '商品';
                       this.viewSetting.details[index].showTargetBtn = 'Y';
                       break;
                   case 'MALL_STORE':
                       this.targetTypeName = '店铺';
                       this.viewSetting.details[index].showTargetBtn = 'Y';
                       break;
                   case 'MALL_PRODUCT_CATEGORY':
                       this.targetTypeName = '商品分类';
                       this.viewSetting.details[index].showTargetBtn = 'Y';
                       break;
                   case 'APP_JUMP':
                       this.targetTypeName = 'APP内转链接';
                       this.viewSetting.details[index].recommendCategoryId = this.categoriList[i].id;
                       this.viewSetting.details[index].showTargetBtn = 'Y';
                       break;
                   case 'H5':
                       this.viewSetting.details[index].recommendCategoryId = this.categoriList[i].id;
                       this.viewSetting.details[index].showTargetBtn = 'N';
                       break;
                   case 'E_PROJECT':
                       this.targetTypeName = '服务项目';
                       this.viewSetting.details[index].recommendCategoryId = this.categoriList[i].id;
                       this.viewSetting.details[index].showTargetBtn = 'Y';
                       break;
                   case 'E_SERVICE_CATEGORY':
                       this.targetTypeName = '服务分类';
                       this.viewSetting.details[index].recommendCategoryId = this.categoriList[i].id;
                       this.viewSetting.details[index].showTargetBtn = 'Y';
                       break;
                   default:
                       //this.viewSetting.details[index].showTargetBtn = 'N';
                  }
                  // this.viewSetting.details[index].needLogin = 'N';
                  /*重置数据*/
                  this.viewSetting.details[index].target = '';
                  this.viewSetting.details[index].targetBtnName = "请选择" + this.targetTypeName;
                break;
               }
              }
            },
          initServeList(data,index){ //设置分类后请选择XXX按钮事件
            this.detailIndex = index;
            this.chooseServeModal.searchForm.code = data
            let name = this.chooseServeModal.searchForm.name;
            this.serveListRemote("");
            switch(data){
                case 'APP_JUMP' : this.label = 'APP内转链接:';
                break;
                default: this.label = '请选择服务项目类型:';
              }
              this.chooseServeModal.show = true
              if(data == 'E_PROJECT'){
                this.serverFlag = true;
              }
          },
          getServerItem(){           //获取弹窗第二条数据
              let formData = new FormData();
              formData.append('categoryId',this.chooseServeModal.selectForm.serviceId)
              this.$http.post('/ad/banner/get/repair/category',formData).then(res=>{
                if(res.data.code == 0){
                  this.secondList = res.data.data
                }else{
                  this.$Message.warning(res.data.msg)
                }
              })
          },
          serveListRemote(query){    //获取弹窗第一条数据
            let code = this.chooseServeModal.searchForm.code;
            let name = query;
            this.$http.get(`/service/getServiceByCategoryByCode?code=${code}&name=${name}`).then(res=>{
              if (res.data.code === 0){
                this.serveList = res.data.data;
              }else {
                this.$Message.error(res.data.msg)
              }
            })
          },
          changeOnServe(code){ //选择服务类型选择框变化事件(弹窗第一条)
            this.getServerItem();
            this.serveList.forEach(item=>{
              if (item.serviceId === code){
                if(this.chooseServeModal.searchForm.code == 'APP_JUMP'){
                  this.chooseServeModal.selectForm.target = item.target;
                  this.viewSetting.details[this.detailIndex].needLogin = item.needLogin;
                  this.viewSetting.details[this.detailIndex].isLogin = true;
                  }else{this.viewSetting.details[this.detailIndex].isLogin = false;this.chooseServeModal.selectForm.target = item.serviceId}
                if(this.chooseServeModal.searchForm.code == 'E_PROJECT'){this.chooseServeModal.selectForm.target = ''}
                this.chooseServeModal.selectForm.title = item.title;
                // this.chooseServeModal.selectForm.idServiceCategory = item.serviceId;
              }
            });
          },
          changeItem(data){     //选择服务项目选择框变化事件(弹窗第二条)
            this.secondList.forEach(ele=>{
              if(ele.id == data){
                this.chooseServeModal.selectForm.target = ele.id;
                this.chooseServeModal.selectForm.itemName = ele.name  //存储第二条弹窗的选择name
              }
            })
          },
          uploadInputchange(event,index){
            let file = event.target.files[0];
            let randomNum = Math.floor(Math.random() * 1000); //随机数
            let name = Date.parse(new Date())+randomNum;
            console.log(file)
            const axiosInstance = this.$http.create({withCredentials: false});    //withCredentials 禁止携带cookie，带cookie在七牛上有可能出现跨域问题
            let data = new FormData();
            data.append('token', this.qiniuToken.token);     //七牛需要的token，叫后台给，是七牛账号密码等组成的hash
            data.append('file', file);
            axiosInstance({
              method: 'POST',
              url: 'https://up.qbox.me',  //上传地址
              data: data,
              timeout:30000,      //超时时间，因为图片上传有可能需要很久
            }).then(res =>{
              this.$set(this.viewSetting.details[index],'targetImage',res.data.key);
              this.viewSetting.details[index].targetImage = res.data.key;
              document.getElementById("uploadFileInput").value = ''        //上传成功，把input的value设置为空，不然 无法两次选择同一张图片
              //上传成功...  (登录七牛账号，找到七牛给你的 URL地址) 和 data里面的key 拼接成图片下载地址
            }).catch(function(err) {
              //上传失败
            });
          },
          getToken(){
            this.$http.get(`/base/qiniu/token`).then(res=>{
              if (res.data.code === 0){
                this.qiniuToken.token = res.data.data.token;
              }
            })
          },
          getAllOwner(){
            this.$http.get(`/ad/owner/getOwnerName`).then(res=>{
              if (res.data.code === 0){
                this.advertiserList = res.data.data
              } else {
                this.$Message.error(res.data.msg)
              }
            })
          },
          onServeCh(flag){
            if (flag === false){
              this.serveList = [];
              this.chooseServeModal.searchForm.name = '';
              this.chooseServeModal.selectForm.target = '';
              this.chooseServeModal.selectForm.title = '';
              this.chooseServeModal.selectForm.serviceId = '';
              this.chooseServeModal.selectForm.item = '';
              // this.chooseServeModal.selectForm.idServiceCategory = '';
              this.serverFlag = false;
            }
          },
          selectServe(){     //选择服务项目和服务类型弹窗确认按钮
            let index = this.detailIndex;
            //this.viewSetting.details[index].recommendCategoryId= this.chooseServeModal.selectForm.idServiceCategory;
            this.viewSetting.details[index].showTargetBtn = 'Y';
            this.viewSetting.details[index].target = this.chooseServeModal.selectForm.target;
            this.viewSetting.details[index].targetBtnName = this.chooseServeModal.selectForm.item?this.chooseServeModal.selectForm.title+'-'+this.chooseServeModal.selectForm.itemName:this.chooseServeModal.selectForm.title;
            this.viewSetting.details[index].targetShowName = this.chooseServeModal.selectForm.title
            if(this.chooseServeModal.searchForm.code == 'E_PROJECT'){this.viewSetting.details[index].targetShowName = this.chooseServeModal.selectForm.itemName}
            this.chooseServeModal.show = false;
          },
          commitSet(){
            let parmas = Util.deepClone(this.viewSetting);
            for (let i=0;i<parmas.details.length;i++){
              if (!parmas.details[i].targetImage || parmas.details[i].targetImage === ''){
                this.$Message.error('推荐位'+(i + 1)+'图片不能为空');
                return
              }
              if(!parmas.details[i].adOwnerId|| parmas.details[i].adOwnerId === ''){
                this.$Message.error("请选择推荐" + (i + 1) + "的广告主");
                return;
              }
              if ((!parmas.details[i].target|| parmas.details[i].target === '') && parmas.details[i].recommendCategoryCode!=='H5') {
                this.$Message.error("请设置推荐" + (i + 1) + "的跳转目标");
                return;
              }
              // if(parmas.details[i].recommendCategoryCode!=='E_PROJECT' && )
              if ((!parmas.details[i].target|| parmas.details[i].target === '') && parmas.details[i].recommendCategoryCode==='H5') {
                this.$Message.error("请设置推荐" + (i + 1) + "的H5链接地址");
                return;
              }
              if(!parmas.details[i].title|| parmas.details[i].title === ''){
                this.$Message.error("请设置推荐" + (i + 1) + "的广告标题");
                return;
              }
              if(this.$route.name == 'eRecommend' && !parmas.details[i].needLogin){
                this.$Message.error('请选择是否登录APP');
                return;
              }
              delete parmas.details[i].recommendCategoryName;
              delete parmas.details[i].showTargetBtn;
              delete parmas.details[i].targetBtnName;
            }
            delete parmas.screenActive;
            delete parmas.templateCode;
            parmas.details.forEach(ele=>{
              delete ele.adviseSizeDes
            })
            delete parmas.end;
            this.$emit('onSave',parmas);
          },
        },
      mounted() {
        this.getToken();
        this.getAllOwner();
      }
    }
</script>

<style scoped lang="scss">
    @import "./commponents-manage.scss";
    .gap{
      margin:10px;
    }
    .set-list{
      padding: 15px;
        li{
          height:140px;
          margin-top:20px;
        }
    }
    .title-tips{
        color: #999;
        padding: 0 10px;
        display: inline-block;
        margin-left: 5%;
    }
    .item-content{
        background: #EFEFEF;
        line-height: 1.4em;
        width: 120px;
        height: 120px;
        margin-bottom: 10px;
        .item-1{
            height: 60px;
            background: #D4D4D4;
            width: 100%;
            border: 1px solid #979797;
        }
        .item-2{
            display: flex;
            border-right: 0;
            background: #ffffff;
            .item-2-1{
                border-right: 1px solid #979797;
                flex: 1;
            }
            .item-2-2{
                flex: 1;
                border-right: 1px solid #ccc;
            }
        }
        .item-3{
            display: flex;
            border-right: 0;
            background: #ffffff;
            .big-item{
                border-right: 1px solid #979797;
                flex: 1;
                display: flex;
                flex-direction: column;
                .item-3-2{
                    flex: 1;
                }
                .item-3-2:first-child{
                    border-bottom: 1px solid #ccc;
                }
            }
        }
        .item-5{
            border-bottom: 0;
            background: #ffffff;
            .item-5-line{
                height: 50%;
                display: flex;
                border-bottom: 1px solid #979797;
                .item-5-1{
                    flex: 1;
                    border-right: 1px solid #979797;
                }
                .item-5-2{
                    flex:3
                }
                .item-5-3{
                    flex:3;
                    border-right: 1px solid #979797;
                }
                .item-5-4{
                    flex:1
                }
            }
        }
        .item-6{
            display: flex;
            border-right: 0;
            background: #ffffff;
            .item-6-1{
                flex: 1;
                border-right: 1px solid #979797;
            }
        }
        .item-7{
            height: 30px;
            background: #ffffff;
            display: flex;
            border-right: 0;
            .item-7-1{
                flex: 1;
                border-right: 1px solid #979797;
            }
        }

    }
.active-imageItem{
    background: #D4D4D4
}
  .upload-hide-input{
    opacity: 0;
    position: absolute;
    z-index: 10;
    left: 0;
    top:0;
    width: 174px;
    height: 120px;
    cursor: pointer;
  }
    .serve-item{
      font-size: 16px;
      margin-top: 5px;
    }
    .serve-item:hover{
      color: #2b85e4;
    }
</style>
