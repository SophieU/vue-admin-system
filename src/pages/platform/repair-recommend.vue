<template>
  <div class="recommend-content">
    <Card class="box-card">
      <div class="recommend-card">
        <div class="phone-view">
          <div class="phone-screen">
            <phone-screen :screenList="phoneViewList"
                          @addNew="addNewView"
                          @deleteView="deleteView"
                          @selectView="selectView"
                          @dragEnd="dragCommit"
                          :domain="domain"
            ></phone-screen>
          </div>
        </div>
        <div class="recommend-right">
          <template-tab :templateList="pageTemplate" @selectTab="initTab"></template-tab>
          <recommend-set :qiniuToken="qiniuToken" :domain="domain" :disabledBtn="disabledBtn" @onSave="commitSave" ref="recSet" :categoriList="categoriList" :viewSetting="viewSetting"></recommend-set>
        </div>
      </div>
      <!-- <div class="phone-view">
         <div class="phone-screen">
           <phone-screen :screenList="phoneViewList"
                         @addNew="addNewView"
                         @deleteView="deleteView"
                         @selectView="selectView"
                         @dragEnd="dragCommit"
                         :domain="domain"
           ></phone-screen>
         </div>
       </div>
       <Row class="SettingRow" style="top:0;display: inline-block;clear:both;position: absolute;margin-left: 5%;margin-bottom: 30px">
             <Col span="24" >
                 <div class="grid-content bg-purple">
                     <template-tab :templateList="pageTemplate" @selectTab="initTab"></template-tab>
                     <recommend-set :qiniuToken="qiniuToken" :domain="domain" :disabledBtn="disabledBtn" @onSave="commitSave" ref="recSet" :categoriList="categoriList" :viewSetting="viewSetting"></recommend-set>
                 </div>

             </Col>
         </Row>-->
    </Card>
  </div>
</template>

