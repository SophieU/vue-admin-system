<template>
  <Card>
    <div class="clearfix mb-15">
      <div class="pull-left">
        <Button type="primary" @click="newInvent">新建盘点</Button>
        <Button @click="filter=true">筛选</Button>
      </div>
      <div class="pull-right">
        <Button @click="downloadExcel" type="primary">excel导出</Button>
      </div>
    </div>
    <div class="table-wrapper">
      <Table :columns="columns" :data="lists"></Table>
      <div class="pagination">
        <Page :total="totalCount" :current.sync="pageNo"  show-elevator
          @on-change="pageChange"
              @on-page-size-change="pageSizeChange"
        ></Page>
      </div>
    </div>

    <!--筛选-->
    <Drawer title="出库筛选" width="425" v-model="filter">
      <div class="clearfix mb-15">
        <div class="pull-left">
          <Button @click="clearFilter">清空筛选条件</Button>
        </div>
        <div class="pull-right">
          <Button @click="filterList" type="primary">确定筛选</Button>
        </div>
      </div>
      <div>
        <i-form :model="filterForm" label-position="top">
          <form-item label="创建时间">
            <DatePicker @on-change="filterDateChange" v-model="filterForm.dateRange" type="daterange" style="width: 100%;"></DatePicker>
          </form-item>
          <form-item label="组织名称">
            <Select v-model="filterForm.departmentId">
              <Option v-for="department in departmentLists" :key="department.id" :value="department.id">{{department.name}}</Option>
            </Select>
          </form-item>
        </i-form>
      </div>
    </Drawer>
  </Card>
</template>

<script>
  import util from '../../libs/util'
    export default {
        name: "inventory-admin",
      computed:{
        downlink(){
          let baseUrl = localStorage.getItem('baseURL');
          let url = baseUrl+'/repair/material/check/order/export';
        }
      },
      data(){
          return {
            filter:false,
            columns:[
              {title:'组织名称',key:'departmentName',align:'center'},
              {title:'单号',key:'orderSn',align:'center'},
              {title:'创建时间',key:'createTime',align:'center'},
              {title:'盈亏数',key:'diffNum',align:'center'},
              {title:'盈亏成本',key:'amount',align:'center'},
              {title:'操作',align:'center',render:(h,params)=>{
                let _this= this;
                return h('Button',{
                    props:{
                      type:'primary',
                      size:'small'
                    },
                    on:{
                      click(){
                        let id = params.row.id;
                        _this.$router.push({name:'inventoryDetail',params:{id:id}})
                      }
                    }
                  },'查看')
                }},
            ],
            lists:[],
            pageNo:1,
            pageSize:10,
            totalCount:0,
            departmentLists:[], //组织列表
            filterForm:{
              departmentId:'',
              dateRange:[],
            }
          }
      },
      methods:{
        downloadExcel(){
          let filterForm = {...this.filterForm};
          console.log(filterForm)
          let query =`pageNo=${this.pageNo}&pageSize=${this.pageSize}`;
          delete filterForm.dateRange;
          let param = util.formatterParams(filterForm);
          this.$http.post(`/repair/material/check/order/list/export?${query}&${param}`,null,{responseType:'blob'})
            .then(res=>{
              //这里res.data是返回的blob对象
              util.downloadExcel(res)
            })
        },
        newInvent(){
          this.$router.push({name:'inventoryNew'})
        },
        getLists(filter){
          let params= `pageNo=${this.pageNo}&pageSize=${this.pageSize}`;
          if(filter){
            params=params+'&'+util.formatterParams(filter);
          }
          this.$http.post(`/repair/material/check/order/list?${params}`)
            .then(res=>{
              if(res.data.code===0){
                let data = res.data.data;
                this.lists = data.list;
                this.pageNo = data.pageNo;
                this.totalCount=data.totalCount;
                this.pageSize= data.pageSize;
                this.filter=false;
              }
            })
        },
        filterList(){
            let filterForm = this.filterForm;
            let param = {};
            if(filterForm.departmentId){
              param.departmentId=filterForm.departmentId;
            }
            if(filterForm.dateRange[0]&&filterForm.dateRange[0]){
              let dateRange = filterForm.dateRange;
              param.startTime=util.formateTime(dateRange[0],true);
              param.endTime=util.formateTime(dateRange[1],true);
            }
            this.pageNo=1;
            this.getLists(param);
        },
        //清空筛选
        clearFilter(){
          this.filterForm={
            dateRange:[],
            departmentId:'',
          };
          this.filter=false;
          this.pageNo=1;
          this.getLists()
        },
        pageChange(val){
          this.pageNo=val;
          this.getLists();
        },
        pageSizeChange(val){
          this.pageSize=val;
          this.getLists();
        },
        filterDateChange(date){
          if(date.length<=0) return;
          this.filterForm.startTime=date[0];
          this.filterForm.endTime=date[1];
        }
      },
      mounted(){
          // this.getOrgan();
        util.getDepartment(data=>{
          this.departmentLists=data;
        })
          this.getLists();
      }
    }
</script>

<style scoped>

</style>
