<style scoped lang="scss">
  @import "./staff.scss";
</style>
<template>
  <div style="padding-bottom: 30px;">
    <Card class="mb-15">
      <ul class="nav-ul">
        <router-link active-class="text-blue" replace tag="li" exact :to="{name:'staffDetail',query:{id:id}}">基础信息</router-link>
        <router-link active-class="text-blue" replace tag="li" :to="{name:'staffServiceType',query:{id:id}}">服务类型</router-link>
        <router-link active-class="text-blue" replace tag="li" :to="{name:'staffAccountInfo',query:{id:id}}">账号信息</router-link>
        <router-link active-class="text-blue" replace tag="li" :to="{name:'staffOrderIncome',query:{id:id}}">工单收益</router-link>
        <router-link active-class="text-blue" replace tag="li" :to="{name:'staffOrderInfo',query:{id:id}}">工单信息</router-link>
        <router-link active-class="text-blue" replace tag="li" :to="{name:'staffEvaluate',query:{id:id}}">评价</router-link>
        <router-link active-class="text-blue" replace tag="li" :to="{name:'staffControl',query:{id:id}}">账号管控</router-link>
      </ul>
    </Card>
    <router-view></router-view>
  </div>

</template>

<script>
    export default {
        name: "staff-detail",
      data(){
        return {
          id:'',
        }
      },
        mounted(){
          let id = this.$route.query.id;
          this.id=id;
        },
    }
</script>


