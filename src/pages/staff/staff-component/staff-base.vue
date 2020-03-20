<template>
  <Card>
    <Form class="normal-form" v-if="queryType==='normal'" :label-width="80">
      <div class="normal-left">
        <div class="normal-title">基本信息

          <Button class="normal-btn" @click="generateQrCode">生成二维码</Button>
        </div>
        <div class="normal-table">
          <div class="table-row">
            <label>用户姓名：</label>
            <span>{{normalUserInfo.trueName}}</span>
          </div>
           <div class="table-row">
            <label>用户电话：</label>
            <span>{{normalUserInfo.mobile}}</span>
          </div>
           <div class="table-row">
            <label>用户昵称：</label>
            <span>{{normalUserInfo.nickName}}</span>
          </div>
          <div class="table-row">
            <label>微信Id：</label>
            <span>{{normalUserInfo.wxXcxOpenId}}</span>
          </div>
        </div>

      </div>
      <div class="normal-right">
        <div class="normal-title">
          可变更信息
          <Button @click="toggleNormal" class="normal-btn">{{disNormalUser?'编辑':'保存'}}</Button>
        </div>
        <FormItem label="用户类型：">
          <Select :disabled="disNormalUser" v-model="normalUserInfo.userType">
            <Option value="USER">普通用户</Option>
            <Option value="ADMIN">超级管理员</Option>
            <Option value="SERVICE_USER">系统用户</Option>
            <Option value="MERCHANT">商户类型</Option>
          </Select>
        </FormItem>
        <FormItem label="会员状态">
          <i-switch size="large" :disabled="disNormalUser" v-model="normalUserInfo.UserStateEnum" true-value="OPEN" false-value="CLOSE">
            <span slot="open">开启</span>
            <span slot="close">关闭</span>
          </i-switch>
        </FormItem>
        <FormItem label="分佣类型：">
          <Select :disabled="disNormalUser" v-model="normalUserInfo.commissionType">
            <Option value="FIXED">固定金额型</Option>
            <Option value="PERCENT">按百分比型</Option>
            <Option value="NONE">无</Option>
          </Select>
        </FormItem>
        <template  v-show="normalUserInfo.commissionType!=='NONE'&&!!normalUserInfo.commissionType">
          <FormItem label="分佣值：">
            <div>
              <InputNumber :disabled="disNormalUser" v-model="normalUserInfo.commissionValue"></InputNumber>
              <span v-if="normalUserInfo.commissionType" >%</span>
              <span v-else>元</span>
            </div>
          </FormItem>
        </template>
      </div>

    </Form>
    <Form v-if="queryType==='service'" class="form-wrap">
      <div class="info-block mb-15">
        <p class="info-title">
          <span>人员信息</span>
        </p>
        <div class="info-content">
          <FormItem label="师傅姓名：" >
            <Input readonly v-model="baseInfo.trueName"/>
          </FormItem>
          <FormItem label="师傅电话：">
            <Input readonly v-model="baseInfo.mobile"/>
          </FormItem>
          <FormItem label="服务网点：">
            <Input readonly v-model="baseInfo.repairStationName"/>
          </FormItem>

        </div>
      </div>
      <div class="info-block mb-15 ">
        <p class="info-title">师傅状态</p>
        <template v-if="applyState==0">
          <div class="info-content">
            <Alert show-icon>当前账号需要您先审核</Alert>
            <FormItem label="是否通过审核：">
              <Select class="form-control" v-model="accountInfo.applyState">
                <Option value="1">是</Option>
                <Option value="-1">否</Option>
              </Select>
            </FormItem>
            <FormItem label="审核说明：">
              <Input type="textarea" v-model="accountInfo.applyRemark" />
            </FormItem>
            <FormItem>
              <Button class="pull-right" @click="saveChange('accountInfo')" type="primary">保存</Button>
            </FormItem>
          </div>
        </template>
       <template v-else>
         <div class="info-content">
           <FormItem label="账号状态设置">
             <i-switch size="large" v-model="accountInfo.accountsState" true-value="NORMAL" false-value="DISABLE" @on-change="saveChange('accountInfo','switch')">
               <span slot="open">启用</span>
               <span slot="close">停用</span>
             </i-switch>
           </FormItem>
         </div>
       </template>
      </div>
      <template v-if="applyState!==0">
        <div class="info-block mb-15">
          <p class="info-title">
            <span>师傅扣点比例</span>
            <Button @click="toggleService" :type="disService?'default':'primary'" size="small">{{disService?'编辑':'保存'}}</Button>
          </p>
          <div class="info-content">
            <FormItem label="人工费扣点方式">
              <Select :disabled="disService" v-model="sysService.sysServiceProjectType" class="form-item" >
                <Option value="FIXED">固定金额型</Option>
                <Option value="PERCENT">按百分比型</Option>
                <Option value="NONE">无</Option>
              </Select>
            </FormItem>
            <template  v-show="sysService.sysServiceProjectType!=='NONE'&&!!sysService.sysServiceProjectType">
              <FormItem label="人工费扣点值">
                <div>
                  <InputNumber :disabled="disService" v-model="sysService.sysServiceProjectValue"></InputNumber>
                  <span v-if="sysService.sysServiceProjectType==='PERCENT'" >%</span>
                  <span v-else>元</span>
                </div>
              </FormItem>
            </template>

            <FormItem label="材料费扣点方式">
              <Select :disabled="disService" v-model="sysService.sysMaterialProjectType" class="form-item" >
                <Option value="FIXED">固定金额型</Option>
                <Option value="PERCENT">按百分比型</Option>
                <Option value="NONE">无</Option>
              </Select>
            </FormItem>
            <template v-show="sysService.sysMaterialProjectType!=='NONE'&&!!sysService.sysServiceProjectType">
              <FormItem label="材料费扣点值">
               <div class="form-item">
                 <InputNumber :disabled="disService" v-model="sysService.sysMaterialProjectValue" />

                 <span v-if="sysService.sysServiceProjectType==='PERCENT'" >%</span>
                 <span v-else >元</span>
               </div>
              </FormItem>
            </template>

          </div>
        </div>
        <div class="info-block mb-15">
          <p class="info-title">
            <span>业务状态</span>
            <Button size="small" :type="disBusiness?'default':'primary'" @click="toggleBusiness">{{disBusiness?'编辑':'保存'}}</Button>
          </p>
          <div class="info-content">
            <FormItem label="业务状态调整">
              <Select :disabled="disBusiness" v-model="businessState" class="form-item mb-15" >
                <Option value="NORMAL">正常</Option>
                <Option value="DISABLE_ACCEPT_REPAIR_ORDER">禁止接工单</Option>
                <Option value="DISABLE">禁用账号</Option>
              </Select>
            </FormItem>
          </div>
        </div>
      </template>


    </Form>
  </Card>
