<template>
  <div class="visitCheck">
    <Spin fix v-show="loading == true">加载中...</Spin>
    <div class="leftBox">
      <div class="order">
        <span style="font-size:12px;font-weight: bold;">{{workOrderInfo.orderSn}}</span>
        <span class="status">{{workOrderInfo.orderState | stateFilters}}</span>
      </div>
      <table class='table'>
        <tr>
          <td class="left">服务项目：</td>
          <td class="right">{{workOrderInfo.repairCategoryName}}<span v-show="workOrderInfo.isAcceptDtdFee === 'Y'" style="color:#999;">(同意上门费)</span></td>
        </tr>
      </table>
      <table class='table'>
        <tr>
          <td class="left">报修地点：</td>
          <td class="right">{{workOrderInfo.repairRegionName}}</td>
        </tr>
        <tr>
          <td class="left">详细地址：</td>
          <td class="right">{{workOrderInfo.address}}</td>
        </tr>
        <tr>
          <td class="left">用户姓名：</td>
          <td class="right">{{workOrderInfo.username}}</td>
        </tr>
        <tr>
          <td class="left">用户手机：</td>
          <td class="right">{{workOrderInfo.userPhone}}</td>
        </tr>
      </table>
      <table class='table'>
        <tr>
          <td class="left">接单师傅：</td>
          <td class="right">{{masterInfo.masterName}}<span v-if="workOrderInfo.receiveUserId" class="checkShiFu" @click="checkShiFu(workOrderInfo.receiveUserId)">查看</span></td>
        </tr>
        <tr>
          <td class="left">师傅电话：</td>
          <td class="right">{{masterInfo.masterPhone}}</td>
        </tr>
      </table>
      <table class='table'>
        <tr class="trBorder">
          <td class="left levelTop">工单费用：</td>
          <div class="order-sub-item">
            <p class="sub-item-text" v-for="item in repairOrderAmountVos" :key="item.type">
              <span class="label">{{item.name}}：</span>
              <span>{{item.amount}}</span>
            </p>
          </div>
        </tr>
        <tr class="trBorder">
          <td class="left levelTop">工单渠道：</td>
          <div class="order-sub-item">
            <p class="sub-item-text" v-for="item in repairOrderOfferPlanVoList" :key="item.type">
              <span class="label">{{item.planName}}：</span>
              <span>{{item.amount}}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <span>{{item.isPay == 'Y'? '已支付' : '未支付'}}</span>
            </p>
          </div>
        </tr>
      </table>
      <table class='table' style="border:none">
<!--        <tr>-->
<!--          <td class="left">质保中：</td>-->
<!--          <td class="right">{{workOrderInfo.isWarranty}}</td>-->
<!--        </tr>-->
<!--        <tr>-->
<!--          <td class="left">售后记录：</td>-->
<!--          <td class="right">{{workOrderInfo.afterSalesServiceCount}}</td>-->
<!--        </tr>-->
<!--        <tr>-->
<!--          <td class="left">故障原因：</td>-->
<!--          <td class="right">{{workOrderInfo.faultReason}}</td>-->
<!--        </tr>-->
        <tr>
          <td class="left">服务网点：</td>
          <td class="right">{{workOrderInfo.stationName}}</td>
        </tr>
        <tr>
          <td class="left">网点电话：</td>
          <td class="right">{{workOrderInfo.stationPhone}}</td>
        </tr>
        <tr>
          <td class="left">创建时间：</td>
          <td class="right">{{workOrderInfo.createTime}}</td>
        </tr>
      </table>
    </div>
    <div class="interval"></div>
    <div class="rightBox">
      <Form ref="formValidate" :model="visitForm" :rules="ruleValidate">
        <table class='table'>
          <tr>
            <td class="left">售后回访</td>
            <td class="right" colspan="2">否</td>
          </tr>
