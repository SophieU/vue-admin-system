<template>
  <Card>
    <search-bar :searchForm="searchForm" ref="searchBar"
                @on-add="showAdd" :typeId="adTypeId" @search="onSearch" @onReset="resetSearch"
                @dateChange="dateChange"
    ></search-bar>
    <Tabs type="card" @on-click="tabChange">
      <TabPane v-for="tab in AdTypeList" :label="tabLabel(tab)" :name="tab.id" :key="tab.id"
      >
        <advert-table :domain="domain" :advertLists="advertLists" :pageConfig="pageConfig"
                      @pageConfigChange="pageConfigChange"
                      @sortChange="sortChange"
                      @onDrag="commitDrag"
                      @onEdit="showEdit"
                      @onDelete="showDelete"
                      @setTips="commitTips"
                      :loading="loading"
        ></advert-table>
      </TabPane>
    </Tabs>
    <Modal
      @on-visible-change="addModalOpen"
      :title="addModal.type==='add'?'新增广告':'编辑广告'"
      v-model="addModal.show"
      width="30%"
      :modal-append-to-body="false"
      :append-to-body="true"
      :show-close="false"
      :mask-closable="false"
      center>
      <div class="modal-form">
        <Form :model="addModal.form" :rules="rules" ref="addForm" :label-width="100" class="demo-ruleForm">
          <FormItem label="广告主" prop="adOwnerId">
            <Select v-model="addModal.form.adOwnerId" placeholder="请选择">
              <Option
                v-for="item in adOwnerList"
                :key="item.id"
                :value="item.id"
                :label="item.ownerName"
              >
                {{item.ownerName}}
              </Option>
            </Select>
          </FormItem>
          <div class="labelBefore">
          <FormItem label="类型" prop="serviceCategoryCode">
             <div class="typeChoose"><Button v-for="(item,index) in typeTree" :style="{background:item.color}" :key="item.code" type="default" @click="typeFn(item,index)">{{item.name}}</Button></div>
          </FormItem>
          </div>
          <div v-show="extShow == true">
            <FormItem label="" v-if="isServeBtn.show">
              <Button type="primary" v-if="butName == true" @click="initServeList">{{showTargetName}}</Button>
              <Button type="primary" v-else @click="initServeList">请选择{{isServeBtn.targetName}}</Button>
            </FormItem>
           <div v-else>
             <FormItem  label="URL" prop="target">
              <Input v-model="addModal.form.target"></Input>
             </FormItem>
           </div>
          </div>
          <div class="labelBefore">
            <FormItem prop="needLogin"  label="是否登录APP:">
               <RadioGroup v-model="addModal.form.needLogin">
                    <Radio label="Y"  :disabled="ifLogin">是</Radio>
                    <Radio label="N"  :disabled="ifLogin">否</Radio>
                </RadioGroup>
            </FormItem>
          </div>
          <FormItem label="是否仅针对于新注册用户" prop="applyNewUser">
            <RadioGroup v-model="addModal.form.applyNewUser">
              <Radio label="Y">是</Radio>
              <Radio label="N">否</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="广告标题" prop="title">
            <Input v-model="addModal.form.title" :maxlength="10"></Input>
            <span style="color:red">最多10个字</span>
          </FormItem>
          <FormItem label="广告图片" prop="imgName">
            <UploadImg :qiniuToken="qiniuToken" :domain="domain" ref="upImg" :eidtImg="eidtImg"  @onUpload="onUpload"></UploadImg>
            <span style="color:red">{{typeDes}}</span>
          </FormItem>
          <FormItem label="是否长期有效" prop="isLongValid">
            <RadioGroup v-model="addModal.form.isLongValid">
              <Radio label="Y">是</Radio>
              <Radio label="N">否</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="开始时间" prop="startTime" v-if="addModal.form.isLongValid=== 'N'">
            <DatePicker :editable="false"
              v-model="addModal.form.startTime"
              type="datetime"
              placeholder="选择开始时间">
            </DatePicker>
          </FormItem>
          <FormItem label="结束时间" prop="endTime" v-if="addModal.form.isLongValid=== 'N'">
            <DatePicker :editable="false"
              v-model="addModal.form.endTime"
              type="datetime"
              placeholder="选择结束时间">
            </DatePicker>
          </FormItem>
          <FormItem label="是否到期提醒" prop="needExpireRemind">
            <RadioGroup v-model="addModal.form.needExpireRemind">
              <Radio label="Y">是</Radio>
              <Radio label="N">否</Radio>
            </RadioGroup>
          </FormItem>
        </Form>
      </div>
      <span slot="footer" class="dialog-footer">
        <Button @click="addModal.show = false">取 消</Button>
        <Button type="primary" :disabled="disabledBtn" @click="submitAdd()">完成</Button>
      </span>
    </Modal>
    <Modal
      v-model="deleteModal.show"
      :mask-closable="false"
      @close="deleteModal.id = ''"
      width="30%"
    >
      <div>
        确定删除该广告吗
      </div>
      <span slot="footer" class="dialog-footer">
        <Button type="error" :disabled="disabledBtn" @click="submitDelete">删除</Button>
        <Button @click="deleteModal.show = false">取 消</Button>
      </span>
    </Modal>
    <Modal
      v-model="chooseServeModal.show"
      @on-visible-change="onServeCh"
      :mask-closable="false"
      width="30%"
    >
    <Form :model="chooseServeModal.selectForm" :label-width="130">
      <div class="gap"></div>
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
          <Option v-for="(serve, index) in serveList" :value="serve.serviceId" :key="index">{{serve.title}}</Option>
        </Select>
      </FormItem>
       <FormItem label="请选择服务项目:" v-show="poseObj.code == 'E_PROJECT'">
        <Select v-model="chooseServeModal.selectForm.second" @on-change="secondOnServe">
          <Option v-for="(item,index) in secondList" :value="item.id" :key="index">{{ item.name }}</Option>
        </Select>
      </FormItem>
       <FormItem label="">
        <div style="color:#CD0000">
          <p>*请输入搜索或点击选择</p><p v-show="poseObj.code == 'E_PROJECT'">*请先选择服务类型再选择服务项目</p>
        </div>
      </FormItem>
      </Form>
      <span slot="footer" class="dialog-footer">
        <Button @click="chooseServeModal.show = false">取消</Button>
        <Button type="primary" @click="selectServe">完成</Button>
      </span>
    </Modal>
  </Card>
