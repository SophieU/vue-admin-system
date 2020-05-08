
<template>
  <Card>
    <Spin fix v-show="loadingTable == true">加载中...</Spin>
    <ul  class="tab-nav mb-15">
      <li @click="toggleTab(ind)" :class="nav.check?'nav-active':''" v-for="(nav,ind) in orderNav" :key="nav.title">
        <Badge  :count="nav.count" :overflow-count="99">
          <span class="nav-title">{{nav.title}}</span>
        </Badge>
      </li>
    </ul>
    <div class="tab-content">
      <div class="mb-15 headerForm">
<!--        <i-form :model="filterForm" inline :label-width="100">-->
<!--          <form-item label="联系人姓名：">-->
<!--            <Input v-model="filterForm.username"/>-->
<!--          </form-item>-->
<!--          <form-item label="报修区域：">-->
<!--            &lt;!&ndash; <Select v-model="filterForm.regionName" style="width: 150px;">-->
<!--              <Option v-for="(region,index) in regionLists" :key="index" :value="region.name">{{region.name}}</Option>-->
<!--            </Select> &ndash;&gt;-->
<!--            <Select-->
<!--                placeholder="请选择小区"-->
<!--                v-model="filterForm.regionName"-->
<!--                filterable-->
<!--                @on-query-change="regionFilter"-->
<!--              >-->
<!--                <Option v-for="(region, index) in filterRegionList" :value="region.name" :key="index">{{region.name}}</Option>-->
<!--              </Select>-->
<!--          </form-item>-->
<!--          <form-item label="服务网点：">-->
<!--            <Select v-model="filterForm.repairStationId" style="width:150px;">-->
<!--              <Option v-for="(station,index) in stationLists" :key="index" :value="station.id">{{station.name}}</Option>-->
<!--            </Select>-->
<!--          </form-item>-->
<!--           <form-item label="创建时间：">-->
<!--             <DatePicker :options="filterDateOptions" @on-change="filterDateChange" v-model="filterForm.dateRange" type="daterange" style="width:200px;"></DatePicker>-->
<!--          </form-item>-->
<!--          <form-item style="margin-left: -100px;">-->
<!--             <Button @click="sureFilter" type="primary">查询</Button>-->
<!--             <Button @click="clearFilter">清空</Button>-->
<!--          </form-item>-->

<!--        </i-form>-->
      </div>
      <div class="clearfix mb-15">
        <div class="pull-left">
          <Button type="primary" @click="showModal=true">新建</Button>
          <Button @click="filter=true">所有查询条件</Button>
        </div>

      </div>

      <div class="tabler-wrapper">
        <Table :columns="columns" :data="lists"></Table>
        <div class="pagination">
          <Page :total="totalCount" show-elevator :current.sync="pageNo"
                @on-change="pageChange"
                @on-page-size-change="pageSizeChange"
          ></Page>
        </div>
      </div>
    </div>
    <!--新建-->
    <create-order :createOrder="showModal" @close="closeModal"></create-order>
    <!--筛选-->
    <Drawer width="425" title="工单筛选"  v-model="filter"  :mask-closable="false">
      <div class="clearfix mb-15">
        <div class="pull-left">
          <Button @click="clearFilter">清空筛选条件</Button>
        </div>
        <div class="pull-right">
          <Button @click="sureFilter" type="primary">确定筛选</Button>
        </div>
      </div>
      <i-form :model="filterForm" refs="filterForm">
        <form-item label="客户姓名：">
          <Input v-model="filterForm.username"/>
        </form-item>
        <form-item label="联系电话">
          <Input v-model="filterForm.userPhone" :number="true"
                 :maxlength="11"
                 @on-blur="validateTel(filterForm.userPhone)"
          />
          <span v-if="!telValid" class="text-red">请输入正确格式的手机号</span>
        </form-item>
        <form-item label="服务分类">
          <Select v-model="filterForm.repairCategoryParentId"  @on-change="(id)=>repairFirstChange(id,'filter')">
            <Option v-for="item in repairFirst" :key="item.id" :value="item.id">{{item.name}}</Option>
          </Select>
        </form-item>
        <form-item label="服务项目">
          <Select v-model="filterForm.repairCategoryId"
                  placeholder="请先选择服务分类"
                  not-found-text="服务项目列表为空，请先选择服务分类"
          >
            <Option v-for="repair in repairSecond" :key="repair.id" :value="repair.id">{{repair.name}}</Option>
          </Select>
        </form-item>
        <form-item label="报修区域：">
          <Select v-model="filterForm.regionName">
            <Option v-for="(region,index) in regionLists" :key="index" :value="region.name">{{region.name}}</Option>
          </Select>
        </form-item>
        <form-item label="服务网点：">
          <Select v-model="filterForm.repairStationId" >
            <Option v-for="(station,index) in stationLists" :key="index" :value="station.id">{{station.name}}</Option>
          </Select>
        </form-item>
        <!--<form-item label="报修类型">-->
          <!--<Select v-model="filterForm.repairCategoryId">-->
            <!--<Option v-for="item in repairLists" :key="item.id" :value="item.id">{{item.name}}</Option>-->
          <!--</Select>-->
        <!--</form-item>-->
        <form-item label="工单编号">
          <Input v-model="filterForm.orderSn" />
        </form-item>

        <form-item label="服务人员">
          <Input v-model="filterForm.serviceUserName"/>
        </form-item>
        <form-item label="工单状态">
          <div style="clear:both;">
            <CheckboxGroup v-model="filterForm.orderStateList">
              <Checkbox v-if="item.state" v-for="item in orderNav" :label="item.state" :key="item.state">{{item.title}}</Checkbox>
            </CheckboxGroup>
          </div>

        </form-item>
        <form-item label="工单渠道">
          <Select v-model="filterForm.orderSource">
            <Option value="APP">APP</Option>
            <Option value="CALL_CENTER">呼叫中心</Option>
            <Option value="STATION">服务网点</Option>
          </Select>
        </form-item>
        <form-item label="创建时间">
          <DatePicker :options="filterDateOptions" @on-change="filterDateChange" v-model="filterForm.dateRange" type="daterange" style="width:100%;"></DatePicker>
        </form-item>
