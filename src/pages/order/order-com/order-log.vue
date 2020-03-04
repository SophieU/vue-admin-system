
<style scoped lang="scss">
  @import "../order.scss";
</style>

<template>
  <div>
    <table class="flow-table">
      <thead>
      <tr>
        <th>时间</th>
        <th>添加人</th>
        <th>日志内容</th>
      </tr>
      </thead>
      <tbody>
        <tr v-for="(flow,index) in flowLists" :key="index">
          <td>{{flow.createTime}}</td>
          <td>{{flow.logUserName}}</td>
          <td class="wrap-word">{{flow.content}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: "order-log",
  data(){
    return{
      flowLists:[]
    }
  },
  methods:{
    getLog(id){
      this.$http.get(`/repair/order/custom/log/list?orderId=${id}`)
        .then(res=>{
          if(res.data.code===0){
            this.flowLists=res.data.data;
          }else{
            console.log('工单日志获取失败：'+res.data.msg);
          }
        })
    }
  },
  mounted(){
    let id = this.$route.query.id;
    this.getLog(id)
  }
}
</script>
