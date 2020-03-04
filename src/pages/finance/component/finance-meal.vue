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
      <table class="native-table">
        <thead>
        <tr>
          <th>项目名称</th>
          <th>已售套餐数量</th>
          <th>销售收入</th>
          <th>员工结算</th>
          <th>套餐佣金</th>
          <th>中心套餐收益</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td>套餐销售收入总计</td>
          <td>{{mealInfo.orderNum}}</td>
          <td>{{mealInfo.orderAmount}}</td>
          <td>{{mealInfo.employeeCommission}}</td>
          <td>{{mealInfo.platformCommission}}</td>
          <td>{{mealInfo.earning}}</td>
        </tr>
        </tbody>
      </table>
    </div>
    <div class="table-wrapper mb-15">
      <div class="table-wrapper">
        <Table :columns="typeColumn" :data="typeLists"></Table>
        <div class="pagination">
          <Page :total="typePageTotal"
                :current.sync="typePageNo"
                @on-change="(page)=>getTypeLists('page',page)"
          ></Page>
        </div>
      </div>
    </div>
    <div class="mb-15 table-wrapper">
      <h4 class="mb-15">服务网点统计</h4>
      <Table :columns="serviceColumns" :data="serviceLists"></Table>
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
    <!-- 套餐筛选 -->
    <Drawer title="套餐筛选" v-model="filterDraw" width="450">
      <div class="clearfix mb-15">
        <div class="pull-left">
          <Button @click="clearFilter()">清空筛选条件</Button>
        </div>
        <div class="pull-right">
          <Button @click="sureFilter()" type="primary">确定</Button>
        </div>
      </div>
      <i-form ref="mealFilterForm" :model="filter" label-position="top">
        <form-item label="套餐类型" prop="repairCategoryId">
          <Select v-model="filter.repairCategoryId">
            <Option v-for="item in repairLists" :key="item.id" :value="item.id">{{item.name}}</Option>
          </Select>
        </form-item>
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
        <form-item label="交易渠道"  prop="payChannelType">
          <Select v-model="filter.payChannelType">
            <Option value="ZFB">支付宝</Option>
            <Option value="WX">微信</Option>
            <Option value="GENERAL_UNION">通联</Option>
          </Select>
        </form-item>
        <form-item label="是否完成代付"  prop="agentPayFinished">
          <Select v-model="filter.agentPayFinished">
            <Option value="Y">是</Option>
            <Option value="N">否</Option>
          </Select>
        </form-item>
      </i-form>
    </Drawer>
  </div>
</template>