<script>
  import templateTab from './components/templateTab.vue'
  import phoneScreen from './components/phoneScreen.vue'
  import recommendSet from './components/recommendSet.vue'
  export default {
    name: "firstPageActive-recommend",
    components:{
      templateTab,
      phoneScreen,
      recommendSet
    },
    data:()=>{
      return{
        isLogin:false,
        pageTemplate:[],
        phoneViewNow:'',
        domain:'',
        qiniuToken:{
          key:'',
          token:''
        },
        phoneViewList:[

        ],
        viewSetting:{},
        categoriList:[],
        targetTypeName:'',
        disabledBtn:false
      }
    },
    methods:{
      initTab(item){
        this.phoneViewNow = item;
      },
      getTemplate(){
        this.$http.get(`/yyht/v1/recommend/config/template`).then(res=>{
          if (res.data.code === 0){
            this.pageTemplate = res.data.data;
          }else {
            this.$Message.error(res.data.msg)
          }
        })
      },
      getViewList(){
        this.$http.get(`/yyht/v1/recommend/config/config/list`).then(res=>{  //获取推荐位列表
          if (res.data.code === 0){
            this.phoneViewList = res.data.data;
            let data = res.data.data;
            for (var i = 0; i < data.length; i++) {
              data[i].templateCode = data[i].recommendFormatCode;
              data[i].end = 'Y';
              for (var j = 0; j < data[i].details.length; j++) {
                if(data[i].details[j].parentName){
                 data[i].details[j].targetBtnName = data[i].details[j].parentName + '-' + data[i].details[j].targetShowName;
                }else{
                 data[i].details[j].targetBtnName = data[i].details[j].targetShowName;
                }
                data[i].details[j].adviseSizeDes = data[i].details[j].recommendFormatImgAdviceSizeDes;
                data[i].details[j].targetImage = this.domain + data[i].details[j].targetImage;
                data[i].details[j].recommendCategoryName = data[i].details[j].recommendCategoryCode;
                switch (data[i].details[j].recommendCategoryCode) {
                  case 'MALL_PRODUCT':
                    this.targetTypeName = '商品';
                    data[i].details[j].recommendCategoryName = 'MALL_PRODUCT';
                    this.$set(data[i].details[j],'showTargetBtn','Y');
                    break;
                  case 'MALL_STORE':
                    this.targetTypeName = '店铺';
                    data[i].details[j].recommendCategoryName = 'MALL_STORE';
                    this.$set(data[i].details[j],'showTargetBtn','Y');
                    break;
                  case 'MALL_PRODUCT_CATEGORY':
                    this.targetTypeName = '商品分类';
                    data[i].details[j].recommendCategoryName = 'MALL_PRODUCT_CATEGORY';
                    this.$set(data[i].details[j],'showTargetBtn','Y');
                    break;
                  case 'APP_JUMP':
                    this.targetTypeName = 'APP内转链接';
                    data[i].details[j].recommendCategoryName = 'APP_JUMP';
                    this.$set(data[i].details[j],'showTargetBtn','Y');
                    break;
                  case 'E_PROJECT':
                    this.targetTypeName = '服务项目';
                    data[i].details[j].recommendCategoryName = 'E_PROJECT';
                    this.$set(data[i].details[j],'showTargetBtn','Y');
                    break;
                  case 'E_SERVICE_CATEGORY':
                    this.targetTypeName = '服务分类';
                    data[i].details[j].recommendCategoryName = 'E_SERVICE_CATEGORY';
                    this.$set(data[i].details[j],'showTargetBtn','Y');
                    break;
                  default:
                    data[i].details[j].recommendCategoryName = 'H5';
                    this.$set(data[i].details[j],'showTargetBtn','N');
                }
              }
            }
          }else {
            this.$Message.error(res.data.msg)
          }
        })
      },
      addNewView(){
        if (this.phoneViewNow === ''){
          this.$Message.error('请选择版面');
          return
        }
        //获取模板数据
        let template = this.phoneViewNow;
        let config = {
          "recommendFormatId": template.id,
          "recommendFormatCode":template.formatCode,
          "templateCode": template.formatCode,
          "sortIndex": this.phoneViewList.length,
          "screenActive":false
        };
        let configDetail = [];
        //构建配置明细
        for (let i = 0; i < template.images.length; i++) {
          let image = template.images[i];
          let configItem = {
            'recommendFormatImgId': image.id,
            'sortIndex': image.sortIndex,
            'adviseSizeDes': image.adviseSizeDes || '',
            'adviseScaleDes': image.adviseScaleDes,
            'recommendFormatImgAdviceSizeDes': image.adviseSizeDes,
          };
          configDetail.push(configItem);
        }
        config.details = configDetail;
        this.phoneViewList.push(config);
      },
      commitSave(data){
        this.disabledBtn = true;
        this.$http.post(`/yyht/v1/recommend/config/saveOrUpdate`,data).then(res=>{
          this.disabledBtn = false;
          if (res.data.code === 0){
            this.$Message.success("保存成功");
            this.getViewList();
            this.viewSetting={};
          } else {
            this.$Message.error(res.data.msg)
          }
        })
      },
      deleteView(index){
        if (!this.phoneViewList[index].id){
          this.phoneViewList.splice(index,1);
          return;
        }
        let id = this.phoneViewList[index].id;
        this.$http.post(`/yyht/v1/recommend/config/delete?id=${id}`).then(res=>{
          if (res.data.code === 0){
            this.$Message.success('删除成功');
            this.phoneViewList.splice(index,1)
          } else {
            this.$Message.error(res.data.msg)
          }
        });
        return;
      },
      selectView(view){
        console.log(view)
        this.viewSetting = view;
        this.viewSetting.details.forEach((item,index)=>{
          if(!item.needLogin){item.needLogin = 'N';item.isLogin = false}
          this.$set(item,'recommendCategoryName',item.recommendCategoryId);
        });
      },
      getTargetType(){
        this.$http.get(`/yyht/v1/recommend/config/target/categories`).then(res=>{
          if (res.data.code === 0){
            this.categoriList = res.data.data;
          } else {
            this.$Message.error(res.data.msg)
          }
        })
      },
      dragCommit(data){  //拖拽事件
        this.phoneViewList = data.list;
        let sortIndex = data.event.newIndex;
        if (!this.phoneViewList[sortIndex].id) {
          return
        }
        let id = this.phoneViewList[sortIndex].id;
        this.$http.get(`/yyht/v1/recommend/config/sort?id=${id}&sortIndex=${sortIndex}`).then(res=>{
          if (res.data.code === 0){

          } else {
            this.$Message.error(res.data.msg)
          }
        })
      },
      getToken(){
        this.$http.get(`/base/qiniu/token`).then(res=>{
          if (res.data.code === 0){
            this.domain = res.data.data.domain;
            this.qiniuToken.token = res.data.data.token;
          }
        })
      }
    },
    mounted(){
      this.getTemplate();
      this.getViewList();
      this.getTargetType();
      // this.getToken();
    }
  }
</script>

<style scoped lang="scss">
  @import "./advert-manage.scss";
  /*.recommend-card:after{
    content:'';
    clear:both;
    display: block;
    overflow:hidden;
    height:3px;
    *zoom:1;
  }*/
  .phone-view{
    flex-grow: 0;
    flex-shrink: 0;
    background-image:url('../../assets/imgs/phone.png');
  }
</style>

