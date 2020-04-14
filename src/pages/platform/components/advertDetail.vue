<template>
    <div>

        <Card class="box-card mb-15">
            <div class="clearfix">
              <div class="pull-left " style="line-height: 30px">
                  <span class="mr-15"><span class="text-blue">广告主名称：</span>{{advertiserMsg.ownerName}}</span>
                  <span class="mr-15"><span class="text-blue">联系电话：</span>{{advertiserMsg.ownerPhone}}</span>
                  <span class="mr-15"><span class="text-blue">联系地址：</span>{{advertiserMsg.ownerAddress}}</span>
                  <span class="mr-15"><span class="text-blue">业务员姓名：</span>{{advertiserMsg.agentName}}</span>
                  <span class="mr-15"><span class="text-blue">合作状态：</span>{{advertiserMsg.adState}}</span>
              </div>
              <div class="pull-right">
                <Button type="primary" @click="showOwnerEdit">修改信息</Button>
              </div>
            </div>
        </Card>
        <Card class="box-card">
          <Spin fix v-show="loading == true">加载中...</Spin>
            <Tabs  @on-click="tabClick" :value="tabPaneValue">
                <TabPane v-for="item in tabPane" :key="item.key" :label="item.label" :name="item.key">
                    <Table  :columns="adOn" :data="advertLists"></Table>
                    <div class="pagination">
                        <Page :current="pageConfig.current" :page-size="pageConfig.size" :total="pageConfig.total"
                              show-sizer show-elevator
                              @on-change="handleCurrentChange"
                              @on-page-size-change="handleSizeChange"
                         >
                        </Page>
                    </div>
                </TabPane>
            </Tabs>
        </Card>
        <Modal title="编辑广告主" v-model="adOwnerEdit.show" width="30%" @on-visible-change="visibleChange">
            <div class="modal-form">
                <Form :model="adOwnerEdit.from" :rules="rules" ref="editForm" :label-width="100" class="demo-ruleForm">
                    <FormItem label="广告主" prop="ownerName">
                        <Input v-model="adOwnerEdit.from.ownerName"></Input>
                    </FormItem>
                    <FormItem label="联系电话" prop="ownerPhone">
                        <Input v-model="adOwnerEdit.from.ownerPhone"></Input>
                    </FormItem>
                  <FormItem label="业务员姓名" prop="agentName">
                    <Input v-model="adOwnerEdit.from.agentName" :maxlength="11"  style="width:250px"></Input>
                  </FormItem>
                    <FormItem label="联系地址" prop="ownerAddress">
                        <Input v-model="adOwnerEdit.from.ownerAddress"></Input>
                    </FormItem>
                  <FormItem label="合作状态：" prop="adState">
                    <Select :transfer="true" v-model="adOwnerEdit.from.adState" placeholder="请选择" style="width:250px">
                      <!--                      <Option-->
                      <!--                        label="全部"-->
                      <!--                        value="">-->
                      <!--                      </Option>-->
                      <Option
                        label="合作中"
                        value="IN_COOPERATION">
                      </Option>
                      <Option
                        label="暂停中"
                        value="PAUSE">
                      </Option>
                      <Option
                        label="停止合作"
                        value="STOP_COOPERATION">
                      </Option>
                    </Select>
                  </FormItem>
                </Form>
            </div>
            <div slot="footer" class="dialog-footer">
                <Button @click="adOwnerEdit.show = false">取 消</Button>
                <Button type="primary" @click="submitEdit">完成</Button>
            </div>
        </Modal>
        <Modal v-model="deleteModal.show" @close="deleteModal.adOwnerId = ''" width="30%">
            <div>
                确定删除该广告主吗?
            </div>
            <span slot="footer" class="dialog-footer">
                <Button type="error" @click="submitDelete()">删除</Button>
                <Button @click="deleteModal.show = false">取 消</Button>
            </span>
        </Modal>
    </div>
</template>

