<template>
  <div>
    <Card class="mb-15">
      <table class="native-table">
        <thead>
        <tr>
          <th>今日工单数</th>
          <th>本月工单总数</th>
          <th>已完成工单总数</th>
          <th>已取消总数</th>
          <th>已关闭总数</th>
          <th>协助工单总数</th>
          <th>历史工单总数</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td>{{orderCount.todayOrderNum}}</td>
          <td>{{orderCount.currentMonthOrderNum}}</td>
          <td>{{orderCount.finishedOrderNum}}</td>
          <td>{{orderCount.canceledOrderNum}}</td>
          <td>{{orderCount.closedOrderNum}}</td>
          <td>{{orderCount.totalHelpedOrderNum}}</td>
          <td>{{orderCount.totalOrderNum}}</td>
        </tr>
        </tbody>
      </table>
    </Card>
    <Card>
        <p style="font-weight: normal;color: #555;" slot="title">
          <span v-if="filterDateRange[0]&&filterDateRange[1]"> 时间：{{filterDateRange[0]}}-{{filterDateRange[1]}}</span>
        </p>
        <div slot="extra" style="margin-top: -5px;">
          <Button @click="filter=true">筛选</Button>
          <Button type="primary" @click="exportExcel">excel导出</Button>
        </div>
      <div class="table-wrapper">
        <Table :columns="columns" :data="lists"></Table>
        <div class="pagination">
          <Page :total="totalCount" :page-size="pageSize" show-elevator
                @on-change="pageChange"
                @on-page-size-change="pageSizeChange"
          ></Page>
        </div>
      </div>
    </Card>

<!--筛选-->
    <Drawer width="450" title="收益筛选" v-model="filter" :mask-closable="false"
      @on-close="clearFilter('filterForm')"
    >
      <div class="clearfix mb-15">
        <div class="pull-left">
          <Button @click="clearFilter('filterForm')">清空筛选条件</Button>
        </div>
        <div class="pull-right">
          <Button type="primary" @click="sureFilter">确定筛选</Button>
        </div>
      </div>
      <Form ref="filterForm" :model="filterForm" label-position="top">
        <FormItem label="服务类型" prop="repairCategoryId">
          <Select v-model="filterForm.repairCategoryId">
            <Option v-for="repair in repairTypeLists" :key="repair.id" :value="repair.id">{{repair.name}}</Option>
          </Select>
        </FormItem>
        <FormItem label="工单时间"  prop="dateRange">
          <DatePicker @on-change="dateRangeChange" v-model="filterForm.dateRange" type="daterange" style="width: 100%;"></DatePicker>
        </FormItem>
        <FormItem label="工单状态" prop="orderStateList" >
          <CheckboxGroup v-model="filterForm.orderStateList">
            <Checkbox label="ASSIGNED">待分配</Checkbox>
            <Checkbox label="WAIT_DOOR">待上门</Checkbox>
            <Checkbox label="WAITING_DOOR">已上门</Checkbox>
            <Checkbox label="STAY_PAY">待付款</Checkbox>
            <Checkbox label="WAIT_SERVICE">待服务</Checkbox>
            <Checkbox label="FINISH">已完成</Checkbox>
            <Checkbox label="AFTER_SALE">售后中</Checkbox>
            <Checkbox label="CANCEL">已取消</Checkbox>
            <Checkbox label="CLOSED">已关闭</Checkbox>
            <Checkbox label="EXCEPTION">异常</Checkbox>
          </CheckboxGroup >
        </FormItem>
      </Form>
    </Drawer>
  </div>
</template>

