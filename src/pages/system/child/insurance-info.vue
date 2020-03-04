<template>
  <div>
    <Card>
      <div class="clearfix mb-15">
        <div class="pull-left">
          <h4>{{this.pageType==='view'?'查看':'新建'}}保险服务</h4>
        </div>
        <div class="pull-right">
          <Button @click="$router.back()">返回</Button>
          <Button v-if="this.pageType==='new'" @click="saveThis" type="primary">保存</Button>
        </div>
      </div>
      <Row :gutter="40">
        <Col class="insurance-box" span="12">
          <h5 class="mb-15">保险基础信息</h5>
          <Form ref="form" label-width="80" :model="insuranceForm" :rules="formRule">
            <FormItem label="保险名称" prop="name">
              <Input v-model="insuranceForm.name" :disabled="this.pageType==='view'" maxlength="16"></Input>
            </FormItem>
            <FormItem label="保险备注" prop="remark">
              <Input v-model="insuranceForm.remark" :disabled="this.pageType==='view'" maxlength="16"></Input>
            </FormItem>
            <FormItem label="有效期" prop="validMonth">
              <InputNumber v-model="insuranceForm.validMonth" style="width:80%;max-width:280px;" :precision="0" :min="1"   :disabled="this.pageType==='view'?'disabled':false" />
              <span>月</span>
            </FormItem>
            <FormItem label="保险价格" prop="price">
              <InputNumber :precision="2" v-model="insuranceForm.price" style="width:80%;max-width:280px;"    :disabled="this.pageType==='view'?'disabled':false"/>
              <span>元</span>
            </FormItem>
            <FormItem label="保险售价" prop="salePrice">
              <InputNumber  style="width:80%;max-width:280px;" disabled="disabled" v-model="insuranceForm.salePrice" />
              <span >元</span>
            </FormItem>
          </Form>
        </Col>
        <Col v-if="this.pageType==='view'"  class="insurance-box" span="12">
          <h5 class="mb-15">保险售卖详情</h5>
          <Form class="info-form" label-width="80">
            <FormItem label="套餐状态">
              <span class="info">{{saleDetail.saleState==='1'?'在售':'停售'}}</span>
              <Button @click="toggleState" size="small">{{saleDetail.saleState==='1'?'下架':'上架'}}</Button>
            </FormItem>
            <FormItem label="售卖数">
              <span>{{saleDetail.saleNum}}</span>
              <Button size="small" @click="$router.push({name:'meal-order',query:{serviceId:id}})">查看订单</Button>
            </FormItem>
            <FormItem label="创建时间">
              <span>{{saleDetail.createTime}}</span>
            </FormItem>
            <FormItem label="创建人">
              <span>{{saleDetail.creator}}</span>
            </FormItem>
          </Form>
        </Col>
      </Row>
    </Card>
  </div>
</template>

<script>
    import MoneyInput from "../../main-components/input-money";
    export default {
        name: "insurance-info",
      components: {MoneyInput},
      data(){
          let strValidator=function(rule, value, callback){
            if(value===''){
              callback(new Error('请填写保险名称'));
            }else{
              let reg=/^[A-Za-z0-9\u4e00-\u9fa5]+$/;
              if(!reg.test(value)){
                callback(new Error('名称不允许输入符号等字符'));
              }else{
                callback();
              }
            }
          };
         return {
           pageType:'new', //new:新建，view:查看
           insuranceForm:{
              name:'',
             salePrice:0,
             price:null,
             remark:'',
             validMonth:null,
           },
           saleDetail:{},
           formRule:{
             name: [{ required: true, message: '请填写保险名称', trigger: 'blur' },
               {validator:strValidator,trigger:'blur'}
             ],
             validMonth:[{required:true,message:'请填写有效期,且最低1个月',trigger:'blur',type:'number',min:1}],
             price:[{required:true,message:'请填写价格',trigger:'blur',type:'number'}]
           }
         }
      },
      created(){
        this.pageType=this.$route.query.type;
        let id = this.$route.query.id;
        if(id){
          this.getInfo(id);
          this.id=id;
        }
      },
      methods:{
          getInfo(id){
            this.$http.get(`/insurance/info/${id}`)
              .then(res=>{
                if(res.data.code===0){
                  let data = res.data.data;
                  this.insuranceForm={
                    "name": data.name,
                    "price": 150,
                    "salePrice": data.salePrice,
                    "remark": data.remark,
                    "validMonth": data.validMonth,
                  };
                  this.saleDetail={
                    "saleState": data.saleState,
                    "saleNum": data.saleNum,
                    "createTime": data.createTime,
                    "creator": data.creator
                  }
                }
              }).catch(err=>{
                this.$Message.error('信息获取失败，请稍候再试')
            })
          },
        toggleState(){
          let id = this.id;
          let saleState = this.saleDetail.saleState==='1'?'0':'1';
          let params=`id=${id}&state=${saleState}`;
          this.$http.get(`/insurance/change/saleState?${params}`)
            .then(res=>{
              if(res.data.code===0){
                this.$Message.success('操作成功');
                this.getInfo(id);
              }
            }).catch(err=>{
              this.$Message.error('操作失败')
          })
        },
        saveThis(){
            let insuranceForm = this.insuranceForm;
          // insuranceForm.image='xxx'
          this.$refs['form'].validate((valid) => {
            if (valid) {
              this.$http.post('/insurance/save',{...insuranceForm})
                .then(res=>{
                  if(res.data.code===0){
                    this.$Message.success('保存成功');
                    this.$router.back();
                  }else{
                    this.$Message.error(res.data.msg);
                  }
                }).catch(err=>{
                this.$Message.error('保存失败，请稍候再试');
              })
            }
          });
        }
      }
    }
</script>

<style scoped lang="scss">
.insurance-box{
  .ivu-input-type{
    max-width:300px;
  }
  .info-form{
    span{
      margin:0 15px;
    }
  }
}
</style>