<script>
    // import {validateTel} from '../../libs/validator'
    import UploadImg from '../../main-components/upload-img'
    import moment from 'moment'
    export default {
        name: "advertDetail",
        filters:{
          timeFormat(val){
            if (!val)return '';
            return (new Date(val).Format('yyyy-MM-dd hh:mm:ss'))
          }
        },
      components:{
        UploadImg
      },
        data(){
            return{
              loading:true,
              tabPaneValue:'',
              tabPane:[{label:'生效中',key:'IN_EFFECT'},{label:'已失效',key:'IS_INVALID'},{label:'即将过期',key:'IMMINENT_EXPIRY'},{label:'未生效',key:'NOT_EFFECTIVE'}],
              adOwnerId:'',
              spinShow:false,
                adOwnerEdit:{  //修改框的数据
                  show:false,
                  from:{
                    id:'',
                    ownerAddress:'',
                    ownerName:'',
                    ownerPhone:'',
                    agentName:'',  //业务员姓名
                    adState:''
                  }
                },
                advertiserMsg:{
                    id:'',
                    ownerAddress:'',
                    ownerName:'',
                    ownerPhone:'',
                    agentName:'',
                    adState:''
                },
                searchAdState:"IN_EFFECT",//广告生效状态类型 生效中:IN_EFFECT 已失效:IS_INVALID 默认生效中
                pageConfig:{
                  current:1,
                  size:10,
                  total:0
                },
              isServeBtn:{
                targetName:'',
                show:false,
                data:{

                }
              },
                deleteModal:{
                    show:false,
                    adOwnerId:'',
                    adTypeId:''
                },
              eidtImg:null,
              advertLists:[],//广告列表数据
              rules: {
                ownerName: [
                  { required: true, message: '请输入广告主', trigger: 'blur' },
                ],
                ownerPhone:[
                  { required: true, message: '请输入联系电话', trigger: 'blur' },
                  // {validator:validateTel,trigger:'blur'}
                ],
                ownerAddress:[
                  { required: true, message: '请输入联系地址', trigger: 'blur' },
                ],
                agentName:[
                  { required: true, message: '请输入业务员姓名', trigger: 'blur' },
                ],
                adState:[
                  { required: true, message: '请选择广告状态', trigger: 'blur' },
                ],
              },
              adOn:[
                {title:'编号',type:'index',align:'center'},
                {title:'广告主',key:'ownerName',align:'center'},
                {title:'广告位置',key:'typeName',align:'center'},
                {title:'图片',key:'index',align:'center',width:118,render:(h,params)=>{
                  return h('img',{
                    attrs:{
                      src:params.row.imgName,
                      'class':'advertImg',
                      'width':'100px',
                      'height':'63px'
                    },
                  })
                  }},
                {title:'广告状态', align:'center',render:(h,params)=>{
                    let status = params.row.adState;
                    let text='';
                    let color='#333';
                    if(status==='IN_EFFECT'){
                      text = '生效中'
                    }
                     if(status==='IS_INVALID'){
                      text = '已失效';
                       color='#f00'
                    }
                    return h('span',{style:{color}},text)
                  }},

                {title:'跳转类型',key:'type',align:'center'},
                {title:'是否长期有效' ,align:'center',render:(h,params)=>{
                    let valid = params.row.isLongValid==='Y'?'是':'否';
                    return h('span',{},valid)
                  }},
                {title:'开始时间',key:'index',align:'center',render:(h,params)=>{
                    let time = params.row.startTime;
                    if (time) {
                      time = moment(time).format('YYYY-MM-DD hh:mm')
                    }else {
                      time = ''
                    }
                    return h('span',{},time)
                  }},
                {title:'结束时间' ,align:'center',render:(h,params)=>{
                    let time = params.row.endTime;
                    if (time) {
                      time = moment(time).format('YYYY-MM-DD hh:mm')
                    }else {
                      time = ''
                    }
                    return h('span',{},time)
                }},
                {title:'操作',width:'240',align:'center',render:(h,params)=>{
                  let _this = this;
                  let id = params.row.id;
                    return h('div',[
                      h('Button',{
                        props:{
                          type:'error',
                          size:'small'
                        },
                        on:{
                          click(){
                            _this.$store.commit('setDeleteModal',{model:true,callback:()=>{
                                _this.submitDelete(id);
                              }});
                          }
                        }
                      },'删除'),
                    ])
                  }},
              ]
            }
        },
        methods:{
          init(){
              this.getAdList();
              this.getOwnerDetail();
          },
          showOwnerEdit(){   //修改信息按钮的弹出框
              this.adOwnerEdit.from.id=this.advertiserMsg.id;
              this.adOwnerEdit.from.ownerName=this.advertiserMsg.ownerName;
              this.adOwnerEdit.from.ownerAddress=this.advertiserMsg.ownerAddress;
              this.adOwnerEdit.from.ownerPhone=this.advertiserMsg.ownerPhone;
              this.adOwnerEdit.from.agentName=this.advertiserMsg.agentName;
              this.adOwnerEdit.show = true;
          },
            tabClick(name){
              this.loading = true;
              this.searchAdState = name;
              this.getAdList();
            },
            getAdList(){
                this.adOwnerId = this.$route.query.id;
                let parmas = {
                    adOwnerId: this.adOwnerId,
                    adState: this.searchAdState,//广告生效状态类型 生效中:IN_EFFECT 已失效:IS_INVALID 默认生效中
                    pageNo: this.pageConfig.current,
                    pageSize: this.pageConfig.size
                };
              this.$http.get(`/yyht/v1/ad/owner/ad/getPageList?pageNo=${parmas.pageNo}&pageSize=${parmas.pageSize}&adState=${parmas.adState}&adOwnerId=${parmas.adOwnerId}`).then(res=>{
                    if (res.data.code === 0){
                        let data = res.data.data.list;
                        this.advertLists =data;
                        this.pageConfig.current = res.data.data.pageNo;
                        this.pageConfig.total = res.data.data.totalCount;
                        this.loading = false;
                    }else {
                        this.$Message.error(res.data.msg);
                    }
                })
            },
            getOwnerDetail(){  //上方长卡片显示的详细信息
                let id = this.$route.query.id;
                this.$http.get(`/yyht/v1/ad/owner/get/owner?adOwnerId=${id}`).then(res=>{
                    if (res.data.code === 0){
                      let val;
                      switch (res.data.data.ownerState) {
                        case "IN_COOPERATION": val='合作中';
                        break;
                        case "PAUSE" :val = '暂停中';
                        break;
                        default: val = '未生效'
                      }
                        this.advertiserMsg = {
                            id:res.data.data.id,
                            ownerAddress:res.data.data.ownerAddress,
                            ownerName:res.data.data.ownerName,
                            ownerPhone:res.data.data.ownerPhone,
                            agentName:res.data.data.agentName,
                            adState:val
                        };
                      this.adOwnerEdit.from.adState = res.data.data.ownerState; //模态框合作状态赋值
                    } else {
                        this.$Message.error(res.data.msg);
                    }
                })
            },
            // showDelete(id,adTypeId){
            //     this.deleteModal.show = true;
            //     this.deleteModal.adOwnerId = id;
            //     this.deleteModal.adTypeId = adTypeId;
            // },
            submitDelete(id){   //
                this.$http.post(`/yyht/v1/ad/config/deleteAdById?id=${id}`,).then(res=>{
                    if (res.data.code === 0){
                        this.$Message.success('删除成功');
                        this.$store.commit('setDeleteModal',{model:false});
                        this.init();
                    } else {
                        this.$Message.error(res.data.msg);
                    }
                })
            },
            submitEdit(){ //修改框的确认按钮
                this.$refs['editForm'].validate((valid) => {
                    if (valid) {
                        let params = {
                            ownerAddress: this.adOwnerEdit.from.ownerAddress,
                            ownerName: this.adOwnerEdit.from.ownerName,
                            agentName:this.adOwnerEdit.from.agentName,
                            ownerPhone: this.adOwnerEdit.from.ownerPhone,
                            ownerState: this.adOwnerEdit.from.adState,  //合作状态 合作中:IN_COOPERATION 暂停中:PAUSE 停止合作:STOP_COOPERATION 默认合作中
                            adOwnerId:this.adOwnerEdit.from.id
                        };
                        this.$http.post(`/yyht/v1/ad/owner/addOrUpdate`,params).then(res=>{
                            if (res.data.code === 0){
                                this.$Message.success('修改成功');
                                this.adOwnerEdit.show = false;
                                this.init();
                            } else {
                                this.$Message.error(res.data.msg);
                            }
                        })
                    } else {
                        this.$Message.error('表单填写错误');
                        return false;
                    }
                })
            },
          onServeCh(flag){
            if (flag === false){
              this.serveList = [];
              this.chooseServeModal.searchForm.name = '';
              this.chooseServeModal.selectForm.target = '';
              this.chooseServeModal.selectForm.title = '';
              this.chooseServeModal.selectForm.idServiceCategory = '';
            }
          },
          visibleChange(){

          },
          showEdit(id){
            this.$http.post(`/ad/owner/getDetails?configId=${id}`).then(res=>{
                if (res.data.code === 0){
                  let data= res.data.data;
                  if (data.adTypeId !== '4'){
                    this.typeTree.forEach(item=>{
                      if (data.serviceCategoryCode === item.code) {
                        this.$set(item,'selected',true);
                        if (item.code !== 'H5'){

                          this.isServeBtn.data = item;
                          this.isServeBtn.show = true;
                        }
                      }else {
                        this.$set(item,'selected',false)
                      }
                      if (item.children.length > 0){
                        item.children.forEach(child=>{
                          if (data.serviceCategoryCode === child.code) {
                            item.expand = true;
                            this.$set(child,'selected',true);
                            this.isServeBtn.data = child;
                            this.isServeBtn.show = true;
                          }else {
                            this.$set(child,'selected',false)
                          }
                        })
                      }
                    });
                  }
                  this.isServeBtn.targetName = data.targetName;
                  this.addModal.form.adTypeId = data.adTypeId;
                  this.addModal.form.imgName = data.imgName;
                  this.addModal.form.adOwnerId = this.adOwnerId;
                  this.addModal.form.adState = data.adState;
                  this.addModal.form.applyNewUser = data.applyNewUser;
                  this.addModal.form.idServiceCategory = data.idServiceCategory;
                  this.addModal.form.isLongValid = data.isLongValid;
                  this.addModal.form.needLogin = data.needLogin;
                  this.addModal.form.serviceCategoryCode = data.serviceCategoryCode;
                  this.chooseServeModal.searchForm.code = data.serviceCategoryCode;
                  this.addModal.form.target = data.target;
                  this.addModal.form.title = data.title;
                  this.addModal.form.id = data.id;
                  this.chooseServeModal.searchForm.code = data.serviceCategoryCode;

                  this.eidtImg = [{name:data.imgName,url:data.imageUrl,status:'finished'}];
                  if (data.startTime){
                    this.addModal.form.startTime = data.startTime;
                  }
                  if (data.endTime){
                    this.addModal.form.endTime = data.endTime;
                  }
                  this.addModal.type = 'edit';
                  console.log(this.addModal.form.endTime);
                  this.addModal.show = true;
                } else {
                  this.$Message.error(res.data.msg)
                }
              });
          },
          selectType(list,item){
            this.addModal.form.serviceCategoryCode = item.code;
            if (item.code !== 'H5') {
              this.chooseServeModal.searchForm.code = item.code;
              this.addModal.form.idServiceCategory = item.id;
              this.isServeBtn.show = true;
              this.isServeBtn.data = item;
              this.isServeBtn.targetName = '选择'+item.title;
            }else {
              this.addModal.form.target = '';
              this.addModal.form.title = '';
              this.isServeBtn.show = false;
              this.addModal.form.idServiceCategory = item.id;
              this.isServeBtn.data = {};
            }
          },
          onUpload(data){
            this.addModal.form.imgName = data.key
          },
            handleSizeChange(size){
                this.loading = true;
                this.pageConfig.size = size;
                this.pageConfig.current = 1;
                this.getAdList();
            },
            handleCurrentChange(page){
                this.loading = true;
                this.pageConfig.current = page;
                this.getAdList();
            }
        },
        mounted() {
            this.init();
        }
    }
</script>

<style scoped>
    .invalidRed{
        color:red;
    }
</style>
