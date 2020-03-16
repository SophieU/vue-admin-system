<template>
 <div>
   <Card>
     <div class="clearfix mb-15">
       <div class="pull-right">
         <Button icon="md-add" type="primary" @click="addAllServe = true">新增服务</Button>
       </div>
     </div>
     <Tabs type="card" @on-click="tabChange">
       <TabPane v-for="(item,index) in AdTypeList" :key="index" :label="item.typeName">
         <Table :columns="columns" :data="lists" draggable @on-drag-drop="dragRow" @on-sort-change="sortChange" :loading="loading"></Table>
       </TabPane>
     </Tabs>
     <div class="pagination mt-15">
        <Page :current.sync="pageConfig.current" :page-size="pageConfig.size" :total="pageConfig.totalCount" @on-change="changeCurrent" @on-page-size-change="changeSize" show-elevator show-sizer></Page>
      </div>
   </Card>
     <Modal
      :title="title"
      v-model="addAllServe"
      @on-visible-change="addModalChange"
      :mask-closable="false"
      :closable="false">
      <Form  :label-width="100" ref="addAllServeRefs" :rules="addAllRules" :model="addAllForm">
        <FormItem prop="belong" label="所属栏目:">
         <Select v-model="addAllForm.belong">
          <Option v-for="item in belongList" :value="item.id" :key="item.id">{{ item.typeName }}</Option>
         </Select>
        </FormItem>
        <div class="labelBefore">
        <FormItem label="类型:">
          <div class="typeChoose"><Button v-for="(item,index) in serverType" :style="{background:item.color}" :key="item.code" type="default" @click="typeFn(item,index)">{{item.name}}</Button></div>
        </FormItem>
        </div>
        <div v-show="btnShow == true">
           <div class="labelBefore">
            <FormItem label="URL:" prop="url" v-if="urlShow == true">
              <Input v-model="addAllForm.url"></Input>
            </FormItem>
            <FormItem label="" v-else>
             <Button v-if="btnFlag == true" @click="getOptionType" type="primary">{{btnTitle}}</Button>
             <Button v-else type="primary" @click="getOptionType">选择{{showType}}</Button>
            </FormItem>
           </div>
        </div>
        <div class="labelBefore">
        <FormItem prop="needLogin"  label="是否登录APP:">
           <RadioGroup v-model="addAllForm.needLogin">
                <Radio label="Y"  :disabled="disabled">是</Radio>
                <Radio label="N"  :disabled="disabled">否</Radio>
            </RadioGroup>
        </FormItem>
        </div>
        <FormItem prop="name"  label="名称显示:">
            <Input v-model="addAllForm.name" :maxlength="5"></Input><span>App分类显示最多5个字</span>
        </FormItem>
        <div class="labelBefore">
        <FormItem label="图标设置:">
          <UploadImg :qiniuToken="qiniuToken" :domain="domain" ref="upImg" :eidtImg="eidtImg"  @onUpload="onUpload"></UploadImg>
        </FormItem>
        </div>
       </Form>
       <div slot="footer">
        <Button @click="cancel">取消</Button>
        <Button type="primary" @click="saveAddAll('addAllServeRefs')">确认</Button>
       </div>
     </Modal>
      <Modal
        v-model="modalShow"
        :title="showType"
        @on-ok="okModal"
        @on-cancel="modalShow = false">
        <Form :model="addAllForm" :label-width="130">
          <FormItem :label="label">
           <Select
              v-model="addAllForm.serverOption"
              :remote="true"
              :remote-method="serveListRemote"
              :filterable="true"
              @on-query-change="changeQuery"
              @on-change="changeServer"
              @on-open-change="openChange"
              :loading="false"
              >
            <Option v-for="(item,index) in serverOptionList" :value="item.serviceId" :key="index">{{ item.title }}</Option>
           </Select>
          </FormItem>
          <FormItem label="请选择服务项目:" v-show="poseObj.code == 'E_PROJECT'">
           <Select v-model="addAllForm.second" @on-change="secondOnServe">
             <Option v-for="(item,index) in secondList" :value="item.id" :key="index">{{ item.name }}</Option>
           </Select>
          </FormItem>
          <FormItem label="">
           <div style="color:#CD0000">
             <p>*请输入搜索或点击选择</p><p v-show="poseObj.code == 'E_PROJECT'">*请先选择服务类型再选择服务项目</p>
           </div>
          </FormItem>
      </Form>
    </Modal>