<!--        <form-item label="是否上传证据">-->
<!--          <i-switch v-model="filterForm.hasEvidence" true-value="Y" false-value="">-->
<!--            <span slot="open">是</span>-->
<!--          </i-switch>-->
<!--        </form-item>-->
        <form-item label="是否有回访记录">
          <i-switch v-model="filterForm.hasReturnVisit" true-value="Y" false-value="">
            <span slot="open">是</span>
          </i-switch>
        </form-item>
<!--        <form-item label="质保中">-->
<!--          <i-switch v-model="filterForm.isWarranty" true-value="Y" false-value="">-->
<!--            <span slot="open">是</span>-->
<!--          </i-switch>-->
<!--        </form-item>-->
<!--        <form-item label="售后记录">-->
<!--          <i-switch v-model="filterForm.afterSaleRecord" true-value="Y" false-value="">-->
<!--            <span slot="open">是</span>-->
<!--          </i-switch>-->
<!--        </form-item>-->
        <form-item label="客户评价">
          <Select v-model="filterForm.commentState">
            <Option value="">全部</Option>
            <Option value="2">满意</Option>
            <Option value="3">不满意</Option>
            <Option value="1">暂未评价</Option>
          </Select>
        </form-item>
      </i-form>
    </Drawer>
  </Card>
</template>

