<template>
  <div>
    <div class="card no-border mb-15">
      <div class="card-header">
        <div class="card-title">统计</div>
      </div>
      <div class="card-body">
        <table class="native-table">
          <thead>
          <tr>
            <th>工单金额</th>
            <th>工单实收</th>
            <th>平台佣金</th>
            <th>师傅收益</th>
            <th>公司收益</th>
          </tr>
          </thead>
          <tbody >
          <tr>
            <td>{{orderRecord.totalAmount}}</td>
            <td>{{orderRecord.realAmount}}</td>
            <td>{{orderRecord.totalPlatformCommission}}</td>
            <td>{{orderRecord.totalEmployeeCommission}}</td>
            <td>{{orderRecord.companyCommission}}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="card no-border">
      <div class="card-header">
        <div class="card-title">明细</div>
      </div>
      <div class="card-body">
        <table class="native-table">
          <thead>
          <tr>
            <th>类别</th>
            <th>项目</th>
            <th>数量</th>
            <th>单价</th>
            <th>小计</th>
            <th>师傅收益</th>
            <th>平台佣金比例</th>
            <th>平台收益</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item,index) in offerPlanList" :key="index">
            <td>{{item.planType}}</td>
            <td>{{item.planName}}</td>
            <td>{{item.serviceNum}}</td>
            <td>{{item.serviceCost}}</td>
            <td>{{item.amount}}</td>
            <td>{{item.employeeCommission}}</td>
            <td>{{item.rate?item.rate+'%':''}}</td>
            <td>{{item.platformCommission}}</td>
          </tr>
          </tbody>
          <tfoot v-if="offerPlanList.length<=0">
            <tr>
              <td colspan="8">暂无数据</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
        name: "order-income",
      data(){
          return {
            offerPlanList:[],
            orderRecord:{}
          }
      },
      methods:{
          getIncome(id){
            this.$http.get(`/repair/order/earning/list?id=${id}`)
              .then(res=>{
                if(res.data.code===0){
                  let data = res.data.data;
                  this.offerPlanList=data.offerPlanList;
                  this.orderRecord=data.orderRecord;
                }else{
                  console.log('工单收益：'+res.data.msg)
                }
              })
          }
      },
      mounted(){
          let id = this.$route.query.id;
          this.getIncome(id);
      }
    }
</script>

<style scoped>

</style>
