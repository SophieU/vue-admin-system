<style scoped lang="scss">
  @import "./system.scss";
  .icon-lists{
    display: flex;
    flex-wrap:wrap;
    li{
      flex:20% 0 0;
      padding:5px;
      img{
        display: block;
        width:100%;
        height: auto;
      }
      &.checked{
        img{
          border: 3px solid #039dff;
          border-radius: 2px;
        }
      }
    }
  }
</style>

<template>
    <div>
      <Card>
        <div>
          <div class="clearfix mb-15">
            <div class="pull-left">
              <Button icon="md-add" @click="modalTitle='新建';repairModal=true;hasFee=false;">新建</Button>
              <Button icon="ios-funnel" @click="filter=true" >筛选</Button>
            </div>
            <div class="pull-right">
              <Button  icon="ios-cloud-download-outline" @click="downExcel">excel导入模板下载</Button>
              <div class="inline-upload">
                <Upload :action="uploadUrl"
                        :with-credentials="true"
                        :on-success="uploadSuccess"
                        :before-upload="uploading"
                        :show-upload-list="false"

                >
                  <Button icon="ios-cloud-upload-outline">excel导入</Button>
                </Upload>
              </div>
              <!--<Button>excel导入</Button>-->
            </div>
          </div>
          <div class="table-wrapper">
            <Table :data="lists" :columns="tableColumn" ></Table>
          </div>
        </div>
      </Card>
      <!--报修弹窗-->
      <Modal v-model="repairModal"
        :title="modalTitle+'报修分类'"
             :mask-closable="false"
          @on-visible-change="resetForm"
      >
        <div  class="modal_wrap_form">
          <i-form ref="typeForm" :model="typeForm" label-position="top" :rules="typeFormRule">
            <form-item label="报修分类名称" prop="name">
              <Input v-model="typeForm.name"
                @on-keydown="inputName"
              />
            </form-item>
            <form-item label="用户可选" prop="isUserCanUse">
              <i-select v-model="typeForm.isUserCanUse">
                <i-option value="Y">是</i-option>
                <i-option value="N">否</i-option>
              </i-select>
            </form-item>
            <form-item label="师傅可用" prop="isServiceUserCanUse">
              <i-select v-model="typeForm.isServiceUserCanUse">
                <i-option value="Y">是</i-option>
                <i-option value="N">否</i-option>
              </i-select>
            </form-item>

            <form-item label="上门费收费标准" >
              <Row :gutter="15">
                <Col span="16" >
                  <form-item prop="dtdServiceFee">
                    <InputNumber :min="0" :precision="2" style="width:100%;"  :disabled="!hasFee" v-model="typeForm.dtdServiceFee"></InputNumber>
                    <!--<Input  ref="dtdServiceFee" @on-keydown="inputMoney($event,'dtdServiceFee')"  :disabled="!hasFee" v-model="typeForm.dtdServiceFee" />-->
                  </form-item>
                </Col>
                <Col span="8" >
                  <form-item prop="hasFee">
                    <Checkbox @on-change="toggleFee" v-model="hasFee">收取上门费</Checkbox>
                  </form-item>
                </Col>
              </Row>
            </form-item>

            <form-item label="员工上门费结算标准" prop="employeeDtdServiceCommission">
              <InputNumber
                        :precision="2"
                        style="width:100%;"
                        :min="0"
                           v-model="typeForm.employeeDtdServiceCommission"></InputNumber>
              <!--<Input ref="epDtdFee"  @on-keydown="inputMoney($event,'epDtdFee')" v-model="typeForm.employeeDtdServiceCommission" />-->
            </form-item>
            <form-item label="图标样式" prop="icon">
              <ul class="icon-lists">
                <li @click="checkIcon(item)" v-for="(item,index) in iconLists" :key="index" :class="iconCode===item.iconCode?'checked':''"><img :src="item.iconUrl" alt=""></li>
              </ul>
            </form-item>
          </i-form>
        </div>
        <div slot="footer">
          <Button @click="repairModal=false">取消</Button>
          <Button :loading="loadingSend" @click="saveType" type="primary">{{modalTitle===1?'添加':'保存'}}</Button>
        </div>
      </Modal>
      <!--报修筛选-->
      <Drawer title="报修筛选"  v-model="filter" width="425">
        <div class="filter-top mb-15 clearfix">
          <div class="pull-left">
            <Button @click="clearFilter" icon="md-close-circle">清空筛选条件</Button>
          </div>
          <div class="pull-right">
            <Button @click="filterData" type="primary">确定筛选</Button>
          </div>
        </div>
        <i-form v-model="repairFilter" >
          <form-item label="报修名称">
            <Input v-model="repairFilter.name" />
          </form-item>
          <form-item label="收取上门费">
            <i-switch v-model="repairFilter.needFee"  />
          </form-item>
        </i-form>

      </Drawer>
      <!--正在上传中-->
     <!-- <Modal v-model="uploadingModal" title="正在上传中..." :mask-closable="false" :footer-hide="true" :closable="false">
        <Progress :percent="uploadPercent" status="active" />
      </Modal>-->
    </div>
