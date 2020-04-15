<template>
    <Card>
      <Spin fix v-show="loading == true">加载中...</Spin>
      <Table :columns="columns" :data="lists"></Table>
      <div class="pagination">
        <Page :current="pageNo" :total="totalCount"></Page>
      </div>
      <Modal title="处理提现申请" v-model="showModal">

      </Modal>
    </Card>
</template>
<script>

    export default {
        data() {
            return {
                loading:true,
                showModal:false,
                lists:[],
                columns:[
                  {title:'登录账号',key:'username',align:'center'},
                  {title:'用户类型',key:'userType',align:'center',render:(h,params)=>{
                      let map={
                        ADMIN:'超级管理员',
                        USER:'普通用户',
                        SERVICE_USER:'系统用户',
                        MERCHANT:'商户类型',
                      };
                      let text=map[params.row.userType];
                      return h('span',text)
                    }},
                  {title:'用户姓名',key:'trueName',align:'center'},
                  {title:'昵称',key:'nickName',align:'center'},
                  {title:'提现单号',key:'withdrawSn',align:'center'},
                  {title:'支付单号',key:'paySn',align:'center'},
                  {title:'金额',key:'amount',align:'center'},
                  {title:'时间',key:'createTime',align:'center'},
                  {title:'备注',key:'withdrawRemark',align:'center'},
                  {title:'操作',align:'center',render:(h,params)=>{
                      let state = params.row.payState === 'Y'
                      let _this = this
                      if(state){
                        return h('span','')
                      }else{
                        return h('Button',{
                          props:{
                            type:'primary',
                            size:'small',
                          },
                          on:{
                            click(){
                              let param = {
                                "userWithdrawId":params.row.id,
                                "payState":params.row.payState,
                                "thirdPaySn":params.row.withdrawSn,
                                "withdrawRemark":params.row.withdrawRemark,
                              }
                              _this.dealWithDraw(param)
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
          getLists(){
            let params = {
              pageNo:this.pageNo,
              pageSize:this.pageSize
            };
            this.$http.get(`/yyht/v1/user/withdraw/findUserWithdrawListPage`,{params:params}).then(res=>{
              if(res.data.code===0){
                let data = res.data.data;
                this.lists = data.list;
                this.loading = false;
                this.totalCount= data.totalCount
              }
            })
          },
        dealWithDraw(params){
            this.$http.post(`/yyht/v1/user/withdraw/handle`,params).then(res=>{
              if(res.data.code===0){
                this.$Message.success('处理成功')
                this.getLists()
              }else{
                this.$Message.error('处理失败')
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
