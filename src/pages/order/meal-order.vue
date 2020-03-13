<template>
  <div>
    <Card>
        <div class="mb-15">
          <i-form class="headerForm" :model="filterForm" inline :label-width="100">
            <form-item label="用户姓名">
              <Input v-model="filterForm.username"/>
            </form-item>

            <form-item label="服务网点">
              <Select v-model="filterForm.stationId" style="width:200px;">
                <Option v-for="item in stationList" :key="item.id" :value="item.id">{{item.name}}</Option>
              </Select>
            </form-item>
            <form-item label="创建时间">
              <DatePicker :options="filterDateOptions" @on-change="(value)=>filterDateChange(value,'CreateTime')" v-model="CreateTime" type="daterange" style="width:100%;"></DatePicker>
            </form-item>
            <form-item label="套餐类型">
              <Select v-model="filterForm.serviceType" style="width:200px;">
                <Option value="NORMAL">固定金额</Option>
                <Option value="PRICE_CUSTOM">可变动金额</Option>
              </Select>
            </form-item>
            <form-item label="套餐名称">
              <Input v-model="filterForm.serviceName"/>
            </form-item>
            <form-item label="绑定地址">
                  <Select
                    style="width:150px;float:left;"
                    placeholder="请选择小区"
                    v-model="addressTemp.village"
                    filterable
                    @on-query-change="regionFilter"
                  >
                    <Option v-for="(region, index) in regionList" :value="region.name" :key="index">{{region.name}}</Option>
                  </Select>
                  <Input style="width: 100px;float: left;margin-right: 10px;margin-left: 10px;" v-model="addressTemp.flats">
                    <span slot="append">栋</span>
                  </Input>
                  <Input  style="width: 100px;float:left;"   v-model="addressTemp.door">
                    <span slot="append">号</span>
                  </Input>
            </form-item>
            <form-item >
              <div class="btn-wrap" style="margin-left:-100px;">
                <Button type="primary" @click="sureFilter">查询</Button>
                <Button @click="clearFilter">清空</Button>
              </div>
            </form-item>
          </i-form>
        </div>
        <div class="clearfix">
          <div class="pull-right">
            <Button type="primary" @click="exportExcel">Excel导出</Button>
            <Button @click="filter=true">更多查询</Button>
          </div>
        </div>
      <div class="table-wrapper mt-15">
        <Table :columns="column" :data="lists"></Table>
        <div class="pagination">
          <Page show-elevator :total="totalCount" :current.sync="pageNo"
                :page-size.sync="pageSize"
                @on-change="(page)=>getLists('page',page)"
               ></Page>
        </div>
      </div>
    </Card>
    <!--筛选-->
    <Drawer width="460" title="套餐订单筛选"  v-model="filter" :mask-closable="false">
      <div class="clearfix mb-15">
        <div class="pull-left">
          <Button @click="clearFilter">清空筛选条件</Button>
        </div>
        <div class="pull-right">
          <Button @click="sureFilter" type="primary">确定筛选</Button>
        </div>
      </div>
      <i-form :model="filterForm" refs="filterForm">
        <form-item label="套餐类型">
          <Select v-model="filterForm.serviceType">
            <Option value="NORMAL">固定金额</Option>
            <Option value="PRICE_CUSTOM">可变动金额</Option>
          </Select>
        </form-item>
        <form-item label="套餐名称">
          <Input v-model="filterForm.serviceName"/>
        </form-item>
        <form-item label="下单方式">
          <Select v-model="filterForm.inputType">
            <Option value="SELF">自助下单</Option>
            <Option value="PROXY">代客下单</Option>
          </Select>
        </form-item>
        <form-item label="用户姓名">
          <Input v-model="filterForm.username"/>
        </form-item>
        <form-item label="订单编号">
          <Input v-model="filterForm.sn" />
        </form-item>
        <form-item label="销售人员">
          <Input v-model="filterForm.serviceUserName"/>
        </form-item>
        <form-item  label="绑定地址">
          <br>
          <Row :gutter="10">
            <Col span="12">
              <!--<Input v-model="addressTemp.village">-->
                <!--<span slot="append">小区</span>-->
              <!--</Input>-->
              <Select
                placeholder="请选择小区"
                v-model="addressTemp.village"
                filterable
                @on-query-change="regionFilter"
              >
                <Option v-for="(region, index) in regionList" :value="region.name" :key="index">{{region.name}}</Option>
              </Select>
            </Col>
            <Col span="6">
              <Input v-model="addressTemp.flats">
                <span slot="append">栋</span>
              </Input>
            </Col>
            <Col span="6">
              <Input  v-model="addressTemp.door">
                <span slot="append">号</span>
              </Input>
            </Col>
          </Row>
        </form-item>
        <form-item label="订单状态">
          <div style="clear:both;">
            <CheckboxGroup v-model="filterForm.orderState">
              <Checkbox label="STAY_PAY">待付款</Checkbox>
              <Checkbox  label="TRAN_SUCCESS">交易成功</Checkbox>
              <Checkbox label="TRAN_CANCEL">交易关闭</Checkbox>
            </CheckboxGroup>
          </div>
        </form-item>
        <form-item label="创建时间">
          <DatePicker @on-change="(value)=>filterDateChange(value,'CreateTime')" v-model="CreateTime" type="daterange" style="width:100%;"></DatePicker>
        </form-item>
        <!--<form-item label="有效时间">-->
          <!--<DatePicker @on-change="(value)=>filterDateChange(value,'ValidDate')" v-model="ValidDate" type="daterange" style="width:100%;"></DatePicker>-->
        <!--</form-item>-->
        <form-item label="服务网点">
          <Select v-model="filterForm.stationId">
            <Option v-for="item in stationList" :key="item.id" :value="item.id">{{item.name}}</Option>
          </Select>
        </form-item>
        <form-item label="包含服务套餐">
          <Select v-model="filterForm.hasDiscountService">
            <Option value="">全部</Option>
            <Option value="Y">包含</Option>
            <Option value="N">不包含</Option>
          </Select>
        </form-item>
        <form-item label="包含保险套餐">
          <Select v-model="filterForm.hasInsurance">
            <Option value="">全部</Option>
            <Option value="Y">包含</Option>
            <Option value="N">不包含</Option>
          </Select>
        </form-item>
      </i-form>
    </Drawer>
  </div>