</template>

<script>
    export default {
        name: "staff-account",
      computed:{
        username(){
          let account = this.$store.state.app.staffAccount;
          if(account){
            return account.username;
          }else{
            return '';
          }
        },
      },
      data(){
        return {
          userId:'',
          queryType:'', //页面类型： service-服务师傅，normal-普通用户
          disNormalUser:true,
          normalUserInfo:{ //普通用户信息

          },
          disInfo:true,
          baseInfo:{
            trueName:'',
            mobile:'',
            repairStationName:'',
          },
          disService:true,
          sysService:{
            "serviceUserId":"",
            "sysServiceProjectType":"",
            "sysServiceProjectValue":"",
            "sysMaterialProjectType":"", //系统材料费扣点方式（1、固定值 FIXED；2、百分比 PERCENT；3、无 NONE；）
            "sysMaterialProjectValue":"",
          },
          columns:[],
          orderLists:[],
          applyState:'',
          accountInfo:{
            "applyState":0,  // 审核状态（1、-1 审核失败；2、0 待审核 3、 1 审核成功）
            "applyRemark":"",
            "accountsState":"" //帐号状态（1、正常NORMAL；2、停用DISABLE；）
          },
          disBusiness:true,
          businessState:''
        }
      },
      methods:{
          // 普通用户-生成二维码
        generateQrCode(){
          this.$http.get(`/api/v1/user/makeInviteQr?userId=${this.userId}`).then(res=>{
            if(res.data.code===0){
              console.log(res.data.data)
            }
          })
        },
        //普通用户详情
        getUserDetail(id){
          this.$http.get(`/yyht/v1/user/detail?userId=${id}`).then(res=>{
            if(res.data.code===0){
              this.normalUserInfo = res.data.data;
            }else{
              console.log(res.data.msg)
            }
          })
        },
        // 普通用户-编辑
        toggleNormal(){
          if(this.disNormalUser){
            this.disNormalUser = false
          }else{
            let params = {
              userId:this.userId,
              userType:'',
              trueName:'',
              userState:'',
              commissionType:'',
              commissionValue:'',
            }
            for(let key in params){
              params[key] = this.normalUserInfo[key]
            }
            this.$http.post(`/yyht/v1/service/user/changeUserMsg`,params).then(res=>{
              if(res.data.code===0){
                this.disNormalUser=true;
                this.$Message.success('保存成功')
              }else{
                this.$Message.error('保存失败')
              }
            })
          }
        },
          // 服务师傅详情
          getDetail(id){
            this.$http.get(`/yyht/v1/service/user/detail?id=${id}`).then(res=>{
              if(res.data.code===0){
                let data = res.data.data;
                this.userId = data.id;
                for(let key in this.baseInfo){
                  this.baseInfo[key] = data[key]
                }
                for(let key in this.sysService){
                  this.sysService[key] = data[key]
                }
                for(let key in this.accountInfo){
                  this.accountInfo[key] = data[key]
                }
                this.businessState = data.businessState
                this.applyState = data.applyState   //防止表单state变动影响
                console.log(res.data.data)
              }
            })
          },
        // 师傅
        toggleService(){
          if(this.disService){
            this.disService = !this.disService
          }else{
            this.saveChange('sysService')
          }
        },
        // 师傅-编辑bussinessState
        toggleBusiness(){
            if(this.disBusiness){
              this.disBusiness = false
            }else{
              let params = `serviceUserId=${this.userId}&businessState=${this.businessState}`
              this.$http.post(`/yyht/v1/service/user/change/businessState?${params}`).then(res=>{
                if(res.data.code===0){
                  this.$Message.success('保存成功')
                  this.disBusiness = true
                }else{
                  this.$Message.info('保存失败')
                }
              })
            }
        },
        // 师傅
        saveChange(changeKey,from){
          let params
          if(changeKey==='accountInfo'){
            params = this.accountInfo;
            params.serviceUserId = this.userId
            if(from==='switch'){
              delete this.accountInfo.applyState
              delete this.accountInfo.applyRemark
            }
          }
          if(changeKey==='sysService'){
            params = this.sysService
            this.sysService.serviceUserId = this.userId
            if(!parseFloat(this.sysService.sysServiceProjectType)||!parseFloat(this.sysService.sysServiceProjectType)){
              this.$Message.error('扣点值格式不正确，请重新输入数字')
            }
          }
            this.$http.post(`/yyht/v1/service/user/applyServiceUser`,params).then(res=>{
              if(res.data.code===0){
                this.$Message.success('状态更新成功')
                this.getDetail(this.userId)
                if(changeKey==='sysService'){
                  this.disService = true
                }
              }else{
                this.$Message.error('状态更新失败')
              }
            })
        },

      },
      mounted(){
          this.userId = this.$route.query.id;
          this.queryType = this.$route.query.queryType;
          if(this.queryType==='service'){
            this.getDetail(this.userId)
          }else{
            this.getUserDetail(this.userId)
          }
      }
    }
