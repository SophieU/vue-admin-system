<template>
    <div class="page-content">
        <Card class="box-card">
          <div class="mb-15 clearfix">
            <Form inline :model="searchForm" ref="searchFormRef" class="pull-left" :label-width="100">
              <FormItem label="广告主名称" prop="ownerName">
                <Input v-model="searchForm.ownerName" placeholder="请输入广告主名称"></Input>
              </FormItem>
              <FormItem label="联系电话" prop="phone">
                <Input v-model="searchForm.phone" placeholder="请输入广告主电话"></Input>
              </FormItem>
              <FormItem class="no-label-form-item">
                <Button type="primary" @click="onSearch">查询</Button>
                <Button @click="onReset('searchFormRef')">清空</Button>
              </FormItem>
            </Form>
            <div class="pull-right">
              <Button type="primary" icon="el-icon-plus" @click="addModal.show=true;addModal.type='add'">新增广告主</Button>
            </div>
          </div>
            <!--表格-->
            <Table  :columns="columns" :data="advertiserLists" :loading="loading">

            </Table>
            <div class="pagination">
                <Page :total="pageConfig.total" :current="pageConfig.current" :page-size="pageConfig.size" show-elevator show-sizer
                      @on-change="handleCurrentChange"
                      @on-page-size-change="handleSizeChange"
                       >
                </Page>
            </div>
        </Card>

        <Modal
                :title="addModal.type==='add'?'新增广告主':'编辑广告主'"
                v-model="addModal.show"
                @on-visible-change="visibleChange"
                width="30%">
            <div class="modal-form">
                <Form :model="addModal.form" :rules="rules" ref="addForm" :label-width="100">
                    <FormItem label="广告主" prop="ownerName">
                        <Input v-model="addModal.form.ownerName" style="width:250px"></Input>
                    </FormItem>
                    <FormItem label="联系电话" prop="ownerPhone">
                        <Input v-model="addModal.form.ownerPhone" :maxlength="11"  style="width:250px"></Input>
                    </FormItem>
                    <FormItem label="联系地址" prop="ownerAddress">
                        <Input v-model="addModal.form.ownerAddress"  style="width:250px"></Input>
                    </FormItem>
                </Form>
            </div>
            <span slot="footer" class="dialog-footer">
                <Button @click="addModal.show = false">取 消</Button>
                <Button type="primary" :disabled="disabledBtn" @click="submitAdd('addForm')">完成</Button>
            </span>
        </Modal>
        <Modal
                v-model="deleteModal.show"
                @close="deleteModal.adOwnerId = ''"
                width="30%"
               >
            <div>
                确定删除该广告主吗
            </div>
            <span slot="footer" class="dialog-footer">
                <Button type="error" :disabled="disabledBtn" @click="submitDelete()">删除</Button>
                <Button @click="deleteModal.show = false">取 消</Button>
            </span>
        </Modal>
    </div>
</template>

