<template>
 <div>
   <Card>
     <div class="clearfix mb-15">
       <div class="pull-right">
         <Button icon="md-add" type="primary" @click="addAllServe = true;this.modalType = 'add';this.modalShow= true;">新增服务</Button>
       </div>
     </div>
     <Spin fix v-show="loading == true">加载中...</Spin>
     <Tabs type="card" @on-click="tabChange">
       <TabPane v-for="(item,index) in AdTypeList" :key="index" :label="item.typeName">
         <Table :columns="columns" :data="lists" draggable @on-drag-drop="dragRow" @on-sort-change="sortChange"></Table>
       </TabPane>
     </Tabs>
     <div class="pagination mt-15">
        <Page :current.sync="pageConfig.current" :page-size="pageConfig.size" :total="pageConfig.totalCount" @on-change="changeCurrent" @on-page-size-change="changeSize" show-elevator show-sizer></Page>
      </div>
     <bannerPoput :modalShow.sync="modalShow" :modalType="modalType" :adTypeId="adTypeId" @completeModal="completeModal" :editorData="editorData"/>
   </Card>
</div>
</template>

<script>
import util from '../../libs/util'
import bannerPoput from "./components/bannerPoput";
// import {allSort} from '../../assets/request/apis/activities'
// import UploadImg from '../main-components/upload-img.vue'
export default {
  name: "allService",
  components:{
    // UploadImg,
    bannerPoput
  },
  data(){
      return{
        editorData:null,
        loading:true,
        disabled:false,//是否登录APP禁用控制
        editorId:'',  //编辑的Id
        serverType:[], //弹窗服务类型
        modalType:'add',//区分弹窗的新增和编辑
        eidtImg:[],   //图片组件
        domain:'',//图片域名
        belongList:[],//服务栏目列表
        pageConfig:{   //分页
         current:1,
         size:10,
         bigSize:100,
         totalCount:0
        },
        modalShow:false,//弹窗控制
        btnFlag:false,
        serverOptionList:[], //选择类型数组
        addAllServe:false,
        AdTypeList:[],  //tab名称数组
        columns:[
          {title:'编号',key:'',render:(h,params)=>{
            return h('span',params.index+1)
           }},
          {title:'服务名称',key:'title'},
          {title:'图片',key:'iconName',render:(h,params)=>{
            let src = params.row.iconUrl
            return h('img',{
              attrs:{
                src:src
              },
              style:{
                height:'40px',
                width:'40px',
              }
            })
          }},
          {title:'类型',key:'serviceCategoryName'},
          {title:'位置',key:'',render:(h,params)=>{
            return h('span','首页')
          }},
          {title:'发布日期',key:'createTime',sortable: true},
          {title:'点击量',key:'clickCount',sortable: true},
          {title:'操作',key:'',render:(h,params)=>{
            return h('div',[
              h('Button',{
                props:{
                  type:'primary',
                  size:'small'
                },
                style:{
                  marginRight:'10px'
                },
                on:{
                  click:()=>{
                    console.log(params.row)
                   this.editorId = params.row.serviceId
                   this.idEditor(params.row.serviceId)
                   this.addAllServe = true
                    this.modalType = 'editor'//区分弹窗的新增和编辑
                  }
                }
              },'编辑'),
              h('Button',{
                props:{
                  type:'error',
                  size:'small'
                },
                on:{
                   click:()=>{
                      let _this = this;
                      _this.$store.commit('setDeleteModal',{model:true,callback:()=>{
                        _this.delThis(params.row.serviceId);
                      }})
                  }
                }
              },'删除')
            ])
           }},
        ],
        lists:[]
      }
  },
  methods:{
    completeModal(data){  //子组件弹窗完成按钮
      this.modalShow = false;
      if(data == true) {
        this.pageConfig.current = 1;
        this.getAdLists()
      }
    },
    secondOnServe(data){  //第二个模态框内容改变的方法

    },
    openChange(flag){ //下拉框展开收起时的方法
      if(flag == true){
        let data = "";
        this.serveListRemote(data)
      }
    },
    changeQuery(e){  //远程搜索query变化时触发
      if(e == ''){
        this.serveListRemote(e)
      }
    },
    sortChange(data){       //修改排序
      let flag;
      data.order == 'desc'?flag = 'down' : flag = 'up'
       if(data.key == 'createTime'){
         this.getCol(flag,'createTime')
       }else{
         this.getCol(flag,'clickCount')
       }
    },
    dragRow(a,b){       //拖拽行序列
      let data = util.sortTableRow(a,b,this.lists)
      this.lists = data
    },
    getServerItem(code){           //获取弹窗第二条数据
      let param = {
       categoryId:code
      }
     this.$http.get('/yyht/v1/repair/category/select/next',{params:param}).then(res=>{
       if(res.data.code == 0){
         this.secondList = res.data.data
       }else{
         this.$Message.warning(res.data.msg)
       }
     })
   },
    delThis(id){    //删除按钮
     this.$http.get(`/yyht/v1/service/delete?id=${id}`).then(res=>{
      if(res.data.code == 0){
        this.$Message.success('删除成功');
        this.$store.commit('setDeleteModal',{model:false})
        this.getCol()
      }else{
        this.$Message.warning(res.data.msg)
      }
     })
    },
    changeServer(data){  //模态框选项发生变化事件
      console.log(data)
      this.getServerItem(data);
      this.serverOptionList.forEach((item,index)=>{
        if(item.serviceId == data){
         if(this.poseObj.code == 'APP_JUMP'){this.addAllForm.target = item.target;this.addAllForm.needLogin = item.needLogin;this.disabled = true}else{this.addAllForm.serverOption = item.serviceId}
        }
      })
    },
    idEditor(id){    //编辑按钮
      this.modalShow = true;
      this.modalType = 'editor';
      this.editorData = data;
    },
    uploadCallback(data){      //上传图片的方法
      this.$set(this.addAllForm,'imgKey',data.key)
    },
    changeSize(e){  //分页修改当前尺寸
     this.pageConfig.size = e;
     this.getCol()
    },
    changeCurrent(e){  //分页修改当前页
     this.pageConfig.current = e;
     this.getCol()
    },
    getCol(data,item){  //查询所有服务
      this.loading = true;
      if(!data){data = ''}
      if(!item){item = ''}
        this.$http.get(`/yyht/v1/service/getAllServiceByServiceTyIdForPage?PageSize=${this.pageConfig.size}&pageNo=${this.pageConfig.current}&id=${this.defaultServeId}&flag=${data}&type=${item}`).then(res=>{
          if(res.data.code == 0){
            this.lists = res.data.data.list;
            this.loading = false;
            this.pageConfig.totalCount = res.data.data.totalCount;
          }else{
            this.$Message.warning(res.data.msg)
          }
        })
    },
    getServeCol(){  //获取服务栏目列表
      this.$http.get(`/yyht/v1/service/type/getAllServiceType`).then(res=>{
        if(res.data.code == 0){
          this.belongList = res.data.data
          this.defaultServeId = res.data.data[0].id
          this.getCol()
          this.AdTypeList = res.data.data
        }else{
          this.$Message.warning(res.data.msg)
        }
      })
    },
    cancel(){  //模态框取消按钮
      this.addAllServe = false
    },
    tabChange(e){  //tab改变按钮
      this.AdTypeList.forEach((ele,index)=>{
        if(e == index){
          this.defaultServeId = ele.id;
          this.getCol()
        }
      })
    },
  },
  mounted(){
   this.getServeCol();
   // this.getToken();
  }
}
</script>

<style>
.typeChoose .ivu-btn{
  border:none;
  margin-right: 3px;
}
</style>
