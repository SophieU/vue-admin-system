<template>
  <div>
    <Card>
      <div class="clearfix mb-15">
        <div class="pull-right">
          <Button icon="md-add" type="primary" @click="homeAdd">首页新增服务</Button>
        </div>
      </div>
      <Table :columns="columns" :data="lists" draggable @on-drag-drop="dragRow" :loading="loading"></Table>
      <div class="pagination mt-15">
        <Page :current.sync="pageConfig.current" :page-size="pageConfig.size" :total="pageConfig.totalCount" @on-change="changeCurrent" @on-page-size-change="changeSize" show-elevator show-sizer></Page>
      </div>
    </Card>
     <Model :addService="addService"
             :current="pageConfig.current"
             :size="pageConfig.bigSize"
             :addTitle="addTitle"
             :singleId="singleId"
             @updateCol="updateList"
             @getStatus="modelStatus"
             @deleteId="deleteSingleId"
    ></Model>
  </div>
</template>

<script>
import util from '../../libs/util'
// import {homeSort} from '../../assets/request/apis/activities'
import Model from './components/model.vue'
  export default {
    name: "functionSet",
    data(){
      return{
        loading:true,
        singleId:'',//要传给子组件的(点击编辑时存下的ID)ID
        addService:false,
        serverId:'',//传数据时需要使用的服务ID
        pageConfig:{ //分页
         current:1,
         size:10,
         bigSize:100,
         totalCount:0
        },
        addTitle:'新增服务',
        columns:[
          {title:'编号',key:'',render:(h,params)=>{
            return h('span',params.index+1)
            }},
          {title:'图标',key:'imageName',render:(h,params)=>{
            let src = params.row.imageName
            return h('img',{
              attrs:{
                src:src
              },
              style:{
                width:'50px',
                height:'40px'
              }
            })
          }},
          {title:'服务名称',key:'serviceName'},
          {title:'类型',key:'categoryName'},
          {title:'是否长期有效',key:'isLongValid'},
          {title:'开始时间',key:'startTime'},
          {title:'结束时间',key:'endTime'},
          {title:'操作',key:'',render:(h,params)=>{
              return h('div',[
                h('Button',{
                  props:{
                    type:'primary',
                    size:'small'
                  },
                  on:{
                    click:()=>{
                      this.singleId = params.row.id;
                      this.addService = true;
                      this.addTitle = '编辑服务';
                    }
                  }
                },'编辑'),
                h('Button',{
                  props:{
                    type:'error',
                    size:'small'
                  },
                  on:{
                    click:()=>{
                      let _this = this;
                       _this.$store.commit('setDeleteModal',{model:true,callback:()=>{
                          _this.deleteSingle(params.row.id);
                        }})
                    }
                  }
                },'删除'),
              ])
            }},
        ],
        lists:[]
      }
    },
    components:{
         Model
    },
    methods:{
      dragRow(a,b){       //拖拽行序列
        let data = util.sortTableRow(a,b,this.lists)
        this.lists = data
        // homeSort(this.lists)
      },
      changeSize(e){    //分页size的改变
        this.pageConfig.size = e
        this.getCol()
      },
      changeCurrent(e){ //分页页码的改变
        this.pageConfig.current = e
        this.getCol()
      },
      deleteSingleId(data){ //删除singleID
        if(data == true){
          this.singleId = ''
        }
      },
      modelStatus(data){  //通过父组件控制模态框关闭
        if(data == false){
          this.addService = false;
          this.singleId = '';
          this.addTitle = '新增服务';
        }
      },
      deleteSingle(data){ //根据ID删除单条信息
        this.$http.delete(`/service/default/deleteServiceDefaultById?id=${data}`).then(res=>{
          if(res.data.code == 0){
             this.$Message.success('删除成功');
             this.$store.commit('setDeleteModal',{model:false})
             this.getCol();
          }else{
            this.$Message.warning(res.data.msg)
          }
        })
      },
      updateList(data){ //子组件传递上来的方法  用于给定一个flag判断是否刷新列表
         if(data == true){
           this.getCol()
           this.addService = false
         }
      },
      getCol(){ //获取首页服务一进页面的数据
      this.loading = true;
        this.$http.get(`/service/default/getAllServiceDefault?PageSize=${this.pageConfig.size}&pageNo=${this.pageConfig.current}`).then(res=>{
          if(res.data.code == 0){
            this.lists = res.data.data.list;
            this.loading = false;
            this.pageConfig.totalCount = res.data.data.totalCount;
          }else{
            this.$Message.warning(res.data.msg)
          }
        })
      },
      homeAdd(){ //新增按钮
        this.addService = true
      }
    },
    mounted(){
     this.getCol()
    }
  }
</script>

<style scoped>

</style>