<script>
    // import {validateTel} from '../../libs/validator'
    export default {
        name: "advertiser",
        data(){
            return {
              loading:true,
                searchForm: {
                    name: '',
                    phone: ''
                },
                disabledBtn:false,
                advertiserLists: [

                ],
                pageConfig: {
                    current: 1,
                    size: 10,
                    total: 0
                },
                addModal: {
                    type:'add',
                    show: false,
                    form:{
                        ownerName: '',
                        ownerPhone: '',
                        ownerAddress: '',
                        id:''
                    }
                },
                deleteModal:{
                    show:false,
                    adOwnerId:''
                },
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
              columns:[
                {title:'序号',align:'center',render:(h,params)=>{
                    return h('span',{},params.row._index+1)
                  }},
                {title:'广告主名称',key:'ownerName',align:'center'},
                {title:'联系地址',key:'ownerAddress',align:'center'},
                {title:'联系电话',key:'ownerPhone',align:'center'},
                {title:'正在投放广告数',key:'countNum',align:'center'},
                {title:'操作',width:240,align:'center',render:(h,params)=>{
                    let _this = this;
                    let id = params.row.id;
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
                            _this.goDetail(params.row)
                          }
                        }
                      },'查看广告'),
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
                            _this.showEdit(params.row)
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
                            _this.showDelete(params.row.id)
                          }
                        }
                      },'删除'),

                    ])
                  }},
              ]
            }
        },
        methods: {
            //搜索
            onSearch() {
              this.loading = true;
                let parms = {
                    "ownerName": this.searchForm.ownerName,
                    "ownerPhone": this.searchForm.phone,
                    "pageNo": this.pageConfig.current,
                    "pageSize": this.pageConfig.size
                };
                this.$http.post(`/yyht/v1/ad/owner/get/adOwner/show/pageList`,parms).then(res=>{
                    if (res.data.code === 0){
                        this.advertiserLists = res.data.data.list;
                        this.pageConfig.current = res.data.data.pageNo;
                        this.pageConfig.total = res.data.data.totalCount;
                        this.loading = false;
                    }else{
                      this.$Message.warning(res.data.msg)
                    }
                })
            },
            //重置
            onReset(ref) {
                this.$refs[ref].resetFields();
            },
            handleSizeChange(size) {
                this.pageConfig.size = size;
                this.pageConfig.current = 1;
                this.onSearch();
            },
            handleCurrentChange(page) {
                this.pageConfig.current = page;
                this.onSearch();
            },
            showEdit(row){
                this.addModal.type = 'edit';
                this.addModal.form = {
                    ownerName: row.ownerName,
                    ownerPhone: row.ownerPhone,
                    ownerAddress: row.ownerAddress,
                    id:row.id
                };
                this.addModal.show = true;
            },
            submitAdd(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                      this.disabledBtn = true;
                        let params = {
                            "ownerAddress": this.addModal.form.ownerAddress,
                            "ownerName": this.addModal.form.ownerName,
                            "ownerPhone": this.addModal.form.ownerPhone,
                            "ownerState": "IN_COOPERATION"  //合作状态 合作中:IN_COOPERATION 暂停中:PAUSE 停止合作:STOP_COOPERATION 默认合作中
                        };
                        if (this.addModal.type === 'edit'){
                            params.adOwnerId= this.addModal.form.id;
                        }
                        this.$http.post(`/yyht/v1/ad/owner/addOrUpdate`,params).then(res=>{
                          this.disabledBtn = false;
                            if (res.data.code === 0){
                                if (this.addModal.type === 'add'){
                                    this.$Message.success('添加成功');
                                } else if (this.addModal.type === 'edit'){
                                    this.$Message.success('修改成功');
                                }
                                this.addModal.show = false;
                                this.onSearch();

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
            showDelete(id){
                this.deleteModal.show = true;
                this.deleteModal.adOwnerId = id;
            },
            submitDelete(){
              this.disabledBtn = true;
              let id = this.deleteModal.adOwnerId;
              this.$http.post(`/yyht/v1/ad/owner/delete?adOwnerId=${id}`,{headers:{'Content-Type':'application/json'
                  }}).then(res=>{
                this.disabledBtn = false;
                  if (res.data.code === 0){
                      this.$Message.success('删除成功');
                      this.deleteModal.show = false;
                      this.onSearch()
                  } else {
                      this.$Message.error(res.data.msg);
                  }
              })
            },
          goDetail(row){
                this.$router.replace({name:'advertiserDetail',query:{id:row.id}})
            },
            restAddForm(){
                this.$refs['addForm'].resetFields();
                this.addModal.form={
                    name: '',
                    phone: '',
                    address: '',
                    id:''
                };
            },
          visibleChange(flag){
              if (flag === false){
                this.restAddForm();
              }
          }
        },
        mounted() {
            this.onSearch();
        }
    }
</script>

<style scoped lang="scss">
    @import "./advert-manage.scss";
    .page-content {
        width: 100%;
    }
</style>
