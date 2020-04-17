<template>
  <div>
    <Card class="mb-15">
      <div class="pull-right mb-15">
        <Input style="width: 250px" clearable v-model="userMobile" @on-clear="getLists(1 )" placeholder="被邀请人电话"/>
        <Button type="primary" @click="getLists(1)">搜索</Button>
      </div>
      <Spin fix v-show="loading == true">加载中...</Spin>
      <Table style="clear:both;" :columns="columns" :data="lists"></Table>
      <div class="pagination">
        <Page :total="totalCount" :current.sync="pageNo" @on-change="(page)=>getLists(page)"></Page>
      </div>
    </Card>
  </div>
</template>

<script>
export default {
  name: "staff-control",
  data(){
    return{
      userId:'',
      userMobile:'', //搜索被邀请人电话
      columns:[
        {title:'用户电话',key:'userMobile',align:'center'},
        {title:'邀请时间',key:'inviteDate',align:'center'},
        {title:'受邀人电话',key:'inviteUserMobile',align:'center'},
        {title:'首次登录时间',key:'firstLoginDate',align:'center'},
      ],
      lists:[],
      pageNo:1,
      pageSize:10,
      loading:true,
      totalCount:0,
    }
  },
  mounted(){
    this.userId= this.$route.query.id;
    this.getLists();
  },
  methods:{
   getLists(page){
      this.loading=true;
      if(page){this.pageNo= page}
      let params = {
        pageNo:this.pageNo,
        pageSize:this.pageSize,
        userId:this.userId,
        userMobile:this.userMobile
      }
      this.$http.get(`/yyht/v1/user/getInviteUserPageList`,{params:params}).then(res=>{
        this.loading=false;
        if(res.data.code===0){
          let data = res.data.data;
          this.lists=data.list;
          this.totalCount=data.totalCount;
        }else{
          this.$Message.warning(res.data.msg)
        }
      })
   }
  },

}
</script>

<style scoped>

</style>
