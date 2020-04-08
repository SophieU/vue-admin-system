<template>
  <Card>
    <div class="card-head" style="" slot="title">{{title}}</div>
    <div slot="extra">
      <div class="btn-wrapper">
        <template  v-if="!viewInfo">
          <Button @click="pageInfo='list'">取消</Button>
          <Button :loading="loadingSave" @click="saveStation('portSet')" type="primary">确认</Button>
        </template>
        <!--查看-->
        <template v-else>
          <Button @click="viewInfo=false" type="primary">编辑</Button>
          <Button @click="pageInfo='list'">返回</Button>
        </template>
      </div>
    </div>
    <Spin fix v-show="loading == true">加载中...</Spin>
    <Form class="portForm" ref="portSet" :model="portSettingForm" :rules="portSettingRule" :label-width="120" label-position="right">
      <FormItem label="服务网点名称" prop="name">
        <Input placeholder="请输入服务网点名称" :disabled="viewInfo" v-model="portSettingForm.name" class="form-input"/>
      </FormItem>
      <FormItem label="服务网点地址" prop="address">
        <Input  placeholder="请输入服务网点地址" :disabled="viewInfo" v-model="portSettingForm.address"  class="form-input"/>
      </FormItem>
      <FormItem label="服务网点电话" prop="phone">
        <Input :disabled="viewInfo" placeholder="请输入手机或座机号" @on-keydown="validateInputTel"  v-model="portSettingForm.phone" class="form-input"/>
      </FormItem>
      <FormItem label="请选择是否自营" prop="isSelf">
        <RadioGroup v-model="portSettingForm.isSelf">
          <Radio label="Y" :disabled="viewInfo">是</Radio>
          <Radio label="N" :disabled="viewInfo">否</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="服务区域设置" prop="regionList">
        <Checkbox
          v-model="checkAllRegion"
          :disabled="viewInfo"
          @click.prevent.native="handleCheckAll('checkAllRegion','regionList')">全选</Checkbox>
        <CheckboxGroup class="area-box" v-model="portSettingForm.regionList" @on-change="judgeCheckAll('regionList')">
          <ul class="column_3">
            <li v-for="station in stationLists"><Checkbox :disabled="viewInfo||portSettingForm.isSlave" :label="station.id" >{{station.name}}</Checkbox></li>
          </ul>
        </CheckboxGroup>
      </FormItem>
      <FormItem class="must" label="服务类型选择" prop="categoryList">
        <Tree ref="repairTree" class="column_3" :data="repairTypes" show-checkbox></Tree>

      </FormItem>
      <FormItem label="管理员账号" prop="loginName">
        <Input placeholder="请输入管理员账号" :disabled="viewInfo" v-model="portSettingForm.loginName" class="form-input"/>
      </FormItem>
      <FormItem label="登陆密码" prop="password">
        <Input :disabled="viewInfo" type="password" placeholder="请设置6~10位密码"  v-model="portSettingForm.password" class="form-input"/>
      </FormItem>
      <FormItem label="服务商权限管控：" prop="state">
        <Select  :disabled="viewInfo" style="width:300px;" v-model="portSettingForm.state" placeholder="请选择服务商权限管控">
          <Option value="NORMAL">正常</Option>
          <Option value="DISABLE_ACCEPT_REPAIR_ORDER">禁止新接工单</Option>
          <Option value="DISABLE_SALE_DISCOUNT_SERVICE">禁止销售套餐</Option>
          <Option value="DISABLE_STATION">禁用该服务商</Option>
        </Select>
      </FormItem>
    </Form>
  </Card>
</template>

