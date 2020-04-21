<template>
  <div>
    <Card class="mb-15">
      <Spin fix v-show="loading == true">加载中...</Spin>
      <div style="margin-bottom: 8px">
        <Button type="primary" @click="feeModal = true">业务结算</Button>
      </div>
      <Table :columns="columns" :data="lists"></Table>
      <div class="pagination">
        <Page :total="totalCount" :current.sync="pageNo" @on-change="(page)=>getLists(page)"></Page>
      </div>
      <Modal
        v-model="feeModal"
        :mask-closable="false"
        title="业务结算">
        <Form ref="formFee" :model="feeModel" :rules="feeRule" :label-width="100" inline>
          <FormItem label="系统结算" prop="amount">
            <Input v-model="feeModel.amount"></Input>
          </FormItem>
          <FormItem label="操作的业务ID" prop="businessId">
            <Input v-model="feeModel.businessId"></Input>
          </FormItem>
        </Form>
        <div slot="footer">
          <Button @click="cancle('formFee')">取消</Button>
          <Button :loading="loadingSend" @click="saveFee('formFee')" type="primary">保存</Button>
        </div>
      </Modal>
    </Card>
  </div>
</template>

<script>
  export default {
    name: "staff-control",
    data(){
      return{
        loadingSend:false,
        feeModal:false,//弹窗的状态控制
        feeModel:{ //弹窗数据
          userId:'',
          amount:'',
          businessId:'',
          userAccountChangeType:"SYSTEM_SETTLE",
          userActionType:"BUSINESS_INCOME"
        },
        feeRule:{ //弹窗数据校验规则
          amount:[{required:true,message:'请输入系统结算金额',trigger:'blur'}],
          businessId:[{required:true,message:'请输入操作业务ID',trigger:'blur'}],
        },
        userMobile:'', //搜索被邀请人电话
        columns:[
          {title:'业务行为',key:'actionTypeName',align:'center'},
          {title:'业务描述',key:'changeIntro',align:'center'},
          {title:'变动金额',align:'center',render:(h,params)=>{
              let changeType = params.row.changeType=='-1'?'-':'+'
              let color = changeType=='-'?'#19be6b':'#ed4014'
              let num = params.row.changeNum
              return h('span',{style:{color}},changeType+num)
            }},
          {title:'余额',key:'surplusNum',align:'center'},
          {title:'时间',key:'createTime',align:'center'},
          {title:'钱包状态',align:'center',render:(h,params)=>{
              let state = params.row.state==='1'?'正常':'冻结中'
              let color = state==='正常'?'#2d8cf0':'#ed4014'
              return h('span',{style:{color}},state)
            }},
        ],
        lists:[],
        pageNo:1,
        pageSize:10,
        loading:true,
        totalCount:0,
      }
    },
    mounted(){
      this.feeModel.userId= this.$route.query.id;
      this.getLists();
    },
    methods:{
      cancle(name){
        this.feeModal = false;
        this.feeModel = {
          userId:this.$route.query.id,
          amount:'',
          businessId:'',
          userAccountChangeType:"SYSTEM_SETTLE",
          userActionType:"BUSINESS_INCOME"
        };
        this.$refs[name].resetFields();
      },
      saveFee(name){  //弹窗保存
        this.$refs[name].validate((valid)=>{
          if(valid){
             this.$http.post(`/yyht/v1/user/changeUserAccount`,this.feeModel).then(res=>{
               if(res.data.code == 0){
                 this.getLists();
                 this.cancle();
                 this.$Message.success('保存成功！')
               }
             })
          }else{
            this.$Message.error('表单未填写完整！')
          }
        })
      },
      getLists(page){
        this.loading=true;
        if(page){this.pageNo= page}
        let params = {
          pageNo:this.pageNo,
          pageSize:this.pageSize,
          userId:this.feeModel.userId,
        }
        this.$http.get(`/yyht/v1/user/getUserAccountLogPageList`,{params:params}).then(res=>{
          this.loading=false;
          if(res.data.code===0){
            let data = res.data.data;
            this.lists=data.list
            this.totalCount=data.totalCount;
          }
        })
      }
    },

  }
</script>

<style scoped>

</style>
