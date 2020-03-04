<style scoped lang="scss">
  @import './home-components.scss';
</style>
<template>
  <div>
    <Modal
      :mask-closable="false"
      v-model="activeModal"
      title="新建工单"
    >
      <div class="new_order_wrapper">
        <i-form ref="newOrder" :model="newOrder" :rules="newOrderRule" label-position="top">
          <form-item label="一生约绑定手机（非必填）" prop="ysyUserPhone">
            <Select
              v-model="newOrder.ysyUserPhone"
              filterable
              remote
              :remote-method="searchTel"
              :loading="loadingSearch"
              @on-query-change="setTel"
            >
              <Option v-for="(tel, index) in searchTelRes" :value="tel" :key="index">{{tel}}</Option>
            </Select>
            <span v-if="!ysyUserPhoneValid" class="text-red">请填写正确的手机号</span>
          </form-item>
          <form-item label="联系人姓名"  prop="username">
            <Input :maxlength="10" v-model="newOrder.username"></Input>
          </form-item>
          <form-item label="联系电话"  prop="userPhone">
            <Input v-model="newOrder.userPhone"></Input>
          </form-item>

          <form-item label="报修小区" prop="estate">
            <!--<Input v-model="newOrder.estate"/>-->
            <!--<Select v-model="newOrder.repairRegionId" :label-in-value="true" @on-change="setEstate">-->
              <!--<Option v-for="(region,index) in regionList" :value="region.id" :key="index">{{region.name}}</Option>-->
            <!--</Select>-->
            <!--remote-->
            <!--:remote-method="getRegionLists"-->
            <Select
              v-model="newOrder.estate"
              filterable
              :loading="loadingSearch"
              @on-change="setEstate"
            >
              <Option v-for="(region, index) in filterRegionLists" :value="region.name" :key="index">{{region.name}}</Option>
            </Select>
            <span v-if="!ysyUserPhoneValid" class="text-red">请设置报修小区</span>
          </form-item>
          <form-item label="详细地址">
            <Row :gutter="10">
              <Col span="5">
                <form-item prop="unit">
                  <InputNumber  @on-change="userType=null" v-model="newOrder.unit" :precision="0"/>
                </form-item>
              </Col>
              <Col span="3">楼栋</Col>
              <Col span="5">
                <form-item prop="door">
                  <InputNumber @on-change="userType=null" v-model="newOrder.door" :precision="0"/>
                </form-item>
              </Col>
              <Col span="3">门牌号</Col>
              <Col span="8"><Button  @click="searchUser" size="small" type="primary">查询客户身份</Button></Col>
            </Row>
           <!-- <Input v-model="newOrder.repairAddress"></Input>-->
          </form-item>
          <form-item class="must" label="服务类型">
            <Select v-model="serviceType"  @on-change="(id)=>repairFirstChange(id)">
              <Option v-for="item in repairFirst" :key="item.id" :value="item.id">{{item.name}}</Option>
            </Select>
          </form-item>
          <form-item :label="'服务项目'+(userType===null?'':'（'+userType+'）')"  prop="repairCategoryId">
            <Row :gutter="15">
              <Col span="14">
                <Select placeholder="请先查询客户身份" :disabled="userType===null" v-model="newOrder.repairCategoryId" @on-change="repairChange">
                  <Option v-for="item in repairLists" :key="item.id" :value="item.id+'+'+item.dtdServiceFee">
                    {{item.name}}{{item.dtdFee?'(上门费：￥'+item.dtdFee+')':''}} {{item.discount?`-${item.discount}`:''}}
                  </Option>
                </Select>
              </Col>
              <Col span="8" v-if="needAccept">
                <Checkbox :disabled="userType===null" v-model="acceptFee">接受上门费</Checkbox>
              </Col>
            </Row>
          </form-item>

        </i-form>
      </div>
      <div slot="footer">
        <Button @click="activeModal=false">取消</Button>
        <Button :loading="loadingSubmit" @click="sureSend" type="primary">{{userType==='svip'?'发送至服务网点':'确认'}}</Button>
      </div>
    </Modal>
  </div>

</template>