<script>
  import util from '../../libs/util'
  import createOrder from '../home/component/createOrder';
    export default {
        name: "order-search",
      components:{
        createOrder
      },
      computed:{
          downLink(){
            let baseUrl = localStorage.getItem('baseURL');
            return baseUrl+'/repair/order/list/export';
          }
      },
      data(){
          return {
            telValid:true, //fitlerForm中验证手机号
            showModal:false,
            filter:false,
            currentTab:'',
            repairFirst:[],
            repairSecond:[],
            orderNav:[
              {title:'所有工单',state:'',count:0,check:true},
              {title:'待分配',state:'ASSIGNED',count:0},
              {title:'待上门',state:'WAIT_DOOR',count:0},
             // {title:'已上门',state:'WAITING_DOOR',count:0},
              {title:'待付款',state:'STAY_PAY',count:0},
              //{title:'待服务',state:'WAIT_SERVICE',count:0},
              {title:'已完成',state:'FINISH',count:0},
              //{title:'售后中',state:'AFTER_SALE',count:0},
              {title:'已取消',state:'CANCEL',count:0},
              {title:'已关闭',state:'CLOSED',count:0},
              {title:'异常',state:'EXCEPTION',count:0},
            ],
            columns:[
              {title:'创建日期',key:'createTime',sortable:true,align:'center',width:150},
              {title:'客户手机',key:'userPhone',align:'center',width:120},
              {title:'客户姓名',key:'userName',align:'center',width:100},
              {title:'服务项目',key:'repairCategoryName',align:'center',width:150},
              {title:'服务网点',key:'stationName',align:'center',width:150},
              {title:'服务人员',key:'receiveUserName',align:'center',width:100},
              {title:'工单状态',key:'orderStateName',align:'center',width:100},
              {title:'报修地址',key:'repairAddress',align:'center',width:200},
              {title:'回访记录',key:'hasReturnVisit',align:'center',width:100,render:(h,params)=>{return h('span',{},params.row.hasReturnVisit==='Y'?'有':'无')}},
              {title:'客户评价',key:'commentResult',align:'center',width:100,render:(h,params)=>{
                  let map = {
                    '1':'未评价',
                    '2':'满意',
                    '3':'不满意'
                  }
                  let text = map[params.row.commentState]
                  if(!text){
                    text= '暂无评价'
                  }
                  return h('span',text)
                }},
              // {title:'证据',key:'hasEvidence',align:'center',width:100},
              // {title:'回访记录',key:'hasReturnVisit',align:'center',width:100},
              // {title:'质保中',key:'isWarranty',align:'center',width:100},
              // {title:'售后中',key:'isAfterSale',align:'center',width:100},
              // {title:'售后记录',key:'afterSaleRecord',align:'center',width:100},
              // {title:'优惠金额',key:'discountAmount',align:'center',width:100,render:(h,params)=>{
              //   if(params.row.discountAmount){
              //     return params.row.discountAmount;
              //   }else{
              //     return '-'
              //   }
              // }},
              {title:'工单编号',key:'orderSn',align:'center',minWidth:200},
              {title:'操作',fixed:'right',align:'center',width:150,render:(h,params)=>{
                let _this = this;
                  return h('div',[
                    h('Button',{
                      props:{
                        type:'primary',
                        size:'small'
                      },
                      style:{marginRight:'8px'},
                      on:{
                        click(){
                          let id= params.row.id;
                          sessionStorage.setItem('viewOrderId',id);
                          _this.$router.push({name:'orderDetail',query:{id:id}});
                        }
                      }
                    },'查看'),
                    // h('Button',{
                    //   props:{
                    //     type:'success',
                    //     size:'small'
                    //   },
                    //   on:{
                    //     click:()=>{
                    //       let id = params.row.id;
                    //       let state=params.row.orderState;
                    //       let isWarranty = params.row.isInWarrantyPeriod;
                    //       sessionStorage.setItem('viewOrderId',id);
                    //       _this.$router.push({name:'orderControl',query:{id:id,state:state,isWarranty:isWarranty}})
                    //     }
                    //   }
                    // },'处理订单'),
                  ])
                }},
            ],
            lists:[],
            filterForm:{ },
            loadingTable:false,
            inFilter:false, //标记正在筛选中
            pageNo:1,
            pageSize:10,
            totalCount:0,
            repairLists:[],
            stationLists:[],
            regionLists:[],
            filterRegionList:[], //筛选结果
            filterDateOptions: {
              disabledDate (date) {
                return date.valueOf() > Date.now();
              }
            },
          }
      },
      methods:{
        repairFirstChange(id,fromType){
          util.getRepairTypeNext(id,data=>{
            if(fromType==='modal'){
              this.repairLists = data
            }else{
              this.repairSecond = data
            }
          })
        },
        //选择小区
       regionFilter(query){
          let regionList=this.regionLists;
          let filterRes = regionList.filter(item=>{
            if(item.name.indexOf(query)>-1){
              return true;
            }else{
              return false;
            }
          });
          this.filterRegionList=filterRes;
        },
        validateTel(val){
          let telReg = /^1[3456789]\d{9}/;
          if(!telReg.test(val)){
            this.telValid=false;
          }else{
            this.telValid=true;
          }
          // 为空
          if(!val){
            this.telValid=true;
          }
        },
        toggleTab(ind){
          let arr = this.orderNav.map((item,index)=>{
            if(index===ind){
              item.check=true;
              this.currentTab=item.state;
            }else{
              item.check=false;
            }
            return item;
          });

          this.orderNav=arr;
        },
        closeModal(param){
          this.showModal=false;
          this.clearFilter();
        },
        //获取工单列表
        getLists(pageType,num,filter){
          this.loadingTable=true;
          let param = {
            pageNo:this.pageNo,
            pageSize:this.pageSize
          };
          if(pageType==='page'){
            param.pageNo=num;
          }else if(pageType==='size'){
            param.pageSize=num;
          }
          let state = this.currentTab;
          if(state){
            param.orderStateList=[state];
          }
          if(filter){
            delete filter.dateRange;
            param=Object.assign({},param,filter);
          }
          this.$http.post(`/yyht/v1/repair/order/pageList`,{...param}).then(res=>{
            this.loadingTable=false;
            if(res.data.code===0){
              let data= res.data.data;
              this.lists=data.list;
              this.pageSize=data.pageSize;
              this.totalCount=data.totalCount;
              if(!param.orderStateList){
                this.orderNav[0].count=data.totalCount;
              }
            }else{
              console.log('工单列表获取失败：'+res.data.msg);
            }
            this.filter=false;
          })
        },
        //筛选
        filterDateChange(val){
          this.filterForm.createTimeStart=val[0];
          this.filterForm.createTimeEnd=val[1];
        },
        clearFilter(){
          this.filterForm={
            hasEvidence:'',
            hasReturnVisit:'',
            isWarranty:'',
            afterSaleRecord:'',
            commentState:'',
            username:'',
            regionName:'',
            repairStationId:'',
            repairCategoryParentId:'',
          };
          this.filter=false;
          this.inFilter=false;
          this.pageNo=1;
          this.getLists();
        },
        sureFilter(){
          let filterForm = {...this.filterForm};
          delete filterForm.dateRange;
          this.inFilter=true;
          this.pageNo=1;
          this.getLists(null,null,filterForm);
        },
        pageChange(val){
          this.pageNo=val;
          let filterForm = {...this.filterForm};
          delete filterForm.dateRange;
          let filterQuery = util.formatterParams(filterForm);
          if(filterQuery.length>0){
            this.inFilter=true;
          }
          this.getLists('page',val,filterForm);
        },
        pageSizeChange(val){
          this.pageSize=val;
          let filterForm = {...this.filterForm};
          delete filterForm.dateRange;
          let filterQuery = util.formatterParams(filterForm);
          if(filterQuery.length>0){
            this.inFilter=true;
          }
          this.getLists('size',val,filterForm);
        },
        //不同状态的数值
        getStateCount(){
          this.$http.get(`/yyht/v1/repair/order/state/count`)
            .then(res=>{
              if(res.data.code===0){
                let data = res.data.data;
                this.orderNav=this.orderNav.map(item=>{
                  for(let i=0;i<data.length;i++){
                    let state = data[i].state;
                    if(item.state===state){
                      let num = parseInt(data[i].countNum);
                      item.count=num;
                    }
                  }
                  return item;
                });
              }else{
                console.log('/repair/order/state/count:'+res.data.msg);
              }
            })
        }
      },
      mounted(){
          let query = this.$route.query;
          if(query.from==='home'){
            let todayTime =new Date();
            let dateToday =`${todayTime.getFullYear()}-${todayTime.getMonth()+1}-${todayTime.getDate()}`;
              if(query.type==='today'){
                let filterForm={
                  createTimeStart:dateToday,
                  createTimeEnd:dateToday,
                };
                this.filterForm=Object.assign({},filterForm,{dateRange:[dateToday,dateToday]});
                this.getLists(null,null,filterForm);
              }else if(query.type==='month'){
                let monthAgo=`${todayTime.getFullYear()}-${todayTime.getMonth()+1}-1`;
                let filterForm={
                  createTimeStart:monthAgo,
                  createTimeEnd:dateToday,
                };
                this.filterForm=Object.assign({},filterForm,{dateRange:[monthAgo,dateToday]});
                this.getLists(null,null,filterForm);
              }else{
                this.getLists();
              }
          }else if(query.from==='meal'){
            let serviceId = query.serviceId;
            this.filterForm={
              serviceId:serviceId
            };
            this.getLists(null,null,this.filterForm);
          }else{
            this.getLists();
          }
          this.getStateCount();
          // util.getRepairType(data=>{
          //   this.repairLists=data;
          // })
          util.getRepairTypeDropdown(data=>{
            this.repairFirst = data;
          });
          util.getStationLists(data=>{
            this.stationLists=data;
          });
          util.getRegion(data=>{
            this.regionLists=data;
            this.filterRegionList=JSON.parse(JSON.stringify(data));
          })

      },
      watch:{
        currentTab(newVal){
          let filterForm = {...this.filterForm};
          delete filterForm.dateRange;
          this.pageNo=1;
          this.pageSize=10;
          this.totalCount=0;
          this.inFilter=false;
          this.getLists(null,null,filterForm);
        }
      }
    }
</script>

<style scoped lang="scss">
  .headerForm{
    .ivu-form-item{
      margin-bottom: 0;
    }
  }
</style>
