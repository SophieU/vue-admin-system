<template>
  <div>
    <Card>
      <div class="clearfix">
        <div class="pull-left"><h3>{{pageType==='view'?'查看套餐服务':'新增套餐服务'}}</h3></div>
        <div class="pull-right">
          <Button @click="$router.back()">返回</Button>
          <Button :disabled="!mealForm.serviceType" v-if="pageType==='new'" @click="saveThis" type="primary">保存</Button>
        </div>
      </div>
      <Form  ref="mealForm" :rules="formRule" class="mealForm" :model="mealForm" :label-width="80">
        <div>
          <h4>套餐类型</h4>
          <FormItem label="套餐类型" prop="serviceType">
            <Select :disabled="pageType==='view'" placeholder="请选择套餐类型"  v-model="mealForm.serviceType" style="width: 300px;" @on-change="changeMealType">
              <Option value="NORMAL">固定金额</Option>
              <Option value="PRICE_CUSTOM">可变动金额</Option>
            </Select>
            <div v-show="!mealForm.serviceType&&pageType!=='view'" class="tips" style="color: #f00;">* 请先选择套餐类型，再进入下一步操作</div>
          </FormItem>

        </div>
        <Row :gutter="40" v-show="mealForm.serviceType">
          <Col span="12" class="form-block">
            <!--套餐基础信息-->
            <div>
              <h4>套餐基础信息</h4>
              <div class="formItem-wrapper" style="max-width:500px">
                <FormItem label="套餐名称" prop="name">
                  <Input placeholder="请输入套餐名称，最多16个字" :maxlength="16" :disabled="pageType==='view'" v-model="mealForm.name"/>
                </FormItem>
                <FormItem label="套餐价格" prop="price">
                  <InputNumber placeholder="请输入套餐价格" v-model="mealForm.price" :disabled="pageType==='view'" :precision="2"  style="width:100%;max-width:200px;" />
                  <span>元</span>
                </FormItem>
                <FormItem label="套餐售价" prop="salePrice">
                  <InputNumber placeholder="请输入套餐售价"  v-model="mealForm.salePrice" :disabled="pageType==='view'" :precision="2"  style="width:100%;max-width:200px;" />
                  <span>元</span>
                </FormItem>

                <template v-if="mealForm.serviceType==='PRICE_CUSTOM'">
                  <FormItem label="最低售价" prop="minSalePrice">
                    <InputNumber placeholder="请输入最低售价"  v-model="mealForm.minSalePrice" :disabled="pageType==='view'" :precision="2"  style="width:100%;max-width:200px;" />
                    <span>元</span>
                    <div class="tips">（最低成交价必须大于0，且小于售价）</div>
                  </FormItem>
                </template>
                <FormItem label="套餐简介" prop="shortDescribe">
                  <Input  placeholder="请输入套餐简介，最多16个字"  v-model="mealForm.shortDescribe" :disabled="pageType==='view'" :maxlength="16"/>
                </FormItem>
                <FormItem label="套餐备注"  prop="remark">
                  <Input placeholder="请输入套餐备注，最多16个字" v-model="mealForm.remark"  :disabled="pageType==='view'" :maxlength="16"/>
                </FormItem>
                <FormItem label="有效期" prop="validMonth">
                  <InputNumber placeholder="请输入大于0的正整数" v-model="mealForm.validMonth" :precision="0" :min="1" :disabled="pageType==='view'||mealForm.isSingleUse==='Y'" style="width:100%;max-width:200px;" />
                  <span>月</span>
                  <!-- <Checkbox :disabled="pageType==='view'" class="ml-15" true-value="Y" false-value="N" v-model="mealForm.isSingleUse">是否一次性</Checkbox> -->
                </FormItem>
                <FormItem  label="销售提成"  prop="saleCommission">
                  <InputNumber v-if="mealForm.serviceType==='NORMAL'" placeholder="请输入销售提成" v-model="mealForm.saleCommission" :precision="2" :min="0" :disabled="pageType==='view'" style="width:100%;max-width:200px;" >
                  </InputNumber>
                  <InputNumber v-else :max="100" placeholder="请输入销售提成" v-model="mealForm.saleCommission" :precision="2" :min="0" :disabled="pageType==='view'" style="width:100%;max-width:200px;" >
                  </InputNumber>
                  <span>{{mealForm.serviceType==='PRICE_CUSTOM'?'%':'元'}}</span>
                  <div v-show="mealForm.serviceType==='PRICE_CUSTOM'" class="tips">（可变动金额套餐按百分比例提成）</div>
                </FormItem>
              </div>
            </div>
            <!--套餐详细信息-->
            <div>
              <h4>套餐详细信息</h4>
              <div class="formItem-warpper">
                <Form :model="detailForm" :rules="detailRule" ref="detailForm" :label-width="30">
                  <table class="check-table">
                    <tr>
                      <td style="width:120px">用户自主下单</td>
                      <td>
                        <FormItem style="margin-bottom:0;">
                          <Select :disabled="pageType==='view'||mealForm.serviceType==='PRICE_CUSTOM'" v-model="mealForm.isUserCanBuy" style="width: 160px;">
                            <Option value="Y">是</Option>
                            <Option  value="N">否</Option>
                          </Select>
                          <span class="tips" v-show="mealForm.serviceType==='PRICE_CUSTOM'">（可变动金额套餐用户无法自主下单）</span>
                        </FormItem>
                      </td>
                    </tr>
                    <tr>
                      <td>优惠项目</td>
                      <td>
                        <FormItem style="margin-bottom:0;">
                          <CheckboxGroup v-model="detailForm.discountType">
                            <Checkbox  :disabled="pageType==='view'"  label="DTDS">上门费</Checkbox>
                            <Checkbox  :disabled="pageType==='view'"  label="SERVICE">服务费</Checkbox>
                            <Checkbox  :disabled="pageType==='view'"  label="MATERIAL">辅材费</Checkbox>
                          </CheckboxGroup>
                        </FormItem>
                      </td>
                    </tr>
                    <tr>
                      <td>包含服务类型</td>
                      <td>
                        <FormItem  class="over-height" prop="discountLimitTemp">
                          <Tree ref="repairTree" class="column_3" :data="repairTypes" show-checkbox></Tree>
                          <!--<CheckboxGroup v-model="detailForm.discountLimitTemp">-->
                            <!--<Checkbox :key="item.id" v-for="item in repairType"  :disabled="pageType==='view'" :label="item.id">{{item.name}}</Checkbox>-->
                          <!--</CheckboxGroup>-->
                        </FormItem>
                      </td>
                    </tr>
                    <tr>
                      <td>优惠额度</td>
                      <td>
                        <FormItem style="margin-bottom:0;">
                          <Radio :value="detailForm.discountRate===0" disabled="disabled" label="0">全额减免</Radio>
                        </FormItem>
                      </td>
                    </tr>
                  </table>
                </Form>

              </div>
            </div>

          </Col>
          <Col span="12" class="form-block">
            <div>
              <h4>卡片背景</h4>
              <div class="card-bg mb-15">
                <template v-if="cardImg">
                   <img :src="cardImg" alt="">
                </template>
                <template v-else>
                  <span class="tips">暂无图片</span>
                </template>
              </div>
              <div class="tips mt-15 mb-15">(建议尺寸：1035 x 375)</div>
              <div>

                  <Upload
                    ref="upload"
                    :with-credentials="true"
                    :show-upload-list="false"
                    :on-success="uploadCardSuccess"
                    :format="['jpg','jpeg','png']"
                    :on-format-error="(file)=>{$Message.info('上传格式有误，请重新上传')}"
                    :action="$http.defaults.baseURL+'base/qiniu/upload/image'"
                    >
                    <Button :disabled="pageType==='view'" icon="md-cloud-upload">上传图片</Button>
                </Upload>

              </div>

            </div>

            <div style="padding-top:30px;">
                <h4 class="mt-15" >套餐详情</h4>
                <div class="editor-wrapper">
                  <div class="btn-group" v-if="pageType==='view'">
                    <Button @click="editEditor('mealDetail')">编辑</Button>
                    <Button @click="editSimple('mealDetail')" type="primary">保存</Button>
                  </div>
                  <div class="editor-mask"  v-if="pageType==='view'&&editorEditing.indexOf('mealDetail')===-1"></div>
                  <div id="mealDetail"></div>
                </div>

            </div>

            <div style="padding-top:30px;">
                <h4>服务协议</h4>
                <div class="editor-wrapper">
                  <div class="btn-group" v-if="pageType==='view'">
                    <Button @click="editEditor('serviceArg')">编辑</Button>
                    <Button @click="editSimple('serviceArg')" type="primary">保存</Button>
                  </div>
                  <div class="editor-mask"  v-if="pageType==='view'&&editorEditing.indexOf('serviceArg')===-1"></div>
                  <div id="serviceArg"></div>
                </div>

            </div>

          </Col>
        </Row>
      </Form>
      <Row>
          <Col span="12" class="form-block"  v-if="pageType==='view'">
            <h4>套餐售卖详情</h4>
            <div class="formItem-wrapper sale-detail" >
              <Form :model="mealSale" :label-width="100">
                <FormItem label="套餐状态">
                  <span class="mr-15">{{mealSale.saleState}}</span>
                  <Button @click="toggleState" type="primary" size="small">{{mealSale.saleState==='在售'?'下架':'上架'}}</Button>
                </FormItem>
                <FormItem label="售卖数">
                  <span class="mr-15">{{mealSale.saleNum}}</span>
                  <Button @click="$router.push({name:'meal-order',query:{serviceId:id}})" type="primary" size="small">查看订单</Button>
                </FormItem>
                <FormItem label="优惠金额">
                  <span class="mr-15">{{mealSale.discountAmount}}</span>
                  <Button @click="$router.push({name:'order_filter',query:{from:'meal',serviceId:id}})" type="primary" size="small">查看工单</Button>
                </FormItem>

                <FormItem label="创建时间">
                  <span>{{mealSale.createTime}}</span>
                </FormItem>
                <FormItem label="创建人"><span>{{mealSale.creator}}</span></FormItem>
              </Form>
            </div>
          </Col>
        </Row>

    </Card>
  </div>
