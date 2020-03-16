<template>
  <div>
    <div class="clearfix mb-15">
      <div class="pull-right">
        <Button @click="$emit('exportExcel','total')" type="primary">excel导出</Button>
      </div>
    </div>
    <div class="table-wrapper mb-15">
      <table class="native-table">
        <thead>
        <tr>
          <th>项目名称</th>
          <th>总收入</th>
          <th>员工结算</th>
          <th>平台佣金</th>
          <th>资产成本</th>
          <th>资产亏损</th>
          <th>总收益</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td>数量</td>
          <td>{{totalCountInfo.orderAmount}}</td>
          <td>{{totalCountInfo.employeeCommission}}</td>
          <td>{{totalCountInfo.platformCommission}}</td>
          <td>{{totalCountInfo.materialEarning}}</td>
          <td>{{totalCountInfo.materialCheckEarning}}</td>
          <td>{{totalCountInfo.serviceEarning}}</td>
        </tr>
        </tbody>
      </table>
    </div>
    <div class="table-wrapper mb-15">
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
        <tr v-for="(item,index) in detail" :key="index">
          <td>{{item.name}}</td>
          <td>{{item.orderAmount}}</td>
          <td>{{item.employeeCommission}}</td>
          <td>{{item.platformCommission}}</td>
          <td>{{item.materialEarning}}</td>
          <td>{{item.materialCheckEarning}}</td>
          <td>{{item.serviceEarning}}</td>
        </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<script>
  import util from '../../../libs/util';
    export default {
        name: "income-total",
      props:['timeTab'],
      data(){
          return {
            totalCountInfo:{},
            detail:[],
            filter:{
              timeType:'1',
              timeScope:'1',
              repairCategoryId:'',
              departmentId:'',
              startDate:'',
              endDate:'',
            }
          }
      },
      mounted(){
        this.getInfo();
      },
      methods:{
          getInfo(filter){
            let postParam = {};
            if(filter){
              postParam=filter
            }else{
              postParam=this.filter;
            }
            postParam=util.formatterParams(postParam)
            this.$http.post(`/simple/earning/count?${postParam}`)
              .then(res=>{
                if(res.data.code===0){
                  let data = res.data.data;
                  this.totalCountInfo=data.totalCountInfo;
                  this.detail=data.detail;
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
          this.getInfo(filter);
        }
      },
      watch:{
        timeTab:{
          handler(newVal,oldVal){
            this.filter.timeType=newVal.timeType;
            this.filter.timeScope=newVal.timeScope;
            this.getInfo(this.filter);
          },
          deep:true
        },
      }
    }
</script>

<style scoped>

</style>