<script>
    import util from '../../../libs/util'
    export default {
        name: "staff-order-info",
      data(){
          return{
            filter:false,
            id:'',
            columns:[
              {title:'创建时间',key:'createTime',align:'center'},
              {title:'服务类型',key:'repairCategoryName',align:'center'},
              {title:'工单类型',key:'ownerType',align:'center'},
              {title:'工单状态',key:'orderState',align:'center'},
              {title:'工单号',key:'sn',align:'center'},
              {title:'操作',align:'center',render:(h,params)=>{
                let _this = this;
                let id = params.row.id;
                  return h('Button',{
                    props:{
                      type:'primary',
                      size:'small'
                    },
                    on:{
                      click:function(){
                       _this.$router.push({name:'orderDetail',query:{id:id}})
                      }
                    }
                  },'查看订单')
                }},
            ],
            lists:[],
            repairTypeLists:[],
            pageNo:1,
            pageSize:10,
            totalCount:0,
            orderCount:{},
            filterForm:{
              dateRange:[],
              orderStateList:[],
              repairCategoryId:'',
              startDate:'',
              endDate:'',
            },
            filterDateRange:[],
          }
      },
      methods:{
          dateRangeChange(val){
            this.filterForm.startDate=val[0];
            this.filterForm.endDate=val[1];
          },
          getLists(filter){
            let param={};
            let paramString=`pageNo=${this.pageNo}&pageSize=${this.pageSize}`;
            let id = this.id;
            if(filter){
             param=filter;
            }
            this.$http.post(`server/order/list?${paramString}`,{
              id:id,
              ...param
            }).then(res=>{
                if(res.data.code===0){
                  let data=res.data.data;
                  this.pageSize=data.pageSize;
                  this.totalCount=data.totalCount;
                  this.lists=data.list;
                  this.filter=false;
                  if(filter&&filter.startDate){
                    this.filterDateRange=[filter.startDate,filter.endDate];
                  }else{
                    this.filterDateRange=[];
                  }
                }else{
                  console.log('员工工单列表：'+res.data.msg);
                }
              })
          },
          getOrderCount(){
              this.$http.get(`/server/order/count?id=${this.id}`)
                .then(res=>{
                  if(res.data.code===0){
                    this.orderCount=res.data.data
                  }
                })
          },
        clearFilter(name){
            this.filterForm={
              dateRange:[],
              orderStateList:[],
              repairCategoryId:'',
              startDate:'',
              endDate:'',
            };
            this.$refs['filterForm'].resetFields();
            this.getLists();
            this.filter=false;
        },
        sureFilter(){
            let filterParam = {...this.filterForm};
            delete filterParam.dateRange;
            let param = {};
            console.log(filterParam)
            for(let key in filterParam){

              if((filterParam[key]&&filterParam[key].length>0)||filterParam[key]>0){
                param[key]=filterParam[key];
              }
            }
            this.getLists(param);
        },
        pageChange(val){
          this.pageNo=val;
          let filterParam = {...this.filterForm};
          delete filterParam.dateRange;
          let param = {};
          for(let key in filterParam){
            if(filterParam[key].length>0||filterParam[key]>0){
              param[key]=filterParam[key];
            }
          }
          this.getLists(param);
        },
        pageSizeChange(val){
          this.pageSize=val;
          let filterParam = {...this.filterForm};
          delete filterParam.dateRange;
          let param = {};
          for(let key in filterParam){
            if(filterParam[key].length>0||filterParam[key]>0){
              param[key]=filterParam[key];
            }
          }
          this.getLists(param);
        },
        exportExcel(){
          let filterParam = {...this.filterForm};
          delete filterParam.dateRange;
          let param = {};
          for(let key in filterParam){
            if(!!filterParam[key]){

            }
            if(filterParam[key].length>0||filterParam[key]>0){
              param[key]=filterParam[key];
            }
          }
            // delete filterForm.dateRange;
            let id = this.id;
            this.$http.post(`/server/order/list/export`,{
              id:id,
              ...param
            },{responseType:'blob'}).then(res=>{
              util.downloadExcel(res)

            })
        }
      },
      mounted(){
          this.id=this.$route.query.id;
          this.getLists();
          this.getOrderCount();
          //获取报修分类
          util.getRepairType((data)=>{
            this.repairTypeLists=data;
          })
      }
    }
</script>

<style scoped>

</style>