</template>

<script>
    import util from '../../../libs/util'
    import E from 'wangeditor';
    import carousel from '@/pages/main-components/carousel/carousel'
    export default {
        name: "meal-info",
      components:{
        carousel
      },
      data(){
          const minPriceValidator = (rule, value,callback )=>{
            let salePrice = this.mealForm.salePrice;
            if(value<salePrice){
              callback();
            }else{
              callback(new Error('最低售价应小于售价'));
            }

          }
        return{
          repairTypes:[], //可选报修分类列表
          pageType:'view', // view-查看,new-新建
          id:null,
          cardNow:null, //当前卡片
          fullDescribe:'', //详细描述
          protocol:'', //服务协议
          // serviceType:'',
          mealForm:{
            serviceType:'', //套餐类型-PRICE_CUSTOM(可变动)，NORMAL（固定）
            minSalePrice:null, //最低套餐售价
            name:null,
            price:null,
            salePrice:null,
            shortDescribe:null,
            remark:'',
            validMonth:null,
            saleCommission:null,
            discountAmount:null,
            items:[],
            isUserCanBuy:'Y', //是否可选
            isSingleUse:'N', //是否一次性
          },
          detailForm:{
            discountType:['DTDS'],
            discountLimit:[],
            discountRate:0,
            discountLimitTemp:[], //缓
          },
          mealSale:{},
          formRule:{
            name:[{required:true,message:'请输入套餐名称',trigger:'blur'}],
            price:[{required:true,message:'请输入套餐价格,且不小于0',trigger:'blur',type:'number',min:0.01}],
            salePrice:[{required:true,message:'请输入套餐售价,且不小于0',trigger:'blur',type:'number',min:0.01}],
            minSalePrice:[
              {required:true,message:'请输入套餐售价,大于0且小于售价',trigger:'blur',type:'number',min:0.01},
              {validator:minPriceValidator,trigger:'blur'}
              ],
            shortDescribe:[{required:true,message:'请输入套餐简介',trigger:'blur'}],
            validMonth:[{required:true,type:'number',message:'请填写有效期,且最低1个月',trigger:'blur',min:1}],
          },
          detailRule:{
            // discountLimitTemp: [
            //   { required: true, type: 'array', min: 1, message: '请至少选择一项服务类型', trigger: 'change' }
            // ],
          },
          repairType:[],
          repairTypesPrimitive:[], //未处理的树结构列表
          cardLists:[],
          cardImg:'', //套餐图片
          cardImgKey:'', //套餐图片key
          editor1:{},
          editor2:{},
          editorEditing:[],
        }
      },
      created(){
         this.pageType=this.$route.query.type;

        util.getTreeLists((data)=>{
          this.repairTypesPrimitive = data;
          if(this.pageType==='new'){
            this.repairTypes = this.formatDataTree(data,{disableCheckbox:this.pageType==='view'})
          }else{
            this.id=this.$route.query.id;
            this.getInfo()
          }
        })

        //获取图片列表
        this.getCardLists();
      },
      mounted(){
        //富文本
        let config=[
          'head',  // 标题
          'bold',  // 粗体
          'fontSize',  // 字号
          'fontName',  // 字体
          'italic',  // 斜体
          'underline',  // 下划线
          'strikeThrough',  // 删除线
          'foreColor',  // 文字颜色
          'backColor',  // 背景颜色
          'image', //插入图片
          'link',  // 插入链接
          'list',  // 列表
          'justify',  // 对齐方式
          'undo',  // 撤销
          'redo'  // 重复
        ]
        this.editor1 = new E('#mealDetail');
        let editor1 = this.editor1;
        editor1.customConfig.menus =config;
        editor1.customConfig.uploadImgServer = this.$http.defaults.baseURL+'base/qiniu/upload/image'
        editor1.customConfig.withCredentials=true;
        editor1.customConfig.uploadFileName = 'file'
        editor1.customConfig.customAlert = (info)=> {
          // info 是需要提示的内容
          this.$Message.info(info)
        }
        editor1.customConfig.uploadImgHooks={
          customInsert: function (insertImg, result, editor) {
            console.log(result)
            if(result.code===0){
              var url = result.data.imageUrl;
              insertImg(url)
            }
          }
        }
        editor1.create();

        this.editor2 = new E('#serviceArg');
        let editor2 = this.editor2;
        editor2.customConfig.menus =config;
        editor2.customConfig.uploadImgServer = this.$http.defaults.baseURL+'base/qiniu/upload/image'
        editor2.customConfig.withCredentials=true;
        editor2.customConfig.uploadFileName = 'file'
        editor2.customConfig.customAlert = (info)=> {
          // info 是需要提示的内容
         this.$Message.info(info)
        }
        editor2.customConfig.uploadImgHooks={
          customInsert: function (insertImg, result, editor) {
            console.log(result)
            if(result.code===0){
              var url = result.data.imageUrl;
              insertImg(url)
            }
          }
        }
        editor2.create();



      },
      methods:{
          // 格式化树结构
        /*
        * @params {object} data 原始数据
        * @params {object} options 配置属性
        * @params {array}  checkedList  已选中数据
        * */
        formatDataTree(data,options,checkedList){
          if(this.pageType==='new'){
            checkedList = []
          }
          data.map(item=>{
            item.title = item.name;
            // item.expand=false;
            // 属性
            if(options&&options.toString().length>0){
              for(let key in options){
                item[key] = options[key]
              }
            }
            // 选中
            if(checkedList&&checkedList.length>0){
              let target = JSON.stringify(checkedList)
              if(target.indexOf(item.id)>-1){
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
          return data;
        },
          //变更套餐类型
        changeMealType(){
          let tempType=this.mealForm.serviceType;
          this.mealForm={
            serviceType:tempType, //套餐类型
            name:null,
            price:null,
            salePrice:null,
            shortDescribe:null,
            remark:'',
            minSalePrice:null,
            validMonth:null,
            saleCommission:null,
            discountAmount:null,
            items:[],
            // isUserCanBuy:'Y', //是否可选
            isSingleUse:'N', //是否一次性
          }
          // 可变动金额套餐，不能自主下单
          if(tempType==='PRICE_CUSTOM'){
            this.mealForm.isUserCanBuy='N';
          }else{
            this.mealForm.isUserCanBuy='Y';
          }
        },
        //编辑富文本
        editEditor(name){
          if(this.editorEditing.indexOf(name)===-1){
            this.editorEditing.push(name);
          }
          if(name==='mealDetail'){
            this.editor1.$textElem.attr('contenteditable', true);
          }
          if(name==='serviceArg'){
            this.editor2.$textElem.attr('contenteditable', true);
          }
        },
        editSimple(editorName){
          let param={
            id:this.id,
            type:'',
            content:'',
          };
          //富文本内容
          if(editorName==='mealDetail'){
            param.type='fullDescribe'
            param.content=this.editor1.txt.html();
          }else if(editorName==='serviceArg'){
            param.type='protocol';
            param.content=this.editor2.txt.html();
          }
          this.$http.post(`/discount/service/edit`,param)
            .then(res=>{
              this.editorEditing.forEach((item,index)=>{
                if(item===editorName){
                  this.editorEditing.splice(index,1);
                }
              });
              if(res.data.code===0){
                this.$Message.success('保存成功');
              }else{
                this.$Message.success(res.data.msg);
              }
            })

        },
          //获取默认图片列表
        getCardLists(){
          this.$http.get(`/discount/service/default/image/list`)
            .then(res=>{
              if(res.data.code===0){
                this.cardLists=res.data.data;
              }else{
                this.$Message.error(res.data.msg);
              }
            })
        },
         // 查看信息
          getInfo(){
            let id = this.id;
            this.$http.get(`/discount/service/info/${id}`)
              .then(res=>{
                if(res.data.code===0){
                  let data=res.data.data;
                  this.mealForm={
                    serviceType:data.serviceType,
                    minSalePrice:data.minSalePrice,
                    name:data.name,
                    price:data.price,
                    salePrice:data.salePrice,
                    shortDescribe:data.shortDescribe,
                    remark:data.remark,
                    validMonth:data.validMonth,
                    saleCommission:data.saleCommission,
                    discountAmount:data.discountAmount,
                    items:data.items,
                    isUserCanBuy:data.isUserCanBuy
                  };
                  //卡片图
                  this.cardImg=data.image;
                  //富文本内容
                  this.fullDescribe=data.fullDescribe;
                  this.protocol=data.protocol;
                  this.editor1.txt.html(data.fullDescribe);
                  this.editor2.txt.html(data.protocol);
                    this.editor1.$textElem.attr('contenteditable', false)
                    this.editor2.$textElem.attr('contenteditable', false)
                  this.mealSale={
                    saleState:data.saleState==='1'?'在售':'停售',
                    saleNum:data.saleNum,
                    discountAmount:data.discountAmount,
                    createTime:data.createTime,
                    creator:data.creator,
                  };
                  this.detailForm=this.mealForm.items[0];
                  this.detailForm.discountType=this.mealForm.items.map(item=>{
                    return item.discountType;
                  })

                  this.repairTypes = this.formatDataTree(this.repairTypesPrimitive,{disableCheckbox:this.pageType==='view'},this.detailForm.discountLimit)
                  // this.detailForm.discountLimitTemp=this.formateDiscount(this.detailForm.discountLimit,'encode');
                }
              })
          },
        saveThis(){
            let _this = this;
            this.$refs['mealForm'].validate((valid)=>{
              if(valid){
                  _this.$refs['detailForm'].validate((validDetail)=>{
                    if(validDetail){
                      //优惠项目
                      // _this.detailForm.discountLimit=this.formateDiscount(_this.detailForm.discountLimitTemp,'decode');
                      let nodes =  this.$refs['repairTree'].getCheckedNodes()
                      _this.detailForm.discountLimit =nodes.map(item=>{
                        return {
                          id:item.id,
                          name:item.name,
                          isLeaf:item.parentId===''?'N':'Y'
                        };
                      });
                      let detailForm=Object.assign({}, _this.detailForm);
                      delete detailForm.discountLimitTemp;
                      let mealFormItems = [];
                      let discountType=JSON.parse(JSON.stringify(detailForm.discountType))


                      discountType.forEach(item=>{
                          let detailItem = JSON.parse(JSON.stringify(detailForm));
                          detailItem.discountType=item;
                          mealFormItems.push(detailItem);
                      })

                      let params = _this.mealForm;
                      params.items=mealFormItems;
                      if(!params.saleCommission){
                        params.saleCommission=0
                      }
                      delete params.discountAmount;

                      //优惠项目处理多次

                      // 一次性使用
                      if(params.isSingleUse!=='Y'){
                        if(!params.validMonth){
                          _this.$Message.error('请输入套餐有效期');
                          return false;
                        }
                      }
                      //富文本内容
                      params.fullDescribe = this.editor1.txt.html();
                      params.protocol = this.editor2.txt.html();
                      //图片
                      params.image=this.cardImgKey;
                      _this.$http.post(`/discount/service/save`,{...params})
                        .then(res=>{

                          if(res.data.code===0){
                            _this.$Message.success('保存成功');
                            _this.$router.back();
                          }else{
                            _this.$Message.success(res.data.msg);
                          }
                        })
                    }
                  })
              }
            })

        },

        toggleState(){
          let state = this.mealSale.saleState==='在售'?'0':'1';
          let params=`id=${this.id}&state=${state}`;
          this.$http.get(`/discount/service/change/saleState?${params}`)
            .then(res=>{
              if(res.data.code===0){
                this.$Message.success('操作成功');
                this.getInfo();
              }
            })
        },
        //上传图片 成功
        uploadCardSuccess(res,file){
          if(res.code===0){
            this.cardImg=res.data.imageUrl;
            this.cardImgKey=res.data.key;
          }else{
            this.$Message.error(res.data.msg)
          }
        }
      },
      watch:{
        cardNow(newVal,oldVal){
          this.cardNow=newVal;
          this.cardImg=this.cardLists[newVal].imageUrl;
        }
      }
    }
</script>

<style scoped lang="scss">
@import "../system";
.mealForm{
  padding-top: 20px;
  .form-block{
    h4{
      margin:10px 0;
    }
  }
  .sale-detail{
    .ivu-form-item-content{
      &>span{
        margin:0 20px;
      }
    }
  }
  .check-table{
    width:100%;
    border: 1px solid #ddd;
    border-collapse: collapse;
    td{
      border: 1px solid #ddd;
      padding:10px;
      &:first-child{
        width:120px;
      }
    }
  }
}
.over-height{
  max-height: 300px;
  overflow: auto;
  margin-bottom: 0;
}
  .card-bg{
    img{
      display: block;
      width:360px;
      height: 225px;
      border-radius: 8px;
    }
  }
  .editor-wrapper{
    position: relative;
    .btn-group{
      position: absolute;
      right: 0;
      top: -40px;
    }
    .editor-mask{
      position: absolute;
      background: rgba(243,243,243,0.5);
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 999999;
      cursor:not-allowed;
    }
  }
</style>
