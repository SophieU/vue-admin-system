<template>
  <div>
    <div class="clearfix mb-15">
      <div class="pull-left">
        <ButtonGroup>
          <Button @click="viewType='1'" :type="viewType==='1'?'primary':'default'">本月</Button>
          <Button @click="viewType='2'" :type="viewType==='2'?'primary':'default'">前三月</Button>
          <Button @click="filterDraw=true" :type="viewType==='3'?'primary':'default'" >筛选</Button>
        </ButtonGroup>
      </div>
      <div class="pull-right">
        <Button @click="exportExcel" type="primary">excel导出</Button>
      </div>
    </div>
    <div class="table-wrapper mb-15">
      <h4 class="mb-15">总计</h4>
      <table class="native-table">
        <thead>
        <tr>
          <th>总收入</th>
          <th>员工结算</th>
          <th>e维修佣金</th>
          <th>套餐佣金</th>
          <th>中心总收益</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <!--2018-11-19 测试确定，项目名称写死为“数目” {{earningCount.name}}-->
          <td>{{totalCount.orderAmount}}</td>
          <td>{{totalCount.employeeCommission}}</td>
          <td>{{totalCount.orderCommission}}</td>
          <td>{{totalCount.discountServiceCommission}}</td>
          <td>{{totalCount.earning}}</td>
        </tr>
        </tbody>
      </table>
    </div>
    <div class="mb-15 table-wrapper">
      <h4 class="mb-15">工单收入</h4>
      <table class="native-table">
        <thead>
        <tr>
          <th>项目名称</th>
          <th>已付工单总数</th>
          <th>工单应收</th>
          <th>已付工单优惠</th>
          <th>工单实收</th>
          <th>员工结算</th>
          <th>e维修佣金</th>
          <th>中心服务收益</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <!--2018-11-19 测试确定，项目名称写死为“数目” {{earningCount.name}}-->
          <td>工单收入</td>
          <td>{{repairOrderCount.orderNum}}</td>
          <td>{{(repairOrderCount.orderAmount+repairOrderCount.discountAmount).toFixed(2)}}</td>
          <td>{{repairOrderCount.discountAmount}}</td>
          <td>{{repairOrderCount.orderAmount}}</td>
          <td>{{repairOrderCount.employeeCommission}}</td>
          <td>{{repairOrderCount.platformCommission}}</td>
          <td>{{repairOrderCount.earning}}</td>
        </tr>
        </tbody>
      </table>
    </div>
    <div class="mb-15 table-wrapper">
      <h4 class="mb-15">套餐销售收入</h4>
      <table class="native-table">
        <thead>
        <tr>
          <th>项目名称</th>
          <th>已付套餐总数</th>
          <th>已付套餐收入</th>
          <th>员工结算</th>
          <th>套餐佣金</th>
          <th>中心套餐收益</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <!--2018-11-19 测试确定，项目名称写死为“数目” {{earningCount.name}}-->
          <td>套餐销售收入</td>
          <td>{{serviceOrderCount.orderNum}}</td>
          <td>{{serviceOrderCount.orderAmount}}</td>
          <td>{{serviceOrderCount.employeeCommission}}</td>
          <td>{{serviceOrderCount.platformCommission}}</td>
          <td>{{serviceOrderCount.earning}}</td>
        </tr>
        </tbody>
      </table>
    </div>
    <div class="mb-15 table-wrapper">
      <h4 class="mb-15">服务网点统计</h4>
      <Table :columns="columns" :data="serviceLists"></Table>
      <div class="pagination">
        <Page  :total="totalServiceCount" :current.sync="pageNo" :page-size="pageSize" show-elevator
              @on-change="(page)=>getServiceList('page',page)"
              @on-page-size-change="(size)=>getServiceList('size',size)"
        />
      </div>
    </div>
    <!--概览筛选-->
    <Drawer title="网点筛选" v-model="filterDraw" width="450">
      <div class="clearfix mb-15">
        <div class="pull-left">
          <Button @click="clearFilter()">清空筛选条件</Button>
        </div>
        <div class="pull-right">
          <Button @click="sureFilter()" type="primary">确定</Button>
        </div>
      </div>
      <i-form ref="totalFilterForm" :model="filter" label-position="top">
        <form-item label="服务网点" prop="stationId">
          <Select v-model="filter.stationId">
            <Option v-for="item in stationLists" :key="item.id" :value="item.id">{{item.name}}</Option>
          </Select>
        </form-item>
        <form-item label="付款时间"  prop="dateRange">
          <DatePicker @on-change="(val)=>filterDateChange(val)" v-model="dateRange" type="daterange" style="width:100%;"></DatePicker>
        </form-item>
      </i-form>
    </Drawer>
  </div>
