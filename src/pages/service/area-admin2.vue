<template>
    <div>
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
              @on-change="getAreaLists"
            ></Page>
          </div>
        </div>
      </Card>
      <Card v-else>
        <p slot="title">{{pageType==='add'?'新增区域':'编辑区域'}}</p>
        <AreaEdit />
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
        // areaLists:[],
        // editInd:'',
        // areaName:'',
        // editId:'', //编辑的Id
        // radioCheck:'',
        // loadingSave:false,
        // stationColumn:[
        //   {title:'服务商名称',key:'name',align:'center'},
        //   {title:'网点地址',key:'address',align:'center'},
        //   {title:'联系电话',key:'phone',align:'center'},
        // ],
        pageNo:1,
        pageType:'add', // 页面类型： list-列表（默认），detail-详情编辑, add-新增
        areaLists:[],
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
                      _this.deleteArea(id)
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
      // noSpace(event){
      //   let code = event.code;
      //   if(code==="Space"){
      //     event.preventDefault();
      //     return false;
      //   }
      // },
      // 待添加分页
      getAreaLists(){
        this.$http.get(`/yyht/v1/repair/region/pageList?pageSize=10&pageNo=${this.pageNo}`)
          .then(res=>{
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
      // editThis(ind){
      //   this.editInd=ind;
      // },
      //保存设置
      // saveThis(){
      //   let name = this.areaName;
      //   let id = this.editId;
      //   let paramStr='';
      //   let control='edit';
      //   if(!name){
      //     this.$Message.info('请设置区域名');
      //     return ;
      //   }
      //   //修改
      //   if(name.length>0&&id.length>0){
      //     paramStr=`name=${name}&id=${id}`;
      //   }else if(name.length>0&&!id.length){
      //     //新增
      //     paramStr=`name=${name}`;
      //     control='add';
      //   }
      //   this.loadingSave=true;
      //   this.$http.post(`/yyht/v1/repair/region/addOrUpdate?${paramStr}`)
      //     .then(res=>{
      //       let data = res.data;
      //       if(data.code===0){
      //         this.$Message.success('保存成功');
      //         this.getAreaLists();
      //       }else{
      //         this.$Message.error(`保存失败,${data.msg}`);
      //       }
      //       this.loadingSave=false;
      //     })
      // },
      //添加区域
      // addArea(){
      //   if(this.areaLists[this.areaLists.length-1].name==='新建小区'){
      //     this.$Message.info('请修改新建小区的默认名称');
      //   }else{
      //     this.areaLists.push({name:'新建小区',id:''});
      //     this.editInd=this.areaLists.length-1;
      //     this.areaName='新建小区';
      //     this.editId='';
      //   }
      //   //新增置空服务网点
      //   this.stationLists=[];
      // },
      deleteArea(id){
        this.$http.delete(`/yyht/v1/repair/region/delete?id=${id}`)
          .then(res=>{
            let data = res.data;
            if(data.code===0){
              this.$Message.success('删除成功');
              this.getAreaLists();
            }else{
              this.$Message.error(`删除失败，${data.msg}`)
            }
          })
      },
      // getAreaStations(areaId){
      //   this.$http.get(`/yyht/v1/repair/region/support/station/list?regionId=${areaId}`)
      //     .then(res=>{
      //       if(res.data.code===0){
      //         this.stationLists=res.data.data;
      //       }else{
      //         this.$Message.error(res.data.msg);
      //       }
      //     })
      // }
    },
    mounted(){
      this.getAreaLists();
    },
    watch:{
      // editInd(newVal,oldVal){
      //   this.areaName = this.areaLists[newVal].name;
      //   this.editId = this.areaLists[newVal].id;
      //   this.getAreaStations(this.editId);
      // }
    }
  }
</script>

<style scoped>

</style>
