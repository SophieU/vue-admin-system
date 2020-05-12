<template>
  <Card>
    <div class="mb-15">
      <div class="mb-15 clearfix">
        <Form :model="searchModal" :label-width="100"  inline>
          <FormItem label="工单状态:">
            <Select v-model="searchModal.orderState" style="width:200px" transfer>
              <Option value="">全部</Option>
              <Option value="STAY_PAY">待付款</Option>
              <Option value="FINISH">已完成</Option>
            </Select>
          </FormItem>
          <FormItem label="服务网点：">
            <Select v-model="searchModal.repairStationId" @on-change="changeStation" style="width: 200px" transfer>
              <Option v-for="item in modalStation" :key="item.id" :value="item.id">{{item.name}}</Option>
            </Select>
          </FormItem>
          <FormItem label="服务师傅：">
            <Select v-model="searchModal.serviceUserId" style="width: 200px" transfer :not-found-text="'请先选择服务网点'">
              <Option v-for="item in modalTeach" :key="item.id" :value="item.id">{{item.trueName}}</Option>
            </Select>
          </FormItem>
<!--          <FormItem label="待分配师傅预约订单：" :label-width="150">-->
<!--            <Input v-model="searchModal.searchVyingOrder" style=width:200px></Input>-->
<!--          </FormItem>-->
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
<!--    <Modal-->
<!--      v-model="orderModal"-->
<!--      title="分配预约订单"-->
<!--      @on-ok="ok"-->
<!--      @on-cancel="cancel">-->
<!--      <Form :model="orderDistribute" :label-width="100"  inline>-->
<!--        <FormItem label="服务网点：">-->
<!--          <Select v-model="orderDistribute.repairStationId" @on-change="orderChangeStation" style="width: 200px" transfer>-->
<!--            <Option v-for="item in orderStation" :key="item.id" :value="item.id">{{item.name}}</Option>-->
<!--          </Select>-->
<!--        </FormItem>-->
<!--        <FormItem label="服务师傅：">-->
<!--          <Select v-model="orderDistribute.serviceUserId" style="width: 200px" transfer :not-found-text="'请先选择服务网点'">-->
<!--            <Option v-for="item in orderTeach" :key="item.id" :value="item.id">{{item.trueName}}</Option>-->
<!--          </Select>-->
<!--        </FormItem>-->
<!--      </Form>-->
<!--    </Modal>-->
  </Card>