</template>

<script>
  import searchBar from './components/searchBar.vue'
  import advertTable from './components/advertTable.vue'
  import UploadImg from '../main-components/upload-img.vue'
  export default {
    name: "banner",
    components:{
      searchBar,
      advertTable,
      UploadImg
    },
    data:()=>{
      return{
        loading:true,
        ifLogin:false,//是否登录APP
        label:'',     //弹窗名称显示
        showTargetName:'',
        butName:false, //控制button上的name回显
        extShow:false,//控制H5url和服务类型butn显示
        advertLists:[],
        disabledBtn:false,
        isServeBtn:{
          targetName:'',
          show:false,
          data:{
          }
        },
        poseObj:{  //服务类型code
          code:'',
          name:'',
          id:''
        },
        secondList:[],//弹窗的第二条数据
        chooseServeModal:{
          show:false,
          searchForm:{
            code:'',
            name:'',
          },
          selectForm:{
            target:'',
            title:'',
            idServiceCategory:'',
            second:'',
          }
        },
        tipsData:[],
        tabLabel:(params) => {
          return (h)=>{
            let name = params.typeName;
            let num = params.tipsCount;
            return h('div', [
              h('span', name),
              h('Badge', {
                props: {
                  count: num
                }
              })
            ])
          };
        },
        eidtImg:null,//编辑回显图片
        searchForm: {
          adOwnerId:'',
          adTypeId:1,
          isLongValid:'',
          adTitle:'',
          adState:'',// 广告状态 全部:'',生效中:IN_EFFECT,已失效:IS_INVALID,即将过期:IMMINENT_EXPIRY,未生效:NOT_EFFECTIVE
          beginStartTime:'',
          beginEndTime:'',
          endEndTime:'',
          endStartTime:''
        },
        AdTypeList:[],
        serveList:[],
        startTimeArr:[],
        endTimeArr:[],
        adTypeId:1,//广告类型Id,插屏广告默认传：7，启动页广告默认传：4，banner广告默认传：1
        pageConfig:{
          current:1,
          size:10,
          total:0
        },
        domain:'',
        qiniuToken:{
          key:'',
          token:''
        },
        adOwnerList:[],
        typeTree:[],
        deleteModal:{
          show:false,
          id:''
        },
        addModal: {
          show:false,
          type:'add',
          form:{
            adOwnerId:'',//所属广告主Id
            adTypeId:1,//广告位id,插屏广告默认传值 7，启动页广告默认传 4
            applyNewUser:'N',//是否仅针对于新注册用户,是：Y 否：N 没有选项默认传：N
            idServiceCategory:'',//所属服务分类Id,启动页广告默认传:5
            imgName:'',
            isLongValid:'N',//是否长期有效
            needLogin:'Y',//是否需要登录,是：Y 否：N 默认为 N
            serviceCategoryCode:'',//服务分类编码 ,启动页广告默认传:H5
            target:'',//目标（具体的操作码/id/h5链接）
            title:'',//标题
            needExpireRemind:'N',// 是否到期提醒,当设置不是长期有效的，此值必填 是：Y 否：N
            startTime:'',
            endTime:''
          }
        },
        rules: {
          adOwnerId: [
            { required: true, message: '请选择广告主', trigger: 'blur' },
          ],
          title:[
            { required: true, message: '请输入广告标题', trigger: 'blur' },
          ],
          imgName:[
            { required: true, message: '请选择广告图片', trigger: 'blur' },
          ],
          target:[
            { required: true, message: '请输入目标url', trigger: 'blur' },
          ],
          needLogin:[{ required: true, message: '请选择是否跳转APP', trigger: 'blur' }]
        },
        typeDes:'图片大小 345*156 比例 3.45：1.56'
      }
    },
    watch:{
      pageConfig:{
        handler:()=>{

        },
        deep:true
      },
      'pageConfig.size':function () {
        this.onSearch()
      },
      'pageConfig.current':function () {
        this.onSearch()
      },
    },
    methods:{
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
      onSearch(flag,type){
        this.loading = true;
        if (this.startTimeArr[0]) {
          this.searchForm.beginStartTime = new Date(this.startTimeArr[0]).Format('yyyy-MM-dd hh:mm:ss');
        }
        if (this.startTimeArr[1]) {
          this.searchForm.beginEndTime = new Date(this.startTimeArr[1]).Format('yyyy-MM-dd hh:mm:ss');
        }
        if (this.endTimeArr[0]) {
          this.searchForm.endStartTime = new Date(this.endTimeArr[0]).Format('yyyy-MM-dd hh:mm:ss');
        }
        if (this.endTimeArr[1]) {
          this.searchForm.endEndTime = new Date(this.endTimeArr[1]).Format('yyyy-MM-dd hh:mm:ss');
        }
        let parmas = this.searchForm;
        parmas.pageNo = this.pageConfig.current;
        parmas.pageSize = this.pageConfig.size;
        parmas.flag=flag;
        parmas.type=type;
        this.$http.post(`/ad/banner/getAllAdByTypeId`,parmas).then(res=>{
          if (res.data.code === 0){
            this.advertLists = res.data.data.list;
            this.pageConfig.total = res.data.data.totalCount;
            this.loading = false;
          } else {
            this.$Message.error(res.data.msg)
          }
        })
      },
      resetSearch(){
        this.searchForm = {
          adOwnerId:'',
          adTypeId:this.adTypeId,
          isLongValid:'',
          adTitle:'',
          adState:'',// 广告状态 全部:'',生效中:IN_EFFECT,已失效:IS_INVALID,即将过期:IMMINENT_EXPIRY,未生效:NOT_EFFECTIVE
          beginStartTime:'',
          beginEndTime:'',
          endEndTime:'',
          endStartTime:''
        };
        this.startTimeArr = [];
        this.endTimeArr = [];
        this.onSearch();
      },
      dateChange(data){
        if (data.type === 1){
          this.startTimeArr = data.date
        }else {
          this.endTimeArr = data.date
        }
      },
      sortChange(data){
        let type = data.key;
        let flag = 'up';
        if (data.order === 'desc') {
          flag = 'down'
        }
        this.onSearch(flag,type)
      },
      commitDrag(data){
        this.$http.post(`/ad/banner/updateAdSort`,data).then(res=>{
          if (res.data.code !== 0){
            this.$Message.error(res.data.msg)
          }else {
            this.onSearch()
          }
        })
      },
      showDelete(data){
        this.deleteModal.id = data;
        this.deleteModal.show = true;
      },
      commitTips(row){
        let adConfigId = row.id;
        let optionValue = '';
        if (row.needExpireRemind === 'Y'){
          optionValue = 'CLOSE'
        }else {
          optionValue = 'OPEN'
        }
        this.$http.post(`/ad/banner/set/expire/remind?adConfigId=${adConfigId}&optionValue=${optionValue}`).then(res=>{
          if (res.data.code === 0){
            this.onSearch();
            this.$Message.success('操作成功')
          } else {
            this.$Message.error('操作失败')
          }
        })
      },
      showEdit(data){
        this.typeTree.forEach((item,index)=>{
          if (data.serviceCategoryCode === item.code) {
            if (item.code !== 'H5'){this.isServeBtn.show = true}
            this.typeTree[index].color = '#d5e8fc'
          }else {
            this.typeTree[index].color = 'white'
          }
        });
        this.extShow = true;
        this.butName = true;
        if(data.targetName == null){
          this.butName = false;
          this.isServeBtn.targetName = data.serviceCategoryName
        }else{
          data.parentName? this.showTargetName = data.parentName + '-' + data.targetName : this.showTargetName = data.targetName
        }
        this.addModal.form.adTypeId = data.typeId || this.adTypeId;
        this.addModal.form.imgName = data.imgName;
        this.addModal.form.adOwnerId = data.adOwnerId;
        this.addModal.form.adState = data.adState;
        this.addModal.form.applyNewUser = data.applyNewUser;
        if(data.serviceCategoryCode == 'H5'){
          this.extShow = true;
          this.isServeBtn.show = false;
          this.addModal.form.target = data.target
        }else{
          this.btnShow = true;
          this.isServeBtn.show = true;
        }
        this.poseObj.id = data.idServiceCategory;
        this.addModal.form.isLongValid = data.isLongValid;
        this.addModal.form.needLogin = data.needLogin;
        data.serviceCategoryCode == 'APP_JUMP'?this.ifLogin = true:this.ifLogin = false;
        this.poseObj.code = data.serviceCategoryCode;
        this.addModal.form.target = data.target;
        if(data.serviceCategoryCode == "E_PROJECT"){
          this.chooseServeModal.selectForm.second = data.target
        }
        this.addModal.form.title = data.title;
        this.addModal.form.id = data.id;
        this.eidtImg = [{name:data.imgName,url:this.domain+data.imgName,status:'finished'}];
        if (data.startTime){
          this.addModal.form.startTime = data.startTime;
        }
        if (data.endTime){
          this.addModal.form.endTime = data.endTime;
        }
        this.addModal.type = 'edit';
        this.addModal.show = true;
      },
      showAdd(){
        this.addModal.type = 'add';
        this.$refs.upImg.clearFiles();
        this.eidtImg = null;
        this.addModal.show = true;
      },
      getTypeTree(){   //获取服务分类
        this.$http.get(`/service/category/getAllServiceCategory`).then(res=>{
          if (res.data.code === 0){
              res.data.data.forEach((item,index)=>{
                item.color = 'white'
              })
            this.typeTree = res.data.data;
          } else {
            this.$Message.error(res.data.msg)
          }
        });
      },
      tabChange(name){
        this.adTypeId = Number(name);
        this.searchForm.adTypeId = Number(name);
        this.addModal.form.adTypeId = Number(name);
        name == '12'?this.typeDes = '图片大小1125px*600px，建议主图区域控制在图片下方420px高度': this.typeDes = '图片大小 345*156 比例 3.45：1.56'
        this.onSearch();
      },
      pageConfigChange(data){
        this.pageConfig = data;
        this.onSearch()
      },
      addModalOpen(flag){
        if (flag === true){
          this.$http.get(`/ad/owner/getOwnerName`).then(res=>{
            if (res.data.code === 0){
              this.adOwnerList = res.data.data;
            } else {
              this.$Message.error(res.data.msg)
            }
          })
        }else {
          this.extShow = false;
          this.butName = false;
          this.typeTree.forEach(ele=>{
              delete ele.color
            });
          this.eidtImg = null;
          this.typeTree.forEach(item=>{
            item.selected = false;
          });
          this.addModal.form.adOwnerId = '';
          this.addModal.form.id = '';
          this.addModal.form.adState = '';
          this.addModal.form.idServiceCategory = '';
          this.addModal.form.endTime = '';
          this.addModal.form.startTime = '';
          this.addModal.form.target = '';
          this.addModal.form.title = '';
          this.addModal.form.needLogin = 'Y';
          this.addModal.form.isLongValid = 'N';
          this.isServeBtn.show = false;
          this.ifLogin = false;
        }
      },
      getAdTypeList(){
        this.$http.get(`/ad/banner/getAdTypeList`).then(res=>{
          if (res.data.code === 0){
            let _this = this;
            res.data.data.forEach(item=>{
              if (item.id !== '6' && item.id !== '4' && item.id !==  '7') {
                this.tipsData.forEach(tips=>{
                  if (tips.adTypeId === item.id){
                    this.$set(item,'tipsCount',tips.tipsCount)
                  }
                });
                this.AdTypeList.push(item)
              }
            });
            this.adTypeId = Number(this.AdTypeList[0].id)
          } else {
            this.$Message(res.data.msg)
          }
        })
      },
      typeFn(data,index){  //选择类型按钮
        this.chooseServeModal.selectForm.second = '';
        this.chooseServeModal.selectForm.serviceId = '';
        this.addModal.form.needLogin = 'Y';
        this.ifLogin = false;
        this.addModal.form.target = '';
        this.butName = false;
        this.poseObj.code = data.code;
        this.poseObj.name = data.name;
        this.poseObj.id = data.id;
        this.typeTree.forEach((item,ind)=>{
          if(ind == index){
            item.color = "#d5e8fc"
          }else{
            item.color = "white"
          }
        })
        if(data){
          this.extShow = true
        }else{
          return
        }
        if(data.code != 'H5'){
           this.isServeBtn.show = true
           this.isServeBtn.targetName = data.name
        }else{
          this.isServeBtn.show = false
        }
      },
      onUpload(data){
        this.addModal.form.imgName = data.key
      },
      submitAdd(){
        this.$refs['addForm'].validate((valid) => {
          if (valid) {
            if(!this.poseObj.id && !this.addModal.form.idServiceCategory){
              this.$Message.warning('请选择服务分类')
              return
            }
            if(this.poseObj.code == "E_PROJECT" && !this.chooseServeModal.selectForm.second){
              this.$Message.warning('请选择服务分类下的服务项目')
              return
            }
            if(!this.addModal.form.needLogin){
              this.$Message.warning('请选择是否登录APP')
              return}
            this.disabledBtn = true;
            this.addModal.form.idServiceCategory = this.poseObj.id;
            this.addModal.form.serviceCategoryCode = this.poseObj.code;
            if(this.poseObj.code == "E_PROJECT"){
              this.addModal.form.target = this.chooseServeModal.selectForm.second
            }
            let parmas = this.addModal.form;
            if (parmas.startTime && parmas.startTime !== ''){
              parmas.startTime = new Date(parmas.startTime).Format('yyyy-MM-dd hh:mm:ss');
            }
            if (parmas.endTime && parmas.endTime !== ''){
              parmas.endTime = new Date(parmas.endTime).Format('yyyy-MM-dd hh:mm:ss');
            }
            this.$http.post(`/ad/banner/addOrUpdateAd`,parmas).then(res=>{
              this.disabledBtn = false;
              if(res.data.code === 0){
                if(this.addModal.type === 'add'){
                  this.$Message.success('添加成功');
                }else {
                 this.$Message.success('修改成功');
                }
                this.pageConfig.current = 1;
                this.onSearch();
                this.addModal.show = false
              } else {
                this.$Message.error(res.data.msg)
              }
            })
          }else{
            this.$Message.warning('表单填写不完整!');
            return false;
          }
        })
      },
      submitDelete(){
        this.disabledBtn = true;
        let id = this.deleteModal.id;
        this.$http.delete(`/ad/banner/deleteAdById?id=${id}`).then(res=>{
          this.disabledBtn = false;
          if (res.data.code === 0){
            this.deleteModal.show = false;
            this.$Message.success('删除成功');
            this.onSearch();
          } else {
            this.$Message.error(res.data.msg);
            this.deleteModal.show = false;
          }
        })
      },
      onServeCh(flag){     //选择服务类型模态框状态方法
        if(flag == true){
        }else{
          if(this.chooseServeModal.selectForm.serviceId == ''){
            this.butName = false;
            this.isServeBtn.targetName = this.poseObj.name;
            return
          }
          let father;
          this.serveList.forEach(ele=>{
            if(ele.serviceId == this.chooseServeModal.selectForm.serviceId){
               father = ele.title
             }
          })
          if(!this.chooseServeModal.selectForm.second){
             this.showTargetName = father
          }else{
           this.secondList.forEach(v=>{
             if(v.id == this.chooseServeModal.selectForm.second){
               this.showTargetName = father + '-' +v.name
             }
           })
         }
         this.butName = true;
        }
      },
      secondOnServe(data){  //第二个模态框内容改变的方法
      //  if(this.secondList.length > 0){
      //     this.secondList.forEach(ele=>{
      //     if(ele.id == data){
      //       this.chooseServeModal.selectForm.itemName = ele.name
      //     }
      //   })
      //  }
      },
      getServerItem(code){           //获取弹窗第二条数据
         let formData = new FormData();
         formData.append('categoryId',code);
         this.$http.post('/ad/banner/get/repair/category',formData).then(res=>{
           if(res.data.code == 0){
             this.secondList = res.data.data;
           }else{
             this.$Message.warning(res.data.msg)
           }
         })
       },
      serveListRemote(query){  //弹窗的第一条数据
        let code = this.poseObj.code;
        let name = query;
        this.$http.get(`/service/getServiceByCategoryByCode?code=${code}&name=${name}`).then(res=>{
          if (res.data.code === 0){
            this.serveList = res.data.data;
          }else {
            this.$Message.error(res.data.msg)
          }
        })
      },
      initServeList(){
        let code = this.poseObj.code;
        let name = '';
        this.$http.get(`/service/getServiceByCategoryByCode?code=${code}&name=${name}`).then(res=>{
          if (res.data.code === 0){
            this.serveList = res.data.data;
            this.poseObj.code == 'E_PROJECT'?this.label = '请选择服务项目类型:': this.label = `请选择${this.poseObj.name}:`
            this.chooseServeModal.show = true
          }else {
            this.$Message.error(res.data.msg)
          }
        })
      },
      changeOnServe(code){       //第一个模态框内容改变的方法
       this.secondList = [];
       this.getServerItem(code)
       this.serveList.forEach(item=>{
        if (item.serviceId === code){
          if(this.poseObj.code == 'APP_JUMP'){this.addModal.form.target = item.target;this.addModal.form.needLogin = item.needLogin;this.ifLogin = true}else{this.addModal.form.target = item.serviceId}
          this.chooseServeModal.selectForm.title = item.title;
        }
       });
      },
      selectServe(){      //第二个模态框完成按钮
        this.chooseServeModal.show = false;
      },
      initTips(){
        let tips = this.$store.state.app.tipsData;
        for (let i=0;i<tips.length;i++){
          if (tips[i].adTypeId==='6' && tips[i].tipsCount >0){
            this.tipsData = tips[i].adTipsVoList;
            return
          }
        }
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
    mounted() {
      this.initTips();
      this.onSearch();
      this.getTypeTree();
      this.getAdTypeList();
      this.getToken();
    }
  }
</script>

<style scoped lang="scss">
  @import "./advert-manage.scss";
  .serve-item{
    font-size: 16px;
    margin-top: 5px;
  }
  .typeChoose .ivu-btn{
  border:none;
  margin-right: 3px;
  }
  .gap{
    margin-top:25px;
  }
</style>
