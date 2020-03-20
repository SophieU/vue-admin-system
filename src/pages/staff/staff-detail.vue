<style scoped lang="scss">
  @import "staff";
</style>
<template>
  <div style="padding-bottom: 30px;">
    <Card class="mb-15">
      <ul class="nav-ul">
        <template v-if="queryType==='service'">
          <router-link active-class="text-blue" replace tag="li" exact :to="{name:'staffDetail',query:{id:id,queryType:queryType}}">基础信息</router-link>
          <router-link active-class="text-blue" replace tag="li" :to="{name:'serviceOrderLists',query:{id:id,queryType:queryType}}">工单列表</router-link>
        </template>
         <template v-if="queryType==='normal'">
           <router-link active-class="text-blue" replace tag="li" exact :to="{name:'staffDetail',query:{id:id,queryType:queryType}}">基础信息</router-link>
           <router-link active-class="text-blue" replace tag="li" :to="{name:'inviteRecord',query:{id:id,queryType:queryType}}">邀请记录</router-link>
           <router-link active-class="text-blue" replace tag="li" :to="{name:'walletRecord',query:{id:id,queryType:queryType}}">钱包记录</router-link>
        </template>
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
          queryType:'', //service-服务师傅，normal-普通用户
        }
      },
        mounted(){
          let id = this.$route.query.id;
          this.queryType = this.$route.query.queryType;
          this.id=id;
          console.log(this.id)
        },
    }
</script>


