<style scoped lang="scss">
  @import './home_index.scss';
</style>
<template>
  <div class="home-index">
    <Row :gutter="15">
      <Col :sm="24" :md="24" :lg="16">
        <Card>
          <p slot="title">工单统计</p>
          <Row :gutter="15">
            <Col :xs="24" :sm="12" :md="8" >
              <router-link :to="{name:'order_filter',query:{from:'home',type:'today'}}">
                <info-card
                  id-name="today_new_order"
                  title="今日新增工单"
                  :end-val="count.todayNum"
                  icon="md-list"
                ></info-card>
              </router-link>
            </Col>
            <Col :xs="24" :sm="12" :md="8" >
              <router-link :to="{name:'order_filter',query:{from:'home',type:'month'}}">
                <info-card
                  id-name="month_new_order"
                  title="本月新增工单"
                  :end-val="count.currentMonthNum"
                  color="#FED478"
                ></info-card>
              </router-link>

            </Col>
            <Col :xs="24" :sm="12" :md="8" >
              <router-link :to="{name:'order_filter',query:{from:'home',type:'total'}}">
                <info-card
                  id-name="history_order"
                  title="历史工单"
                  :end-val="count.totalNum"
                  color="#68D576"
                  icon="ios-filing-outline"></info-card>
              </router-link>

            </Col>
          </Row>
        </Card>
      </Col>
      <Col :sm="24" :lg="8">
        <Card style="width:100%;margin-bottom: 10px;">
          <p slot="title">常用操作</p>
          <div class="controls">
            <div class="control-btn" @click="createModal=true">
              <Icon type="ios-create"  size="40"/>
              <p>创建工单</p>
            </div>
            <div class="control-btn" @click="initiateService=true">
              <Icon type="logo-skype" size="40"/>
              <p>发起售后</p>
            </div>
            <div class="control-btn" @click="cancelModal=true">
              <Icon type="md-easel" size="40"/>
              <p>取消工单</p>
            </div>
          </div>
        </Card>
      </Col>
    </Row>
    <Row>
      <Col :lg="24" :md="24" :sm="24">
        <Card :style="{width:'100%'}">
          <p slot="title">工单趋势</p>
          <div class="weekChart" style="height: 500px;">
            <order-week-trend></order-week-trend>
          </div>
        </Card>
      </Col>
    </Row>
    <!--创建工单-->
    <create-order :createOrder="createModal" @close="closeModal"></create-order>
    <!--发起售后-->
    <initiate-service :initiateService="initiateService" @close="closeModal"></initiate-service>
    <!--取消工单-->
    <cancel-order :cancelModal="cancelModal" @close="closeModal"></cancel-order>
  </div>
</template>

<script>
  import infoCard from './component/infoCard';
  import orderWeekTrend from './component/orderWeekTrend';
  import createOrder from './component/createOrder';
  import initiateService from './component/initiateService';
  import cancelOrder from './component/cancelOrder';

    export default {
        name: "Index",
        components:{
          infoCard,
          orderWeekTrend,
          createOrder,
          initiateService,
          cancelOrder,
        },
        data(){
          return{
            createModal:false,
            initiateService:false,
            cancelModal:false,
            count:{
              "todayNum": 0,
              "currentMonthNum": 0,
              "totalNum": 0
            }, //首页数据
          }
        },
      methods:{
          closeModal(model){
            this[model]=false;
          },
          getCount(){
            this.$http.get(`/index/order/count`)
              .then(res=>{
                if(res.data.code===0){
                  this.count=res.data.data;
                }else{
                  console.log('首页统计数据：'+res.data.msg);
                }
              })
          },
      },
      mounted(){
          this.getCount();
      }

    }
</script>


