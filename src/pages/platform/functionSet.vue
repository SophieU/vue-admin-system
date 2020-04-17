<template>
  <div>
    <Card>
      <div class="clearfix mb-15">
        <div class="pull-right">
          <Button icon="md-add" type="primary" @click="functionFn">新增</Button>
        </div>
      </div>
      <Spin fix v-show="loading == true">加载中...</Spin>
<!--       draggable @on-drag-drop="dragRow"-->
      <Table :columns="columns" :data="lists"></Table>
<!--       <div class="pagination mt-15">-->
<!--        <Page :current.sync="pageConfig.current" :page-size="pageConfig.size" :total="pageConfig.totalCount" @on-change="changeCurrent" @on-page-size-change="changeSize" show-elevator show-sizer></Page>-->
<!--      </div>-->
    </Card>
     <Model :addService="addService"
             :current="pageConfig.current"
             :size="pageConfig.bigSize"
             :addTitle="addTitle"
             :functionId="functionId"
             @updateCol="updateList"
             @getStatus="modelStatus"
             @deleteId="deleteSingleId"
    ></Model>
  </div>
</template>

<script>
import util from '../../libs/util'
// import {functionSort} from '../../assets/request/apis/activities'
import Model from './components/model.vue'
    export default {
      name: "functionSet",
      data(){
          return{
            loading:true,
            pageConfig:{  //table分页
               current:1,
               size:10,
               bigSize:100,
               totalCount:0,
            },
            functionId:'',//用于编辑时的id
            addTitle:'新增服务',//模态框title
            addService:false,
            columns:[
              {title:'编号',key:'',align: 'center',render:(h,params)=>{
                return h('span',params.index+1)
                }},
              {title:'图片',key:'imageName',align: 'center',render:(h,params)=>{
                let src = params.row.imageName
                return h('img',{
                    attrs:{
                      src:src
                    },
                    style:{
                      height:'40px',
                      width:'60px'
                    }
                  })
              }},
              {title:'服务名称',align: 'center',key:'serviceName'},
              {title:'类型',align: 'center',key:'categoryName'},
              {title:'是否长期有效',align: 'center',key:'isLongValid'},
              {title:'开始时间',align: 'center',key:'startTime'},
              {title:'结束时间',align: 'center',key:'endTime'},
              {title:'操作',align: 'center',key:'',render:(h,params)=>{
                return h('div',[
                  h('Button',{
                    props:{
                      type:'primary',
                      size:'small'
                    },
                    style:{
                      marginRight:"5px"
                    },
                    on:{
                      click:()=>{
                        this.functionId = params.row.id
                        this.addService = true
                        this.addTitle = '编辑服务'
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
        // dragRow(a,b){       //拖拽行序列
        //   let data = util.sortTableRow(a,b,this.lists)
        //   this.lists = data
        //   // functionSort(this.lists)
        // },
        // changeSize(e){    //分页size的改变
        //   this.pageConfig.size = e
        //   this.getCols()
        // },
        // changeCurrent(e){ //分页页码的改变
        //   this.pageConfig.current = e
        //   this.getCols()
        // },
        functionFn(){  //新增按钮
          this.addService = true;
        },
        deleteSingleId(data){ //删除singleID
          if(data == true){
            this.functionId = ''
          }
        },
        updateList(data){ //子组件传递上来的方法  用于给定一个flag判断是否刷新列表
         if(data == true){
           this.getCols()
           this.addService = false
         }
        },
        modelStatus(data){  //通过父组件控制模态框关闭
          if(data == false){
            this.addService = false;
            this.functionId = '';
            this. addTitle = '新增服务';
          }
         },
        deleteSingle(data){  //删除
         this.$http.post(`/yyht/v1/service/default/delete?id=${data}`).then(res=>{
          if(res.data.code == 0){
             this.$Message.success('删除成功');
             this.$store.commit('setDeleteModal',{model:false})
             this.getCols();
          }else{
            this.$Message.warning(res.data.msg)
            this.$store.commit('setDeleteModal',{model:false})
          }
        })
        },
        getCols(){ //获取页面table数据
        this.loading = true;
          this.$http.get(`/yyht/v1/service/default/getAllServiceDefault`).then(res=>{
            if(res.data.code == 0){
              this.lists = res.data.data;
              this.loading = false;
            }else{
              this.$Message.warning(res.data.msg)
            }
          })
        },
      },
      mounted(){
        this.getCols()
      }
    }
</script>

