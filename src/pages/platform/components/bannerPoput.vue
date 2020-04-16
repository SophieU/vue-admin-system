<template>
    <div>
      <Modal
        @on-visible-change="addModalOpen"
        :title="modalType==='add'?'新增广告':'编辑广告'"
        v-model="modalShow"
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
                <FormItem  label="URL">
                  <Input v-model="addModal.form.target"></Input>
                </FormItem>
              </div>
            </div>
            <div class="labelBefore">
              <FormItem prop="needLogin"  label="是否登录APP">
                <RadioGroup v-model="addModal.form.needLogin">
                  <Radio label="Y"  :disabled="ifLogin">是</Radio>
                  <Radio label="N"  :disabled="ifLogin">否</Radio>
                </RadioGroup>
              </FormItem>
            </div>
<!--            <FormItem label="是否仅针对于新注册用户" prop="applyNewUser" v-show="menu == 'banner'">-->
<!--              <RadioGroup v-model="addModal.form.applyNewUser">-->
<!--                <Radio label="Y">是</Radio>-->
<!--                <Radio label="N">否</Radio>-->
<!--              </RadioGroup>-->
<!--            </FormItem>-->
            <FormItem label="广告标题" prop="title">
              <Input v-model="addModal.form.title" :maxlength="10"></Input>
              <span style="color:red">最多10个字</span>
            </FormItem>
            <FormItem label="广告图片" prop="imgName">
              <UploadImg ref="upImg" :eidtImg="eidtImg"  @onUpload="onUpload" @uploadCallback="successImg"></UploadImg>
              <span style="color:red">{{typeDes}}</span>
            </FormItem>
            <FormItem label="是否长期有效" prop="isLongValid" v-show="menu == 'banner'">
              <RadioGroup v-model="addModal.form.isLongValid">
                <Radio label="Y">是</Radio>
                <Radio label="N">否</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="开始时间" prop="startTime" v-show="addModal.form.isLongValid=== 'N' && menu == 'banner'">
              <DatePicker :editable="false"
                          v-model="addModal.form.startTime"
                          type="datetime"
                          placeholder="选择开始时间">
              </DatePicker>
            </FormItem>
            <FormItem label="结束时间" prop="endTime" v-show="addModal.form.isLongValid=== 'N' && menu == 'banner' ">
              <DatePicker :editable="false"
                          v-model="addModal.form.endTime"
                          type="datetime"
                          placeholder="选择结束时间">
              </DatePicker>
            </FormItem>
            <FormItem label="是否到期提醒" prop="needExpireRemind" v-show="menu == 'banner'">
              <RadioGroup v-model="addModal.form.needExpireRemind">
                <Radio label="Y">是</Radio>
                <Radio label="N">否</Radio>
              </RadioGroup>
            </FormItem>
          </Form>
        </div>
        <span slot="footer" class="dialog-footer">
        <Button @click="closeModal">取 消</Button>
        <Button type="primary" @click="loading = true;submitAdd()" :loading="loading">完成</Button>
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
            <Select v-model="chooseServeModal.selectForm.second">
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
    </div>
</template>

