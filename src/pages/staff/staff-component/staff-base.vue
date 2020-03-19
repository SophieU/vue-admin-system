<template>
  <Card>

    <Form class="form-wrap">
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
        <div v-if="applyState==0" class="info-content">
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
        <div v-else class="info-content">
          <FormItem label="账号状态设置">
            <i-switch size="large" v-model="accountInfo.accountsState" true-value="NORMAL" false-value="DISABLE" @on-change="change">
              <span slot="open">启用</span>
              <span slot="close">停用</span>
            </i-switch>
          </FormItem>
        </div>
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
              <FormItem :disabled="disService" label="人工费扣点值">
                <Input v-model="sysService.sysServiceProjectValue">
                  <span v-if="sysService.sysServiceProjectType==='PERCENT'" slot="append">%</span>
                  <span v-else slot="append">元</span>
                </Input>
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
                <Input :disabled="disService" v-model="sysService.sysMaterialProjectValue">
                  <span v-if="sysService.sysServiceProjectType==='PERCENT'" slot="append">%</span>
                  <span v-else slot="append">元</span>
                </Input>
              </FormItem>
            </template>

          </div>
        </div>
        <div class="info-block mb-15">
          <p class="info-title">
            <span>业务状态</span>
            <Button size="small" :type="disBusiness?'default':'success'" @click="toggleBusiness">{{disBusiness?'编辑':'保存'}}</Button>
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
          applyState:0,
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
        change(){

        },
        toggleService(){
          this.disService = !this.disService
          if(!this.disService){
            this.saveChange('sysService')
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
        // 编辑bussinessState
        toggleBusiness(){
            if(this.disBusiness){
              this.disBusiness = false
            }else{
              let params = `serviceUserId=${this.userId}&businessState=${this.businessState}`
              this.$http.post(`/yyht/v1/service/user/change/businessState?${params}`).then(res=>{
                if(res.data.code===0){
                  this.$Message.success('保存成功')
                }else{
                  this.$Message.info('保存失败')
                }
              })
            }
        },
        saveChange(changeKey){
          let params
          if(changeKey==='accountInfo'){
            params = this.accountInfo;
            params.serviceUserId = this.userId
          }
          if(changeKey==='sysService'){
            params = this.sysService
            this.sysService.serviceUserId = this.userId
          }
          console.log(params)
            this.$http.post(`/yyht/v1/service/user/applyServiceUser`,params).then(res=>{
              if(res.data.code===0){
                this.$Message.success('状态更新成功')
              }else{
                this.$Message.error('状态更新失败')
              }
            })
        },

      },
      mounted(){
          let id = this.$route.query.id;
          this.getDetail(id)
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
</style>