<script>
  import util from '../../../libs/util'
    export default {
        name: "finance-meal",
      props:['timeTab','stationLists','repairLists'],
      data(){
          return {
            viewType:'1', //概况时间：本月-1,前三月-2,筛选-3
            pageTotal:0,
            pageSize:10,
            pageNo:1, //明细分页
            typePageTotal:0,
            typePageNo:1, //分类分页
            mealInfo:{},
            serviceLists:[],
            serviceColumns:[
              {title:'网点名称',key:'stationName',align:'center',render:(h,params)=>{
                  let noticeStr='(未分配的网点)';
                  let stationName=params.row.stationName;
                  if(stationName===noticeStr){
                    return h('span',{style:{color:'#f00'}},stationName)
                  }
                  return h('span',stationName)
                }},
              {title:'已售套餐数量',key:'orderNum',align:'center'},
              {title:'销售收入',key:'orderAmount',align:'center'},
              {title:'员工结算',key:'employeeCommission',align:'center'},
              {title:'套餐佣金',key:'platformCommission',align:'center'},
              {title:'中心总收益',key:'earning',align:'center'},
            ],
            typeColumn:[
              {title:'套餐名称',key:'name',align:'center'},
              {title:'已付套餐总数',key:'orderNum',align:'center'},
              {title:'销售收入',key:'orderAmount',align:'center'},
              {title:'员工结算',key:'employeeCommission',align:'center'},
              {title:'套餐佣金',key:'platformCommission',align:'center'},
              {title:'中心套餐收益',key:'earning',align:'center'},
            ],
            mealColumn:[
              {title:'服务网点',key:'stationName',align:'center',width:140},
              {title:'套餐名称',key:'name',align:'center',width:140},
              {title:'套餐售价',key:'salePrice',align:'center',width:140},
              {title:'销售人员',key:'serviceUserName',align:'center',width:140},
              {title:'销售提成',key:'saleCommission',align:'center',width:140},
              {title:'套餐佣金比例',key:'commissionRate',align:'center',width:140},
              {title:'套餐佣金',key:'platformCommission',align:'center',width:140},
              {title:'付款日期',key:'payTime',align:'center',width:140},
              {title:'订单编号',key:'sn',align:'center',width:140},
              {title:'支付单号',key:'paySn',align:'center',width:140},
              {title:'支付方式',key:'payType',align:'center',width:140},
              {title:'下单方式',key:'inputType',align:'center',width:140},
              {title:'交易渠道',key:'payChannelName',align:'center',width:140},
              {title:'收款商户',key:'payChannelReceiverName',align:'center',width:140},
              {title:'是否完成代付',key:'agentPayFinishState',align:'center',width:140},
              {title:'订单状态',key:'orderState',align:'center',width:140},
              // {title:'创建日期',key:'createTime',align:'center',width:140},
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
                        _this.$router.push({name:'meal-detail',query:{id:id}});
                      }
                    }
                  },'查看')
                }},
            ],
            mealLists:[],
            typeLists:[],
            filterDraw:false,
            filter:{
              startDate:'',
              endDate:'',
              serverName:'',
              stationId:'',
              timeType:'1',
              timeScope:'1',
            },
            dateRange:[]
          }
      },
      mounted(){
        this.getInfo();
        this.getLists();
        this.getTypeLists();
        this.getServiceList();
      },
      methods:{
        //时间范围转换
        filterDateChange(val){
          this.filter.startDate=val[0];
          this.filter.endDate=val[1];
        },
        //服务网点统计列表
        getServiceList(pageType,num,filter){
          let postParam;
          if(filter){
            postParam=filter;
          }else{
            postParam=this.filter;
          }
          postParam=util.formatterParams(postParam);
          this.$http.post(`/service/financial/station/count?${postParam}`)
            .then(res=>{
              if(res.data.code===0){
                this.serviceLists=res.data.data;

              }
            })
        },
        // 统计
          getInfo(filter){
            let postParam;
            if(filter){
              postParam=filter;
            }else{
              postParam=this.filter;
            }
            postParam=util.formatterParams(postParam);
            this.$http.post(`/service/financial/count?${postParam}`)
              .then(res=>{
                if(res.data.code===0){
                  let data= res.data.data;
                  this.mealInfo=data;
                }
                this.filterDraw=false;
              })
          },
        // 套餐明细
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
          this.$http.post(`/service/financial/list?${query}&${postParam}`).then(res=>{
            if(res.data.code===0){
              let data = res.data.data;
              this.mealLists=data.list;
              this.pageTotal = data.totalCount;
              this.pageSize=data.pageSize;
              this.pageNo=data.pageNo;
            }
          })
        },
        //套餐分类
        getTypeLists(pageType,num,filter){
          let query=`pageNo=${this.typePageNo}`;
          if(pageType==='page'){
            query=`pageNo=${num}&pageSize=10`;
          }
          let postParam;
          if(filter){
            postParam=filter;
          }else{
            postParam=this.filter;
          }

          postParam=util.formatterParams(postParam);
          this.$http.post(`/service/financial/category/count?${query}&${postParam}`).then(res=>{
            if(res.data.code===0){
              let data = res.data.data;
              this.typeLists=data.list;
              this.typePageTotal = data.totalCount;
              this.typePageNo=data.pageNo;
            }
          })
        },
        sureFilter(){
          let filter = this.filter;
          if(filter.startDate){
            filter.timeType=2;
            filter.timeScope="";
            this.viewType='3';
          }
          this.pageNo=1;
          this.pageSize=10;
          this.typePageNo=1;

          this.getInfo(filter);
          this.getLists(null,null,filter);
          this.getTypeLists(null,null,filter);
          this.getServiceList(null,null,filter);
        },
        clearFilter(){
          this.filter={
            startDate:'',
            endDate:'',
            serverName:'',
            stationId:'',
            timeType:'1',
            timeScope:'1',
          }
          this.viewType='1';
          this.dateRange=[];
          this.pageNo=1;
          this.pageSize=10;
          this.typePageNo=1;
          this.getInfo(this.filter);
          this.getLists(null,null,this.filter);
          this.getTypeLists(null,null,this.filter);
          this.getServiceList(null,null,this.filter);
        },
        exportExcel(){
          let url='/service/financial/export';
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
            this.getLists(null,null,this.filter);
            this.getTypeLists(null,null,this.filter);
            this.getServiceList(null,null,this.filter);
          }
        },
      }
    }
</script>

<style scoped>

</style>
