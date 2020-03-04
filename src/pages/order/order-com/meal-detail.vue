<template>
  <div>
    <Card>
      <div class="clearfix">
        <div class="pull-right">
          <Button @click="$router.back()">返回</Button>
        </div>
      </div>
      <Row :gutter="20">
        <Col span="12">
          <h4>订单信息</h4>
          <table class="info-table"  style="max-width:600px;">
            <tr>
              <td class="label">订单编号</td>
              <td>{{mainInfo.sn}}</td>
            </tr>
            <tr>
              <td class="label">订单状态</td>
              <td>{{mainInfo.orderState}}</td>
            </tr>
            <tr>
              <td class="label">订单金额</td>
              <td>{{mainInfo.amount}}</td>
            </tr>
            <tr>
              <td class="label">创建日期</td>
              <td>{{mainInfo.createTime}}</td>
            </tr>
            <tr>
              <td class="label">付款日期</td>
              <td>{{mainInfo.payTime}}</td>
            </tr>
            <tr>
              <td class="label">绑定地址</td>
              <td>{{mainInfo.address}}</td>
            </tr>
             <tr>
              <td class="label">联系人姓名</td>
              <td>{{mainInfo.username}}</td>
            </tr>
            <tr>
              <td class="label">绑定用户手机号</td>
              <td>{{mainInfo.userPhone}}</td>
            </tr>
            <tr>
              <td class="label">付款流水号</td>
              <td>{{mainInfo.paySn}}</td>
            </tr>
            <tr>
              <td class="label">付款方式</td>
              <td>{{mainInfo.payType}}</td>
            </tr>
            <tr>
              <td class="label">下单方式</td>
              <td>{{mainInfo.inputType}}</td>
            </tr>
            <tr>
              <td class="label">销售人员</td>
              <td>{{mainInfo.serviceUserName}}</td>
            </tr>
            <tr>
              <td class="label">服务网点</td>
              <td>{{mainInfo.stationName}}</td>
            </tr>

          </table>
        </Col>
        <Col span="12">
          <h4>套餐详情</h4>
          <table v-for="detail in mainInfo.details" :key="detail.id" class="info-table mb-15" style="max-width:500px;">
            <tr>
              <td class="label">套餐类型</td>
              <td>{{detail.serviceType}} </td>
            </tr>
            <tr>
              <td class="label">套餐名称</td>
              <td>{{detail.name}} <Button type="text" @click="$router.push({name:detail.type==='优惠套餐'?'mealInfo':'insuranceInfo',query:{id:detail.id,type:'view'}})" style="padding:0;margin:-2px 0 0 20px;">查看套餐详情</Button></td>
            </tr>
            <tr>
              <td class="label">套餐价格</td>
              <td>{{detail.price}} </td>
            </tr>
            <tr v-if="detail.type==='优惠套餐'">
              <td class="label">优惠项目</td>
              <td>{{detail.discountType}} </td>
            </tr>
            <tr v-if="detail.type==='优惠套餐'">
              <td class="label">包含服务项目</td>
              <td>{{detail.discountLimit}} </td>
            </tr>
            <tr v-if="detail.type==='优惠套餐'">
              <td class="label">优惠额度</td>
              <td><span v-show="detail.discountRate.length>0">{{detail.discountRate==='0.00'?'全额减免':'折扣:'+detail.discountRate}}</span> </td>
            </tr>
             <tr v-if="detail.type==='优惠套餐'">
              <td class="label">是否使用</td>
              <td><span>{{detail.hasUsed}}</span> </td>
            </tr>
            <tr v-if="detail.type==='优惠套餐'">
              <td class="label">是否一次性</td>
              <td><span>{{detail.isSingleUse}}</span> </td>
            </tr>
             <!-- <tr v-if="detail.type==='优惠套餐'">
              <td class="label">客户签名</td>
              <td><Button type="text" @click="signModal=true">点击查看</Button></td>
            </tr> -->
            <tr>
              <td class="label">有效期</td>
              <td>{{detail.validMonth}}月 </td>
            </tr>

            <tr>
              <td class="label">套餐服务有效期</td>
              <td>{{detail.validTimeBegin}}&nbsp;至&nbsp;{{detail.validTimeEnd}}</td>
            </tr>
          </table>
        </Col>
      </Row>
      <div class="mt-15" v-show="mainInfo.details[0].changePriceRemark&&mainInfo.details[0].serviceType == '可变动金额'">
        <h4>改价说明</h4>
        <div class="price-desc">
          <span >{{mainInfo.details[0].changePriceRemark}}</span>
        </div>
      </div>
      <div class="mt-15">
        <h4>优惠次数</h4>
        <div class="table-wrapper">
          <Table :data="saleList" :columns="tableColumn"></Table>
          <div class="pagination">
            <Page :current.sync="pageNo" :total="totalCount" :page-size="pageSize" show-elevator @on-change="(page)=>getUseLists('page',page)" @on-page-size-change="(size)=>getUseLists('size',size)"></Page>
          </div>
        </div>
      </div>
    </Card>
    <Modal title="客户签名" v-model="signModal" :footer-hide="true">
      <template v-if="signModalUrl">
        <img :src="signModalUrl" alt="" style="width:300px;display:block;margin:0 auto;">
      </template>
      <template v-else>
        <span class="tips">暂无签名</span>
      </template>
    </Modal>
  </div>