</script>

<style scoped lang="scss">
.form-item{
  width: 250px;
}
  .info-block{
    margin-right: 50px;
    .info-title{
     display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 15px;
      position: relative;
      padding-left: 15px;
      &:before{
        content: "";
        display: inline-block;
        width: 8px;
        height: 20px;
        background: #2b85e4;
        position: absolute;
        left: 0;
        top:50%;
        transform: translateY(-50%);
      }
    }
    .info-content{
      width: 250px;
    }
  }
  .form-wrap{
    display: flex;
    flex-wrap: wrap;
  }
  /deep/ .ivu-form-item{
    margin-bottom: 10px;
  }
  /deep/ .ivu-input-number{
    width:200px;
  }

  .normal-form{
    display: flex;
    .normal-title{
      font-weight: bold;
      padding-bottom: 10px;
      margin-bottom: 10px;
      position: relative;
      padding-left: 10px;
      &:before{
        content: "";
        display: block;
        width: 5px;
        height: 5px;
        background: #2b85e4;
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-8px);
      }
      .normal-btn{
        position: absolute;
        right: 0;
        top: -4px;
      }
    }
    .normal-left{
      flex: 1 0 0;
      margin-right: 30px;
    }
    .normal-right{
      flex: 1 0 0;

    }
    .normal-table{
      .table-row{
        padding:4px 10px;
        label{
          display: inline-block;
          width: 100px;
          text-align: right;
          margin-right: 10px;
          color: #333;
        }
      }
    }

  }
</style>