</template>

<script>
  import util from '../../../libs/util';
    export default {
        name: "finance-total",
      props:['stationLists'],
      data(){
          return{
            viewType:'1', //概况时间：本月-1,前三月-2,筛选-3
            totalCount:{},
            repairOrderCount:{},
            serviceOrderCount:{},
            serviceLists:[],
            pageNo:1,
            pageSize:10,
            totalServiceCount:0,
            columns:[
              {title:'网点名称',key:'stationName',align:'center',render:(h,params)=>{
                  let noticeStr='(未分配的网点)';
                  let stationName=params.row.stationName;
                  if(stationName===noticeStr){
                    return h('span',{style:{color:'#f00'}},stationName)
                  }
                  return h('span',stationName)
                }},
              {title:'总收入',key:'orderAmount',align:'center'},
              {title:'员工结算',key:'employeeCommission',align:'center'},
              {title:'已付工单数',key:'orderNum',align:'center'},
              {title:'e维修佣金',key:'orderPlatformCommission',align:'center'},
              {title:'已付套餐数',key:'serviceOrderNum',align:'center'},
              {title:'套餐佣金',key:'serviceOrderPlatformCommission',align:'center'},
              {title:'中心总收益',key:'earning',align:'center'},
            ],
            filter:{ //筛选条件
              stationId:'',
              startDate:'',
              endDate:'',
              timeType:'1',
              timeScope:'1',
            },
            filterDraw:false,
            dateRange:[],
          }
      },
      mounted(){
        this.getInfo();
        this.getServiceList();
      },
      methods:{
        //筛选时间范围格式化
        filterDateChange(val){
            this.filter.startDate=val[0];
            this.filter.endDate=val[1];
        },
          //详情
        getInfo(filter){
          let postParam;
          if(filter){
            postParam=filter;
          }else{
            postParam=this.filter;
          }
          postParam=util.formatterParams(postParam);
          this.$http.post(`/simple/financial/count?${postParam}`)
            .then(res=>{
              if(res.data.code===0){
                let data = res.data.data;
                this.totalCount=data.totalCount;
                this.repairOrderCount=data.repairOrderCount;
                this.serviceOrderCount=data.serviceOrderCount;
              }
              this.filterDraw=false;
            })

        },
        //列表
        getServiceList(pageType,num,filter){
          let param;
          if(pageType==='page'){
            param=`pageNo=${num}&pageSize=${this.pageSize}`;
            this.pageNo=num;
          }else if(pageType==='size'){
            param=`pageNo=${this.pageNo}&pageSize=${num}`;
            this.pageSize=num;
          }else{
            param=`pageNo=${this.pageNo}&pageSize=${this.pageSize}`;
          }
          let postParam;
          if(filter){
            postParam=filter;
          }else{
            postParam=this.filter;
          }
          postParam=util.formatterParams(postParam);
          this.$http.post(`/simple/financial/list?${param}&${postParam}`)
            .then(res=>{
              if(res.data.code===0){
                let data = res.data.data;
                this.serviceLists=data.list;
                this.totalServiceCount=data.totalCount;
              }
              this.filterDraw=false;
            })
        },
        sureFilter(){
          let filter = this.filter;
          if(filter.startDate){
            //筛选时间
            this.filter.timeType="2";
            this.filter.timeScope="";
            this.viewType='3';
          }
          this.pageNo=1;
          this.pageSize=10;
          this.getInfo(filter);
          this.getServiceList(null,null,filter);
        },
        clearFilter(){
          this.filter={  //筛选条件
              stationId:'',
              startDate:'',
              endDate:'',
              timeType:'1',
              timeScope:'1',
          };
          this.viewType='1';
          this.dateRange=[];
          this.pageNo=1;
          this.pageSize=10;
          this.getInfo(this.filter);
          this.getServiceList(null,null,this.filter);
        },
        exportExcel(){
          let url='/simple/financial/export';
          let filter=util.formatterParams(this.filter);
          this.$http.post(`${url}?${filter}`,null,{responseType:'blob'})
            .then(res=>{
              util.downloadExcel(res);
            })
        }
      },
      watch:{
        viewType(newVal){
          if(newVal!=='3'){
            // 本月，前三月
            this.filter.timeType=1;
            this.filter.timeScope=newVal;
            this.dateRange=[];
            this.filter.startDate='';
            this.filter.endDate='';
            this.getInfo(this.filter);
            this.getServiceList(null,null,this.filter);
          }

        },
      }
    }
</script>

<style scoped>

</style>
