<template>
    <Card style="padding-bottom: 30px;">
      <Tabs v-model="tabActive" :animated="false">
        <TabPane :label="visited" name="visited">
          <div class="mb-15 clearfix">
            <div class="pull-right">
              <Button type="primary" @click="filter=true">筛选</Button>
            </div>
          </div>
          <!--<Table :columns="visitedColumns" :data="lists"></Table>-->
        </TabPane>
        <TabPane :label="waiting" name="waiting">
          <!--<Table :columns="waitColumns" :data="lists"></Table>-->
        </TabPane>
      </Tabs>
      <table class="native-table">
        <thead>
        <tr>
          <th>创建日期</th>
          <th>售后回访</th>
          <th>工单状态</th>
          <th>服务项目</th>
          <th>服务网点</th>
          <th>接单师傅</th>
          <th>工单编号</th>
          <th>网点回访</th>
          <th v-if="tabActive==='visited'">回访结果</th>
          <th>操作</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in lists" :key="item.id">
           <td>{{item.createTime}}</td>
          <td>{{item.afterSaleVisit}}</td>
          <td>{{item.orderState}}</td>
          <td>{{item.repairCategoryName}}</td>
          <td>{{item.repairStationName}}</td>
          <td>{{item.receiveUserName}}</td>
          <td>{{item.orderSn}}</td>
          <td>{{item.linkVisitState}}</td>
          <td v-if="tabActive==='visited'">{{item.returnVisitResult}}</td>
          <td  v-if="tabActive==='visited'">
            <Button @click="$router.push({name:'orderDetail',query:{id:item.orderId}})"  type="text">查看</Button>
          </td>
          <td  v-if="tabActive==='waiting'">
            <Button type="text" @click="goCenterVisite(item.id,item.orderId,item.linkVisitResult)">回访</Button>
          </td>
        </tr>
        </tbody>
      </table>
      <div class="pagination" v-if="totalCount>0">
        <Page :total="totalCount" :current.sync="pageNo" show-elevator
              @on-change="pageChange"
              @on-page-size-change="pageSizeChange"
        ></Page>
      </div>

      <Drawer width="450" title="工单筛选"  v-model="filter" @on-close="clearFilter">
        <div class="clearfix mb-15">
          <div class="pull-left">
            <Button @click="clearFilter">清空筛选条件</Button>
          </div>
          <div class="pull-right">
            <Button @click="sureFilter" type="primary">确定</Button>
          </div>
        </div>
        <i-form :model="filterForm" ref="filterForm">
          <form-item label="回访结果">
            <Select  :clearable="true" v-model="filterForm.returnVisitResult">
              <Option value="PASS">通过</Option>
              <Option value="NOT_PASS">不通过</Option>
            </Select>
          </form-item>
          <form-item label="工单编号">
            <Input v-model="filterForm.orderSn"/>
          </form-item>
          <form-item label="创建时间">
            <DatePicker  v-model="filterForm.dateRange" @on-change="dateRangeChange" type="daterange" style="width:100%;"></DatePicker>
          </form-item>
          <form-item label="服务网点">
            <Select :clearable="true" v-model="filterForm.repairStationId">
              <Option v-for="item in stationLists" :key="item.id" :value="item.id">{{item.name}}</Option>
            </Select>
          </form-item>
          <form-item label="售后回访">
            <Select  :clearable="true" v-model="filterForm.afterSaleVisit">
              <Option value="AFTER_SALE">是</Option>
              <Option value="ORDER">否</Option>
            </Select>
          </form-item>
        </i-form>
      </Drawer>
    </Card>
</template>