</template>
<script>
  export default {
    name:'pre-order',
    data() {
      return {
        orderModal:false,//弹窗状态
        orderId:'',//弹窗需要传值的ID
        orderStation:[],//弹窗网点
        orderTeach:[],//弹窗师傅
        modalTeach:[],//服务师傅数组
        modalStation:[],//服务网点数组
        orderDistribute:{  //弹窗的Form
          repairStationId:'',
          serviceUserId:''
        },
        searchModal:{  //查询参数
          repairStationId:'',//服务网点ID
          orderState:'',
          serviceUserId:'',//服务师傅ID
          searchFrom:'YYHT'
        },
        loading:false,
        lists:[],
        columns:[
          {title:'订单号',key:'orderSn',align:'center',width:'200px',fixed:'left'},
          {title:'订单生成时间',key:'addTime',align:'center',width:'160px'},
          {title:'预约上门时间',key:'hopeDoorTime',align:'center',width:'160px'},
          {title:'预约地址',key:'repairAddress',align:'center',width:'160px'},
          {title:'预约状态显示',key:'',align:'center',width:'120px',render:(h,params)=>{
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
          {title:'商品名称',key:'productName',align:'center',width:'150px'},
          {title:'商品主图',key:'',align:'center',width:'150px',render:(h,params)=>{
              let src = params.row.productImage;
              return h('div',[
                h('img',{
                  attrs:{
                    src:src
                  },
                  style:{
                    height:'40px',
                    width:'40px'
                  }
                })
              ])
            }},
          {title:'商品总价格',key:'productAmount',align:'center',width:'150px'},
          {title:'服务人员名称',key:'repairServiceUserName',align:'center',width:'160px'},
          {title:'服务人员联系电话',key:'repairServiceUserPhone',align:'center',width:'160px'},
          {title:'服务价格',key:'serviceAmount',align:'center',width:'100px'},
          {title:'订单总价格',key:'orderAmount',align:'center',width:'100px'},
          // {title:'工单状态',key:'orderState;',align:'center',width:'100px'},
          {title:'支付单号',key:'paySn',align:'center',width:'200px'},
          {title:'支付方式',key:'payCode',align:'center',width:'100px',render:(h,params)=>{
              let val;
              switch (params.row.payCode) {
                case 'WX_XCX' : val = '微信小程序';
                      break;
                case 'WX_QR'  : val = '微信扫码';
                      break;
                default:val = ''
              }
              return h('span',val)
            }},
          {title:'支付状态',key:'payState',align:'center',width:'100px',render:(h,params)=>{
            let val;
            switch (params.row.payState) {
              case 'Y': val = '已支付';
              break;
              case 'N': val = '未支付';
              break;
              default: val = ''
            }
            return h('span',val)
            }},
          {title:'支付时间',key:'payTime',align:'center',width:'160px'},
          // {title:'备注',key:'withdrawRemark',align:'center',width:'150px'},
          // {title:'操作',align:'center',width:'100px',fixed:'right',render:(h,params)=>{
          //     let state = params.row.orderStateName;
          //     let _this = this;
          //     if(state == '已完成'){
          //       return h('span','')
          //     }else{
          //       return h('Button',{
          //         props:{
          //           type:'primary',
          //           size:'small',
          //         },
          //         on:{
          //           click(){
          //             _this.orderModal = true;
          //             _this.orderId = params.row.id;
          //           }
          //         }
          //       },'分配')
          //     }
          //   }},
        ],
        pageNo:1,
        pageSize:10,
        totalCount:0
      }
    },
    mounted(){
      this.getStation();
      this.getLists()
    },
    methods:{
      // ok(){
      //    let data = {
      //      "orderId":this.orderId,
      //      "serviceUserId":this.orderDistribute.serviceUserId
      //    }
      //    this.$http.post(`/yyht/v1/order/vyingOrder`,data).then(res=>{
      //      if(res.data.code == 0){
      //        this.$Message.success('预约订单分配成功！')
      //      }else{
      //        this.$Message.warning(res.data.msg)
      //      }
      //    })
      // },
      // cancel(){
      //
      // },
      // orderChangeStation(data){
      //   this.$http.get(`/yyht/v1/order/getWorkingServiceUserList?repairStationId=${data}`).then(res=>{
      //     if(res.data.code == 0){
      //       this.orderTeach = res.data.data;
      //     }else{
      //       this.$Message.warning(res.data.msg)
      //     }
      //   })
      // },
      changeStation(data){ //服务网点下拉选择改变获取该网点下的师傅
        this.$http.get(`/yyht/v1/order/getWorkingServiceUserList?repairStationId=${data}`).then(res=>{
          if(res.data.code == 0){
            this.modalTeach = res.data.data
          }else{
            this.$Message.warning(res.data.msg)
          }
        })
      },
      getStation(){ //获取弹窗网点下拉列表
        this.$http.get(`/yyht/v1/repair/station/select/list`)
          .then(res=>{
            if(res.data.code===0){
              // this.orderStation=res.data.data;
              this.modalStation = res.data.data;
            }else{
              console.log('网点下拉'+res.data.msg);
            }
          })
      },
      changePage(e){
        this.pageNo = e;
        this.getLists()
      },
      resetPhone(){
        this.searchModal = {  //查询参数
            repairStationId:'',//服务网点ID
            orderState:'',
            serviceUserId:'',//服务师傅ID
            searchFrom:'YYHT'
        };
        this.getLists()
      },
      getLists(){
        this.loading = true;
        this.$http.post(`/yyht/v1/order/getOrderForPage?pageNo=${this.pageNo}&pageSize=${this.pageSize}`,this.searchModal).then(res=>{
          if(res.data.code===0){
            let data = res.data.data;
            this.lists = data.list;
            this.loading = false;
            this.totalCount= data.totalCount
          }
        })
      },
      // dealWithDraw(name){
      //   this.btnLoading = true;
      //   this.$refs[name].validate((valid) => {
      //     if (valid) {
      //       let data = {
      //         "userWithdrawId":this.handleId,
      //         "orderState":this.handleForm.orderState,
      //         "thirdPaySn":this.handleForm.thirdPaySn,
      //         "withdrawRemark":this.handleForm.withdrawRemark,
      //       }
      //       this.$http.post(`/yyht/v1/user/withdraw/handle`,data).then(res=>{
      //         if(res.data.code===0){
      //           this.$Message.success('处理成功')
      //           this.getLists();
      //         }else{
      //           this.$Message.error('处理失败')
      //         }
      //         this.btnLoading = false;
      //         this.showModal = false
      //       })
      //     }else {
      //       this.btnLoading = false;
      //       this.$Message.error('表单未填写完整！')
      //     }
      //   })
      // }
    }
  }
</script>
<style lang="scss">
  .fund-inner {
    padding: 15px;
  }
</style>
