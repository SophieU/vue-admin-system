<template>
  <div>
    <div class="clearfix mb-15">
      <div class="pull-left">
        <Button @click="$emit('exportExcel','settleMeal')" type="primary">excel导出</Button>
      </div>
    </div>
    <div class="table-wrapper mb-15">
      <table class="native-table">
        <thead>
        <tr>
          <th>项目名称</th>
          <th>现金流水</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td>总计</td>
          <td>{{mealInfo.totalAmount}}</td>
        </tr>
        </tbody>
      </table>
    </div>
    <div class="mt-15">
      <h4 class="mb-15" slot="title">明细</h4>
      <div class="table-wrapper">
        <Table :columns="mealColumn" :data="mealLists"></Table>
        <div class="pagination">
          <Page :total="pageTotal"  show-elevator
                :current.sync="pageNo"
                @on-change="(page)=>getLists('page',page)"
                @on-page-size-change="(size)=>getLists('size',size)"
          ></Page>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import util from '../../../libs/util'
    export default {
        name: "settle-meal",
      props:['timeTab'],
      data(){
        return {
          filter:{
            startDate:'',
            endDate:'',
            orderSn:'',
            stationId:'',
            hasConfirmed:'',
            timeType:'1',
            timeScope:'1',
          },
          mealInfo:{
            totalAmount:0,
          },
          mealColumn:[
            {title:'订单编号',key:'orderSn',align:'center',width:140},
            {title:'套餐名称',key:'serviceName',align:'center',width:140},
            {title:'套餐售价',key:'servicePrice',align:'center',width:140},
            {title:'下单方式',key:'inputType',align:'center',width:140},
            {title:'服务网点',key:'stationName',align:'center',width:140},
            {title:'销售人员',key:'serviceUserName',align:'center',width:140},
            {title:'订单状态',key:'orderState',align:'center',width:140},
            {title:'创建日期',key:'createTime',align:'center',width:140},
            {title:'付款日期',key:'payTime',align:'center',width:140},
            {title:'支付方式',key:'payType',align:'center',width:140},
            {title:'交易号',key:'paySn',align:'center',width:140,render:(h,params)=>this.renderEmpty(h,params,'paySn')},
            {title:'状态',key:'hasConfirmed',align:'center',width:140},
            {title:'操作员',key:'confirmOperator',align:'center',width:140,render:(h,params)=>this.renderEmpty(h,params,'confirmOperator')},
            {title:'扎账日期',key:'confirmTime',align:'center',width:140,render:(h,params)=>this.renderEmpty(h,params,'confirmTime')},
            // {title:'操作',fixed:'right',width:100,align:'center',render:(h,params)=>{
            //     let _this = this;
            //     if(params.row.hasConfirmed==='未扎账'){
            //       return h('Button',{
            //         props:{
            //           type:'primary',
            //           size:'small'
            //         },
            //         on:{
            //           click(){
            //             let id = params.row.id;
            //             _this.sureSettle(id);
            //           }
            //         }
            //       },'确认扎账')
            //     }else{
            //       return h('span',null,'-')
            //     }

            //   }},
          ],
          mealLists: [ ],
          pageTotal:0,
          pageSize:10,
          pageNo:1,
        }
      },
      mounted(){
          this.getLists('page',1,null);
          this.getTotal();
      },
      methods:{
          //确认扎账
        // sureSettle(id){
        //   this.$Message.loading('扎账中...');
        //   this.$http.post(`/service/order/cash/financial/confirm?id=${id}`)
        //     .then(res=>{
        //       this.$Message.destroy();
        //       if(res.data.code===0){
        //         this.$Message.success('扎账成功')
        //       }else{
        //         this.$Message.error(res.data.msg);
        //       }
        //     })
        // },
          //表格无值点位
        renderEmpty(h,params,key){
          if(!params.row[key]){
            return h('span',{},'-')
          }else{
            return h('span',{},params.row[key])
          }
        },
          //确定筛选
        sureFilter(filter){
          if(filter.startDate){
            filter.timeType=2;
          }else{
            filter.timeType=1;
            filter.timeScope=this.filter.timeScope;
          }
          delete filter.dateRange;
          this.filter=filter;
          this.pageNo=1;
          this.pageSize=10;
          this.getTotal(this.filter);
          this.getLists('page',1,this.filter);
        },
        //获取明细
        getLists(pageType,num,filter){
          let query=`pageNo=${this.pageNo}&pageSize=${this.pageSize}`;
          if(pageType==='page'){
            query=`pageNo=${num}&pageSize=${this.pageSize}`;
          }else if(pageType==='size'){
            query=`pageNo=${this.pageNo}&pageSize=${num}`;
          }
          let postParam;
          if(filter){
            postParam=filter;
          }else{
            postParam=this.filter;
          }
          postParam=util.formatterParams(postParam);
          this.$http.post(`/service/order/cash/financial/list?${query}&${postParam}`).then(res=>{
            if(res.data.code===0){
              let data = res.data.data;
              this.mealLists=data.list;
              this.pageTotal = data.totalCount;
              this.pageSize=data.pageSize;
              this.pageNo=data.pageNo;
            }
          })
        },
        //获取统计
        getTotal(filter){
          let postParam;
          if(filter){
            postParam=filter;
          }else{
            postParam=this.filter;
          }
          postParam=util.formatterParams(postParam);
          this.$http.post(`/service/order/cash/financial/count?${postParam}`)
            .then(res=>{
              if(res.data.code===0){
                let data= res.data.data;
                this.mealInfo=data;
              }
            })
        }
      },
      watch:{
        timeTab:{
          handler(newVal,oldVal){
            console.log(newVal)
            this.filter.timeType=newVal.timeType;
            this.filter.timeScope=newVal.timeScope;
            this.getLists(null,null,this.filter);
            this.getTotal(this.filter);
          },
          deep:true
        },
      }
    }
</script>

<style scoped>

</style>
