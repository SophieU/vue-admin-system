<template>
    <div>

        <Card class="box-card mb-15">
            <div class="clearfix">
              <div class="pull-left " style="line-height: 30px">
                  <span class="mr-15"><span class="text-blue">广告主名称：</span>{{advertiserMsg.ownerName}}</span>
                  <span class="mr-15"><span class="text-blue">联系电话：</span>{{advertiserMsg.ownerPhone}}</span>
                  <span class="mr-15"><span class="text-blue">联系地址：</span>{{advertiserMsg.ownerAddress}}</span>
              </div>
              <div class="pull-right">
                <Button type="primary" @click="showOwnerEdit">修改信息</Button>
              </div>
            </div>
        </Card>
        <Card class="box-card">
            <Tabs  @on-click="tabClick" value="inEffect">
                <TabPane label="生效中广告" name="inEffect">
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
                <TabPane label="失效中广告" name="noEffect">
                    <Table :data="advertLists" :columns="adOff"></Table>
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
                    <FormItem label="联系地址" prop="ownerAddress">
                        <Input v-model="adOwnerEdit.from.ownerAddress"></Input>
                    </FormItem>
                </Form>
            </div>
            <div slot="footer" class="dialog-footer">
                <Button @click="adOwnerEdit.show = false">取 消</Button>
                <Button type="primary" :disabled="disabledBtn" @click="submitEdit">完成</Button>
            </div>
        </Modal>
        <Modal v-model="deleteModal.show" @close="deleteModal.adOwnerId = ''" width="30%">
            <div>
                确定删除该广告主吗
            </div>
            <span slot="footer" class="dialog-footer">
                <Button type="error" @click="submitDelete()">删除</Button>
                <Button @click="deleteModal.show = false">取 消</Button>
            </span>
        </Modal>
      <Modal
        @on-visible-change="addModalOpen"
        title="编辑广告"
        v-model="addModal.show"
        width="30%"
        :modal-append-to-body="false"
        :append-to-body="true"
        :show-close="false"
        center>
        <div class="modal-form">
          <Form :model="addModal.form" v-if="addModal.form.adTypeId === '4'" :rules="typeRules4" ref="addForm" :label-width="100" class="demo-ruleForm">
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
            <FormItem label="URL" prop="target">
              <Input v-model="addModal.form.target"></Input>
            </FormItem>
            <FormItem label="广告标题" prop="title">
              <Input v-model="addModal.form.title" :maxlength="10"></Input>
              <span style="color:red">最多10个字</span>
            </FormItem>
            <FormItem label="广告图片" prop="imgName">
              <UploadImg ref="upImg" :eidtImg="eidtImg"  @onUpload="onUpload"></UploadImg>
              <span style="color:red">推荐尺寸：1334*750；图片比例：1.78:1</span>
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
          </Form>
          <Form :model="addModal.form" v-else :rules="typeRulesX" ref="addFormB" :label-width="100" class="demo-ruleForm">
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
            <FormItem label="类型" prop="serviceCategoryCode">
              <Tree :data="typeTree" @on-select-change="selectType"></Tree>
              <Button type="primary" v-if="isServeBtn.show" @click="initServeList">{{isServeBtn.targetName}}</Button>
            </FormItem>
            <FormItem label="URL" prop="target" v-if="addModal.form.serviceCategoryCode === 'H5'">
              <Input v-model="addModal.form.target"></Input>
            </FormItem>
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
              <UploadImg ref="upImg" :eidtImg="eidtImg"  @onUpload="onUpload"></UploadImg>
              <span style="color:red">要求：图片大小 345*156 比例 3.45：1.56</span>
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
                <Button type="primary" :disabled="disabledBtn" @click="submitEditAdvert()">完成</Button>
            </span>
      </Modal>
      <Modal
        v-model="chooseServeModal.show"
        @on-visible-change="onServeCh"
        :mask-closable="false"
        width="30%"
      >
        <Select
          style="margin-top: 20px"
          v-model="chooseServeModal.selectForm.target"
          :filterable="true"
          :remote="true"
          :remote-method="serveListRemote"
          @on-change="changeOnServe"
          :loading="loadingServe">
          <Option v-for="(serve, index) in serveList" :value="serve.target" :key="serve.serviceId">{{serve.title}}</Option>
        </Select>
        <span slot="footer" class="dialog-footer">
                <Button @click="chooseServeModal.show = false">取 消</Button>
                <Button type="primary" @click="selectServe">完成</Button>
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
                adOwnerId:'',
              spinShow:false,
              disabledBtn:false,
                adOwnerEdit:{
                  show:false,
                  from:{
                    id:'',
                    ownerAddress:'',
                    ownerName:'',
                    ownerPhone:''
                  }
                },
              serveList:[],
              loadingServe:false,
              chooseServeModal:{
                show:false,
                searchForm:{
                  code:'',
                  name:'',
                },
                selectForm:{
                  target:'',
                  title:'',
                  idServiceCategory:''
                }
              },
              adOwnerList:[],
              typeTree:[],
              addModal: {
                show:false,
                type:'add',
                form:{
                  adOwnerId:'',//所属广告主Id
                  adTypeId:'',//广告位id,插屏广告默认传值 7，启动页广告默认传 4
                  applyNewUser:'N',//是否仅针对于新注册用户,是：Y 否：N 没有选项默认传：N
                  idServiceCategory:'',//所属服务分类Id,启动页广告默认传:5
                  imgName:'',
                  isLongValid:'N',//是否长期有效
                  needLogin:'N',//是否需要登录,是：Y 否：N 默认为 N
                  serviceCategoryCode:'',//服务分类编码 ,启动页广告默认传:H5
                  target:'',//目标（具体的操作码/id/h5链接）
                  title:'',//标题
                  needExpireRemind:'N',// 是否到期提醒,当设置不是长期有效的，此值必填 是：Y 否：N
                  startTime:'',
                  endTime:''
                }
              },
              typeRules4:{
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
                  { required: true, message: '请输入目标url', trigger: 'blur' }]
              },//启动页App广告编辑页面表单验证规则
              typeRulesX:{
                adOwnerId: [
                  { required: true, message: '请选择广告主', trigger: 'blur' },
                ],
                title:[
                  { required: true, message: '请输入广告标题', trigger: 'blur' },
                ],
                imgName:[
                  { required: true, message: '请选择广告图片', trigger: 'blur' },
                ],
                serviceCategoryCode:[
                  { required: true, message: '请选择类型', trigger: 'blur' }
                ],
                target:[
                  { required: true, message: '请输入目标url', trigger: 'blur' },
                ]
              },//其他类型广告编辑页面表单验证规则
                advertiserMsg:{
                    id:'',
                    ownerAddress:'',
                    ownerName:'',
                    ownerPhone:''
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
                    ]
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
                    let color='#333'
                    if(status==='IN_EFFECT'){
                      text = '生效中'
                    }
                     if(status==='IS_INVALID'){
                      text = '已失效'
                       color='#f00'
                    }
                    return h('span',{style:{color}},text)
                  }},

                {title:'跳转类型',key:'type',align:'center'},
                {title:'是否长期有效' ,align:'center',render:(h,params)=>{
                    let valid = params.row.isLongValid==='Y'?'是':'否'
                    return h('span',{},valid)
                  }},
                {title:'开始时间',key:'index',align:'center',render:(h,params)=>{
                    let time = params.row.startTime
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
                          type:'primary',
                          size:'small'
                        },
                        on:{
                          click(){
                            _this.showEdit(id)
                          }
                        }
                      },'编辑'),
                      h('Button',{
                        props:{
                          type:'error',
                          size:'small'
                        },
                        on:{
                          click(){
                            _this.showDelete(id)
                          }
                        }
                      },'删除'),

                    ])
                  }},
              ],
              adOff:[
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
                    let valid = params.row.isLongValid==='Y'?'是':'否'
                    return h('span',{},valid)
                  }},
                {title:'开始时间',key:'index',align:'center',render:(h,params)=>{
                    let time = params.row.startTime
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
                {title:'操作',width:240,align:'center',render:(h,params)=>{
                    let _this = this;
                    let id = params.row.id;
                    let adTypeId = params.row.adTypeId;
                    return h('div',[
                      h('Button',{
                        props:{
                          type:'primary',
                          size:'small'
                        },
                        on:{
                          click(){
                            _this.showEdit(id)
                          }
                        }
                      },'编辑'),
                      h('Button',{
                        props:{
                          type:'error',
                          size:'small'
                        },
                        on:{
                          click(){
                            _this.showDelete(id,adTypeId)
                          }
                        }
                      },'删除'),

                    ])

                  }},
              ],
            }
        },
        methods:{
            init(){
                this.getAdList();
                this.getOwnerDetail();
                this.getTypeTree();
            },
          getTypeTree(){
            this.$http.get(`/yyht/v1/service/category/getAllServiceCategory`).then(res=>{
              if (res.data.code === 0){
                let arr = [];
                res.data.data.forEach(item=>{
                  item.title = item.name;
                  if (item.idParent === '0'){
                    item.children = [];
                    arr.push(item);
                  }
                });
                arr.forEach(val=>{
                  res.data.data.forEach(item=>{
                    if (item.idParent === val.id){
                      val.children.push(item)
                    }
                  })
                });
                this.typeTree = arr;
              } else {
                this.$Message.error(res.data.msg)
              }
            });
          },
          showOwnerEdit(){
              this.adOwnerEdit.from.id=this.advertiserMsg.id;
              this.adOwnerEdit.from.ownerName=this.advertiserMsg.ownerName;
              this.adOwnerEdit.from.ownerAddress=this.advertiserMsg.ownerAddress;
              this.adOwnerEdit.from.ownerPhone=this.advertiserMsg.ownerPhone;
              this.adOwnerEdit.show = true;
          },
            tabClick(name){
              if (name === 'inEffect'){
                    this.searchAdState = 'IN_EFFECT';
                    this.pageConfig.current = 1;
                    this.pageConfig.total = 0;
                    this.pageConfig.size = 10;
                } else if (name === 'noEffect') {
                    this.searchAdState = 'IS_INVALID';
                    this.pageConfig.current = 1;
                    this.pageConfig.size = 10;
                    this.pageConfig.total = 0;
                }
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
              this.$http.get(`/yyht/v1/ad/owner/getPageList`,parmas).then(res=>{
                    if (res.data.code === 0){
                        let data = res.data.data.list;
                        this.advertLists =data;
                        this.pageConfig.current = res.data.data.pageNo;
                        this.pageConfig.total = res.data.data.totalCount;
                    }else {
                        this.$Message.error(res.data.msg);
                    }
                })
            },
            getOwnerDetail(){
                let id = this.$route.query.id;
                this.$http.get(`/yyht/v1/ad/owner/get/owner?adOwnerId=${id}`).then(res=>{
                    if (res.data.code === 0){
                        this.advertiserMsg = {
                            id:res.data.data.id,
                            ownerAddress:res.data.data.ownerAddress,
                            ownerName:res.data.data.ownerName,
                            ownerPhone:res.data.data.ownerPhone
                        };
                    } else {
                        this.$Message.error(res.data.msg);
                    }
                })
            },
            showDelete(id,adTypeId){
                this.deleteModal.show = true;
                this.deleteModal.adOwnerId = id;
              this.deleteModal.adTypeId = adTypeId;
            },
            submitDelete(){
                let id = this.deleteModal.adOwnerId;
                let url = '';
                if (this.deleteModal.adTypeId==='4'){
                  url = '/ad/config/deleteAdById?id='+id;
                } else if (this.deleteModal.adTypeId==='7'){
                  url = '/ad/screen/deleteAdById?id='+id;
                } else {
                  url = '/ad/banner/deleteAdById?id='+id;
                }
                this.$http.delete(url).then(res=>{
                    if (res.data.code === 0){
                        this.$Message.success('删除成功');
                        this.deleteModal.show = false;
                        this.init();
                    } else {
                        this.$Message.error(res.data.msg);
                    }
                })
            },
            submitEdit(){
                this.$refs['editForm'].validate((valid) => {
                    if (valid) {
                      this.disabledBtn = true;
                        let params = {
                            ownerAddress: this.adOwnerEdit.from.ownerAddress,
                            ownerName: this.adOwnerEdit.from.ownerName,
                            ownerPhone: this.adOwnerEdit.from.ownerPhone,
                            ownerState: "IN_COOPERATION",  //合作状态 合作中:IN_COOPERATION 暂停中:PAUSE 停止合作:STOP_COOPERATION 默认合作中
                            adOwnerId:this.adOwnerEdit.from.id
                        };
                        this.$http.post(`/ad/owner/add/adOwner`,params).then(res=>{
                          this.disabledBtn = false;
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
                });

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
          serveListRemote(query){
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
          initServeList(){
            let code = this.chooseServeModal.searchForm.code;
            let name = '';
            this.$http.get(`/service/getServiceByCategoryByCode?code=${code}&name=${name}`).then(res=>{
              if (res.data.code === 0){
                this.serveList = res.data.data;
                //this.chooseServeModal.searchForm.pageTotal = res.data.data.totalCount;
                /*this.chooseServeModal.selectForm.target = this.addModal.form.target;
                this.chooseServeModal.selectForm.title = this.addModal.form.title;
                this.chooseServeModal.selectForm.idServiceCategory = this.addModal.form.idServiceCategory;*/
                this.chooseServeModal.show = true
              }else {
                this.$Message.error(res.data.msg)
              }
            })
          },
          changeOnServe(code){
            this.serveList.forEach(item=>{
              if (item.target === code){
                this.chooseServeModal.selectForm.target = item.target;
                this.chooseServeModal.selectForm.title = item.title;
                this.chooseServeModal.selectForm.idServiceCategory = item.serviceId;
              }
            });
          },
          selectServe(){
            this.addModal.form.target = this.chooseServeModal.selectForm.target;
            this.addModal.form.title = this.chooseServeModal.selectForm.title;
            this.isServeBtn.targetName = this.chooseServeModal.selectForm.title;
            this.addModal.form.idServiceCategory = this.chooseServeModal.selectForm.idServiceCategory;
            this.chooseServeModal.show = false;
          },
          onUpload(data){
            this.addModal.form.imgName = data.key
          },
          submitEditAdvert(){
              if (this.$refs['addForm'] !== undefined){
                this.$refs['addForm'].validate((valid) => {
                  if (valid) {
                    this.disabledBtn = true;
                    let parmas = this.addModal.form;
                    if (parmas.startTime && parmas.startTime !== ''){
                      parmas.startTime = new Date(parmas.startTime).Format('yyyy-MM-dd hh:mm:ss');
                    }
                    if (parmas.endTime && parmas.endTime !== ''){
                      parmas.endTime = new Date(parmas.endTime).Format('yyyy-MM-dd hh:mm:ss');
                    }
                    this.$http.post(`/ad/config/addOrUpdateAd`,parmas).then(res=>{
                      this.disabledBtn = false;
                      if (res.data.code === 0){
                        this.$Message.success('修改成功');
                        this.pageConfig.current = 1;
                        this.getAdList();
                        this.addModal.show = false
                      } else {
                        this.$Message.error(res.data.msg)
                      }
                    })
                  }else {
                    this.$Message.error('表单填写错误');
                    return false;
                  }
                })
              };
            if (this.$refs['addFormB'] !== undefined){
              this.$refs['addFormB'].validate((valid) => {
                if (valid) {
                  this.disabledBtn = true;
                  let parmas = this.addModal.form;
                  if (parmas.startTime && parmas.startTime !== ''){
                    parmas.startTime = new Date(parmas.startTime).Format('yyyy-MM-dd hh:mm:ss');
                  }
                  if (parmas.endTime && parmas.endTime !== ''){
                    parmas.endTime = new Date(parmas.endTime).Format('yyyy-MM-dd hh:mm:ss');
                  }
                  let url='';
                  if (parmas.adTypeId ==='7'){
                    url='/ad/screen/addOrUpdateAd'
                  } else {
                    url='/ad/banner/addOrUpdateAd'
                  }
                  this.$http.post(url,parmas).then(res=>{
                    this.disabledBtn = false;
                    if (res.data.code === 0){
                      this.$Message.success('修改成功');
                      this.pageConfig.current = 1;
                      this.getAdList();
                      this.addModal.show = false
                    } else {
                      this.$Message.error(res.data.msg)
                    }
                  })
                }else {
                  this.$Message.error('表单填写错误');
                  return false;
                }
              })
            }
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
                if (this.$refs['addForm'] !== undefined){
                  this.$refs['addForm'].resetFields();
                }
                if (this.$refs['addFormB'] !== undefined){
                  this.$refs['addFormB'].resetFields();
                }
                this.typeTree.forEach(item=>{
                  item.selected = false;
                  if (item.children.length > 0){
                    item.children.forEach(child=>{
                      child.selected = false
                    })
                  }
                });
                this.isServeBtn.show = false;
                this.isServeBtn.data = {};
                this.eidtImg = null;
              }
          },
            handleSizeChange(size){
                this.pageConfig.size = size;
                this.pageConfig.current = 1;
                this.getAdList();
            },
            handleCurrentChange(page){
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