<!--          <tr>-->
<!--            <td class="left">材料更换</td>-->
<!--            <td class="right" colspan="2">{{materialChange}}</td>-->
<!--          </tr>-->
          <tr>
            <td class="left">网点回访结果</td>
            <td class="right" colspan="2">{{$route.query.linkVisitResult || '未回访'}}</td>
          </tr>
          <tr>
            <td class="left">满意度</td>
            <td class="right">
              <FormItem prop="satisfaction" style="margin:0;">
                <Select v-model="visitForm.satisfaction.val" style="width:200px">
                  <Option v-for="item in visitForm.satisfaction.list" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
              </FormItem>
            </td>
            <td class="remark">
              <Input v-model.trim="visitForm.satisfaction.remark" type="textarea" :rows="4" :maxlength="150" placeholder="请输入备注" clearable />
            </td>
          </tr>
          <tr>
            <td class="left">材料更换</td>
            <td class="right">
              <FormItem style="margin:0;">
                <RadioGroup v-model="visitForm.materials.val">
                  <Radio label="是"></Radio>
                  <Radio label="否"></Radio>
                </RadioGroup>
              </FormItem>
            </td>
            <td class="remark">
              <Input v-model.trim="visitForm.materials.remark" type="textarea" :rows="4" :maxlength="150" placeholder="请输入备注" clearable />
            </td>
          </tr>
          <tr>
            <td class="left">取消订单</td>
            <td class="right">
              <FormItem prop="cancelOrder" style="margin:0;">
                <Select v-model="visitForm.cancelOrder.val" style="width:200px">
                  <Option v-for="item in visitForm.cancelOrder.list" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
              </FormItem>
            </td>
            <td class="remark">
              <Input v-model.trim="visitForm.cancelOrder.remark" type="textarea" :rows="4" :maxlength="150" placeholder="请输入备注" clearable />
            </td>
          </tr>
          <tr>
            <td class="left">私自收费</td>
            <td class="right">
              <FormItem style="margin:0;">
                <RadioGroup v-model="visitForm.privatelyToll.val">
                  <Radio label="是"></Radio>
                  <Radio label="否"></Radio>
                </RadioGroup>
              </FormItem>
            </td>
            <td class="remark">
              <Input v-model.trim="visitForm.privatelyToll.remark" type="textarea" :rows="4" :maxlength="150" placeholder="请输入备注" clearable />
            </td>
          </tr>
          <tr>
            <td class="left">关闭订单</td>
            <td class="right">
              <FormItem prop="closeOrder" style="margin:0;">
                <Select v-model="visitForm.closeOrder.val" style="width:200px">
                  <Option v-for="item in visitForm.closeOrder.list" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
              </FormItem>
            </td>
            <td class="remark">
              <Input v-model.trim="visitForm.closeOrder.remark" type="textarea" :rows="4" :maxlength="150" placeholder="请输入备注" clearable />
            </td>
          </tr>
          <tr>
            <td class="left">其他</td>
            <td class="remark" colspan="2">
              <Input v-model.trim="visitForm.other.remark" type="textarea" :rows="4" :maxlength="150" placeholder="请输入备注" clearable />
            </td>
          </tr>
          <tr>
            <td class="left">回访结果</td>
            <td class="right" colspan="2">
              <FormItem style="margin:0;">
                <RadioGroup v-model="visitForm.result.val">
                  <Radio label="通过"></Radio>
                  <Radio label="不通过"></Radio>
                </RadioGroup>
              </FormItem>
            </td>
          </tr>
        </table>
        <div>
          <Button icon="ios-arrow-back" style="margin-top:20px;" @click="backBtn">返回上一页</Button>
          <Button type="primary" style="margin-top:20px;" @click="subBtn('formValidate')" :loading="btnLoading">提交</Button>
        </div>
      </Form>
    </div>
  </div>
</template>

