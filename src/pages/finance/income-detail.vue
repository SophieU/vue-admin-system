<template>
  <Card>
    <div class="clearfix mb-15">
      <div class="pull-left">
        <Button @click="viewType='1'" :type="viewType==='1'?'primary':'default'">本月</Button>
        <Button @click="viewType='2'" :type="viewType==='2'?'primary':'default'">前三月</Button>
        <Button @click="filter=true">筛选</Button>
      </div>

    </div>
    <div>
      <div>
        <Tabs type="card" v-model="nowTab">
          <TabPane label="概览" name="total">
            <Total ref="total" :timeTab="timeTab"  :filter="filterForm" @exportExcel="exportExcel"/>
          </TabPane>
          <TabPane label="工单收入" name="order">
            <Order ref="order" :timeTab="timeTab" :filter="filterForm"   @exportExcel="exportExcel"/>
          </TabPane>
          <TabPane label="套餐销售收入" name="meal">
            <Meal ref="meal" :timeTab="timeTab" :filter="filterForm"  @exportExcel="exportExcel"/>
          </TabPane>
        </Tabs>
      </div>
    </div>

    <!--筛选-->
    <Drawer title="工单筛选"  v-model="filter" width="450" @on-close="clearFilter('filterForm')">
      <div class="clearfix mb-15">
        <div class="pull-left">
          <Button @click="clearFilter('filterForm')">清空筛选条件</Button>
        </div>
        <div class="pull-right">
          <Button @click="sureFilter" type="primary">确定</Button>
        </div>
      </div>
      <i-form ref="filterForm" :model="filterForm" label-position="top">
        <FormItem label="服务分类">
          <Select v-model="filterForm.repairCategoryParentId" @on-change="(id)=>firstTypeChange(id)">
            <Option v-for="item in repairTypeFirst" :key="item.id" :value="item.id">{{item.name}}</Option>
          </Select>
        </FormItem>
        <FormItem label="服务项目"  prop="repairCategoryId">
          <Select v-model="filterForm.repairCategoryId">
            <Option v-for="repair in repairFilterLists" :key="repair.id" :value="repair.id">{{repair.name}}</Option>
          </Select>
        </FormItem>
        <form-item label="套餐名称" prop="serviceName">
          <Input v-model="filterForm.serviceName"/>
        </form-item>
        <form-item label="服务网点" prop="departmentId">
          <Select v-model="filterForm.departmentId">
            <Option v-for="item in stationLists" :key="item.id" :value="item.id">{{item.name}}</Option>
          </Select>
        </form-item>
        <form-item label="时间" prop="dateRange">
          <DatePicker @on-change="filterDateChange" v-model="filterForm.dateRange" type="daterange" style="width:100%;"></DatePicker>
        </form-item>
      </i-form>
    </Drawer>
  </Card>
</template>

<script>
  import util from '../../libs/util'
  import Total from './component/income-total'
  import Order from './component/income-order'
  import Meal from './component/income-meal'

    export default {
        name: "income-detail",
      components:{
        Total,
        Order,
        Meal
      },
      data(){
        return{
          repairTypeFirst:[],
          repairFilterLists:[],
          nowTab:'total',
          viewType:'1',
          timeTab:{
            timeType:1,
            timeScope:1,
          },
          filter:false,
          repairLists:[], //下拉报修分类
          stationLists:[], //下拉网点列表
          filterForm:{
            repairCategoryParentId:'',
            repairCategoryId:'',
            departmentId:'',
            dateRange:[],
            serviceName:'',
          }
        }
      },
      methods:{
        // 新增二级下拉
        firstTypeChange(id,fromType){
          util.getRepairTypeNext(id,data=>{
            if(fromType==='modal'){
              this.repairLists = data;
            }else{
              this.repairFilterLists = data;
            }
          })
        },
        filterDateChange(val){
          this.filterForm.startDate=val[0];
          this.filterForm.endDate=val[1];
        },
        clearFilter(name){
          this.$refs[name].resetFields();
          this.filter=false;
          this.viewType='1';
          this.timeTab={
            timeType:1,
            timeScope:1
          };
          this.sureFilter();
        },
        sureFilter(){
          let filterForm = {...this.filterForm};
          if(filterForm.startDate){
            this.timeTab.timeType='2';
          }
          let timeTab=this.timeTab;
          delete filterForm.dateRange;
          let filter=Object.assign({},timeTab,filterForm);
          this.$refs['total'].sureFilter(filter);
          this.$refs['order'].sureFilter(filter);
          this.$refs['meal'].sureFilter(filter);
          this.filter=false;
        },
        exportExcel(tabName){
          let url='';
          let timeTab=this.timeTab;
          let filter={...this.filterForm};
          switch(tabName){
            case 'total':
              url='/simple/earning/export';
              break;
            case 'order':
              url='/order/earning/export';
              break;
            case 'meal':
              url='/service/earning/export';
              break;
          }
          delete filter.dateRange;
           let params = Object.assign({},timeTab,filter);
            let query=util.formatterParams(params);
            this.$http.post(`${url}?${query}`,null,{responseType:'blob'})
              .then(res=>{
                util.downloadExcel(res);
              })

        }
      },
      mounted(){
        util.getRepairTypeDropdown(data=>{
          this.repairTypeFirst = data;
        })
        util.getStationLists(data=>{
          this.stationLists=data;
        });
      },
      watch:{
        viewType(newVal){
          if(newVal){
            this.timeTab={
              timeType:1,
              timeScope:newVal,
            }
          }
        }
      }
    }
</script>

<style scoped>

</style>
