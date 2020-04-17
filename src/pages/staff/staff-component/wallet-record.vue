<template>
  <div>
    <Card class="mb-15">
      <Spin fix v-show="loading == true">加载中...</Spin>
      <Table :columns="columns" :data="lists"></Table>
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
          {title:'业务行为',key:'actionTypeName',align:'center'},
          {title:'业务描述',key:'changeIntro',align:'center'},
          {title:'变动金额',align:'center',render:(h,params)=>{
              let changeType = params.row.changeType=='-1'?'-':'+'
              let color = changeType=='-'?'#19be6b':'#ed4014'
              let num = params.row.changeNum
              return h('span',{style:{color}},changeType+num)
            }},
          {title:'余额',key:'surplusNum',align:'center'},
          {title:'时间',key:'createTime',align:'center'},
          {title:'钱包状态',align:'center',render:(h,params)=>{
              let state = params.row.state==='1'?'正常':'冻结中'
              let color = state==='正常'?'#2d8cf0':'#ed4014'
              return h('span',{style:{color}},state)
            }},
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
        }
        this.$http.get(`/yyht/v1/user/getUserAccountLogPageList`,{params:params}).then(res=>{
          this.loading=false;
          if(res.data.code===0){
            let data = res.data.data;
            this.lists=data.list
            this.totalCount=data.totalCount;
            console.log(data)
          }else{
            console.log(res.data.msg)
          }
        })
      }
    },

  }
</script>

<style scoped>

</style>