<script>
export default {
  name: "visitCheck",
  data() {
    const satisfaction = (rule, value, callback) => {
      if (!value.val) {
        callback(new Error("请选择满意度"));
      } else {
        callback();
      }
    };
    const cancelOrder = (rule, value, callback) => {
      if (!value.val) {
        callback(new Error("请选择取消方"));
      } else {
        callback();
      }
    };
    const closeOrder = (rule, value, callback) => {
      if (!value.val) {
        callback(new Error("请选择关闭方"));
      } else {
        callback();
      }
    };
    return {
      btnLoading:false,
      loading:true,
      materialChange:'',//材料更换信息
      workOrderInfo:{},
      masterInfo:{},
      repairOrderAmountVos:[],
      repairOrderOfferPlanVoList:[],
      //表单内容
      visitForm: {
        satisfaction: {
          list:[
            {
              value:'1',
              label:'非常不满意',
            },
            {
              value:'2',
              label:'不满意',
            },
            {
              value:'3',
              label:'良好',
            },
            {
              value:'4',
              label:'满意',
            },
            {
              value:'5',
              label:'非常满意',
            },
          ],
          val:'',
          remark:'',
        },
        materials:{
          val:'是',
          remark:'',
        },
        cancelOrder:{
          list:[
            {
              value: 'N',
              label: '否'
            },
            {
              value: 'MASTER_REQUEST',
              label: '师傅要求'
            },
            {
              value: 'ACTIVE_REQUIREMENT',
              label: '主动要求'
            },
          ],
          val:'',
          remark:'',
        },
        privatelyToll:{
          val:'否',
          remark:'',
        },
        closeOrder:{
          list:[
            {
              value: 'N',
              label: '否'
            },
            {
              value: 'MASTER_REQUEST',
              label: '师傅要求'
            },
            {
              value: 'ACTIVE_REQUIREMENT',
              label: '主动要求'
            },
          ],
          val:'',
          remark:'',
        },
        other:{
          remark:'',
        },
        result:{
          val:'通过',
        }
      },
      ruleValidate: {
        satisfaction: [{ validator: satisfaction,trigger: 'change' }],
        cancelOrder: [{ validator: cancelOrder,trigger: 'change' }],
        closeOrder: [{ validator: closeOrder,trigger: 'change' }],
      }
    };
  },
  filters: {
    stateFilters(value) {
      if (!value) return ''
      if (value === 'ASSIGNED'){
        return '待分配'
      }
      if (value === 'WAIT_DOOR'){
        return '待上门'
      }
      if (value === 'WAITING_DOOR'){
        return '已上门'
      }
      if (value === 'STAY_PAY'){
        return '待付款'
      }
      if (value === 'WAIT_SERVICE'){
        return '待服务'
      }
      if (value === 'FINISH'){
        return '已完成'
      }
      if (value === 'AFTER_SALE'){
        return '售后中'
      }
      if (value === 'CANCEL'){
        return '已取消'
      }
      if (value === 'CLOSED'){
        return '已关闭'
      }
      if (value === 'EXCEPTION'){
        return '异常'
      }
    }
  },
  mounted() {
    this.getOrderData();
  },
  methods: {
    backBtn() {
      this.$router.push({name:'visit-admin'});
    },
    // 查看师傅详情
    checkShiFu(id){
      this.$router.push({name:'staffDetail',query:{id:id}});
    },
    // 获取工单详情
    getOrderData() {
      this.$http({
        method: "get",
        url: `/yyht/v1/repair/order/baseInfo?repairOrderId=${this.$route.query.orderId}`,
      }).then(res => {
        if (res.data.code === 0) {
          this.workOrderInfo = res.data.data.baseInfo;
          this.masterInfo = res.data.data.dispatchInfo;
          this.repairOrderOfferPlanVoList = res.data.data.repairOrderOfferPlanVoList;
          this.repairOrderAmountVos = res.data.data.repairOrderAmountVos;
          this.loading = false;
        } else {
          this.$Message.error(res.data.msg);
        }
      });
    },
    // 提交
    subBtn(name){
      this.btnLoading = true;
      this.$refs[name].validate(valid => {
        if (valid) {
          let data = {
            id:this.$route.query.id,
            satisfaction:this.visitForm.satisfaction.val,
            satisfactionRemarks:this.visitForm.satisfaction.remark,
            materialChange:this.visitForm.materials.val === '是'?'Y':'N',
            materialChangeRemarks:this.visitForm.materials.remark,
            cancelOrder:this.visitForm.cancelOrder.val,
            cancelOrderRemarks:this.visitForm.cancelOrder.remark,
            privateCharge:this.visitForm.privatelyToll.val === '是'?'Y':'N',
            privateChargeRemarks:this.visitForm.privatelyToll.remark,
            closeOrder:this.visitForm.closeOrder.val,
            closeOrderRemarks:this.visitForm.closeOrder.remark,
            other:this.visitForm.other.remark,
            returnVisitResult:this.visitForm.result.val === '通过'?'PASS':'NOT_PASS',
          }
          this.$http({
            method: "post",
            url: `/yyht/v1/repair/return/visit/doVisit`,
            data: data,
          }).then(res => {
            if (res.data.code === 0) {
              if (res.data.code === 0) {
                this.$Message.success("回访操作成功");
                this.$router.push({name:'visit-admin'});
              } else {
                this.$Message.error(res.data.msg);
              }
            } else {
              this.$Message.error(res.data.msg);
            }
            this.btnLoading = false
          });
        }else{
          this.$Message.error('表单未填写完整！')
          this.btnLoading = false
        }
      });
    }
  }
};
</script>

<style lang='scss' scoped>
  .trBorder{
    height: 80px;
  }
  .levelTop{
    vertical-align: top;
  }
  .visitCheck {
    overflow: hidden;
    padding: 15px;
    background-color: #fff;
    .leftBox {
      width: 19.5%;
      min-height: 80vh;
      float: left;
      padding-right: 5px;
      .order {
        height: 100px;
        line-height: 100px;
        font-size: 18px;
        overflow: hidden;
        .status {
          font-size: 14px;
          padding: 5px 10px;
          background-color: #19be6b;
          color: #fff;
          border-radius: 4px;
        }
      }
      .table {
        border-collapse: collapse;
        width: 100%;
        margin: 20px 0;
        tr {
          td {
            padding: 5px 5px;
            .checkShiFu{
              margin-left: 10px;
              color: #2d8cf0;
              cursor: pointer;
            }
          }
          .left {
            font-weight: bold;
            width: 40%;
            text-align: center;
            word-break:break-all;
          }
          .right {
            width: 60%;
            word-break:break-all;
          }
        }
        border-bottom: 1px dashed #999;
      }
    }
    .interval {
      width: 0.5%;
      min-height: 80vh;
      background-color: #f2f2f2;
      float: left;
    }
    .rightBox {
      width: 80%;
      min-height: 80vh;
      padding: 10px;
      float: left;
      .title {
        overflow: hidden;
        margin-bottom: 20px;
        .ornament {
          height: 30px;
          width: 5px;
          background-color: #2d8cf0;
          float: left;
        }
        .name {
          float: left;
          height: 30px;
          line-height: 30px;
          padding-left: 10px;
          font-weight: bold;
          font-size: 18px;
        }
      }
      .table {
        border-collapse: collapse;
        width: 100%;
        margin: 20px 0;
        tr {
          td {
            padding: 10px 10px;
            border: 1px solid #f2f2f2;
          }
          .left {
            width: 20%;
            text-align: center;
          }
          .right {
            width: 30%;
          }
          .remark{
            width: 50%;
          }
        }
      }
      .TabPane {
        padding: 10px;
      }
    }
  }
</style>