</template>

<script>
    export default {
        name: "meal-detail",
      data(){
          return{
            tableColumn:[
              {title:'工单编号',key:'orderSn',align:'center'},
              {title:'服务项目',key:'categoryName',align:'center'},
              {title:'创建日期',key:'createTime',align:'center'},
              {title:'套餐名称',key:'serviceName',align:'center'},
              {title:'优惠金额',key:'discountAmount',align:'center'},
              {title:'维修师傅',key:'serviceUserName',align:'center'
              },{
                title:'操作',
                align:'center',
                render:(h,params)=>{
                  let id = params.row.id;
                  let _this = this;
                  return h('Button',{
                    props:{
                      type:'primary',
                      size:'small'
                    },
                    on:{
                      click(){
                        _this.$router.push({name:'feeDetail',query:{id:id}})
                      }
                    }
                  },'查看')
                }
              },
            ],
            mainInfo:{},
            saleList:[],
            pageNo:1,
            pageSize:10,
            totalCount:0,
            signModalUrl:'',  //签名图
            signModal:false, //显示签名
          }
      },
      created(){
        this.id= this.$route.query.id;
        this.getDetail();
        this.getUseLists();
      },
      methods:{
          getDetail(){
            this.$http.get(`/service/order/info/${this.id}`)
              .then(res=>{
                if(res.data.code===0){
                  let data = res.data.data;
                  this.mainInfo=data;
                  this.signModalUrl=data.userSignImage
                }
              })
          },
          getUseLists(pageType,num){
            let params;
            if(pageType==='page'){
              params=`pageNo=${num}&pageSize=${this.pageSize}`;
              this.pageNo=num;
            }else if(pageType==='size'){
              params=`pageNo=${this.pageNo}&pageSize=${num}`;
              this.pageSize=num;
            }else{
              params=`pageNo=${this.pageNo}&pageSize=${this.pageSize}`;
            }
            this.$http.post(`/service/order/used/list?id=${this.id}&${params}`)
              .then(res=>{
                if(res.data.code===0){
                  let data = res.data.data;
                  this.saleList=data.list;
                  this.totalCount=data.totalCount;
                }else{
                  console.log(data.msg)
                }
              }).catch(err=>{
              console.log(err)
            })
          }
      }
    }
</script>

<style scoped lang="scss">
@import "../order";
  h4{
    margin: 15px 0;
    font-size: 16px;
  }
  .row-info{
    .label{
      height:60px;
    }
  }
.price-desc{
  display: inline-block;
  width: 600px;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 15px;
}
</style>