<script>
  import UploadImg from '../../main-components/upload-img.vue'
    export default {
      name: "bannerPoput",
      components:{
        UploadImg
      },
      props:{
        modalShow:{ //控制模态框显示关闭
          type:Boolean
        },
        modalType:{
          type:String
        },
        editorData:{
          type:Object
        },
        adTypeId:{
          type:Number
        },
        idServiceType:{
          type:String
        },
        menu:{
          type:String
        }
      },
      // watch:{
      //   modalShow:{
      //     handler(newV,oldV){
      //       if(newV == true){
      //         this.getAdOwner();
      //         this.getTypeTree();
      //         this.getToken();
      //       }
      //     }
      //   }
      // },
      data(){
          return{
            secondList:[],//服务分类第二个选择框
            serveList:[],//服务类型第一个选择框
            label:'',
            loading:false,
            chooseServeModal:{ //第二个弹窗
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
            poseObj:{  //服务类型code
              code:'',
              name:'',
              id:''
            },
            qiniuToken:{
              key:'',
              token:''
            },
            isServeBtn:{
              targetName:'',
              show:false,
              data:{
              }
            },
            domain:'',
            eidtImg:null,//编辑回显图片
            ifLogin:false,//是否登录APP
            butName:false, //控制button上的name回显
            extShow:false, //控制按钮按下后url和点击选择的按钮显示
            typeTree:[], //获取服务分类
            adOwnerList:[],//获取广告主
            addModal: {
              form:{
                adOwnerId:'',//所属广告主Id
                adTypeId:'1',//广告位id,插屏广告默认传值 7，启动页广告默认传 4
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
                { required: true, message: '请选择广告主', trigger: 'change' },
              ],
              title:[
                { required: true, message: '请输入广告标题', trigger: 'blur' },
              ],
              imgName:[
                { required: true, message: '请选择广告图片', trigger: 'change' },
              ],
              // target:[
              //   { required: true, message: '请输入目标url', trigger: 'blur' },
              // ],
              needLogin:[{ required: true, message: '请选择是否跳转APP', trigger: 'blur' }]
            },
            typeDes:'图片大小 345*156 比例 3.45：1.56'
          }
      },
      methods:{
        successImg(res){
          this.addModal.form.imgName = res.imageUrl;
        },
        closeModal(){  //关闭模态框的方法
          this.$emit('completeModal',false)
        },
        selectServe(){      //第二个模态框完成按钮
          this.chooseServeModal.show = false;
        },
        getServerItem(code){           //获取弹窗第二条数据
          let formData = new FormData();
          formData.append('categoryId',code);
          this.$http.get(`/yyht/v1/repair/category/select/next?parentId=${code}`).then(res=>{
            if(res.data.code == 0){
              this.secondList = res.data.data;
            }else{
              this.$Message.warning(res.data.msg)
            }
          })
        },
        openChange(flag){ //下拉框展开收起时的方法
          if(flag == true){
            let data = "";
            this.serveListRemote(data)
          }
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
        changeQuery(e){  //远程搜索query变化时触发
          if(e == ''){
            this.serveListRemote(e)
          }
        },
        serveListRemote(query){  //弹窗的第一条数据
          let code = this.poseObj.code;
          let name = query;
          this.$http.get(`/yyht/v1/service/getServiceByCategoryByCode?code=${code}&name=${name}`).then(res=>{
            if (res.data.code === 0){
              this.serveList = res.data.data;
            }else {
              this.$Message.error(res.data.msg)
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
            });
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
        submitAdd(){   //广告弹窗提交按钮
          this.$refs['addForm'].validate((valid) => {
            if (valid) {
              if(!this.poseObj.id && !this.addModal.form.idServiceCategory){
                this.$Message.warning('请选择服务分类');
                return
              }
              if(this.poseObj.code == "E_PROJECT" && !this.chooseServeModal.selectForm.second){
                this.$Message.warning('请选择服务分类下的服务项目');
                return
              }
              if(!this.addModal.form.needLogin){
                this.$Message.warning('请选择是否登录APP');
                return}
              this.addModal.form.idServiceCategory = this.poseObj.id;
              this.addModal.form.serviceCategoryCode = this.poseObj.code;
              if(this.poseObj.code == "E_PROJECT"){
                this.addModal.form.target = this.chooseServeModal.selectForm.second
              }
              this.addModal.form.adTypeId = this.adTypeId;
              let parmas = this.addModal.form;
              if (parmas.startTime && parmas.startTime !== ''){
                parmas.startTime = new Date(parmas.startTime).Format('yyyy-MM-dd hh:mm:ss');
              }
              if (parmas.endTime && parmas.endTime !== ''){
                parmas.endTime = new Date(parmas.endTime).Format('yyyy-MM-dd hh:mm:ss');
              }
              let url;
              if(this.menu == 'allService'){
                url='/yyht/v1/service/addOrUpdate';
                parmas.idServiceType = this.idServiceType;
                delete  parmas.adTypeId;
                delete  parmas.applyNewUser;
                delete  parmas.isLongValid;
                delete  parmas.startTime;
                delete  parmas.endTime;
                delete  parmas.needExpireRemind
              }else{
                url = `yyht/v1/ad/config/addOrUpdate`;
              }
              // this.menu == 'allService'?url='/yyht/v1/service/addOrUpdate': url = `yyht/v1/ad/config/addOrUpdate`;
              this.$http.post(url,parmas).then(res=>{
                if(res.data.code === 0){
                  if(this.modalType === 'add'){
                    this.$Message.success('添加成功');
                  }else {
                    this.$Message.success('修改成功');
                  }
                  this.$emit('completeModal',true)
                } else {
                  this.$Message.warning(res.data.msg);
                  this.$emit('completeModal',false)
                }
                this.loading = false;
              })
            }else{
              this.$Message.warning('表单填写不完整!');
              this.loading = false;
              return false;
            }
          })
        },
        onUpload(data){
          this.addModal.form.imgName = data.key
        },
        // getToken(){
        //   this.$http.get(`/base/qiniu/token`).then(res=>{
        //     if (res.data.code === 0){
        //       this.domain = res.data.data.domain;
        //       this.$emit('getListImage',this.domain)
        //       this.qiniuToken.token = res.data.data.token;
        //     }
        //   })
        // },
        initServeList(){ //点击选择第二个弹窗的内容和方法
          let code = this.poseObj.code;
          let name = '';
          this.$http.get(`/yyht/v1/service/getServiceByCategoryByCode?code=${code}&name=${name}`).then(res=>{
            if (res.data.code === 0){
              this.serveList = res.data.data;
              this.poseObj.code == 'E_PROJECT'?this.label = '请选择服务项目类型:': this.label = `请选择${this.poseObj.name}:`
              this.chooseServeModal.show = true
            }else {
              this.$Message.error(res.data.msg)
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
        getTypeTree(){   //获取服务分类
          this.$http.get(`/yyht/v1/service/category/getAllServiceCategory`).then(res=>{
            if (res.data.code === 0){
              res.data.data.forEach((item,index)=>{
                item.color = 'white';
                item.nocheck == true?'': this.typeTree.push(item)
              });
              // this.typeTree = res.data.data;
            } else {
              this.$Message.error(res.data.msg)
            }
          });
        },
        getAdOwner(){   //获取广告主
          this.$http.get(`/yyht/v1/ad/owner/getOwnerList`).then(res=>{
            if (res.data.code === 0){
              this.adOwnerList = res.data.data;
            } else {
              this.$Message.error(res.data.msg)
            }
          })
        },
        addModalOpen(flag){    //模态框状态切换
          if (flag === true && this.modalType == 'add') {
            this.getAdOwner();
            // this.$refs.upImg.clearFiles();
            this.eidtImg = null;
          }else if(flag === true && this.modalType == 'editor') {
            this.getAdOwner();
              let data = this.editorData;
              this.typeTree.forEach((item, index) => {
                if (data.serviceCategoryCode === item.code) {
                  if (item.code !== 'H5') {
                    this.isServeBtn.show = true
                  }
                  this.typeTree[index].color = '#d5e8fc'
                } else {
                  this.typeTree[index].color = 'white'
                }
              });
              this.extShow = true;
              this.butName = true;
              if (data.targetName == null) {
                this.butName = false;
                this.isServeBtn.targetName = data.serviceCategoryName
              } else {
                data.parentName ? this.showTargetName = data.parentName + '-' + data.targetName : this.showTargetName = data.targetName
              }
              this.addModal.form.adTypeId = data.typeId || this.adTypeId;
              this.addModal.form.imgName = data.imgName;
              this.addModal.form.adOwnerId = data.adOwnerId;
              // this.addModal.form.adState = data.adState;
              this.addModal.form.applyNewUser = data.applyNewUser;
              if (data.serviceCategoryCode == 'H5') {
                this.extShow = true;
                this.isServeBtn.show = false;
                this.addModal.form.target = data.target
              } else {
                this.btnShow = true;
                this.isServeBtn.show = true;
              }
              this.poseObj.id = data.idServiceCategory;
              this.addModal.form.isLongValid = data.isLongValid;
              this.addModal.form.needLogin = data.needLogin;
              data.serviceCategoryCode == 'APP_JUMP' ? this.ifLogin = true : this.ifLogin = false;
              this.poseObj.code = data.serviceCategoryCode;
              this.addModal.form.target = data.target;
              if (data.serviceCategoryCode == "E_PROJECT") {
                this.chooseServeModal.selectForm.second = data.target
              }
              this.addModal.form.title = data.title;
              this.addModal.form.id = data.id;
              this.eidtImg = [{name: data.imgName, url: data.imgName, status: 'finished'}];
              if (data.startTime) {
                this.addModal.form.startTime = data.startTime;
              }
              if (data.endTime) {
                this.addModal.form.endTime = data.endTime;
              }
          }else {
            this.extShow = false;
            this.butName = false;
            this.typeTree.forEach(ele=>{
              delete ele.color
            });
            this.eidtImg = null;
            this.addModal.form.adOwnerId = '';
            this.addModal.form.id = '';
            // this.addModal.form.adState = '';
            this.addModal.form.idServiceCategory = '';
            this.addModal.form.endTime = '';
            this.addModal.form.startTime = '';
            this.addModal.form.target = '';
            this.addModal.form.title = '';
            this.addModal.form.needLogin = 'Y';
            this.addModal.form.isLongValid = 'N';
            this.isServeBtn.show = false;
            this.ifLogin = false;
            this.$refs['addForm'].resetFields();
            this.$emit('update:modalShow',false);
          }
        },
      },
      mounted() {
        this.getAdOwner();
        this.getTypeTree();
        // this.getToken();
      }
    }
</script>

<style scoped>
  .typeChoose .ivu-btn{
    border:none;
    margin-right: 3px;
  }
  .gap{
    margin-top:25px;
  }
</style>
