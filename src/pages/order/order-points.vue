<template>
  <div>
    <Card>
      <div class="mb-15">
        <i-form class="headerForm" :model="filterForm"  inline :label-width="100">
          <form-item label="网点类型">
            <Select v-model="filterForm.isSelf" clearable style="width:200px;">
              <Option value="Y">自营网点</Option>
              <Option value="N">签约商家</Option>
            </Select>
          </form-item>
          <form-item label="网点名称">
            <Input v-model="filterForm.stationName"/>
          </form-item>
          <form-item label="时间">
            <DatePicker :options="filterDateOptions" @on-change="(value)=>filterDateChange(value,'Date')" v-model="filterForm.time" type="daterange" style="width:100%;"></DatePicker>
          </form-item>
          <form-item >
            <div class="btn-wrap" style="margin-left:-100px;">
              <Button type="primary" @click="getData">查询</Button>
              <Button @click="clearFilter">清空</Button>
            </div>
          </form-item>
        </i-form>
      </div>
      <div class="clearfix">
        <div class="pull-right">
          <Button type="primary" @click="exportExcel">Excel导出</Button>
        </div>
      </div>
      <div class="table-wrapper mt-15">
        <Table :columns="column" :data="lists"></Table>
      </div>
    </Card>
  </div>
</template>

<script>

import util from '../../libs/util';
export default {
  name: "order-points",
  data(){
    return{
      column:[
        {
          title:'网点名称',
          key:'stationName',
          align:'center'
        },{
          title:'已完成工单数',
          key:'finishedOrderNum',
          align:'center'
        },{
          title:'未完成工单数',
          key:'unfinishedOrderNum',
          align:'center'
        },{
          title:'异常工单数',
          key:'appealNum',
          align:'center'
        },{
          title:'总工单数',
          key:'totalOrderNum',
          align:'center'
        },{
          title:'总收入',
          key:'orderAmount',
          align:'center'
        },{
          title:'订单完成率(%)',
          key:'finishRate',
          align:'center'
        },{
          title:'异常率占比(%)',
          key:'appealRate',
          align:'center'
        }
      ],
      lists:[],
      filterForm:{
        isSelf:'',
        stationName:'',
        time:'',
        startDate:'',
        endDate:'',
      },
      filterDateOptions: {
        disabledDate (date) {
          return date.valueOf() > Date.now();
        }
      },
    }
  },
  mounted(){
    this.getData();
  },
  methods:{
    //页码改变
    pageChange(val){
      this.pageNo = val;
      this.getData();
    },
    clearFilter(){
      this.filterForm.isSelf = '';
      this.filterForm.stationName = '';
      this.filterForm.time = '';
      this.filterForm.startDate = '';
      this.filterForm.endDate = '';
      this.getData();
    },
    // 获取页面数据
    getData(){
      let URL = `/repair/order/count/list?`
      if(this.filterForm.isSelf){
        URL += `isSelf=${this.filterForm.isSelf}&`
      }
      if(this.filterForm.stationName){
        URL += `stationName=${this.filterForm.stationName}&`
      }
      if(this.filterForm.startDate){
        URL += `startDate=${this.filterForm.startDate}&`
      }
      if(this.filterForm.endDate){
        URL += `endDate=${this.filterForm.endDate}&`
      }
      this.$http({
        method: "post",
        url: URL,
      }).then(res => {
        if (res.data.code === 0) {
          this.lists = res.data.data;
        } else {
          this.$Message.error(res.data.msg);
        }
      });
    },
    filterDateChange(value,key){
      let min=value[0],max=value[1];
      let minKey=`start${key}`;
      let maxKey=`end${key}`;
      this.filterForm[minKey]=min;
      this.filterForm[maxKey]=max;
    },
    exportExcel(){
      let filterForm={...this.filterForm};
      delete filterForm.time;
      this.$http.post(`/repair/order/count/export`,filterForm,{responseType:'blob'})
        .then(res=>{
          util.downloadExcel(res,`工单概况.xls`);
        })
    }
  }
}
</script>

<style scoped lang="scss">
  @import "order";
  .headerForm{
    .ivu-form-item{
      margin-bottom: 10px;
    }
  }
</style>
