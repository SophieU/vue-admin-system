<template>
  <Card>
    <div class="clearfix mb-15">
      <div class="pull-left">
        <Button v-if="pageName==='import'" @click="newIn" type="primary">新建入库</Button>
        <Button v-if="pageName==='output'" @click="newIn" type="primary">新建出库</Button>
        <Button @click="filter=true">筛选</Button>
      </div>
      <div class="pull-right">
        <Button @click="exportExcel" type="primary">excel导出</Button>
      </div>
    </div>

    <div class="table-wrapper">
      <table class="native-table">
        <thead>
        <tr>
          <th>组织名称</th>
          <th>单号</th>
          <th>创建时间</th>
          <th>{{pageName==='import'?'入库类别':'出库类别'}}</th>
          <th>操作人</th>
          <th>{{pageName==='import'?'入库成本':'出库成本'}}</th>
          <th>操作</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(order,index) in lists" :key="index">
          <td>{{order.departmentName}}</td>
          <td>{{order.orderSn}}</td>
          <td>{{order.createTime}}</td>
          <td>{{pageName==='import'?order.inputType:order.outputType}}</td>
          <td>{{order.creator}}</td>
          <td>{{order.amount}}</td>
          <td>
            <Button @click="goDetail(order.id)" type="text">查看</Button>
          </td>
        </tr>
        </tbody>
      </table>
      <div class="pagination">
        <Page :total="totalCount" :current.sync="pageNo" show-elevator
              @on-change="pageChange"
              @on-page-size-change="pageSizeChange"
        ></Page>
      </div>
    </div>
    <Drawer title="入库筛选" width="450" v-model="filter">
      <div class="clearfix mb-15">
        <div class="pull-left">
          <Button @click="clearFilter">清空筛选条件</Button>
        </div>
        <div class="pull-right">
          <Button @click="saveFilter" type="primary">确定筛选</Button>
        </div>
      </div>
      <div>
        <i-form ref="filterForm" label-position="top" :model="filterForm">
          <form-item label="创建时间">
            <DatePicker @on-change="dateRangeChange" v-model="filterForm.dateRange" type="daterange" style="width: 100%;"></DatePicker>
          </form-item>
          <form-item label="组织名称">
            <Select v-model="filterForm.departmentId">
              <Option v-for="organ in organLists" :key="organ.id" :value="organ.id" >{{organ.name}}</Option>
            </Select>
          </form-item>
          <form-item v-if="pageName==='import'" label="入库类型">
            <Select v-model="filterForm.inputType">
              <Option value="PURCHASE">采购</Option>
            </Select>
          </form-item>
          <form-item v-if="pageName==='output'" label="出库类型">
            <Select v-model="filterForm.outputType">
              <Option value="REFUND">退货</Option>
            </Select>
          </form-item>
          <form-item label="原始单号">
            <Input v-model="filterForm.sn"/>
          </form-item>
        </i-form>
      </div>
    </Drawer>
  </Card>
</template>

<script>
  import util from '../../libs/util'
    export default {
        name: "inport-admin",
      data(){
          return {
            pageName:'import', //页面类型：默认import入库管理，其他：output 出库管理
            filter:false,
            filterForm:{
              departmentId:'',
              inputType:'',
              outputType:'',
              sn:'',
              dateRange:[],
            },
            pageNo:1,
            pageSize:10,
            totalCount:0,
            lists:[],
            organLists:[], //组织列表
          }
      },
      methods:{
        newIn(){
          if(this.pageName==='import'){
            this.$router.push({name:'importNew'})
          }else{
            this.$router.push({name:'newOut'})
          }
        },
        getLists(filter){
          let pageNo = this.pageNo;
          let pageSize=this.pageSize;
          let param = `pageNo=${pageNo}&pageSize=${pageSize}`;
          let url = '';
          if(filter){
            param=param+'&'+util.formatterParams(filter);
          }
          if(this.pageName==='import'){
            url='/repair/material/input/order/list'
          }else{
            url='/repair/material/output/order/list'
          }
          this.$http.post(`${url}?${param}`)
            .then(res=>{
              if(res.data.code===0){
                let data=res.data.data;
                this.lists=data.list;
                this.filter=false;
              }else{
                console.log('辅材入库获取失败：'+res.data.msg);
                this.filter=false;
              }
            })
        },
        dateRangeChange(val){
          this.filterForm.startTime=val[0];
          this.filterForm.endTime=val[1];
        },
        pageChange(val){
          this.pageNo=val;
          this.getLists();
        },
        pageSizeChange(val){
          this.pageSize=val;
          this.getLists();
        },
        clearFilter(){

          this.filterForm={
              departmentId:'',
              inputType:'',
              outputType:'',
              sn:'',
              dateRange:[],
          };
          this.pageNo=1;
          this.getLists();
        },
        saveFilter(){
          let form = this.filterForm;

          let param={};
          if(this.pageName==='import'){
            param= {
              inputType:form.inputType,
              sn:form.sn,
            };
          }else if(this.pageName==='output'){
            param= {
              outputType:form.outputType,
              sn:form.sn,
            };
          }

          if(form.departmentId){
            param.departmentId=form.departmentId;

          }
          if(form.dateRange[0]&&form.dateRange[1]){
           param= Object.assign(param,{
              startTime:util.formateTime(form.dateRange[0],true),
              endTime:util.formateTime(form.dateRange[1],true)
            })
          }
          this.pageNo=1;
          this.getLists(param);
        },
        //查看详情
        goDetail(id){
          let pageName = this.pageName;
          let routeName = '';
          if(pageName==='import'){
            routeName='inDetail'
          }else{
            routeName='outDetail'
          }
          this.$router.push({name:routeName,params:{id:id,type:pageName}})
        },
        exportExcel(){
          let url='';
          if(this.pageName==='import'){
            url='/repair/material/input/order/list/export'
          }else if(this.pageName==='output'){
            url='/repair/material/output/order/list/export'
          }
          let filterForm = {...this.filterForm};
          if(filterForm.dateRange[0].length<=0){
            filterForm.dateRange='';
          }else{
            delete filterForm.dateRange;
          }
          let query = `pageNo=${this.pageNo}&pageSize=${this.pageSize}`;
          let  param = util.formatterParams(filterForm);
          this.$http.post(url+'?'+query+'&'+param,null,{responseType:'blob'})
            .then(res=>{
              util.downloadExcel(res);
            });
        }
      },
      mounted(){
          this.pageName=this.$route.name;
          // this.getOrgan();
          this.getLists();
        util.getDepartment(data=>{
          this.organLists=data;
        })
      },
      watch:{
          $route:function(newVal){
            this.pageName=newVal.name;
            util.getDepartment(data=>{
              this.organLists=data;
            });
            // this.getOrgan();
            this.getLists();
            this.filterForm={
              departmentId:'',
              inputType:'',
              outputType:'',
              sn:'',
              dateRange:[],
            };
          }
      }

    }
</script>

<style scoped>

</style>
