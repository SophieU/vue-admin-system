<template>
    <div>
      <Spin fix v-show="loading == true">加载中...</Spin>
      <Card v-if="pageType==='list'">
        <div class="clearfix mb-15">
          <div class="pull-left">
            <Button type="primary" icon="md-add-circle" @click="goControl(1)">新建</Button>
          </div>
        </div>
        <div class="table-wrapper">
          <Table :data="areaLists" :columns="areaColumns"></Table>
          <div class="pagination">
            <Page :page-size="10" :current="pageNo"
              @on-change="(page)=>getAreaLists(page)"
            ></Page>
          </div>
        </div>
      </Card>
      <Card v-else>
        <p slot="title">{{pageType==='add'?'新增区域':'编辑区域'}}</p>
        <AreaEdit :pageType.sync="pageType" :detailId="itemId"/>
      </Card>
    </div>
</template>

<script>
  import AreaEdit from './components/area-edit'
  export default {
    name: "area-admin",
    components:{AreaEdit},
    data(){
      return {
        loading:true,
        pageNo:1,
        pageType:'list', // 页面类型： list-列表（默认），detail-详情编辑, add-新增
        areaLists:[],
        itemId:'', //详情id
        areaColumns:[
          {
            title:'区域名',
            key:'name',
            align:'center',
          },{
            title:'服务说明',
            key:'fullDescribe',
            align:'center',
            render:(h,params)=>{return h('span',{},params.row.fullDescribe||'无')}

          },{
            title:'备注',
            key:'remark',
            align:'center',
            render:(h,params)=>{return h('span',{},params.row.remark||'无')}
          },{
            title:'片区地址',
            key:'areaInfo',
            align:'center',
            render:(h,params)=>{return h('span',{},params.row.areaInfo||'无')}
          },{
            title:'操作',
            align:'center',
            render:(h,params)=>{
              let _this = this;
              return h('div',[
                h('Button',{
                  props:{
                    type:'primary',
                    size:'small'
                  },
                  style:{marginRight:'8px'},
                  on:{
                    click(){
                      _this.pageType='detail';
                      _this.itemId = params.row.id;
                    }
                  }
                },'编辑'),
                h('Button',{
                  props:{
                    type:'error',
                    size:'small'
                  },
                  on:{
                    click(){
                      let id = params.row.id;
                      _this.$store.commit('setDeleteModal',{model:true,callback:function(){
                          _this.deleteArea(id)
                        }});

                    }
                  }
                },'删除')
              ]);

            }
          }
        ]
      }
    },
    methods:{
      goControl(typeInd){
        let type = '';
        switch(typeInd){
          case 1:
            type='add';
            break;
          case 2:
            type='detail';
            break;
          default:
            type='list';
        }
        this.pageType = type
      },
      // 待添加分页
      getAreaLists(page){
        if(page){
          this.pageNo = page
        }
        this.loading=true;
        this.$http.get(`/yyht/v1/repair/region/pageList?pageSize=10&pageNo=${this.pageNo}`)
          .then(res=>{
            this.loading=false;
            let data = res.data;
            if(data.code===0){
              this.areaLists=data.data.list;
            }
            //首次设置默认
            if(this.editInd===''&&this.areaLists.length>0){
              this.editInd=0;
            }
          })
      },

      deleteArea(id){
        this.$http.post(`/yyht/v1/repair/region/delete?id=${id}`)
          .then(res=>{
            let data = res.data;
            this.$store.commit('setDeleteModal',{model:false,callback:function(){}});
            if(data.code===0){
              this.$Message.success('删除成功');
              this.getAreaLists();

            }else{
              this.$Message.error(`删除失败，${data.msg}`)
            }
          })
      },

    },
    watch:{
      pageType(newVal,oldVal){
        if(newVal==='list'){
          this.getAreaLists();
        }
      }
    },
    mounted(){
      this.getAreaLists();
    },
  }
</script>

<style scoped>

</style>
