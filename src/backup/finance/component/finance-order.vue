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
    <div class="mb-15 table-wrapper">
      <table class="native-table">
        <thead>
        <tr>
          <th>项目名称</th>
          <th>已付工单总数</th>
          <th>已付工单收入</th>
          <th>员工结算</th>
          <th>e维修佣金</th>
          <th>中心服务收益</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <!--2018-11-19 测试确定，项目名称写死为“数目” {{earningCount.name}}-->
          <td>工单收入总计</td>
          <td>{{earningCount.orderNum}}</td>
          <td>{{earningCount.orderAmount}}</td>
          <td>{{earningCount.employeeCommission}}</td>
          <td>{{earningCount.platformCommission}}</td>
          <td>{{earningCount.serviceEarning}}</td>
        </tr>
        </tbody>
      </table>
    </div>

    <div class="table-wrapper mb-15">
      <Table :columns="repairColumns" :data="categoryEarningCountList"></Table>
    </div>
    <div class="mb-15 table-wrapper">
      <h4 class="mb-15">服务网点统计</h4>
      <Table :columns="serviceColumns" :data="serviceLists"></Table>
    </div>
    <div class="mt-15">
      <h4 class="mb-15" slot="title">明细</h4>
      <div class="table-wrapper">
        <Table :columns="detailColumn" :data="detailLists"></Table>
        <div class="pagination">
          <Page :total="pageTotal" show-elevator
                :current.sync="pageNo"
                @on-change="(page)=>getOrderLists('page',page)"
                @on-page-size-change="(size)=>getOrderLists('size',size)"
          ></Page>
        </div>
      </div>
    </div>
    <!-- 工单筛选 -->
    <Drawer title="工单筛选" v-model="filterDraw" width="450">
      <div class="clearfix mb-15">
        <div class="pull-left">
          <Button @click="clearFilter()">清空筛选条件</Button>
        </div>
        <div class="pull-right">
          <Button @click="sureFilter()" type="primary">确定</Button>
        </div>
      </div>
      <i-form ref="orderFilterForm" :model="filter" label-position="top">

        <FormItem label="服务分类">
          <Select v-model="filter.repairCategoryParentId" @on-change="(id)=>firstTypeChange(id)">
            <Option v-for="item in repairTypeFirst" :key="item.id" :value="item.id">{{item.name}}</Option>
          </Select>
        </FormItem>
        <FormItem label="服务项目"  prop="repairCategoryId">
          <Select not-found-text="列表为空，请先选择服务分类" v-model="filter.repairCategoryId">
            <Option v-for="repair in repairFilterLists" :key="repair.id" :value="repair.id">{{repair.name}}</Option>
          </Select>
        </FormItem>
        <form-item label="服务人员" prop="serverName">
          <Input v-model="filter.serverName"/>
        </form-item>
        <form-item label="服务网点" prop="stationId">
          <Select v-model="filter.stationId">
            <Option v-for="item in stationLists" :key="item.id" :value="item.id">{{item.name}}</Option>
          </Select>
        </form-item>
        <form-item label="付款时间"  prop="dateRange">
          <DatePicker @on-change="(val)=>filterDateChange(val)" v-model="dateRange" type="daterange" style="width:100%;"></DatePicker>
        </form-item>
        <form-item label="是否完成代付"  prop="agentPayFinished">
          <Select v-model="filter.agentPayFinished">
            <Option value="Y">是</Option>
            <Option value="N">否</Option>
          </Select>
        </form-item>
        <form-item label="交易渠道"  prop="payChannelType">
          <Select v-model="filter.payChannelType">
            <Option value="ZFB">支付宝</Option>
            <Option value="WX">微信</Option>
            <Option value="GENERAL_UNION">通联</Option>
          </Select>
        </form-item>

      </i-form>
    </Drawer>
  </div>
</template>

