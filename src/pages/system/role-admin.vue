<template>
    <div>
      <Card>
        <div class="clearfix mb-15">
          <div class="pull-left">
            <Button type="primary" icon="md-add-circle" @click="goControl(1)">新建</Button>
          </div>
        </div>
        <div class="table-wrapper">
          <Spin fix v-show="loading == true">加载中...</Spin>
          <Table :data="roleLists" :columns="roleColumns"></Table>
        </div>
        <div class="pagination">
          <Page  :total="pageConfig.totalCount" :current="pageConfig.pageNo" :page-size="pageConfig.pageSize" show-elevator
                 @on-change="pageChange"
                 @on-page-size-change="pageSizeChange"
          ></Page>
        </div>
      </Card>
    </div>
</template>

<script>
    export default {
        name: "role-admin",
      data(){
          return{
            loading:true,
            roleColumns:[
              {
                title:'角色名',
                key:'name',
                align:'center'
              },
              {
              title:'角色描述',
                key:'description',
                align:'center'
              },
              {
              title:'操作',
                align:'center',
                render:(h,params)=>{
                  let _this = this;
                  let id = params.row.id;
                  return h('div',[
                    h('Button',{
                      props:{
                        type:'primary',
                        size:'small'
                      },
                      style:{marginRight:'8px'},
                      on:{
                        click(){
                          _this.viewInfo=true;
                          _this.goControl(2,id);
                        }
                      }
                    },'查看'),
                     h('Button',{
                      props:{
                        type:'warning',
                        size:'small'
                      },
                       on:{
                         click(){
                           _this.viewInfo=true;
                           _this.goControl(0,id);
                         }
                       }
                    },'编辑'),

                  ])
                }
              }
            ],
            roleLists:[],
            pageConfig:{
              pageNo:1,
              pageSize:10,
              totalCount:0,
            }
          }
      },
      methods:{
        pageChange(e){  //分页当前页码改变
          this.loading = true;
          this.pageConfig.pageNo = e;
          this.getRoleLists()
        },
        pageSizeChange(e){  //分页页数改变
          this.loading = true;
          this.pageConfig.pageSize = e;
          this.getRoleLists()
        },
          goControl(type,id){
            /*
            * @params: type:跳转类型，1:新建，0：编辑，2：查看
            * */
            this.$router.push({name:'editRole',query:{type:type,id:id}});
          },
        getRoleLists(){
          this.$http.get(`/sys/v1/role/findRoleListWithPage?pageNo=${this.pageConfig.pageNo}&pageSize=${this.pageConfig.pageSize}`)
            .then(res=>{
              if(res.data.code===0){
                this.pageConfig.totalCount = res.data.data.totalCount;
                this.roleLists=res.data.data.list;
                this.loading = false;
              }
            })
        },
      },
      mounted(){
        this.getRoleLists();
      }
    }
</script>

<style scoped>

</style>