<script>
  import util from '../../../libs/util'
  import _ from 'lodash'
    export default {
      name: "port-info",
      props:['viewPortInfo','page','title','refresh','loading'],
      computed:{
        viewInfo:{
          get(){
            return this.viewPortInfo;
          },
          set(val){
            this.formatDataTree(this.repairTypes,{disableCheckbox:val},this.portSettingForm.categoryList)
            this.$emit('update:viewPortInfo',val);
          }
        },
        pageInfo:{
          get(){
            return this.page
          },
          set(val){
            this.checkAllCategory=false
              this.checkAllRegion=false //服务区域全选
            this.$emit('update:page',val)
          }
        }
      },
      data(){
        const validatePhone=function(rule,value,callback){
          if(value===''){
            callback(new Error('请输入联系电话'))
          }else{
            if(value!==''){
              let regTel=/^1[3456789]\d{9}/;
              let regTel2=/0\d{2,3}-\d{7,8}/;
              if(regTel.test(value)||regTel2.test(value)){
                callback();
              }else{
                callback(new Error('请输入正确格式的电话'))
              }
            }
          }
        };
        const validatePWDLen = function(rule,value,callback){
          if(value.length<6){
            callback(new Error('密码至少6位'));
          }else if(value.length>10){
            callback(new Error('密码最多10位'));
          }else{
            callback();
          }
        };
        const validateRequire = function(rule,value,callback){
          if(value.length<=0){
            callback(new Error('请选择服务类型'));
          }else{
            callback()
          }
        }
          return {
            checkAllCategory:false,
            checkAllRegion:false, //服务区域全选
            loadingSave:false,
            portSettingForm:{
              name:'',
              address:'',
              phone:'',
              isSlave:false,
              regionList:[],
              loginName:'',
              password:'',
              buttCode:'', //商户对接码
              categoryList:[], //报修类型
              state:'', //权限管控
              isSelf:'', //是否自营
            },
            stationLists:[], //可用的区域列表
            initialRepairTypes:[], //数据引用
            repairTypes:[], //可选报修分类列表
            portSettingRule:{ //表单验证
              name:[{ required: true, message: '请输入网点名称', trigger: 'blur' }],
              address:[{ required: true, message: '请输入网点地址', trigger: 'blur' }],
              phone:[
                { required: true, message: '请输入网点电话', trigger: 'blur' },
                { validator: validatePhone, trigger: 'blur' }],
              loginName:[{ required: true, message: '管理员账号', trigger: 'blur' }],
              password:[
                { required: true, message: '管理员密码', trigger: 'blur' },
                {validator:validatePWDLen, trigger: 'blur' },
              ],
              categoryList:[
                // { required: true, message: '请选择服务类型', trigger: 'blur' },
                {validator:validateRequire,message:'请选择服务类型',trigger:'blur'},
              ],
              state:[{ required: true, message: '请选择服务商权限', trigger: 'change' }],
              isSelf:[{ required: true, message: '请选择是否自营', trigger: 'change' }],
            }
          }
      },
      methods:{
        handleCheckAll(prop){
          this[prop]=!this[prop];
          if(this[prop]){
            this.portSettingForm.regionList = this.stationLists.map(item=>{
              return item.id
            });
          }else{
            this.portSettingForm.regionList= [];
          }


        },
        judgeCheckAll(propName){
          let compareArr = []
          let checkAllProp=''
          compareArr=this.stationLists
          checkAllProp='checkAllRegion'

          if(this.portSettingForm[propName].length<compareArr.length){
            this[checkAllProp]=false;
          }else{
            this[checkAllProp]=true;
          }
        },
          newStation(){
            this.portSettingForm={
              name:'',
              address:'',
              phone:'',
              isSlave:false,
              regionList:[],
              loginName:'',
              password:'',
              isSelf:'',
            };
            util.getTreeLists((data)=>{
              this.repairTypes = this.formatDataTree(data,{disableCheckbox:this.viewInfo},[])
            });
            this.getStation();
          },
        toggleSlave(val){
          if(val){
            this.portSettingForm.regionList=[];
          }
        },
        //验证电话输入，只能是数字或-
        validateInputTel(event){
          let key = event.key;
          let reg=/(\d|\-)/;
          if(!reg.test(key)&&key!=='Backspace'){
            event.preventDefault();
            return false;
          }
        },
        // 网点可用区域
        getStation(id){
          let params = id?`id=${id}`:'';
          this.$http.get(`/yyht/v1/repair/station/region/list?${params}`)
            .then(res=>{
              if(res.data.code===0){
                let data=res.data.data;
                this.stationLists=data;
              }
            })
        },
        //新增或修改网点-确认保存
        saveStation(name){
          this.loadingSave=true;
          let nodes =  this.$refs['repairTree'].getCheckedAndIndeterminateNodes()
          this.portSettingForm.categoryList =nodes.map(item=>{
            return item.id;
          });
          let formData= this.portSettingForm;
          let params={
            name:formData.name,
            address:formData.address,
            phone:formData.phone,
            // isSlave:formData.isSlave?'Y':'N',
            stationAdmin:{
              loginName:formData.loginName,
              password:formData.password
            },
            regionList:formData.regionList,
            categoryList:formData.categoryList,
            state:formData.state,
            isSelf:formData.isSelf,
          };


          let url = '/yyht/v1/repair/station/addOrUpdate';
          if(formData.id){
            //有id为修改
            params.id=formData.id;
            params.stationAdmin.id=formData.stationId;
            if(formData.password!=='000000'){ //未修改密码时的默认值
              params.stationAdmin.password=formData.password;
            }
          }else{
            params.stationAdmin.password=formData.password;
          }

          if(formData.buttCode){
            params.buttCode = formData.buttCode;
          }
          this.$refs[name].validate(valid=>{
            if(valid){
              this.$http.post(url,{
                ...params
              }).then(res=>{
                this.loadingSave=false;
                if(res.data.code===0){
                  this.$Message.success('保存成功');
                  this.pageInfo='list';
                  this.newStation();
                }else{
                  this.$Message.error(`保存失败,${res.data.msg}`)
                }

              })
            }else{
              this.loadingSave=false;
            }
          })

        },
        //查询网点信息
        getStationInfo(id){
          // /repair/station/info?id=1
          this.$http.get(`/yyht/v1/repair/station/info?repairStationId=${id}`)
            .then(res=>{
              if(res.data.code===0){
                let data = res.data.data;
                this.portSettingForm={
                  name:data.name,
                  address:data.address,
                  phone:data.phone,
                  isSlave:data.isSlave==='Y'?true:false,
                  regionList:data.regionList,
                  loginName:data.stationAdmin?data.stationAdmin.loginName:'',
                  password:data.stationAdmin?'000000':'',
                  stationId:data.stationAdmin?data.stationAdmin.id:'',
                  id:data.id,
                  state:data.state,
                  categoryList:data.categoryList,
                  isSelf:data.isSelf,
                };
                // 树形结构
                this.repairTypes  = this.formatDataTree(this.repairTypes,{disableCheckbox:this.viewInfo},data.categoryList);
                this.judgeCheckAll('regionList');
                this.$emit('update:loading',false);
              }
            })
        },
        init(){
          this.$refs['portSet'].resetFields();
        },
        /*
        * @params {object} data 原始数据
        * @params {object} options 配置属性
        * */
        formatDataTree(data,options,checkedList){
          let res = _.cloneDeep(data);
          res = res.map(item=>{
            item.title = item.name;
            item.expand=false;
            // 属性
            if(options&&options.toString().length>0){
              for(let key in options){
                item[key] = options[key]
              }
            }

            // 选中-默认情况下只判断二级
            if(checkedList&&checkedList.length>0){
              //
              if(item.parentId.length>0&&checkedList.indexOf(item.id)>-1){
                item.checked=true;
              }else{
                item.checked=false;
              }
            }
            if(item.children&&item.children.length>0){
              item.children = this.formatDataTree(item.children,options,checkedList)
            }
            return item;

          })
          return res;
        },
      },
      mounted(){
        util.getTreeLists((data)=>{
          this.repairTypes = this.formatDataTree(data,{disableCheckbox:this.viewInfo},[]);
          // 用于缓存初始数据
          this.initialRepairTypes = this.formatDataTree(data,{disableCheckbox:this.viewInfo},[]);
        })
        this.getStation();
      },
      watch:{
        page(val){
          if(val==='list'){
            this.repairTypes = _.cloneDeep(this.initialRepairTypes)
          }
        },
        viewInfo(val){
          this.repairTypes = this.formatDataTree(this.repairTypes,{disableCheckbox:val},[]);
        }
      }
    }
</script>

<style scoped lang="scss">
  @import '../service.scss';
  .portForm{
    width: 800px;
  }
  .card-head{
    line-height: 2em;
    font-weight: bold;
    font-size: 16px;
  }
  .ivu-tree{
    /deep/ ul li{
      margin: 0;
      line-height: 20px;
      min-width:200px;
    }
  }

  .must{
    /deep/ .ivu-form-item-label:before{
      content: '*';
      display: inline-block;
      margin-right: 4px;
      line-height: 1;
      font-family: SimSun;
      font-size: 12px;
      color: #ed4014;

    }
  }
</style>