<script>
  import util from '../../../libs/util'
    export default {
        name: "finance-order",
      props:['timeTab','repairLists','stationLists'],
      data(){
          return {
            repairTypeFirst:[],
            repairFilterLists:[],
            viewType:'1', //概况时间：本月-1,前三月-2,筛选-3
            earningCount:{}, //总统计信息
            repairColumns:[
              {title:'服务项目',key:'name',align:'center'},
              {title:'已付工单总数',key:'orderNum',align:'center'},
              {title:'已付工单收入',key:'orderAmount',align:'center'},
              {title:'员工结算',key:'employeeCommission',align:'center'},
              {title:'e维修佣金',key:'platformCommission',align:'center'},
              {title:'中心服务收益',key:'serviceEarning',align:'center'},
            ],
            categoryEarningCountList:[], //报修分类统计信息
            detailColumn:[
              {title:'服务网点',key:'stationName',align:'center',width:100},
              {title:'服务项目',key:'repairCategoryName',align:'center',width:100},
              {title:'创建日期',key:'createTime',align:'center',width:140},
              {title:'付款时间',key:'payTime',align:'center',width:140},
              {title:'上门费',key:'dtdServiceAmount',align:'center',width:100},
              {title:'服务费',key:'serviceAmount',align:'center',width:100},
              {title:'辅材费',key:'materialAmount',align:'center',width:100},
              {title:'工单金额',key:'orderAmount',align:'center',width:100},
              {title:'师傅姓名',key:'serverName',align:'center',width:100},
              {title:'师傅提成',key:'employeeCommission',align:'center',width:100},
              {title:'e维修用金比',key:'platformCommissionRate',width:110},
              {title:'e维修佣金',key:'platformCommission',align:'center',width:100,render:(h,params)=>{
                  let commission = params.row.platformCommission;
                  return commission>0?commission:0;
                }},
              {title:'工单单号',key:'orderSn',align:'center',minWidth:160},
              {title:'交易号',key:'paySn',align:'center',width:140},
              {title:'支付方式',key:'payType',align:'center',width:100},
              {title:'交易渠道',key:'payChannelName',align:'center',width:100},
              {title:'收款商户',key:'payChannelReceiverName',align:'center',width:100},
              {title:'是否完成代付',key:'agentPayFinishState',align:'center',width:140},
              {title:'工单状态',key:'orderState',align:'center',width:100},
              {title:'操作',fixed:'right',width:100,align:'center',render:(h,params)=>{
                  let _this = this;
                  return h('Button',{
                    props:{
                      type:'primary',
                      size:'small'
                    },
                    on:{
                      click(){
                        let id = params.row.id;
                        _this.$router.push({name:'orderDetail',query:{id:id}});
                      }
                    }
                  },'查看订单')
                }},
            ],
            serviceColumns:[
              {title:'网点名称',key:'stationName',align:'center'},
              {title:'已付工单总数',key:'orderNum',align:'center'},
              {title:'已付工单收入',key:'orderAmount',align:'center'},
              {title:'员工结算',key:'employeeCommission',align:'center'},
              {title:'e维修佣金',key:'platformCommission',align:'center'},
              {title:'中心总收益',key:'serviceEarning',align:'center'},
            ],
            serviceLists:[],
            detailLists:[],
            pageTotal:0,
            pageSize:10,
            pageNo:1,
            pageServiceSize:10,
            pageServiceNo:1,
            totalServiceCount:0,
            filterDraw:false,
            filter:{
              repairCategoryParentId:'',
              repairCategoryId:'',
              serverName:'',
              stationId:'',
              timeType:1,
              timeScope:1,
              startDate:'',
              endDate:'',
            },
            dateRange:[],
          }
      },
      mounted(){
        this.getOrderLists();
        this.getOrderTotal();
        util.getRepairTypeDropdown(data=>{
          this.repairTypeFirst = data;
        })
      },
      methods:{
        // 新增二级下拉
        firstTypeChange(id){
          util.getRepairTypeNext(id,data=>{
            this.repairFilterLists = data;
          })
        },
          //工单列表
        getOrderLists(pageType,num,filter){
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
          this.$http.post(`/order/financial/list?${query}&${postParam}`).then(res=>{
            if(res.data.code===0){
              let data = res.data.data;
              this.detailLists=data.list;
              this.pageTotal = data.totalCount;
              this.pageSize=data.pageSize;
              this.pageNo=data.pageNo;
            }
            this.filterDraw=false;
          })
        },
        //时间范围转换
        filterDateChange(val){
            this.filter.startDate=val[0];
            this.filter.endDate=val[1];
        },
        //工单统计
        getOrderTotal(filter){
          let postParam;
          if(filter){
            postParam=filter;
          }else{
            postParam=this.filter;
          }
          postParam=util.formatterParams(postParam);
          this.$http.post(`/order/financial/count?${postParam}`).then(res=>{
            if(res.data.code===0){
              let data = res.data.data;
              this.earningCount=data.earningCount;
              this.categoryEarningCountList=data.categoryEarningCountList;
              this.serviceLists= data.stationEarningCountList;
            }else{
              console.log('财务统计信息失败：'+res.data.msg);
            }
          })
        },
        //筛选
        sureFilter(){
          let filter = this.filter;
          if(filter.startDate){
            filter.timeType=2;
            filter.timeScope="";
            this.viewType='3';
          }

          this.pageNo=1;
          this.pageSize=10;
          this.getOrderTotal(filter);
          this.getOrderLists(null,null,filter);
        },
        clearFilter(){
          this.filter={
            repairCategoryParentId:'',
            repairCategoryId:'',
            serverName:'',
            stationId:'',
            timeType:1,
            timeScope:1,
            startDate:'',
            endDate:'',
          };
          this.viewType='1';
          this.dateRange=[];
          this.getOrderTotal(this.filter);
          this.getOrderLists(null,null,this.filter);
        },
        exportExcel(){
          let url='/order/financial/export';
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
            this.getOrderTotal(this.filter);
            this.getOrderLists(this.filter);
          }
        },
      }
    }
</script>

<style scoped>

</style>
