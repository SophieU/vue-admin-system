<template>
<div>
  <div class="clearfix mb-15">
    <div class="pull-right">
      <Button @click="$emit('exportExcel','order')" type="primary">excel导出</Button>
    </div>
  </div>
  <div class="mb-15">
    <table class="native-table">
      <thead>
      <tr>
        <th>项目名称</th>
        <th>工单收入</th>
        <th>员工结算</th>
        <th>平台佣金</th>
        <th>辅料成本</th>
        <th>辅料亏损</th>
        <th>服务收益</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td>数目</td>
        <td>{{earningCount.orderAmount}}</td>
        <td>{{earningCount.employeeCommission}}</td>
        <td>{{earningCount.platformCommission}}</td>
        <td>{{earningCount.materialEarning}}</td>
        <td>{{earningCount.materialCheckEarning}}</td>
        <td>{{earningCount.serviceEarning}}</td>
      </tr>
      </tbody>
    </table>
  </div>
  <div class="mb-15">
    <h5 class="mb-15">明细</h5>
    <div class="table-wrapper">
      <table class="native-table">
        <thead>
        <tr>
          <th>服务项目</th>
          <th>工单总额</th>
          <th>员工佣金</th>
          <th>平台佣金</th>
          <th>辅料成本</th>
          <th>辅料亏损</th>
          <th>服务收益</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item,index) in categoryEarningCountList" :key="index">
          <td>{{item.name}}</td>
          <td>{{item.orderAmount}}</td>
          <td>{{item.employeeCommission}}</td>
          <td>{{item.platformCommission}}</td>
          <td>{{item.materialEarning}}</td>
          <td>{{item.materialCheckEarning}}</td>
          <td>{{item.serviceEarning}}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
  <div class="table-wrapper">
    <h4 class="mb-15">统计</h4>
    <Table :columns="detailColumn" :data="detailLists"></Table>
    <div class="pagination">
      <Page :total="totalCount" show-elevator :current.sync="pageNo"
            @on-change="(page)=>getDetailLists('page',page)"
            @on-page-size-change="(size)=>getDetailLists('size',size)"
      ></Page>
    </div>
  </div>
</div>
</template>

<script>
  import util from '../../../libs/util';
    export default {
        name: "income-total",
      props:['timeTab'],
      data(){
        return {
          earningCount:{},
          categoryEarningCountList:{},
          detailColumn:[
            {title:'服务项目',key:'repairCategoryName',align:'center'},
            {title:'服务网点',key:'departmentName',align:'center'},
            {title:'工单收入',key:'orderAmount',align:'center'},
            {title:'员工结算',key:'employeeCommission',align:'center'},
            {title:'平台佣金',key:'platformCommission',align:'center'},
            {title:'辅料成本',key:'materialEarning',align:'center'},
            {title:'辅料亏损',key:'materialCheckEarning',align:'center'},
            {title:'服务收益',key:'serviceEarning',align:'center'},
          ],
          detailLists:[],
          pageNo:1,
          pageSize:10,
          totalCount:0,
          filter:{
            timeType:1,
            timeScope:1,
          }
        }
      },
      mounted(){
        this.getInfo();
        this.getDetailLists();
      },
      methods:{
        getInfo(filter){
          let postParam = {};
          if(filter){
            postParam=filter
          }else{
            postParam=this.filter;
          }
          postParam=util.formatterParams(postParam);
          this.$http.post(`/order/earning/count?${postParam}`)
            .then(res=>{
              if(res.data.code===0){
                let data=res.data.data;
                this.earningCount=data.earningCount;
                this.categoryEarningCountList=data.categoryEarningCountList;
              }
            })
        },
        getDetailLists(pageType,num,filter){
          let query=`pageNo=${this.pageNo}`;
          if(pageType==='page'){
            query=`pageNo=${num}&pageSize=${this.pageSize}`;
          }
          let postParam;
          if(filter){
            postParam=filter;
          }else{
            postParam=this.filter;
          }
          postParam=util.formatterParams(postParam);
          this.$http.post(`/order/earning/list?${query}&${postParam}`)
            .then(res=>{
              if(res.data.code===0){
                let data = res.data.data;
                this.pageNo=data.pageNo;
                this.pageSize=data.pageSize;
                this.totalCount=data.totalCount;
                this.detailLists=data.list;
              }
            })
        },
        sureFilter(filter){
          // if(filter.startDate.length>0){
          //   filter.timeType=2;
          // }else{
          //   filter.timeType=1;
          //   filter.timeScope=this.filter.timeScope;
          // }
          // delete filter.dateRange;
          this.filter=filter;
          this.pageNo=1;
          this.pageSize=10;
          this.getInfo(filter);
          this.getDetailLists(null,null,filter);
        }
      },
      watch:{
        timeTab:{
          handler(newVal,oldVal){
            this.filter.timeType=newVal.timeType;
            this.filter.timeScope=newVal.timeScope;
            this.getInfo(this.filter);
            this.getDetailLists(null,null,this.filter);
          },
          deep:true
        },
      }
    }
</script>

<style scoped>

</style>