<script>
  import util from '../../../libs/util';
    export default {
        name: "createOrder",
      data(){
          const validateTel=function(rule,val,callback){
            let telReg = /^1[3456789]\d{9}$/;
            if(telReg.test(val)||val.length<=0){
              callback();
            }else{
              callback(new Error('请输入正确格式的手机号码'))
            }
          };
          return{
            serviceType:'', //服务分类一级-id-用于二级服务项目选择
            repairFirst:[], // 服务分类一级列表
            filterRegionLists:[], //模糊搜索结果
            userType:null,
            userDiscount:[],
            needAccept:false,
            loadingSubmit:false,
            loadingSearch:false,
            acceptFee:false, //接受上门费
            filterRegionListsTemp:[], //报修分类全数据缓存
            searchTelRes:[],
            newOrder: {
              repairRegionId: '', //参数为id,需决定是否收费
              repairCategoryId: '',
              userPhone: '',
              ysyUserPhone: '',
              repairAddress: '',
              username:'',
              door:null,
              unit:null,
              estate:'',
            },
            newOrderRule:{
              // repairAddress:[{required:true,message:'请输入报修地址',trigger:'blur'}],
              unit:[{required:true,message:'请输入楼栋号',trigger:'change',type:'number'}],
              door:[{required:true,message:'请输入门牌号',trigger:'change',type:'number'}],
              repairCategoryId:[{required:true,message:'请选择报修分类',trigger:'change'}],
              estate:[{required:true,message:'请选择报修区域',trigger:'change'}],
              username:[{required:true,message:'请输入联系人姓名',trigger:'blur'}],
              userPhone:[
                {required:true,message:'请输入联系电话',trigger:'blur'},
                {validator:validateTel,trigger:'blur'},
                ],
            },
            ysyTelSearch:false, //ysyTel搜索状态标识
            repairDisSearch:false, //服务区域搜索状态标识
            repairLists:[],
            regionList:[],
            ysyUserPhoneValid:true,
          }
      },
      props:{
        createOrder:Boolean
      },
      computed:{
          activeModal:{
            get:function(){
              return this.createOrder;
            },
            set:function(newValue){
              this.filterRegionLists=this.filterRegionListsTemp;
              this.needAccept=false;
              this.newOrder.door=null; //门号
              this.newOrder.unit=null; //楼栋号
              this.userType=null;
              this.$emit('close','createModal');
              this.$refs['newOrder'].resetFields();
            }
          }
      },
      methods:{
        repairFirstChange(id){

          util.getRepairTypeNext(id,data=>{
            this.repairLists = data;
            this.newOrder.repairCategoryId='';
          })
        },
          //拼接地址
        setEstate(val){
          if(!val) return;
          let valId = '';
          this.filterRegionLists.map(item=>{
            if(item.name===val){
              valId=item.id
            }
          });
          this.newOrder.repairRegionId=valId;
        },
        repairChange(val){

          if(!val) return;
          let repair = val.split('+');
          let repairId = repair[0];
          let res = this.repairLists.some(item=>{
            if(item.id===repairId&&item.discount==='免上门费') return true;
          })
          if(repair[1]>0&&!res){
            this.needAccept=true;
          }else{
            this.needAccept=false;
          }
        },
        setTel(query){
          if(query.length<=0){
            this.ysyUserPhoneValid=true;
            this.newOrder.ysyUserPhone='';
            return;
          }
          let telReg = /^1[3456789]\d{9}$/;
          if(telReg.test(query)){
            this.ysyUserPhoneValid=true;
            this.newOrder.ysyUserPhone=query;
          }else{
            this.ysyUserPhoneValid=false;
          }

        },
          //点击搜索
        searchThis(model){
          this[model+'Search']=true;
          //ajax查询
        },
        //选中搜索值
        sureSearch(prop,val){
          this.newOrder[prop] = val;
          this[prop+'Search']=false;
        },
        // 本地搜索
        localFilterRegion(query){
          //报修分类置空
          this.userType=null;
          let regionList=this.regionList;
          let filterRes = regionList.filter(item=>{
            if(item.name.indexOf(query)>-1){
              return true;
            }else{
              return false;
            }
          });
          this.filterRegionLists=filterRes;

        },
        getRegionLists(){
          //请求报修区域
          this.$http.get(`/repair/region/list`)
            .then(res=>{
              if(res.data.code===0){
                this.regionList=res.data.data;
                this.filterRegionLists=this.filterRegionListsTemp=this.regionList;
              }else{
               console.log('新建工单获取报修区域：'+res.data.msg);
              }
            })
        },
        sureSend(){
            this.loadingSubmit=true;
            this.$refs['newOrder'].validate(valid=>{
              if(valid){
                let order = {...this.newOrder};
                //详细地址
                order.repairAddress=`${order.estate}-${order.unit}-${order.door}`;
                delete order.unit;
                delete order.door;
                delete order.estate;

                let repairType = this.newOrder.repairCategoryId.split('+');
                order.repairCategoryId=repairType[0];
                // let needFee=parseFloat(repairType[1]);
                if(this.needAccept&&!this.acceptFee){
                  this.$Message.info('请先勾选接受上门费，再继续');
                  this.loadingSubmit=false;
                  return false;
                }
               this.$http.post(`/repair/order/add`,{
                 ...order
               }).then(res=>{
                 if(res.data.code===0){
                   this.$Message.success('保存成功');
                   this.activeModal=false;
                   this.newOrder={
                     repairRegionId: '',
                     repairCategoryId: '',
                     userPhone: '',
                     ysyUserPhone: '',
                     repairAddress: '',
                     username:'',
                     door:null,
                     unit:null,
                     estate:null,
                   };
                   this.needAccept=false;
                 }else{
                   this.$Message.error('保存失败：'+res.data.msg);
                   this.activeModal=false;
                 }

                 this.loadingSubmit=false;
               })
              }else{
                this.loadingSubmit=false;
              }
            })
        },
        searchTel(query){
          if (query !== '') {
            this.loadingSearch = true;
            this.$http.get(`/repair/order/user/list?phone=${query}`)
              .then(res=>{
                this.loadingSearch=false;
                if(res.data.code===0){
                  this.searchTelRes=res.data.data;
                }
              })
          } else {
            this.searchTelRes = [];
          }
        },
        //查询用户优惠
        searchUser(){
          let estate = this.newOrder.estate;
          let unit = this.newOrder.unit;
          let door = this.newOrder.door;
          if(!estate){
            this.$Message.info('请选择报修区域');
            return;
          }else if(!unit||!door){
            this.$Message.info('请输入楼栋以及门牌号');
            return;
          }
          console.log(this.serviceType)
          if(this.serviceType.length<=0){
            this.$Message.info('请选择服务分类');
            return false;
          }
          util.getRepairTypeNext(this.serviceType,data=>{
            this.repairLists = data
            this.newOrder.repairCategoryId='';
          })
          // util.getRepairType(data=>{
          //   this.repairLists=data;
          //   // this.repairLists=[];
          //   this.newOrder.repairCategoryId='';
          // });
          this.$http.get(`/repair/order/discount/dtd/categories?address=${estate}-${unit}-${door}`)
            .then(res=>{
              if(res.data.code===0){
                let data=res.data.data;
                this.userDiscount=data;
                if(data.length>0){
                  this.userType='SVIP用户';
                }else{
                  this.userType='普通用户'
                }
                //拼接减免用户的上门费
                let repairLists=this.repairLists;
                data.forEach(item=>{
                  let id= item.id;
                  let discountText;
                  if(item.rate===0){
                    discountText='免上门费';
                  }else if(item.rate>0){
                    discountText=`折扣：${item.rate}`
                  }else{
                    discountText='';
                  }
                  repairLists.forEach(repair=>{
                    if(repair.id===id){
                      repair.discount=discountText;
                    }
                  })
                });
                this.repairLists=repairLists;
              }
            })
        },

      },
      mounted(){
          this.getRegionLists();
          util.getRepairTypeDropdown(data=>{
            this.repairFirst = data;
          })
          // util.getRepairType(data=>{
          //   this.repairLists=data;
          // });
      },
    }
</script>

