<template>
    <Card>
      <div class="clearfix mb-15">
        <div class="pull-left">
          <Button @click="filter=true">筛选</Button>
        </div>
        <div class="pull-right">
          <Button @click="exportExcel" type="primary">excel导出</Button>
        </div>
      </div>
      <Card style="max-width:400px;margin-bottom:15px;">
        <p slot="title">使用总数</p>
        <p class="text-blue" slot="extra" v-if="filterForm.startDate&&filterForm.endDate">{{filterForm.startDate}}-{{filterForm.endDate}}</p>
        <div>
          <count-up
            class="infor-card-count user-created-count"
            id-name="total"
            :end-val="materialTotal"
            color="#039dff"
            countSize="60px"
            :countWeight="700"
          >
          </count-up>
        </div>
      </Card>
      <Card>
        <p slot="title">明细</p>
        <div class="table-wrapper">
          <Table :columns="columns" :data="lists"></Table>
          <div class="pagination">
            <Page :total="totalCount" :current.sync="pageNo" show-elevator
              @on-change="pageChange"
                  @on-page-size-change="pageSizeChange"
            ></Page>
          </div>
        </div>
      </Card>
      <Drawer title="领用筛选" width="425"  v-model="filter" @on-close="clearFilter">
        <div class="clearfix mb-15">
          <div class="pull-left">
            <Button @click="clearFilter">清空筛选条件</Button>
          </div>
          <div class="pull-right">
            <Button @click="sureFilter" type="primary">确定筛选</Button>
          </div>
        </div>
        <div>
          <Form ref="filterForm" :model="filterForm" label-position="top">
            <FormItem label="服务项目">
              <Select v-model="filterForm.repairCategoryId" prop="repairCategoryId">
                <Option v-for="item in repairLists" :key="item.id" :value="item.id">{{item.name}}</Option>
              </Select>
            </FormItem>
            <FormItem label="服务人员" prop="serverName">
              <Input v-model="filterForm.serverName" />
            </FormItem>
            <FormItem label="辅材名称" prop="materialName">
              <Input v-model="filterForm.materialName" />
            </FormItem>
            <FormItem label="创建时间">
              <DatePicker style="width:100%;"  v-model="filterForm.dateRange" @on-change="dateRangeChange" type="daterange"></DatePicker>
            </FormItem>
            <FormItem label="服务网点" prop="departmentId">
              <Select v-model="filterForm.departmentId">
                <Option v-for="item in departmentLists" :key="item.id" :value="item.id">{{item.name}}</Option>
              </Select>
            </FormItem>
          </Form>
        </div>
      </Drawer>
    </Card>
</template>

<script>
  import util from '../../libs/util'
  import countUp from '../home/component/countUp';
    export default {
        name: "draw-pool",
      components:{
        countUp
      },
      data(){
          return{
            filter:false,
            columns:[
              {title:'名称',key:'materialName',align:'center'},
              {title:'工单号',key:'orderSn',align:'center',width:190},
              {title:'服务项目',key:'repairCategoryName',align:'center'},
              {title:'型号',key:'materialSpec',align:'center'},
              {title:'师傅',key:'serverName',align:'center'},
              {title:'报修使用',key:'orderUseNum',align:'center'},
              {title:'售后使用',key:'afterSaleUseNum',align:'center'},
              {title:'日期',key:'payTime',align:'center'},
              {title:'成本合计',key:'amount',align:'center'},
              {title:'组织名称',key:'departmentName',align:'center'},
              {title:'操作',align:'center',render:(h,params)=>{
                let _this = this;
                return h('Button',{
                    props:{
                      type:'primary',
                      size:'small'
                    },
                  on:{
                      click:()=>{
                        let id = params.row.id;
                        _this.$router.push({name:'orderDetail',query:{id:id}})
                      }
                  }
                  },'查看订单')
                }},
            ],
            materialTotal:0,
            lists:[],
            pageNo:1,
            pageSize:10,
            totalCount:0,
            filterForm:{
              repairCategoryId:'',
              serverName:'',
              materialName:'',
              departmentId:'',
              startDate:'',
              endDate:'',
              dateRange:[],
            },
            repairLists:[],
            departmentLists:[],
          }
      },
      methods:{
          dateRangeChange(val){
            this.filterForm.startDate=val[0];
            this.filterForm.endDate=val[1];
          },
          getCount(filter){
            let query = `pageNo=${this.pageNo}&pageSize=${this.pageSize}`;
            let param = '';
            if(filter){
              param = util.formatterParams(this.filterForm);
            }

            this.$http.post(`/repair/material/storage/use/count?${query}&${param}`)
              .then(res=>{
                if(res.data.code===0){
                  this.materialTotal=res.data.data;
                }else{
                  console.log('员工领用Count:'+res.data.msg);
                }
              })
          },
        getLists(filter){
          let query = `pageNo=${this.pageNo}&pageSize=${this.pageSize}`;
          let param = '';

          if(filter){
            param = util.formatterParams(this.filterForm);
          }
          this.$http.post(`/repair/material/storage/use/list?${query}&${param}`)
            .then(res=>{
              if(res.data.code===0){
                let data = res.data.data;
                this.pageSize=data.pageSize;
                this.totalCount=data.totalCount;
                this.lists=data.list;
                this.filter=false;
              }else{
                console.log('员工领用列表:'+res.data.msg);
              }
            })
        },
          pageChange(val){
              this.pageNo=val;
              let filterForm = this.filterForm;
              delete filterForm.dateRange;
              this.getCount(filterForm);
              this.getLists(filterForm);
          },
          pageSizeChange(val){
              this.pageSize=val;
            let filterForm = this.filterForm;
            delete filterForm.dateRange;
            this.getLists(filterForm);
            this.getCount(filterForm);
          },
        sureFilter(){
            let filterForm = {...this.filterForm};
            delete filterForm.dateRange;
            this.pageNo=1;
            this.getLists(filterForm);
            this.getCount(filterForm);
        },
        clearFilter(){
          this.filterForm={
            repairCategoryId:'',
            serverName:'',
            materialName:'',
            departmentId:'',
            startDate:'',
            endDate:'',
            dateRange:[]
          };
          this.pageNo=1;
          this.getLists();
        },
        exportExcel(){
            let filterForm={...this.filterForm};
          delete filterForm.dateRange;
          let param = util.formatterParams(filterForm);
            this.$http.post(`/repair/material/storage/use/list/export?${param}`,null,{responseType:'blob'})
              .then(res=>{
                util.downloadExcel(res);
              })
        }
      },
      mounted(){
          util.getRepairType(data=>{
            this.repairLists=data;
          });
          util.getDepartment(data=>{
            this.departmentLists=data;
          });
        this.getLists();
          this.getCount();
      }
    }
</script>

<style scoped>

</style>