</template>

<script>
  /*
   * 订单编号，套餐名称，订单价格，下单方式，服务网点，销售人员，订单状态，用户姓名，用户联系方式，绑定地址，支付方式，创建日期
   * */
  import util from '../../libs/util';
    export default {
        name: "套餐订单查询",
      data(){
          return{
            column:[
              {
                title:'创建日期',
                key:'createTime',
                width:150,
                sort:true,
                align:'center'
              }, {
                title:'套餐名称',
                key:'serviceName',
                align:'center'
              }, {
                title:'套餐类型',
                key:'serviceTypeName',
                align:'center',
                },{
                title:'订单价格',
                key:'amount',
                align:'center'
              },{
                title:'下单方式',
                key:'inputType',
                align:'center'
              },{
                title:'服务网点',
                key:'stationName',
                align:'center'
              },{
                title:'销售人员',
                key:'serviceUserName',
                align:'center'
              },{
                title:'订单状态',
                key:'orderState',
                align:'center'
              },{
                title:'用户姓名',
                key:'userName',
                align:'center'
              },{
                title:'用户联系方式',
                key:'userPhone',
                align:'center'
              },{
                title:'绑定地址',
                key:'address',
                width:150,
                align:'center'
              },{
                title:'支付方式',
                key:'payType',
                align:'center'
              },{
                title:'订单编号',
                key:'sn',
                align:'center'
              },{
                title:'操作',
                align:'center',
                width:100,
                fixed:'right',
                render:(h,params)=>{
                  let _this = this;
                  let id = params.row.id;
                  return h('Button',{
                    props:{
                      type:'primary',
                      size:'small'
                    },
                    on:{
                      click(){
                        _this.$router.push({name:'meal-detail',query:{id:id}})
                      }
                    }
                  },'查看')
                }
              },
            ],
            lists:[],
            pageNo:1,
            pageSize:10,
            totalCount:0,
            filter:false,
            filterForm:{
              serviceType:'', //套餐类型
              inputType:'',
              sn:'',
              serviceUserName:'',
              orderState:[],
              minCreateTime:'',
              maxCreateTime:'',
              // minValidDate:'', //砍了不要
              // maxValidDate:'',
              hasInsurance:'',
              address:'',
            },
            addressTemp:{
              village:'',
              flats:'',
              door:''
            },
            CreateTime:[],
            // ValidDate:[],
            stationList:[],
            regionList:[], //报修区域
            filterRegionList:[], //报修区域筛选结果
            filterDateOptions: {
              disabledDate (date) {
                return date.valueOf() > Date.now();
              }
            },
          }
      },
      created(){
          let _this = this;
          let query = this.$route.query;
          if(query.serviceId){
            this.filterForm.serviceId=query.serviceId;
            this.getLists()
          }else{
            this.getLists();
          }
          //报修区域，用于筛选
          this.getRegionLists();
          util.getStationLists(data=>{
            _this.stationList=data;
          });
      },
      methods:{
          regionFilter(query){
            let regionList=this.regionList;
            let filterRes = regionList.filter(item=>{
              if(item.name.indexOf(query)>-1){
                return true;
              }else{
                return false;
              }
            });
            this.filterRegionList=filterRes;
          },
          //小区模糊搜索
        getRegionLists(){
          //请求报修区域
          this.$http.get(`/repair/region/list`)
            .then(res=>{
              if(res.data.code===0){
                this.regionList=res.data.data;
              }else{
                console.log(res.data.msg);
              }
            })
        },
        getLists(pageType,num){
          let params='';
          if(pageType==='page'){
            this.pageNo=num;
            // params = `pageNo=${num}&pageSize=${this.pageSize}`;
          }else if(pageType==='size'){
            this.pageSize=num;
            // params = `pageNo=${this.pageNo}&pageSize=${num}`;
          }
          params = `pageNo=${this.pageNo}&pageSize=${this.pageSize}`;
          let filterForm=this.filterForm;
          delete filterForm.dateRange;
          let filterParam = util.formatterParams(filterForm);
          this.$http.post(`/service/order/list?${params}&${filterParam}`)
            .then(res=>{
              if(res.data.code===0){
                let data = res.data.data;
                this.totalCount=data.totalCount;
                this.lists = data.list;
              }else{
                this.$Message.error(res.data.msg);
              }
              this.filter=false;
            }).catch(err=>{
              this.$Message.error('服务出错，请稍候再试');
            this.filter=false;
          })
        },
        clearFilter(){
          this.filterForm={
              inputType:'',
              sn:'',
              serviceUserName:'',
              orderState:[],
              minCreateTime:'',
              maxCreateTime:'',
              hasInsurance:'',
              address:'',
              stationId:'',

          };
          this.addressTemp={
            flats:'',
            door:''
          };
          this.addressTemp.village="";
          this.CreateTime=[];
          this.pageNo=1;
          this.pageSize=10;
          this.getLists();
        },
        sureFilter(){
          let filterForm = this.filterForm;
          let addressObj=this.addressTemp;
          if(addressObj.village){
            filterForm.address=`${addressObj.village}${addressObj.flats.length>0?'-'+addressObj.flats:''}${addressObj.door.length>0?'-'+addressObj.door:''}`;
          }
          this.pageNo=1;
          this.getLists(null,null,filterForm);
        },
        filterDateChange(value,key){
          let min=value[0],max=value[1];
          let minKey=`min${key}`;
          let maxKey=`max${key}`;
          this.filterForm[minKey]=min;
          this.filterForm[maxKey]=max;
        },
        exportExcel(){
          let filterForm={...this.filterForm};
          delete filterForm.dateRange;
          let params = util.formatterParams(filterForm)
          this.$http.post(`/service/order/export?${params}`,{...filterForm},{responseType:'blob'})
            .then(res=>{
              util.downloadExcel(res);
            })
        }
      }
    }
</script>

<style scoped lang="scss">
@import "order";
  .headerForm{
    .ivu-form-item{
      margin-bottom: 10px;
    }
  }
</style>
