<template>
<div>
  <div class="card no-border mb-15">
    <div class="card-header">
      <div class="card-title">统计</div>
    </div>
    <div class="card-body">
      <table class="native-table">
        <thead>
        <tr>
          <th>工单总额</th>
          <th>优惠价格</th>
          <th>工单应收</th>
          <th>工单已收</th>
        </tr>
        </thead>
        <tbody>
        <tr v-if="detail">
          <td>{{detail.totalAmount}}</td>
          <td>{{detail.discountAmount}}</td>
          <td>{{detail.shouldAmount}}</td>
          <td>{{detail.receivedAmount}}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
  <div class="card no-border">
    <div class="card-header">
      <div class="card-title">明细</div>
    </div>
    <div class="card-body">
      <div class="detail-box">
        <div class="mt-15"  v-if="prepayDtdInfo.payInfo">
          <h5>预收上门费</h5>
          <table class="native-table">
            <thead>
            <tr>
              <th>应收金额</th>
              <th>实收金额</th>
              <th>优惠</th>
              <th>支付方式</th>
              <th>支付单号</th>
              <th>支付时间</th>
            </tr>
            </thead>
            <tbody>
            <tr >
              <td>{{prepayDtdInfo.payInfo.shouldAmount}}</td>
              <td>{{prepayDtdInfo.payInfo.receivedAmount}}</td>
              <td>{{prepayDtdInfo.payInfo.discountAmount}}</td>
              <td>{{prepayDtdInfo.payInfo.payType}}</td>
              <td>{{prepayDtdInfo.payInfo.paySn}}</td>
              <td>{{prepayDtdInfo.payInfo.payTime}}</td>
            </tr>
            </tbody>
          </table>
        </div>

        <div class="mt-15"  v-if="prepayDtdInfo.discountInfo">
          <h5>优惠信息</h5>
          <table class="native-table">
            <thead>
            <tr>
              <th>类别</th>
              <th>项目</th>
              <th>数量</th>
              <th>单价</th>
              <th>小计</th>
            </tr>
            </thead>
            <tbody  v-if="prepayDtdInfo.discountInfo">
            <tr >
              <td>{{prepayDtdInfo.discountInfo.category}}</td>
              <td>{{prepayDtdInfo.discountInfo.name}}</td>
              <td>{{prepayDtdInfo.discountInfo.num}}</td>
              <td>{{prepayDtdInfo.discountInfo.price}}</td>
              <td>{{prepayDtdInfo.discountInfo.amount}}</td>
            </tr>
            </tbody>
            <tfoot v-else>
              <tr>
                <td colspan="5">暂无数据</td>
              </tr>
            </tfoot>
          </table>
        </div>

      </div>

      <div class="detail-box">
        <div class="mt-15">
          <h5>基础服务统计</h5>
          <table class="native-table">
            <thead>
            <tr>
              <th>基础服务总额</th>
              <th>优惠</th>
              <th>应收</th>
              <th>已收</th>
              <th>支付方式</th>
              <th>支付单号</th>
              <th>支付时间</th>
            </tr>
            </thead>
            <tbody>
            <tr >
              <td>{{baseServiceRecordVo.totalAmount}}</td>
              <td>{{baseServiceRecordVo.discountAmount}}</td>
              <td>{{baseServiceRecordVo.shouldAmount}}</td>
              <td>{{baseServiceRecordVo.receivedAmount}}</td>
              <td>{{baseServiceRecordVo.payType}}</td>
              <td>{{baseServiceRecordVo.paySn}}</td>
              <td>{{baseServiceRecordVo.payTime}}</td>
            </tr>
            </tbody>
          </table>
        </div>
        <div class="mt-15">
          <h5>基础服务</h5>
          <table class="native-table">
            <thead>
            <tr>
              <th>类别</th>
              <th>项目</th>
              <th>数量</th>
              <th>单价</th>
              <th>小计</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item,index) in offerPlanVos" :key="index">
              <td>{{item.planType}}</td>
              <td>{{item.planName}}</td>
              <td>{{item.serviceNum}}</td>
              <td>{{item.serviceCost}}</td>
              <td>{{item.amount}}</td>
            </tr>
            </tbody>
            <tfoot v-if="offerPlanVos.length<=0">
            <tr>
              <td colspan="5">暂无数据</td>
            </tr>
            </tfoot>
          </table>
        </div>
        <div class="mt-15">
          <h5>优惠信息</h5>
          <table class="native-table">
            <thead>
            <tr>
              <th>优惠类别</th>
              <th>项目名称</th>
              <th>优惠项目</th>
              <th>金额</th>
              <th>小计</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item,index) in discountServiceInfoVoList" :key="index">
              <td>{{item.discountCategory}}</td>
              <td>{{item.discountServiceName}}</td>
              <td>{{item.discountServiceItem}}</td>
              <td>{{item.discountAmount}}</td>
              <td>{{item.subtotal}}</td>
            </tr>
            </tbody>
            <tfoot v-if="discountServiceInfoVoList.length<=0">
            <tr>
              <td colspan="5">暂无数据</td>
            </tr>
            </tfoot>
          </table>
        </div>
      </div>
      <!--附加服务统计3.15-->
      <div class="detail-box" v-for="(addItem, index) in addOfferPlanVos" :key="index">
        <div class="mt-15">
          <h5>附加服务统计{{index+1}}</h5>
          <table class="native-table">
            <thead>
            <tr>
              <th>基础服务总额</th>
              <th>优惠</th>
              <th>应收</th>
              <th>已收</th>
              <th>支付方式</th>
              <th>支付单号</th>
              <th>支付时间</th>
            </tr>
            </thead>
            <tbody>
            <tr >
              <td>{{addItem.addServiceRecordVo.totalAmount}}</td>
              <td>{{addItem.addServiceRecordVo.discountAmount}}</td>
              <td>{{addItem.addServiceRecordVo.shouldAmount}}</td>
              <td>{{addItem.addServiceRecordVo.receivedAmount}}</td>
              <td>{{addItem.addServiceRecordVo.payType}}</td>
              <td>{{addItem.addServiceRecordVo.paySn}}</td>
              <td>{{addItem.addServiceRecordVo.payTime}}</td>
            </tr>
            </tbody>
          </table>
        </div>
        <div class="mt-15">
          <h5>基础服务</h5>
          <table class="native-table">
            <thead>
            <tr>
              <th>类别</th>
              <th>项目</th>
              <th>数量</th>
              <th>单价</th>
              <th>小计</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item,indexChild) in addItem.addOfferPlanVos" :key="indexChild">
              <td>{{item.planType}}</td>
              <td>{{item.planName}}</td>
              <td>{{item.serviceNum}}</td>
              <td>{{item.serviceCost}}</td>
              <td>{{item.amount}}</td>
            </tr>
            </tbody>
            <tfoot v-if="addItem.addOfferPlanVos.length<=0">
            <tr>
              <td colspan="5">暂无数据</td>
            </tr>
            </tfoot>
          </table>
        </div>
        <div class="mt-15">
          <h5>优惠信息</h5>
          <table class="native-table">
            <thead>
            <tr>
              <th>优惠类别</th>
              <th>项目名称</th>
              <th>优惠项目</th>
              <th>金额</th>
              <th>小计</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item,index) in addItem.addServiceDiscountList" :key="index">
              <td>{{item.discountCategory}}</td>
              <td>{{item.discountServiceName}}</td>
              <td>{{item.discountServiceItem}}</td>
              <td>{{item.discountAmount}}</td>
              <td>{{item.subtotal}}</td>
            </tr>
            </tbody>
            <tfoot v-if="discountServiceInfoVoList.length<=0">
            <tr>
              <td colspan="5">暂无数据</td>
            </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>

    export default {
        name: "fee-detail",
      data(){
          return {
            detail:null,
            baseServiceRecordVo:{},
            offerPlanVos:[],
            discountServiceInfoVoList:[],
            prepayDtdInfo:null, // 预收上门费
            addOfferPlanVos:[]
          }
      },
      methods:{
          getFeeDetail(id){
            this.$http.get(`/repair/order/charge/list?id=${id}`)
              .then(res=>{
                if(res.data.code===0){
                  let data = res.data.data;
                  this.detail=data;
                  this.baseServiceRecordVo=data?data.baseServiceRecordVo:{};
                  this.offerPlanVos=data?data.offerPlanVos:{};
                  this.discountServiceInfoVoList=data?data.discountServiceInfoVoList:{};
                  this.addOfferPlanVos = data&&data.addOfferPlanVos;
                  this.prepayDtdInfo = data&&data.prepayDtdInfo;
                }else{
                  console.log('工单收费明细获取：'+res.data.msg);
                }
              })
          }
      },
      mounted(){
          let id = this.$route.query.id;
          this.getFeeDetail(id);
      }
    }
</script>

<style scoped lang="scss">
.detail-box{
  margin-bottom: 30px;
  &>.mt-15{
    h5{
      margin: 10px 0;
      font-weight: normal;
    }
    &:first-child>h5{
      font-weight: bold;
    }
  }
}
</style>
