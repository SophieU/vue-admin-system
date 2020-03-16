<template>
    <div>
      <Card class="mb-15">
        <div class="clearfix mb-15">
          <div class="pull-left">
            <Button @click="viewType='1'" :type="viewType==='1'?'primary':'default'">本月</Button>
            <Button @click="viewType='2'" :type="viewType==='2'?'primary':'default'">前三月</Button>
            <Button @click="toggleFilter(true)">筛选</Button>
          </div>
        </div>
        <div>
          <Tabs type="card" v-model="nowTab">
            <TabPane label="套餐销售" name="meal">
              <Meal ref="mealView"  :timeTab="timeTab"  @exportExcel="exportExcel"/>
            </TabPane>
          </Tabs>
        </div>
      </Card>
      <!--套餐筛选-->
      <Drawer title="套餐筛选" v-model="mealFilterModal" width="450">
        <div class="clearfix mb-15">
          <div class="pull-left">
            <Button @click="clearFilter('mealFilter','meal')">清空筛选条件</Button>
          </div>
          <div class="pull-right">
            <Button @click="sureFilter('mealView')" type="primary">确定</Button>
          </div>
        </div>
        <i-form ref="mealFilter" :model="mealFilter" label-position="top">
          <form-item label="工单号" prop="orderSn">
            <Input placeholder="请输入工单编号" v-model="mealFilter.orderSn"/>
          </form-item>
          <form-item label="服务网点" prop="stationId">
            <Select v-model="mealFilter.stationId">
              <Option v-for="item in stationLists" :key="item.id" :value="item.id">{{item.name}}</Option>
            </Select>
          </form-item>
          <form-item label="付款日期"  prop="dateRange">
            <DatePicker @on-change="(val)=>filterDateChange(val,'mealFilter')" v-model="mealFilter.dateRange" type="daterange" style="width:100%;"></DatePicker>
          </form-item>
           <form-item label="扎账状态"  prop="dateRange">
             <Select placeholder="请选择扎账状态" v-model="mealFilter.hasConfirmed">
               <Option value="Y">是</Option>
               <Option value="N">否</Option>
             </Select>
          </form-item>

        </i-form>
      </Drawer>
    </div>
</template>

<script>
  import Meal from './component/settle-meal'
  import util from '../../libs/util'
    export default {
        name: "settle-accounts",
      components:{Meal},
      data(){
          return {
            viewType:'1',
            nowTab:'meal',
            timeTab:{
              timeType:1,
              timeScope:1,
            },
            mealFilterModal:false,
            mealFilter:{
              dateRange:[],
              orderSn:'',
              stationId:'',
              hasConfirmed:'',
            },
            stationLists:[], //网点下拉
          }
      },
      mounted(){
        //网点下拉
        util.getStationLists(data=>{
          this.stationLists=data;
        })
      },
      methods:{
        //筛选时间范围格式化
        filterDateChange(val,key){
          this[key].startDate=val[0];
          this[key].endDate=val[1];
        },
        //导出
        exportExcel(tabName){
          let url='';
          let timeTab=this.timeTab;
          let filter={};
          switch(tabName){
            case 'settleMeal':
              url='/service/order/cash/financial/export';
              filter=this.mealFilter;
              break;
          }
          delete filter.dateRange;
          let params = Object.assign({},timeTab,filter);
          let query=util.formatterParams(params);
          this.$http.post(`${url}?${query}`,null,{responseType:'blob'})
            .then(res=>{
              util.downloadExcel(res);
            })
        },
        //关闭并清理筛选
        clearFilter(filterName,tabName){
          this.$refs[filterName].resetFields();
          // this.timeTab={
          //   timeType:1,
          //   timeScope:1
          // };

          this.sureFilter(`${tabName}View`);
          this.toggleFilter(false);
        },
        //确认筛选
        sureFilter(tabName){
          let nowTab = this.nowTab;
          let filter;
          switch(nowTab){
            case 'meal':
              filter=this.mealFilter;
              break;
            default:
              filter={};
          }
          if(filter.startDate){
            this.timeTab.timeType='2';
          }
          let timeTab=this.timeTab;
          let params=Object.assign({},timeTab,filter);
          delete params.dateRange;
          this.$refs[tabName].sureFilter(params);
          this.toggleFilter(false);
        },
        /*切换筛选*/
        toggleFilter(state){
          switch(this.nowTab){
            case 'meal':
              this.mealFilterModal=state;
              break;
            default:
              this.mealFilterModal=false;
          }
        },
      },
      watch:{
        viewType(newVal){
          if(newVal){
            this.timeTab={
              timeType:1,
              timeScope:newVal
            };
            this.mealFilter={
              dateRange:[],
              orderSn:'',
              stationId:'',
              hasConfirmed:'',
            }
          }
        }
      }
    }
</script>

<style scoped>

</style>