<script>
  import util from '../../libs/util'
    export default {
        name: "visite",
        data () {
          return {
            waiting: (h) => {
              return h('div', [
                h('span', '待回访'),
                h('Badge', {
                  props: {
                    count: this.stateCount.N
                  },
                  style:{
                    marginLeft:'10px'
                  }
                })
              ])
            },
            visited:(h)=>{
              return h('div',[
                h('span','已回访'),
                h('Badge',{
                  props:{
                    count:this.stateCount.Y
                  },
                  style:{
                    marginLeft:'10px'
                  }
                })
              ])
            },
            filter:false,
            tabActive:'visited',
           /* waitColumns:[
              {title:'工单编号',key:'id',align:'center'},
              {title:'售后回访',key:'id',align:'center'},
              {title:'工单状态',key:'id',align:'center'},
              {title:'报修类型',key:'id',align:'center'},
              {title:'服务网点',key:'id',align:'center'},
              {title:'接单师傅',key:'id',align:'center'},
              {title:'创建日期',key:'id',align:'center'},
            ],
            waitData:[],
            visitedColumns:[
              {title:'工单编号',key:'orderSn',align:'center'},
              {title:'售后回访',key:'afterSaleVisit',align:'center'},
              {title:'工单状态',key:'orderState',align:'center'},
              {title:'报修类型',key:'repairCategoryName',align:'center'},
              {title:'服务网点',key:'repairStationName',align:'center'},
              {title:'接单师傅',key:'receiveUserName',align:'center'},
              {title:'创建日期',key:'createTime',align:'center'},
              {title:'回访结果',key:'returnVisitResult',align:'center'},
              {title:'操作',align:'center',render:(h,params)=>{
                let _this = this;
                    return h('Button',{
                      props:{
                        type:'text'
                      },
                      on:{
                        click:()=>{
                          let id = params.row.id;
                          _this.$router.push({name:'visitedInfo',params:{id:id}})
                        }
                      }
                    },'查看')
                }},
            ],*/
            lists:[],
            stationLists:[], //服务网点下拉
            stateCount:{
              Y:0,
              N:0
            },
            pageNo:1,
            pageSize:10,
            totalCount:0,
            filterForm:{},
            isReturnVisit:'Y'
          }
        },
      methods:{
        //  跳转中心回访页面
        goCenterVisite(id,orderId,linkVisitResult){
          this.$router.push({name:'centerVisite',query:{id,orderId,linkVisitResult}})
        },
        getLists(filter){
          let query = `pageNo=${this.pageNo}&pageSize=${this.pageSize}&isReturnVisit=${this.isReturnVisit}`;
          let param=util.formatterParams(filter);
          this.$http.post(`/repair/return/visit/list?${query}&${param}`)
            .then(res=>{
              if(res.data.code===0){
                let data= res.data.data;
                this.pageSize=data.pageSize;
                this.totalCount= data.totalCount;
                this.lists=data.list;
               this.filter=false;

              }else{
                console.log('回访列表获取失败：'+res.data.msg);
              }
            })
        },
        pageChange(val){
            this.pageNo=val;
          let isReturnVisit='';
          switch(this.tabActive){
            case 'visited':
              isReturnVisit='Y';
              break;
            case 'waiting':
              isReturnVisit='N';
              break;
          }
          let filterForm ={...this.filterForm};
          delete filterForm.dateRange;
          this.getLists(filterForm);
        },
        pageSizeChange(val){
            this.pageSize=val;
          let isReturnVisit='';
          switch(this.tabActive){
            case 'visited':
              isReturnVisit='Y';
              break;
            case 'waiting':
              isReturnVisit='N';
              break;
          }
          let filterForm ={...this.filterForm};
          delete filterForm.dateRange;
          this.getLists(filterForm);
        },
        dateRangeChange(val){
            this.filterForm.startTime=val[0];
            this.filterForm.endTime=val[1];
        },
        clearFilter(){
            this.filterForm={};
            this.filter=false;
            this.pageNo=1;
            this.getLists();
        },
        sureFilter(){
            let filterForm ={...this.filterForm};
            delete filterForm.dateRange;
            this.pageNo=1;
            this.getLists(filterForm);
        },
        getCount(){
            this.$http.get(`/repair/return/visit/state/count`)
              .then(res=>{
                if(res.data.code===0){
                  let data = res.data.data;
                  data.map(item=>{
                    switch(item.state){
                      case 'N':
                        this.stateCount.N=item.countNum;
                        break;
                      case 'Y':
                        this.stateCount.Y=item.countNum;
                        break;
                    }
                  })
                }
              })
        }
      },
      mounted(){
        this.getLists();
        this.getCount();
        util.getStationLists(data=>{
          this.stationLists=data;
        })
      },
      watch:{
          tabActive(newVal){
            this.filterForm={};
            // let isReturnVisit='Y';
            if(newVal==='waiting'){
              this.isReturnVisit='N';
            }else{
              this.isReturnVisit='Y';
            }
            this.pageNo=1;
            this.pageSize=10;
            this.lists=[];
            this.getLists();
          }
      }
    }
</script>

<style scoped>

</style>
