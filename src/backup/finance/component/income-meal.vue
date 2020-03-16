<template>
<div>
  <div class="clearfix mb-15">
    <div class="pull-right">
      <Button @click="$emit('exportExcel','meal')" type="primary">excel导出</Button>
    </div>
  </div>
  <div class="mb-15">
    <table class="native-table">
      <thead>
      <tr>
        <th>项目名称</th>
        <th>收入</th>
        <th>员工结算</th>
        <th>平台佣金</th>
        <th>辅料成本</th>
        <th>辅料亏损</th>
        <th>收益</th>
      </tr>
      </thead>
      <tbody>
      <tr>
        <td>数目</td>
        <td>{{totalInfo.orderAmount}}</td>
        <td>{{totalInfo.employeeCommission}}</td>
        <td>{{totalInfo.platformCommission}}</td>
        <td>{{totalInfo.materialEarning}}</td>
        <td>{{totalInfo.materialCheckEarning}}</td>
        <td>{{totalInfo.serviceEarning}}</td>
      </tr>
      </tbody>
    </table>
  </div>
  <div class="mb-15">
    <h4 class="mb-15">明细</h4>
    <Table :columns="typeColumn" :data="typeLists"></Table>
    <div class="pagination">
      <Page :total="pageTypeTotal" :current.sync="pageTypeNo"
            @on-change="(page)=>getTypeLists('page',page)"
      ></Page>
    </div>
  </div>
  <div class="table-wrapper">
    <h4 class="mb-15">统计</h4>
    <Table :columns="detailColumn" :data="detailLists"></Table>
    <div class="pagination">
      <Page :total="detailTotal" :page-size="detailPageSize" show-elevator :current.sync="detailPageNo"
            @on-change="(page)=>getDetailLists('page',page)"
            @on-page-size-change="(size)=>getDetailLists('size',size)"
      ></Page>
    </div>
  </div>
</div>
</template>

<script>
    import util from "../../../libs/util";

  export default {
        name: "income-total",
      props:['timeTab'],
      data(){
          return {
            totalInfo:{},
            typePageNo:1,
            typePageSize:10,
            typePageTotal:0,
            pageTypeNo:1,
            pageTypeTotal:0,
            typeLists:[],
            typeColumn:[
              {title:'套餐名称',key:'name',align:'center'},
              {title:'销售收入',key:'orderAmount',align:'center'},
              {title:'员工结算',key:'employeeCommission',align:'center'},
              {title:'平台佣金',key:'platformCommission',align:'center'},
              {title:'销售收益',key:'earning',align:'center'},
            ],
            detailLists:[],
            detailColumn:[
              {title:'套餐名称',key:'serviceName',align:'center'},
              {title:'服务网点',key:'stationName',align:'center'},
              {title:'销售收入',key:'orderAmount',align:'center'},
              {title:'员工结算',key:'employeeCommission',align:'center'},
              {title:'平台佣金',key:'platformCommission',align:'center'},
              {title:'销售收益',key:'earning',align:'center'},
            ],
            detailPageNo:1,
            detailPageSize:10,
            detailTotal:0,
            filter:{
              timeType:1,
              timeScope:1,
            }
          }
      },

      methods:{
        getTotalInfo(filter){
          let postParam = {};
          if(filter){
            postParam=filter
          }else{
            postParam=this.filter;
          }
          postParam=util.formatterParams(postParam)
          this.$http.post(`/service/earning/count?${postParam}`)
            .then(res=>{
              if(res.data.code===0){
                let data=res.data.data;
                this.totalInfo=data;
              }
            })
        },
        getTypeLists(pageType,num,filter){
          if(pageType==='page'){
            this.typePageNo=num;
          }
          let query=`pageNo=${this.typePageNo}&pageSize=${this.typePageSize}`;
          let postParam;
          if(filter){
            postParam=filter;
          }else{
            postParam=this.filter;
          }
          postParam=util.formatterParams(postParam)
          this.$http.post(`/service/earning/category/count?${query}&${postParam}`)
            .then(res=>{
              if(res.data.code===0){
                let data = res.data.data;
                this.typePageNo=data.pageNo;
                this.pageTypeTotal=data.totalCount;
                this.typeLists=data.list;
              }
            })
        },
        getDetailLists(pageType,num,filter){
          if(pageType==='page'){
            this.detailPageNo=num;
            // query=`pageNo=${num}&pageSize=${this.detailPageSize}`;
          }else if(pageType==='size'){
            this.detailPageSize=num;
            // query=`pageNo=${this.detailPageNo}&pageSize=${num}`;
          }
          let query=`pageNo=${this.detailPageNo}&pageSize=${this.detailPageSize}`;

          let postParam;
          if(filter){
            postParam=filter;
          }else{
            postParam=this.filter;
          }
          postParam=util.formatterParams(postParam)
          this.$http.post(`/service/earning/list?${query}&${postParam}`)
            .then(res=>{
              if(res.data.code===0){
                let data = res.data.data;
                this.detailPageNo=data.pageNo;
                // this.detailPageSize=data.pageSize;
                this.detailTotal=data.totalCount;
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
          this.detailPageNo=1;
          this.detailPageSize=10;
          this.typePageNo=1;
          this.getTotalInfo(filter);
          this.getTypeLists(null,null,filter);
          this.getDetailLists(null,null,filter);
        }
      },
      mounted(){
        this.getTotalInfo();
        this.getTypeLists();
        this.getDetailLists();
      },
      watch:{
        timeTab:{
          handler(newVal,oldVal){
            this.filter.timeType=newVal.timeType;
            this.filter.timeScope=newVal.timeScope;
            this.getTotalInfo();
            this.getTypeLists();
            this.getDetailLists();
          },
          deep:true
        },
      }
    }
</script>

<style scoped>

</style>
