<style scoped lang="scss">
  @import "./source.scss";
  .native-input{
    width: 600px;
  }
</style>
<template>
    <Card class="storage-detail" style="padding-bottom:30px;">
      <div class="clearfix mb-15">
        <div class="pull-right">
          <Button @click="exportDetail" type="primary">excel导出</Button>
        </div>
      </div>
      <div>
        <table class="native-table mb-15">
          <thead>
          <tr>
            <th>组织名称</th>
            <th>单号</th>
            <th>创建时间</th>
            <th>{{pageType==='import'?'入库类别':'出库类别'}}</th>
            <th>操作人</th>
            <th>{{pageType==='import'?'入库成本':'出库成本'}}</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>{{detail.departmentName}}</td>
            <td>{{detail.orderSn}}</td>
            <td>{{detail.createTime}}</td>
            <td>{{pageType==='import'?detail.inputType:detail.outputType}}</td>
            <td>{{detail.creator}}</td>
            <td>{{detail.amount}}</td>
          </tr>
          </tbody>
        </table>
        <div class="mb-15">
          <span>原始单号：</span>
          <input disabled :value="detail.sn" class="native-input" type="text" >
        </div>
        <div>
          <table class="native-table">
            <thead>
            <tr>
              <th>辅材名称</th>
              <th>服务项目</th>
              <th>型号</th>
              <th>单位</th>
              <th>成本价</th>
              <th>数量</th>
              <th>{{pageType==='import'?'入库成本':'出库成本'}}</th>
            </tr>
            </thead>
            <tbody>
              <tr v-for="item in detailList" :key="item.materialId">
                <td>{{item.materialName}}</td>
                <td>{{item.repairCategoryName}}</td>
                <td>{{item.materialSpec}}</td>
                <td>{{item.materialUnit}}</td>
                <td>{{item.price}}</td>
                <td>{{item.num}}</td>
                <td>{{item.amount}}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </Card>
</template>

<script>
  import util from '../../libs/util'
    export default {
        name: "storage-detail",
      data(){
          return {
            pageType:'import',
            detail:{},
            id:'',
            detailList:[],
          }
      },
      methods:{
        getDetail(){
           let url = '';
           let pageType = this.pageType;
           let id = this.id;
           if(pageType==='import'){
             url=`/repair/material/input/order/info?id=${id}`
           }else{
             url=`/repair/material/output/order/info?id=${id}`
           }
           this.$http.get(url).then(res=>{
             if(res.data.code===0){
               this.detail=res.data.data;
               this.detailList=res.data.data.detailList;
             }else{
               console.log('详情获取失败：'+res.data.msg);
             }
           })
        },
        exportDetail(){
          let url = '';
          let pageType=this.pageType;
          let id = this.id;
          if(pageType==='import'){
            url=`/repair/material/input/order/info/export?id=${id}`
          }else{
            url=`/repair/material/output/order/info/export?id=${id}`
          }
          this.$http.get(url,{responseType:'blob'})
            .then(res=>{
              util.downloadExcel(res);
            })
        }
      },
      created(){
          let routeParam = this.$route.params;
          let routeName = this.$route.name;
          if(routeName==='inDetail'){
            this.pageType='import'
          }else if(routeName==='outDetail'){
            this.pageType='output'
          }
          this.id=routeParam.id;
          this.getDetail();
      }
    }
</script>


