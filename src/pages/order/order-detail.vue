<style scoped lang="scss">
  @import "./order";
</style>
<template>
    <div class="order-detail">
      <Row :gutter="15">
        <Col :lg="8" :sm="24">
          <Card>
            <div class="order-title" style="border-bottom: 1px solid #ddd;margin-bottom: 10px;">
              <h4><Icon color="#57a3f3" type="ios-list" size="28"/>{{baseInfo.orderSn}}</h4>
              <span class="status">{{baseInfo.orderState}}</span>
            </div>
            <div class="order-item">
              <span class="label">服务项目：</span>
              <span class="item-info">
                <p>{{baseInfo.repairCategoryName}}</p>
                <p v-if="baseInfo.isAcceptDtdFee==='Y'" class="text-grey">(同意上门费)</p>
              </span>
            </div>
            <Divider />
            <!--报修地址等-->
            <div class="order-item">
              <span class="label">报修区域：</span>
              <span class="item-info">{{baseInfo.regionName}}</span>
            </div>
            <div class="order-item">
              <span class="label">详细地址：</span>
              <span class="item-info">{{baseInfo.address}}</span>
            </div>
            <div class="order-item">
              <span class="label">用户手机：</span>
              <span class="item-info">{{baseInfo.ysyUserPhone}}</span>
            </div>
             <div class="order-item">
              <span class="label">联系人姓名：</span>
              <span class="item-info">{{baseInfo.username}}</span>
            </div>
            <div class="order-item">
              <span class="label">联系电话：</span>
              <span class="item-info">{{baseInfo.userPhone}}</span>
            </div>

            <!--接单师傅等-->
            <Divider />
            <div class="order-item">
              <span class="label">接单师傅：</span>
              <span class="item-info">
                <span>{{baseInfo.receiveUserName}}</span>
                <span v-if="baseInfo.receiveUserId" @click="viewStaff(baseInfo.receiveUserId)" class="text-blue" style="margin-left:10px;cursor:pointer;">查看</span>
              </span>
            </div>
            <div class="order-item">
              <span class="label">师傅电话：</span>
              <span class="item-info">{{baseInfo.receiveUserPhone}}</span>

            </div>
            <Divider />
            <!--协助人员-->
            <div class="order-item">
              <span class="label">协作人员：</span>
              <div style="display: inline-block;" v-if="inviteStaffVoList&&inviteStaffVoList.length>0">
                <span class="item-info" v-for="(item,index) in inviteStaffVoList" :key="index">
                  <span>{{item.name}}</span>
                  <span class="text-blue" @click="$router.push({name:'staffDetail',query:{id:item.id}})" style="margin-left:10px;cursor:pointer;">查看</span>
                </span>
              </div>
              <span v-else>无</span>
            </div>
            <!--费用等-->
            <Divider />
            <div class="order-item">
              <span class="label">工单费用：</span>
              <span class="item-info">{{baseInfo.amount}}</span>
            </div>
            <div class="order-item">
              <span class="label">工单渠道：</span>
              <span class="item-info">{{baseInfo.orderSource}}</span>
            </div>
            <!--回访等-->
            <Divider />
            <div class="order-item">
              <span class="label">质保中：</span>
              <span class="item-info">{{baseInfo.isWarranty}}</span>
            </div>
            <div class="order-item">
              <span class="label">售后记录：</span>
              <span class="item-info">{{baseInfo.afterSalesServiceCount}}</span>
            </div>
            <div class="order-item">
              <span class="label">故障原因：</span>
              <span class="item-info">{{baseInfo.faultReason}}</span>
            </div>
            <div class="order-item">
              <span class="label">服务网点：</span>
              <span class="item-info">{{baseInfo.stationName}}</span>
            </div>
            <div class="order-item">
              <span class="label">创建时间：</span>
              <span class="item-info">{{baseInfo.createTime}}</span>
            </div>
          </Card>
        </Col>
        <Col :lg="16" :sm="24">
          <Card class="order-detail-right">
            <ul class="mb-15 nav-ul">
              <router-link exact active-class="text-blue" replace tag="li" :to="{name:'orderDetail',query:{id:id}}">处理流程</router-link>
              <router-link active-class="text-blue" replace tag="li" :to="{name:'feeDetail',query:{id:id}}">收费明细</router-link>
              <router-link active-class="text-blue" replace tag="li" :to="{name:'orderProve',query:{id:id}}">证据证明</router-link>
              <router-link active-class="text-blue" replace tag="li" :to="{name:'orderDetailIncome',query:{id:id}}">工单收益</router-link>
              <router-link active-class="text-blue" replace tag="li" :to="{name:'afterService',query:{id:id}}">售后质保</router-link>
              <router-link active-class="text-blue" replace tag="li" :to="{name:'visitedInfo',query:{id:id}}">回访信息</router-link>
              <router-link active-class="text-blue" replace tag="li" :to="{name:'orderControl',query:{id:id,state:baseInfo.orderState,isWarranty:baseInfo.isWarranty}}">订单操作</router-link>
              <router-link active-class="text-blue" replace tag="li" :to="{name:'orderLog',query:{id:id}}">工单日志</router-link>
              <router-link active-class="text-blue" replace tag="li" :to="{name:'customEva',query:{id:id}}">客户评价</router-link>
            </ul>
            <router-view></router-view>
          </Card>
        </Col>
      </Row>
    </div>
</template>

<script>
    export default {
        name: "order-detail",
      data(){
          return {
            id:'',
            baseInfo:{},
            stateArr:[
              {title:'待分配',state:'ASSIGNED'},
              {title:'待上门',state:'WAIT_DOOR'},
              {title:'已上门',state:'WAITING_DOOR'},
              {title:'待付款',state:'STAY_PAY'},
              {title:'待服务',state:'WAIT_SERVICE'},
              {title:'已完成',state:'FINISH'},
              {title:'售后中',state:'AFTER_SALE'},
              {title:'已取消',state:'CANCEL'},
              {title:'已关闭',state:'CLOSED'},
              {title:'异常',state:'EXCEPTION'},
            ],
            inviteStaffVoList:[]
          }
      },
      methods:{
        getBaseInfo(){
          let id = this.id;
          this.$http.get(`/repair/order/baseInfo?id=${id}`)
            .then(res=>{
              if(res.data.code===0){
                let data = res.data.data;
                // this.baseInfo=res.data.data;
                let state = data.orderState;
                this.stateArr.forEach(item=>{
                  if(item.state===state){
                    data.orderState=item.title;
                  }
                });
                this.baseInfo=res.data.data;
                this.inviteStaffVoList =data&& data.inviteStaffVoList; //协作人员
              }else{
                console.log('工单基础信息获取失败：'+res.data.msg);
              }
            })
        },
        viewStaff(staffId){
          this.$router.push({name:'staffDetail',query:{id:staffId}})
        }
      },
      mounted(){
        let id = this.$route.query.id;
        // if(!id){
        //   console.log(this.$route)
        //   id = sessionStorage.getItem('viewOrderId');
        //   if(!id){
        //     this.$Message.warning('工单ID不存在');
        //     this.$router.back();
        //   }
        // }
        this.id=id;
        this.getBaseInfo(id);
      },
      destroyed(){
          sessionStorage.removeItem('viewOrderId');
      }
    }
</script>