</template>

<script>
  import util from '../../libs/util';
    export default {
        name: "repair-type",
      computed:{
        uploadUrl:function(){
          let baseUrl=this.$http.defaults.baseURL;
          let url = baseUrl+'/repair/category/import';
          return url;
        }
      },
      data(){
          let _this = this;
          const feeValidator= function(rule,value,callback){
            //收取上门费时，必填
            if(_this.typeForm.hasFee){
              if(value.length>0){
                if(parseFloat(value)){
                  callback();
                }else{
                  callback(new Error('请输入正确的金额'));
                }
              }else{
                callback(new Error('请输入上门费收费标准'));
              }
            }else{
              callback();
            }
          };
          const validName=function(rule,value,callback){
            let reg = /[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/;

          };
          return {
            loadingSend:false,
            uploadingModal:false,
            uploadPercent:0, // 上传进度百分比
            hasFee:false,//自定属性，适应checkbox，是否收取上门费
            modalTitle:'新建', //1：新建，0：编辑
            repairModal:false,
            filter:false, //筛选
            tableColumn:[
              {
                title:'名称',
                key:'name',
                align:'center'
              },{
                title:'上门费',
                align:'center',
                render:(h,params)=>{
                  if(params.row.hasDtdServiceFee==='Y'){
                    let num = params.row.dtdServiceFee;
                    // return h('span','有');
                    return h('span',num);
                  }else{
                    return h('span','无');
                  }
                }
              },
             /* {
                title:'客户上门费结算标准',
                align:'center',
                key:'dtdServiceFee',
              },*/
              {
                title:'员工结算标准',
                // key:'employeeDtdServiceCommission',
                align:'center',
                render:(h,params)=>{
                  let num = params.row.employeeDtdServiceCommission;
                  return h('span',num);
                }
              },{
                title:'用户可选',
                align:'center',
                key:'isUserCanUse'
              },{
                title:'师傅可用',
                align:'center',
                key:'isServiceUserCanUse'
              },{
                title:'操作',
                align:'center',
                render:(h,params)=>{
                  let _this = this;
                  return h('div',[
                    h('Button',{
                      props:{
                        type:'primary',
                        size:'small'
                      },
                      style:{marginRight:'8px'},
                      on:{
                        click(){
                          let id = params.row.id;
                          _this.getTypeInfo(id);
                          _this.modalTitle='编辑';
                          _this.repairModal=true;
                        }
                      }
                    },'编辑'),
                    h('Button',{
                      props:{
                        type:'error',
                        size:'small',

                      },
                      className:'text-red',
                      on:{
                        click(){
                          let id = params.row.id;
                          _this.$store.commit('setDeleteModal',{model:true,callback:function(){
                              _this.deleteType(id)
                            }});
                          // _this.deleteType(id);
                        }
                      }
                    },'删除'),

                  ])
                }
              },
            ],
            lists:[],
            typeForm:{
              id:'',
              callCenterId:'',
              name:'',
              hasDtdServiceFee:'Y',
              dtdServiceFee:0,
              employeeDtdServiceCommission:0,
              iconCode:'',
              isUserCanUse:'Y', //用户可选
              isServiceUserCanUse:'Y', //师傅可用
            },
            typeFormRule:{
              name:[
                {required:true,message:'请输入报修分类名称',trigger:'blur'},
                // {validator:validName,message:'请输入有效的报修分类名称',trigger:'blur'}
              ],
              employeeDtdServiceCommission:[
                {required:true,message:'请输入员工上门费结算标准',trigger:'blur',type:'number'}
              ],
              dtdServiceFee:[
                {required:true,message:'请输入上门费收费标准',trigger:'blur',type:'number'}
              ]
            },
            repairFilter:{
              name:'',
              needFee:true
            },
            iconLists:[],
            iconCode:'',
          }
      },
      methods:{
        checkIcon(item){
          this.iconCode=item.iconCode;
          this.typeForm.iconCode=item.iconCode;
        },
          inputName(event){
            let key = event.key;
            let reg=/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/;
            if(reg.test(key)){
              event.preventDefault();
              return false;
            }
            // this.typeForm.name='';
          },
          toggleFee(val){
            this.hasFee=val;
            if(!val){
              this.typeForm.dtdServiceFee=0;
            }
          },
          //清空筛选
          clearFilter(){
            this.repairFilter={
              name:'',
                needFee:true
            };
            this.getTypeLists();
            this.filter=false;
          },
          // 筛选搜索名称
          filterData(){
            let data = this.repairFilter;
            let filter = {
              name:data.name,
              hasDtdServiceFee:data.needFee?'Y':'N'
            };
            this.getTypeLists(filter);
            this.filter=false;
          },
          //获取分类列表
          getTypeLists(filter){
            let params='';
            if(filter){
              params = util.formatterParams(filter);
            }
              this.$http.get(`/repair/category/list?${params}`)
                .then(res=>{
                  if(res.data.code===0){
                    this.lists=res.data.data;
                  }else{
                    this.$Message.error(res.data.msg);
                  }
                });
          },
        // 获取单个分类信息，用于编辑
        getTypeInfo(id){
            this.$http.get(`/repair/category/info?id=${id}`)
              .then(res=>{
                if(res.data.code===0){
                  this.typeForm=res.data.data;
                  this.typeForm.dtdServiceFee*=1;
                  this.typeForm.employeeDtdServiceCommission*=1;
                  this.hasFee=res.data.data.hasDtdServiceFee==='Y'?true:false;
                  this.iconCode=this.typeForm.iconCode;
                }else{
                  console.log('单个信息获取失败：'+res.data.msg)
                }
              })
        },
        //保存分类
        saveType(){
            let params = this.typeForm;
            params.hasDtdServiceFee=this.hasFee?'Y':'N';
            let url = '';
            if(params.id.length>0){
              //编辑
              url='/repair/category/edit';
              //删除多余属性
            }else{
              //添加
              url='/repair/category/add';
            }
            this.loadingSend=true;

            this.$refs['typeForm'].validate(valid=>{
              if(valid){
                    this.$http.post(url,{
                        ...params
                      }).then(res=>{
                          if(res.data.code===0){
                            this.$Message.success('保存成功');
                            this.repairModal=false;
                            this.getTypeLists();
                          }else{
                            this.$Message.error(res.data.msg);
                          }
                          this.loadingSend=false;
                      })
              }else{
                 this.loadingSend=false;
              }
            })


        },
        //金额输入验证
        inputMoney(event,name){
          let key= event.key;
          let reg = /(\d|\.)/;
          let tagVal = this.$refs[name].value.toString();
          if(key!=='Backspace'){
            if(!reg.test(key)){
              event.preventDefault();
              return false;
            }else{
              if(tagVal.indexOf('.')>-1&&key==='.'){
                event.preventDefault();
                return false;
              }
            }
          }
        },
        //删除分类
        deleteType(id){
          this.$http({
            url:`/repair/category/delete?id=${id}`,
            method:'delete',
          }).then(res=>{
            if(res.data.code===0){
              this.$Message.info('删除成功');
              this.$store.commit('setDeleteModal',{model:false}); //关闭提醒弹窗
              this.getTypeLists();
            }else{
              this.$Message.error(res.data.msg);
              _this.$store.commit('setDeleteModal',{model:false});
            }
          })
        },
        //下载模板
        downExcel(){
           this.$http.get(`/repair/category/import/template`,{responseType:'blob'})
             .then(res=>{
               util.downloadExcel(res);
             })
        },
        //上传回调
        uploadSuccess(res,file,fileLists){
            setTimeout(()=>{
              if(res.code===0){
                this.$Message.success('上传成功');
              }else{
                this.$Message.error(res.msg);
              }
              this.$store.commit('setUploadProgress',false);
              this.$store.commit('setUploadPercent',100);
              this.getTypeLists();
            },1000)
        },
       //正在上传效果
        uploading(){
          this.$store.commit('setUploadProgress',true);
          this.$store.commit('setUploadPercent',0);
        },
        // 关闭弹窗时，重置表单及验证
        resetForm(){
            this.typeForm={
              id:'',
              callCenterId:'',
              name:'',
              hasDtdServiceFee:'Y',
              dtdServiceFee:0,
              employeeDtdServiceCommission:0,
              isUserCanUse:'Y',
              isServiceUserCanUse:'Y',
            };
            this.iconCode='';
            this.$refs['typeForm'].resetFields(); //重置验证错误信息
        },
        getIconLists(){
          this.$http.get(`/repair/category/icon/list`)
            .then(res=>{
              if(res.data.code===0){
                this.iconLists=res.data.data;
              }
            })
        }
      },
      mounted(){
          this.getTypeLists();
          this.getIconLists();
      }
    }
</script>

