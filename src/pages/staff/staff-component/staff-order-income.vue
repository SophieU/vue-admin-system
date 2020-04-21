<template>
  <div>
    <Card>
      <p slot="title">工单列表</p>
      <div class="clearfix mb-15">
        <div v-if="filterDateRange" class="pull-left">
          <span>时间：{{filterDateRange[0]}} 至 {{filterDateRange[1]}}</span>
        </div>
        <div class="pull-right">
          <Button @click="filter=true">筛选</Button>
        </div>
      </div>
      <div class="table-wrapper">
        <Table :columns="columns" :data="lists"></Table>
        <div class="pagination">
          <Page :total="totalCount"  show-elevator
            @on-change="pageChange"
                @on-page-size-change="pageSizeChange"
          ></Page>
        </div>
      </div>
    </Card>

    <Drawer width="450" title="收益筛选" v-model="filter">
      <div class="clearfix mb-15">
        <div class="pull-left">
          <Button @click="clearFilter('filterForm')">清空筛选条件</Button>
        </div>
        <div class="pull-right">
          <Button @click="sureFilter" type="primary">确定筛选</Button>
        </div>
      </div>
      <i-form ref="filterForm" :model="filterForm" label-position="top">
        <form-item label="服务分类">
          <Select v-model="filterForm.repairCategoryParentId" @on-change="changeItem">
            <Option v-for="repair in repairTypeLists" :key="repair.id" :value="repair.id">{{repair.name}}</Option>
          </Select>
        </form-item>
        <form-item label="服务项目">
          <Select v-model="filterForm.repairCategoryId">
            <Option v-for="repair in repairSonLists" :key="repair.id" :value="repair.id">{{repair.name}}</Option>
          </Select>
        </form-item>
        <form-item label="工单时间">
          <DatePicker  @on-change="dateRangeChange" v-model="filterForm.dateRange" type="daterange" style="width: 100%;"></DatePicker>
        </form-item>
      </i-form>
    </Drawer>
  </div>
</template>

<script>
  import util from '../../../libs/util'
    export default {
        name: "staff-order-income",
      data(){
          return{
            filter:false,
            id:'', //当前人员id
            orderTotal:'', //总工单数
            columns:[
              {title:'工单号',key:'orderSn',align:'center'},
              {title:'服务类型',key:'repairCategoryName',align:'center'},
              {title:'创建时间',key:'createTime',align:'center'},
              {title:'上门费收益',key:'dtdServiceEarning',align:'center'},
              {title:'服务费收益',key:'serviceEarning',align:'center'},
              {title:'辅材费收益',key:'materialEarning',align:'center'},
              {title:'收益总计',key:'totalEarning',align:'center'},
              {title:'操作',align:'center',render:(h,params)=>{
                let _this = this;
                  return h('Button',{
                    props:{
                      type:'primary',
                      size:'small'
                    },
                    on:{
                      click:function(){
                        let id = params.row.id;
                        _this.$router.push({name:'orderDetail',query:{id:id}});
                      }
                    }
                  },'查看订单')

                }},
            ],
            lists:[],
            pageNo:1,
            pageSize:10,
            totalCount:0,
            repairTypeLists:[], //报修分类列表
            repairSonLists:[],//报修分类项目列表
            filterForm:{
              repairCategoryParentId:'',
              repairCategoryId:'',
              dateRange:[],
              startDate:'',
              endDate:'',
            },
            filterDateRange:null,//标记是否显示
          }
      },
      methods:{
        changeItem(data){
          this.$http.get(`/yyht/v1/repair/category/select/next?parentId=${data}`).then(res=>{
            if(res.data.code == 0){
              this.repairSonLists = res.data.data
            }
          })
        },
        getFirst(){
         this.$http.get(`/yyht/v1/repair/category/select/first`).then(res=>{
           if(res.data.code == 0){
             this.repairTypeLists = res.data.data
           }
         })
        },
        dateRangeChange(val){
          this.filterForm.startDate=val[0];
          this.filterForm.endDate=val[1];
        },
          getRepairType(){
            util.getRepairType((data)=>{
              this.repairTypeLists=data;
            })
          },
          getLists(filter){
            let id = this.id;
            let query = `pageNo=${this.pageNo}&pageSize=${this.pageSize}&id=${id}`;
            let param =util.formatterParams(filter);
            this.$http.get(`/yyht/v1/service/user/order/pageList?${query}&${param}`).then(res=>{
                if(res.data.code===0){
                  let data = res.data.data;
                  this.lists=data.list;
                  this.pageSize=data.pageSize;
                  this.totalCount=data.totalCount;
                  this.filter=false;
                  if(filter&&filter.startDate){
                    this.filterDateRange=[filter.startDate,filter.endDate];
                  }else{
                    this.filterDateRange=null;
                  }
                }else{
                  console.log('工单收益列表失败：'+res.data.msg);
                }
              })
          },
        clearFilter(name){
            this.$refs[name].resetFields();
            this.filterDateRange=null;
            this.filterForm={
                repairCategoryId:'',
                dateRange:[],
                startDate:'',
                endDate:'',
            };
            this.getLists();
        },
        sureFilter(){
            let filterForm ={... this.filterForm};
            delete filterForm.dateRange;
            let param = {};
            for(let key in filterForm){
              if(filterForm[key].length>0||filterForm[key]>0){
                param[key]=filterForm[key];
              }
            }
            this.getLists(filterForm);
        },
        pageChange(val){
            this.pageNo=val;
            this.getLists();
        },
        pageSizeChange(val){
            this.pageSize=val;
            this.getLists();
        },

      },
      mounted(){
        this.id=this.$route.query.id;
        this.getFirst();
        this.getLists();
        this.getRepairType();
      }
    }
</script>

<style scoped>

</style>
