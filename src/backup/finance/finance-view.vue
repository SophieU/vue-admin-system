<template>
  <div>
    <Card class="mb-15">
      <!--<div class="clearfix mb-15">-->
        <!--<div class="pull-left">-->
          <!--<Button @click="viewType='1'" :type="viewType==='1'?'primary':'default'">本月</Button>-->
          <!--<Button @click="viewType='2'" :type="viewType==='2'?'primary':'default'">前三月</Button>-->

        <!--</div>-->
      <!--</div>-->
      <div>
        <Tabs type="card" v-model="nowTab">
          <TabPane label="概览" name="total">
            <Total ref="totalView" :stationLists="stationLists"/>
          </TabPane>
          <TabPane label="工单收入" name="order">
            <Order ref="orderView"  :timeTab="timeTab"  :stationLists="stationLists" :repairLists="repairLists"/>
          </TabPane>
          <TabPane label="套餐销售收入" name="meal">
            <Meal ref="mealView"  :timeTab="timeTab"  :stationLists="stationLists" :repairLists="repairLists"/>
          </TabPane>
        </Tabs>
      </div>
    </Card>
  </div>

</template>

<script>
  import Total from './component/finance-total'
  import Order from './component/finance-order'
  import Meal from './component/finance-meal'
  import util from '../../libs/util'
    export default {
        name: "finance-view",
      components:{
        Total,
        Order,
        Meal,
      },
      data(){
          return{
            nowTab:'total',
            viewType:'1', //概况时间：本月-1,前三月-2
            timeTab:{
              timeType:1,
              timeScope:1,
            },
            repairLists:[], //报修下拉
            stationLists:[], //网点下拉
          }
      },
      methods:{
          /*切换筛选*/
        // toggleFilter(state){
        //   switch(this.nowTab){
        //     case 'total':
        //       this.viewFilter=state;
        //       break;
        //     case 'order':
        //       this.orderFilter=state;
        //       break;
        //     case 'meal':
        //       this.mealFilter=state;
        //       break;
        //     default:
        //       this.viewFilter=false;
        //       this.orderFilter=false;
        //       this.mealFilter=false;
        //   }
        // },

        //筛选时间范围格式化
        // filterDateChange(val,key){
        //     this[key].startDate=val[0];
        //     this[key].endDate=val[1];
        // },
        //导出
        // exportExcel(tabName){
        //   let url='';
        //   let timeTab=this.timeTab;
        //   let filter={};
        //   switch(tabName){
        //     case 'total':
        //       url='/simple/financial/export';
        //       filter=this.totalFilterForm;
        //       break;
        //     case 'order':
        //       url='/order/financial/export';
        //       filter=this.orderFilterForm;
        //       break;
        //     case 'meal':
        //       url='/service/financial/export';
        //       filter=this.mealFilterForm;
        //       break;
        //   }
        //   delete filter.dateRange;
        //   let params = Object.assign({},timeTab,filter);
        //   let query=util.formatterParams(params);
        //   this.$http.post(`${url}?${query}`,null,{responseType:'blob'})
        //     .then(res=>{
        //       util.downloadExcel(res);
        //     })
        // },
      },
      mounted(){
        //报修下拉
        util.getRepairType(data=>{
          this.repairLists=data;
        });
        //网点下拉
        util.getStationLists(data=>{
          this.stationLists=data;
        })
      },
      watch:{
        viewType(newVal){
            if(newVal){
              this.timeTab={
                timeType:1,
                timeScope:newVal
              };
            }
          }
      }
    }
</script>

<style scoped>

</style>
