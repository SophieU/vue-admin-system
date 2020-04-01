
<style scoped lang="scss">
  @import "../order";
</style>

<template>
  <div>
    <table class="flow-table">
      <thead>
      <tr>
        <th>活动</th>
        <th>活动描述</th>
        <th>活动原因/备注</th>
        <th>处理组织</th>
        <th>处理人员</th>
        <th>时间</th>
      </tr>
      </thead>
      <tbody>
        <tr v-for="(flow,index) in flowLists" :key="index">
          <td>{{flow.title}}</td>
          <td>{{flow.logMsg}}</td>
          <td class="wrap-word">{{flow.logMsgRemarks}}</td>
          <td>{{flow.logOrgName}}</td>
          <td>{{flow.logUserName}}</td>
          <td>{{flow.logTime}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
    export default {
        name: "order-flow",
      data(){
          return{
            flowLists:[]
          }
      },
      methods:{
          getFlow(id){
            this.$http.get(`/yyht/v1/repair/order/schedule?id=${id}`)
              .then(res=>{
                if(res.data.code===0){
                  this.flowLists=res.data.data;

                }else{
                  console.log('工单进度获取失败：'+res.data.msg);
                }
              })
          }
      },
      mounted(){
          let id = this.$route.query.id;
          this.getFlow(id)
      }
    }
</script>
