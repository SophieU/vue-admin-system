<template>
    <Card>
      <div class="mb-15">
        <div class="mb-15 clearfix">
          <Form :model="searchModal" :label-width="100"  inline>
            <FormItem label="登录手机号码">
            <Input v-model="searchModal.username" style=width:200px></Input>
          </FormItem>
            <FormItem label="提现订单状态">
              <Select v-model="searchModal.orderState" style="width:200px" transfer>
                <Option value="HANDING">处理中</Option>
                <Option value="FINISH">已完成</Option>
                <Option value="FAIL">处理失败</Option>
              </Select>
            </FormItem>
            <FormItem label="支付单号">
              <Input v-model="searchModal.paySn" style=width:200px></Input>
            </FormItem>
            <FormItem label="提现单号">
              <Input v-model="searchModal.withdrawSn" style=width:200px></Input>
            </FormItem>
            <FormItem label="">
              <Button type="primary" @click="getLists">查询</Button>
              <Button type="default" @click="resetPhone">重置</Button>
            </FormItem>
          </Form>
        </div>
      </div>
      <Spin fix v-show="loading == true">加载中...</Spin>
      <Table :columns="columns" :data="lists"></Table>
      <div class="pagination">
        <Page :current="pageNo" :total="totalCount" @on-change="changePage"></Page>
      </div>
      <Modal title="处理提现申请" v-model="showModal" @on-visible-change="chang_status">
        <Form :model="handleForm" :label-width="120" :rules="handleRule" ref="handleRef" inline>
          <FormItem label="请选择处理结果：" prop="orderState">
            <Select v-model="handleForm.orderState" style="width:200px" transfer>
              <Option value="FINISH">提现成功</Option>
              <Option value="FAIL">提现失败</Option>
            </Select>
          </FormItem>
          <FormItem label="第三方支付单号：" prop="thirdPaySn">
            <Input v-model="handleForm.thirdPaySn" style=width:200px></Input>
          </FormItem>
          <FormItem label="提现备注：" prop="withdrawRemark">
            <Input v-model="handleForm.withdrawRemark" style=width:200px></Input>
          </FormItem>
        </Form>
        <div slot="footer">
          <Button type="default" @click="showModal = false">取 消</Button>
          <Button type="primary" @click="dealWithDraw('handleRef')" :loading="btnLoading">完成</Button>
        </div>
      </Modal>
    </Card>
</template>
<script>
    export default {
      data() {
            return {
              handleId:'',
              btnLoading:false,
                handleRule:{
                  orderState:[{required:true,message:'请选择处理结果',trigger:'change'}],
                  thirdPaySn:[{required:true,message:'请输入第三方支付账号',trigger:'blur'}],
                  withdrawRemark:[{required:true,message:'请输入提现备注',trigger:'blur'}]
                },
                handleForm:{
                  orderState:'',
                  thirdPaySn:'',
                  withdrawRemark:''
                },
                searchModal:{  //查询参数
                  username:'',
                  orderState:'',
                  paySn:'',
                  withdrawSn:'',
                  withdrawTime:''
                },
                loading:true,
                showModal:false,
                lists:[],
                columns:[
                  {title:'登录账号',key:'username',align:'center',width:'150px',fixed:'left'},
                  {title:'用户类型',key:'userTypeName',align:'center',width:'150px',fixed:'left'},
                  // {title:'用户姓名',key:'trueName',align:'center',width:'150px',fixed:'left'},
                  {title:'用户昵称',key:'nickName',align:'center',width:'150px',fixed:'left'},
                  {title:'提现单号',key:'withdrawSn',align:'center',width:'250px'},
                  {title:'支付单号',key:'paySn',align:'center',width:'250px'},
                  {title:'提现金额',key:'amount',align:'center',width:'150px'},
                  {title:'申请时间',key:'createTime',align:'center',width:'250px'},
                  {title:'处理状态',key:'',align:'center',width:'150px',render:(h,params)=>{
                    let style = {};
                    switch (params.row.orderStateName) {
                      case '处理中' :style = {'color':'green','fontWeight':'bold'};
                      break;
                      case '已完成' :style = {'color':'rgb(45, 140, 240)','fontWeight':'bold'};
                      break;
                      default:style = {'color':'red','fontWeight':'bold'};
                    }
                    return h('span',{
                      style:style
                    },params.row.orderStateName)
                    }},
                  {title:'提现处理时间',key:'withdrawTime',align:'center',width:'250px'},
                  {title:'备注',key:'withdrawRemark',align:'center',width:'150px'},
                  {title:'操作',align:'center',width:'150px',fixed:'right',render:(h,params)=>{
                      let state = params.row.orderStateName;
                      let _this = this;
                      if(state == '已完成'){
                        return h('span','')
                      }else{
                        return h('Button',{
                          props:{
                            type:'primary',
                            size:'small',
                          },
                          on:{
                            click(){
                              _this.showModal = true;
                              _this.handleId = params.row.id;
                            }
                          }
                        },'处理')
                      }
                    }},
                ],
              pageNo:1,
              pageSize:10,
              totalCount:0
            }
        },
      mounted(){
          this.getLists()
      },
      methods:{
        chang_status(data){
          this.handleForm = {
               orderState:'',
              thirdPaySn:'',
              withdrawRemark:''
          }
          this.$refs['handleRef'].resetFields();
        },
        changePage(e){
          this.pageNo = e;
          this.getLists()
        },
        resetPhone(){
          this.searchModal = {  //查询参数
              username:'',
              orderState:'',
              paySn:'',
              withdrawSn:'',
              withdrawTime:''
          }
          this.getLists()
        },
          getLists(){
            this.loading = true;
            this.$http.post(`/yyht/v1/user/withdraw/findUserWithdrawListPage?pageNo=${this.pageNo}&pageSize=${this.pageSize}`,this.searchModal).then(res=>{
              if(res.data.code===0){
                let data = res.data.data;
                this.lists = data.list;
                this.loading = false;
                this.totalCount= data.totalCount
              }
            })
          },
        dealWithDraw(name){
          this.btnLoading = true;
          this.$refs[name].validate((valid) => {
            if (valid) {
              let data = {
                "userWithdrawId":this.handleId,
                "orderState":this.handleForm.orderState,
                "thirdPaySn":this.handleForm.thirdPaySn,
                "withdrawRemark":this.handleForm.withdrawRemark,
              }
              this.$http.post(`/yyht/v1/user/withdraw/handle`,data).then(res=>{
                if(res.data.code===0){
                  this.$Message.success('处理成功')
                  this.getLists();
                }else{
                  this.$Message.error('处理失败')
                }
                this.btnLoading = false;
                this.showModal = false
              })
            }else {
              this.btnLoading = false;
               this.$Message.error('表单未填写完整！')
            }
          })
        }
      }
    }
</script>
<style lang="scss">
    .fund-inner {
        padding: 15px;
    }
</style>
