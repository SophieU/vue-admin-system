<template>
  <div>
    <Card>
      <div class="clearfix mb-15">
        <div class="pull-right">
          <Button type="primary" @click="$router.push({name:'insuranceInfo',query:{type:'new'}})">新建</Button>
        </div>
      </div>
      <div class="table-wrapper">
        <Table :data="lists" :columns="tableColumn" @on-sort-change="sortData"></Table>
        <div class="pagination">
          <Page :total="totalCount" show-elevator :current.sync="pageNo" :page-size="pageSize" @on-change="(page)=>getLists(page,pageSize)" @on-page-size-change="(size)=>getLists(1,size)"></Page>
        </div>
      </div>
    </Card>
  </div>
</template>

<script>
    export default {
        name: "insurance",
      data(){
          return {
            tableColumn:[
              {
                title:'保险名称',
                key:'name',
                align:'center'
              },{
                title:'有效期',
                key:'validMonth',
                align:'center'
              },{
                title:'备注',
                key:'remark',
                align:'center'
              },{
                title:'售价',
                key:'salePrice',
                align:'center'
              },{
                title:'状态',
                key:'saleState',
                align:'center',
                render:(h,params)=>{
                  let state = params.row.saleState;
                  let text = state==='1'?'在售':'停售';
                  return text;
                }
              },{
                title:'销售数',
                key:'saleNum',
                sortable:'custom',
                align:'center'
              },{
                title:'创建时间',
                key:'createTime',
                sortable:'custom',
                align:'center'
              },{
                title:'操作',
                width:150,
                align:'center',
                render:(h,params)=>{
                  let _this = this;
                  let id=params.row.id;
                  let state=params.row.saleState;
                  let status=state==='1'?true:false;
                  let text;
                  if(status){
                    text='暂停销售';
                  }else{
                    text='开启销售'
                  }
                  return h('div',[
                    h('Button',{
                      props:{
                        type:'primary',
                        size:'small',
                      },
                      style:{marginRight:'8px'},
                      on:{
                        click(){
                          _this.toggleSaleState(id,state);
                        }
                      }
                    },text),
                    h('Button',{
                      props:{
                        type:'primary',
                        size:'small'
                      },
                      on:{
                        click(){
                          _this.$router.push({name:'insuranceInfo',query:{type:'view',id:id}})
                        }
                      }
                    },'查看'),

                  ])
                }
              },
            ],
            lists:[],
            pageNo:1,
            pageSize:10,
            totalCount:0,
            sortArr:[]
          }
      },
      methods:{
          //排序
        sortData(sortObj){
          let field=sortObj.key;
          let type=sortObj.order.toUpperCase();
          this.sortArr=[{field:field,type:type}];
          this.getLists(1,10);
        },
          getLists(page,size){
            let params=`pageNo=${page}&pageSize=${size}`;
            this.pageNo=page;
            this.pageSize=size;
            this.$http.post(`/insurance/list?${params}`,{sortList:this.sortArr})
              .then(res=>{
                if(res.data.code===0){
                  let data=res.data.data;
                  this.lists=data.list;
                  this.totalCount=data.totalCount;
                }
              })
          },
        //上下架
        toggleSaleState(id,state){
            state=state==='1'?'0':'1';
            let params=`id=${id}&state=${state}`;
            this.$http.get(`/insurance/change/saleState?${params}`)
              .then(res=>{
                if(res.data.code===0){
                  this.$Message.success('操作成功');
                  this.getLists(this.pageNo,this.pageSize);
                }else{
                  this.$Message.error(res.data.msg);
                }
              }).catch(err=>{
              this.$Message.error('操作失败，请稍候再试');
            })
        }
      },
      mounted(){
          this.getLists(this.pageNo,this.pageSize);
      }
    }
</script>

<style scoped>

</style>