</div>
</template>

<script>
import util from '../../libs/util'
// import {allSort} from '../../assets/request/apis/activities'
import UploadImg from '../main-components/upload-img.vue'
export default {
  name: "allService",
  components:{
    UploadImg
  },
  data(){
      return{
        loading:true,
        disabled:false,//是否登录APP禁用控制
        label:'',
        secondList:[],
        qiniuToken:{  //七牛token
          key:'',
          token:''
        },
        editorId:'',  //编辑的Id
        serverType:[], //弹窗服务类型
        eidtImg:[],   //图片组件
        domain:'',//图片域名
        belongList:[],//服务栏目列表
        pageConfig:{   //分页
         current:1,
         size:10,
         bigSize:100,
         totalCount:0
        },
        showType:'',    //弹窗中选择类型后Button字的变化
        urlShow:false,  //判断弹窗中是否选中H5分类
        btnShow:false,  //判断是出现URL还是button
        modalShow:false,//第二个弹窗的状态控制
        btnFlag:false,
        poseObj:{},     //传参的临时对象
        serverOptionList:[], //选择类型数组
        btnTitle:'',         //按钮选择之后内容的改变
        addAllForm:{    //新增或编辑弹出框数据
          belong:'',
          name:'',
          serverOption:'',
          imgKey:'',
          second:'',
          needLogin:'Y'
        },
        addAllRules:{  //弹出框校验
          belong:[{required: true, message: '请选择所属栏目', trigger: 'blur' }],
          url:[{required: true, message: '请输入内转链接', trigger: 'blur' }],
          name:[{required: true, message: '请填写名称显示', trigger: 'blur' }],
        },
        title:'新增服务',
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
                on:{
                  click:()=>{
                   this.editorId = params.row.serviceId
                   this.idEditor(params.row.serviceId)
                   this.addAllServe = true
                   this.title = '编辑服务'
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
    secondOnServe(data){  //第二个模态框内容改变的方法
    //  if(this.secondList.length > 0){
    //     this.secondList.forEach(ele=>{
    //     if(ele.id == data){
    //       this.btnFlag = true;
    //       this.btnTitle = ele.name
    //     }
    //   })
    //  }
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
      // allSort(this.lists)
    },
    getServerItem(code){           //获取弹窗第二条数据
     let formData = new FormData();
     formData.append('categoryId',code)
     this.$http.post('/ad/banner/get/repair/category',formData).then(res=>{
       if(res.data.code == 0){
         this.secondList = res.data.data
       }else{
         this.$Message.warning(res.data.msg)
       }
     })
   },
    delThis(id){    //删除按钮
     this.$http.delete(`/service/deleteServiceById?id=${id}`).then(res=>{
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
      this.getServerItem(data);
      this.serverOptionList.forEach((item,index)=>{
        if(item.serviceId == data){
         if(this.poseObj.code == 'APP_JUMP'){this.addAllForm.target = item.target;this.addAllForm.needLogin = item.needLogin;this.disabled = true}else{this.addAllForm.serverOption = item.serviceId}
        }
      })
    },
    idEditor(id){    //编辑按钮
     this.$http.get(`/service/getServiceInfoById?id=${id}`).then(res=>{
       if(res.data.code == 0){
         let data = res.data.data
         this.addAllForm.belong = data.idServiceType;
         this.addAllForm.name = data.title;
         this.addAllForm.needLogin = data.needLogin;
         this.poseObj.id = data.idServiceCategory;
         this.poseObj.code = data.serviceCategoryCode;
         this.poseObj.name = data.serviceCategoryName;
         this.showType = data.serviceCategoryName;
         data.serviceCategoryCode == 'APP_JUMP'?this.disabled = true:this.disabled = false;
         this.serverType.forEach((ele,index)=>{
           if(data.serviceCategoryCode == ele.code){
             this.serverType[index].color = '#d5e8fc'
           }
         })
         if(data.serviceCategoryCode == 'H5'){
           this.urlShow = true;
           this.btnShow = true;
           this.addAllForm.url = data.target
         }else{
            this.btnShow = true;
            this.btnFlag = true;
            if(data.parentName){
             this.btnTitle =data.parentName + '-' + data.targetName;
            }else{
             this.btnTitle = data.targetName
            }
            switch(data.serviceCategoryCode){
              case 'APP_JUMP' :
              this.addAllForm.target = data.target;
              break;
              case 'E_SERVICE_CATEGORY' :
              this.addAllForm.serverOption = data.target;
              break;
              default:
              this.addAllForm.second =data.target;
            }
         }
        if (data.imageUrl) {
          this.eidtImg = [{name:'图标',url:data.imageUrl,status:'finished'}];
          this.addAllForm.imgKey = data.imgKey;
        }
       }else{
         this.$Message.warning(res.data.msg)}
     })
    },
    okModal(){     //选择服务类型模态框确认按钮
      let father;
      this.serverOptionList.forEach(ele=>{
        if(ele.serviceId == this.addAllForm.serverOption){
           father = ele.title
         }
      })
      if(!this.addAllForm.second){
         this.btnTitle = father
      }else{
       this.secondList.forEach(v=>{
         if(v.id == this.addAllForm.second){
           this.btnTitle = father + '-' +v.name
         }
       })
      }
      this.btnFlag = true
      this.modalShow = false
    },
    serveListRemote(query){
      let name = query;
      this.$http.get(`service/getServiceByCategoryByCode?code=${this.poseObj.code}&name=${name}`).then(res=>{
        if(res.data.code == 0){
          this.serverOptionList = res.data.data;
        }else{
          this.$Message.warning(res.data.msg)
        }
      })
    },
    getOptionType(){        //根据code查询不同类型
      let query = '';
      this.$http.get(`service/getServiceByCategoryByCode?code=${this.poseObj.code}&name=${query}`).then(res=>{
        if(res.data.code == 0){
          this.serverOptionList = res.data.data;
          this.poseObj.code == 'E_PROJECT'?this.label = '请选择服务项目类型:': this.label = `请选择${this.poseObj.name}:`;
          this.modalShow = true;
        }else{
          this.$Message.warning(res.data.msg)
        }
      })
    },
    typeFn(data,index){      //弹窗类型下的按钮
      this.addAllForm.needLogin = 'Y',
      this.disabled = false,
      this.addAllForm.serverOption = '',
      this.addAllForm.second = '',
      this.serverType.forEach((item,ind)=>{
        if(ind == index){
          item.color = "#d5e8fc"
        }else{
          item.color = "white"
        }
      })
      if(data.id){
        this.poseObj.code = data.code;
        this.poseObj.id = data.id;
        this.poseObj.name = data.name;
        this.btnShow = true;
        this.btnFlag = false;
        data.id == 5?this.urlShow = true:this.urlShow = false;
        switch(data.id){
          case '3' : this.showType = 'APP内转';
          break;
          case '14' : this.showType = '服务分类';
          break;
          default : this.showType = '服务项目';
          break;
        }
      }else{
        this.btnShow = false
      }
    },
    addCategory(){        //点击新增按钮获取树形结构
      this.$http.get('/service/category/getAllServiceCategory').then(res=>{
        if(res.data.code == 0){
          res.data.data.forEach((item,index)=>{
            item.color = 'white'
          })
          this.serverType = res.data.data
        }else{
          this.$Message.warning(res.data.msg)
        }
      })
    },
    getToken(){        //获取七牛token
      this.$http.get(`/base/qiniu/token`).then(res=>{
        if (res.data.code === 0){
          this.domain = res.data.data.domain;
          this.qiniuToken.token = res.data.data.token;
        }else{
          this.$Message.warning(res.data.msg)
        }
      })
    },
    addModalChange(data){      //模态框状态变化
      if(data == false){
        this.title = '新增服务';
        this.eidtImg = [];
        this.urlShow = false;
        this.btnShow = false;
        this.serverType.forEach(ele=>{
          delete ele.color
        })
        this.$refs['addAllServeRefs'].resetFields();
        this.addAllForm = {
           belong:'',
           name:'',
           serverOption:'',
           imgKey:'',
           needLogin:'Y'
        }
        this.disabled = false;
      }else{
        this.belongList.length == 1? this.addAllForm.belong = this.belongList[0].id : this.addAllForm.belong = ''
      }
    },
    onUpload(data){      //上传图片的方法
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
      this.$http.get(`/service/getAllServiceByServiceTyId?PageSize=${this.pageConfig.size}&pageNo=${this.pageConfig.current}&id=${this.defaultServeId}&flag=${data}&type=${item}`).then(res=>{
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
      this.$http.get(`/service/type/getAllServiceType?flag=up&pageNo=${this.pageConfig.current}&pageSize=${this.pageConfig.bigSize}`).then(res=>{
        if(res.data.code == 0){
          this.belongList = res.data.data.list
          this.defaultServeId = res.data.data.list[0].id
          this.defaultName = res.data.data.list[0].typeName
          this.getCol()
          res.data.data.list.forEach((ele,index)=>{
              ele.ind = index
          })
          this.AdTypeList = res.data.data.list
          this.pageConfig.totalCount = res.data.data.totalCount
        }else{
          this.$Message.warning(res.data.msg)
        }
      })
    },
    saveAddAll(name){  //模态框确认按钮
      this.$refs[name].validate((valid) => {
        if(valid){
          if(!this.poseObj.id){
            this.$Message.warning('请选择服务分类!')
            return
          }
          if(!this.addAllForm.serverOption && !this.addAllForm.url && !this.addAllForm.second && !this.addAllForm.target){
            this.$Message.warning(`请选择${this.poseObj.name}`)
            return
          }
          if(!this.addAllForm.imgKey){
            this.$Message.warning('请上传图标设置!')
            return
          }
          if(this.poseObj.code == 'E_PROJECT' && !this.addAllForm.second){
            this.$Message.warning('请选择服务分类下的服务项目!')
            return
          }
          if(!this.addAllForm.needLogin){
            this.$Message.warning('请选择是否登录APP!')
            return
          }
          let target;
          switch(this.poseObj.code){
            case 'H5' : target = this.addAllForm.url;
            break;
            case 'APP_JUMP' : target = this.addAllForm.target;
            break;
            case 'E_SERVICE_CATEGORY' : target = this.addAllForm.serverOption;
            break;
            default: target = this.addAllForm.second;
          }
          let data = {
           "id": this.editorId,
           "idServiceCategory":this.poseObj.id,
           "idServiceType":this.addAllForm.belong,
           "imageUrl":this.addAllForm.imgKey,
           "needLogin":'N',
           "serviceCategoryCode":this.poseObj.code,
           "needLogin":this.addAllForm.needLogin,
           "target": target,
           "title": this.addAllForm.name
          }
          if(!this.editorId){
            delete data.id
          }
          this.$http.post('/service/addOrUpdateService',data).then(res=>{
            if(res.data.code == 0){
               this.addAllServe = false;
               this.getCol()
               this.editorId = ''
            }else{
              this.$Message.warning(res.data.msg)
            }
          })
        }

      })
    },
    cancel(){  //模态框取消按钮
      this.addAllServe = false
    },
    tabChange(e){  //tab改变按钮
      this.pageConfig = {
        current:1,
        size:10
      }
      this.AdTypeList.forEach(ele=>{
        if(e == ele.ind){
          this.defaultServeId = ele.id
          this.defaultName = ele.typeName
          this.getCol()
        }
      })
    },
  },
  mounted(){
   this.getServeCol();
   this.getToken();
   this.addCategory();
  }
}
</script>

<style>
.typeChoose .ivu-btn{
  border:none;
  margin-right: 3px;
}
</style>
