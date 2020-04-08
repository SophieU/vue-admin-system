
<style scoped lang="scss">
  @import './service';
</style>
<template>
    <div>
      <Card  v-show="page==='list'">
          <div class="clearfix mb-15">
            <div class="pull-left">
              <Button type="primary" @click="newStation">新建</Button>
            </div>
          </div>
          <div class="table-wrapper">
            <Spin fix v-show="loading == true">加载中...</Spin>
            <Table :data="portLists" :columns="columns"></Table>
            <div class="pagination">
              <Page :current.sync="pageNo" :page-size="pageSize" :total="totalCount"  show-elevator
                    @on-change="pageToggle"
                    @on-page-size-change="pageSizeToggle"
              ></Page>
            </div>
          </div>
      </Card>
      <PortInfo v-show="page==='info'" ref="portInfo" :title="modalTitle+'服务网点'" :refresh="getLists" :loading.sync="loading" :viewPortInfo.sync="viewPortInfo" :page.sync="page"/>
    </div>
</template>

<script>

  import PortInfo from './components/port-info'
    export default {
        name: "service-port",
      components:{
        PortInfo,
      },
      data(){
          return{
            page:'list', //list-列表页，info-详情页
            viewPortInfo:false, //查看网点信息时，所有项 不可编辑
            modalTitle:'添加',
            loading:true,
            pageNo:1,
            totalCount:0,
            pageSize:10,
            columns:[
              {title:'网点名称',key:'name',align:'center'},
              {title:'是否自营',key:'isSelf',align:'center',render:(h,params)=>{
                  let val;
                  params.row.isSelf == 'Y'?val = '是': val = '否';
                  return ('span',val)
                }},
              {title:'网点地址',key:'address',align:'center'},
              {title:'联系电话',key:'phone',align:'center'},
              {title:'服务区域数量',key:'regionNum',align:'center'},
              {title:'服务状态',key:'stateName',align:'center'},
              {title:'操作',align:'center',render:(h,params)=>{
                  let _this = this;
                  return h('div',[
                    h('Button',{
                      props:{type:'primary',size:'small'},
                      style:{marginRight:'8px'},
                      on:{
                        click:()=>{
                          let id = params.row.id;
                          _this.viewPortInfo=true;
                          _this.modalTitle='查看';
                          _this.page='info';
                          _this.$nextTick(()=>{
                            _this.$refs['portInfo'].getStation(id);
                            _this.$refs['portInfo'].getStationInfo(id);
                          })
                          _this.loading = true;
                        }
                      }
                    },'查看'),
                    h('Button',{
                      props:{type:'warning',size:'small'},
                      on:{
                        click:()=>{
                          let id=params.row.id;
                          _this.viewPortInfo=false;
                          _this.modalTitle='编辑';
                          _this.page='info';
                          _this.loading = true;
                          _this.$nextTick(()=>{
                            _this.$refs['portInfo'].getStation(id);
                            _this.$refs['portInfo'].getStationInfo(id);
                          })
                        }
                      }
                    },'编辑'),
                  ])
                }},
            ],
            portLists:[], //列表数据
            portSetting:false, //开启弹窗
          }
      },
      methods:{
          //获取列表
          getLists(){
            let params = `pageNo=${this.pageNo}&pageSize=${this.pageSize}`;
            this.$http.get(`/yyht/v1/repair/station/pageList?${params}`)
              .then(res=>{
                let data = res.data;
                if(data.code===0){
                  this.portLists=data.data.list;
                  this.pageSize=data.data.pageSize;
                  this.totalCount = data.data.totalCount;
                  this.loading = false;
                }

              })
          },
        //页码变化
        pageToggle(page){
          this.loading = true;
          this.pageNo=page;
          this.getLists();
        },
        //每页条数变化
        pageSizeToggle(size){
          this.loading = true;
          this.pageSize=size;
          this.getLists();
        },
        init(){
          this.pageNo=1;
          this.hasNextPage=true;
          this.$refs['portInfo'].init();
        },

        //新建网点
        newStation(){
          this.page='info';
          this.modalTitle='添加';
          this.viewPortInfo=false;
          this.$nextTick(()=>{
            this.$refs.portInfo.newStation();
          })

          // this.portSetting=true;
        },
        modalHide(val){
            if(!val){
              this.$refs['portSet'].resetFields(); //重置验证信息
            }
        }
      },
      mounted(){
          this.getLists();

      },
      watch:{
        page(newVal,oldVal){
          if(newVal==='list'){
            this.init();
            this.getLists();
          }

        }
      }
    }
</script>

