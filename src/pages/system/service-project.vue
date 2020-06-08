<template>
  <Card>
    <div class="clearfix mb-15">
      <div class="pull-left">
        <Button type="primary" @click="addNewProjectType" icon="md-add">新建服务项目分类</Button>
        <Button type="primary" @click="addNewProject" icon="md-add" >新建服务项目</Button>
      </div>
      <div class="pull-right">
        <Button  @click="editNode" type="primary">编辑</Button>
        <Button  @click="delThis" type="error">删除</Button>
<!--        <Button @click="downExcelTpl">项目服务Excel导入模板下载</Button>-->
<!--        <Upload class="inline-button" :action="uploadUrl"-->
<!--                :before-upload="importExcel"-->
<!--                :show-upload-list="false"-->
<!--                :with-credentials="true"-->
<!--                :on-success="uploadSuccess"-->
<!--                :data="uploadData"-->
<!--        >-->
<!--          <Button icon="ios-cloud-upload-outline">项目服务Excel导入</Button>-->
<!--        </Upload>-->
      </div>
    </div>
    <div class="content">
      <Row :gutter="15">
        <Col span="8">
          <Card>
            <p slot="title">服务分类树</p>
            <Spin fix v-show="treeLoading == true">加载中...</Spin>
            <Tree :render="renderContent" ref="tree" :data="treeLists"></Tree>
          </Card>
        </Col>
        <Col span="16">
          <Card>
            <p slot="title">{{currentNodeType!=='sub'?'服务项目分类':'服务项目'}}</p>
            <Spin fix v-show="loading == true">加载中...</Spin>
            <div v-show="currentNodeType!=='sub'">
              <Form ref="typeForm" class="form-box" :model="typeForm" :rules="typeRule" :label-width="150">
                <FormItem class="must" label="名称" prop="name">
                  <Input :maxlength="10" :disabled="!editTypeForm" v-model="typeForm.name"/>
                </FormItem>
                <FormItem class="must" prop="sortIndex" label="用户端排序顺序">
                  <InputNumber :disabled="!editTypeForm" :min="1" :precision="0" v-model="typeForm.sortIndex"/>
                </FormItem>
                <FormItem class="must" label="选择图标样式">
                <UploadImage :eidtImg="eidtImg" ref="upTypeImg" :qiniuToken="qiniuToken" :imgDisabled="!editTypeForm" @uploadCallback="uploadUrl"></UploadImage>
                </FormItem>
                <FormItem class="must" prop="isShow" label="状态">
                  <RadioGroup v-model="typeForm.isShow">
                    <Radio :disabled="!editTypeForm"  label="Y">正常</Radio>
                    <Radio :disabled="!editTypeForm"  label="N">不显示</Radio>
                  </RadioGroup>
                </FormItem>
                <FormItem    v-show="editTypeForm">
                  <Button  @click="saveTypeForm" :loading="saveLoading" type="primary">保存</Button>
                  <Button  @click="cancelForm">取消</Button>
                </FormItem>
              </Form>
            </div>
            <div  v-show="currentNodeType==='sub'">
              <Form ref="proForm" class="form-wrap" :model="proForm" :label-width="150">
                <FormItem class="form-item" label="服务项目名称">
                  <Input :maxlength="10" :disabled="!editProForm" v-model="proForm.name"/>
                </FormItem>
                <FormItem class="form-item" label="所属服务类型">
                  <Select :disabled="!editProForm" v-model="proForm.parentId">
                    <Option v-for="type in typeLists" :value="type.id" :key="type.id">{{type.name}}</Option>
                  </Select>
                </FormItem>
                <FormItem class="form-item" label="用户可选">
                  <Select :disabled="!editProForm" v-model="proForm.isUserCanUse">
                    <Option value="Y">是</Option>
                    <Option value="N">否</Option>
                  </Select>
                </FormItem>
                <!--                <FormItem class="form-item" label="师傅可选">-->
                <!--                  <Select :disabled="!editProForm" v-model="proForm.isServiceUserCanUse">-->
                <!--                    <Option value="Y">是</Option>-->
                <!--                    <Option value="N">否</Option>-->
                <!--                  </Select>-->
                <!--                </FormItem>-->
                <FormItem class="form-item" label="人工费不低于">
                  <template v-if="!editProForm">
                    <Input :disabled="!editProForm" v-model="proForm.serviceFee"/>
                  </template>
                  <template v-else>
                    <InputNumber v-model="proForm.serviceFee" />
                  </template>
                </FormItem>
                <FormItem class="form-item" label="是否收取上门费">
                  <Select :disabled="!editProForm" v-model="proForm.hasDtdServiceFee">
                    <Option value="Y">收取</Option>
                    <Option value="N">不收取</Option>
                  </Select>
                </FormItem>
                <template v-if="proForm.hasDtdServiceFee==='Y'">
                  <FormItem class="form-item" label="上门费金额">
                    <template v-if="!editProForm">
                      <Input :disabled="!editProForm" v-model="proForm.dtdServiceFee"/>
                    </template>
                    <template v-else>
                      <InputNumber v-model="proForm.dtdServiceFee" />
                    </template>
                  </FormItem>
                  <FormItem class="form-item" label="是否需先支付上门费">
                    <Select :disabled="!editProForm" v-model="proForm.isPrepayDtd">
                      <Option value="Y">是</Option>
                      <Option value="N">否</Option>
                    </Select>
                  </FormItem>
                </template>
                <FormItem class="form-item" label="是否在APP上展示">
                  <Select :disabled="!editProForm" v-model="proForm.isShow">
                    <Option value="Y">是</Option>
                    <Option value="N">否</Option>
                  </Select>
                </FormItem>
                <FormItem class="form-item" label="用户端排序">
                  <template v-if="!editProForm">
                    <Input :disabled="!editProForm" v-model="proForm.sortIndex"/>
                  </template>
                  <template v-else>
                    <InputNumber v-model="proForm.sortIndex" />
                  </template>
                </FormItem>
                <FormItem label="选择图标样式">
                  <UploadImage :eidtImg="eidtImg" ref="upImg" :qiniuToken="qiniuToken" :imgDisabled="!editProForm" @uploadCallback="uploadUrl"></UploadImage>
                </FormItem>
                <FormItem class="form-item" label="服务备注">
                  <Input :disabled="!editProForm" type="textarea" v-model="proForm.description"/>
                </FormItem>
                <FormItem class="form-item editor-item" label="服务说明">
                  <tinymce @input="changeInput" :editProForm="!editProForm"  @on-upload-complete="uploadComplete" :content="{data:proForm.serviceDescription,index:0}" @on-upload-fail="uploadFile" ref="editor"></tinymce>
                </FormItem>
                <FormItem v-show="editProForm">
                  <Button  @click="saveProForm" :loading="btnLoading" type="primary">保存</Button>
                  <Button  @click="cancelForm">取消</Button>
                </FormItem>
              </Form>
            </div>
          </Card>

        </Col>
      </Row>
    </div>
  </Card>
</template>

<script>
  import _ from 'lodash'
  import tinymce from '../main-components/tinymce';
  import UploadImage from '../main-components/upload-img'
  import InputNumber from "../main-components/input-money";
  import util from '../../libs/util'
  import axios from '@/libs/api'
  export default {
    name: "service-project",
    components: {InputNumber,tinymce,UploadImage},
    computed:{
      uploadData(){
        let parentId = this.currentNode.id;
        return {parentId};
      }
    },
    data(){
      return {
        eidtImg:null,//图片
        qiniuToken:{
          key:''
        },
        btnLoading:false,
        saveLoading:false,
        treeLoading:true,
        loading:false,
        editTypeForm:false, // 可编辑分类关态
        editProForm:false, // 可编辑项目状态
        currentNodeType:'', // first-一级节点，sub-二级节点
        editTypeFormType:'add', //add-新增，edit-编辑
        editProFormType:'add', //add-新增，edit-编辑
        typeLists:[],
        typeForm:{
          id:'',
          name:'',
          iconCode:'',
          sortIndex:null,
          isShow:'Y'
        },
        proForm:{
          id:'',
          name:'',  //服务项目名称
          parentId:'', //所属服务类型
          serviceFee:'',//人工费不低于
          hasDtdServiceFee:'',//是否收取上门费
          dtdServiceFee:'',//上门费金额
          isPrepayDtd:'',//是否需要支付上门费
          iconCode:'',//图片名称
          isUserCanUse:'',//用户下单是否可选
          isShow:'Y',//是否在APP上显示
          longName:'',
          sortIndex:'',
          description:'', //textarea描述信息
          serviceDescription:'',//富文本编辑器内的内容
        },
        treeLists:[],
        iconLists:[], //icon列表
        currentNode:{},
        typeRule:{
          name:[
            {required:true,message:'请填写服务项目类型名称',trigger:'blur'},
          ],
          sortIndex:[
            {required:true,type:'number',message:'请填写服务项目类型排序',trigger:'change'},
          ],
          isShow:[
            {required:true,message:'请选择服务项目类型显示状态',trigger:'change'},
          ],
        }
      }
    },
    methods:{
      uploadUrl(data){     //子组件传过来的图片地址
        this.currentNodeType!=='sub'?this.typeForm.iconCode = data.imageUrl:this.proForm.iconCode = data.imageUrl
      },
      renderContent (h, { root, node, data }) {   //树的样式
        let _this = this;
        return h('span',
          {
            style: {
              display: 'inline-block',
              width: '100%',
            }
          },
          [
            h('span', [
              h('Icon', {
                props: {
                  type: 'md-pricetags'
                },
                style: {
                  fontSize:'16px',
                  verticalAlign:'center',
                  color:'#007fff',
                  marginRight: '8px',
                  cursor:'pointer'
                },
                on:{
                  click:()=>{
                    data.expand = !data.expand;
                  }
                }
              }),
              h('span',{
                style:{
                  cursor:'pointer',
                  display:'inline-block',
                },
                domProps:{
                  className:'btn'
                },
                on:{
                  click:(e)=>{
                    let btns=this.$refs.tree.$el.querySelectorAll('.btn');
                    for(let i=0;i<btns.length;i++){
                      btns[i].style.backgroundColor='#fff'
                    }
                    e.path[0].style.backgroundColor="#B0C4DE";//当前点击的元素
                    _this.currentNode.id = data.id;
                    _this.currentNode.parentId = data.parentId;
                    data.parentId == '0'?this.currentNodeType = 'first':this.currentNodeType = 'sub';
                    _this.editTypeForm = false;
                    _this.editProForm =false;
                    _this.loading = true;
                    _this.eidtImg = [];
                    _this.getDetail(data.id);
                  }
                }
              }, data.title)
            ])
          ])
      },
      uploadFile(){  //图片上传失败事件
        this.$Message.warning('图片上传失败！')
      },
      uploadComplete(){
        this.$Message.success('图片上传成功！')
      },
      changeInput(data){    //子组件上传的值
        this.proForm.serviceDescription = data;
      },
      // 获取一级分类
      getTypeList(){
        this.$http.get(`/yyht/v1/repair/category/select/first`).then(res=>{
          if(res.data.code===0){
            this.typeLists = res.data.data;
          }
        })
      },
      initialForm(){
        // 初始化表单
        this.typeForm={
          name:'',
          sortIndex:null,
          isShow:'Y',
          id:'',
          iconCode:'',
        };
        this.proForm={
          id:'',
          name:'',  //服务项目名称
          parentId:'', //所属服务类型
          serviceFee:'',//人工费不低于
          hasDtdServiceFee:'',//是否收取上门费
          dtdServiceFee:'',//上门费金额
          isPrepayDtd:'',//是否需要支付上门费
          iconCode:'',//图片名称
          isUserCanUse:'',//用户下单是否可选
          isShow:'Y',//是否在APP上显示
          longName:'',
          sortIndex:'',
          description:'', //textarea描述信息
          serviceDescription:'',//富文本编辑器内的内容
        };
        this.eidtImg = [];
        // this.$refs.editor.setContent("");
        this.editTypeForm=false;// 可编辑分类关态
        this.editProForm=false // 可编辑项目状态
      },
      // 新增节点（接口调用）
      addNodeAPI(params){
        this.$http.post(`/yyht/v1/repair/category/addOrUpdate`,{...params}).then(res=>{
          if(res.data.code===0){
            this.$Message.success('保存成功');
            this.initialForm();
            this.getTreeLists();
          }else{
            this.$Message.error(res.data.msg)
          }
          this.btnLoading = false;
          this.saveLoading = false;
        })
      },
      // 编辑节点（接口调用）
      // editNodeAPI(params){
      //   this.$http.post(`/yyht/v1/repair/category/addOrUpdate`,{...params}).then(res=>{
      //     if(res.data.code===0){
      //       this.$Message.success('保存成功');
      //       // 初始化表单
      //       this.initialForm();
      //       this.getTreeLists();
      //     }else{
      //       this.$Message.error(res.data.msg)
      //     }
      //   })
      // },
      // 编辑节点（交互通用）
      editNode(){
        if(!this.currentNode.id && this.currentNode.parentId != '0'){
          this.$Message.info('请先选择项目节点')
          return;
        }else{
          if(this.currentNodeType==='first'){
            this.editTypeForm=true;
            this.editTypeFormType='edit';
          }else{
            this.editProForm=true;
            this.proForm.parentId = this.currentNode.parentId;
            this.editProFormType='edit';
          }
        }
      },
      // 保存项目分类
      saveTypeForm(){
        this.saveLoading = true;
        let formData = this.typeForm;
        let params = {
          name:formData.name,
          sortIndex:formData.sortIndex,
          iconCode:formData.iconCode,
          isShow:formData.isShow,
          id:formData.id,
        }
        this.$refs['typeForm'].validate(res=>{
          if(res){
            // if(this.editTypeFormType==='add'){
            //   // 新增项目分类
              this.addNodeAPI(params)
            // }else{
              // 编辑项目分类
              // this.editNodeAPI(params)
            // }
          }else{
            this.saveLoading = false;
          }
        })
      },
      // 保存项目
      saveProForm(){
        this.btnLoading = true;
        let formData = this.proForm;
        let params = {
          id:'',
          name:'',  //服务项目名称
          parentId:this.currentNode.parentId, //所属服务类型
          serviceFee:'',//人工费不低于
          hasDtdServiceFee:'',//是否收取上门费
          dtdServiceFee:'',//上门费金额
          isPrepayDtd:'',//是否需要支付上门费
          iconCode:'',//图片名称
          isUserCanUse:'',//用户下单是否可选
          isShow:'Y',//是否在APP上显示
          longName:'',
          sortIndex:'',
          description:'', //textarea描述信息
          serviceDescription:'',//富文本编辑器内的内容
        };
        for(let key in formData){
          params[key] = formData[key];
        }
          this.addNodeAPI(params)
      },
      // 取消当前编辑表单状态（类型，项目通用）
      cancelForm(){
        if(this.currentNodeType==='first'){
          this.typeForm = {
            name:'',
            sortIndex:null,
            iconCode:'',//图片名称
            isShow:''
          };
          this.editTypeForm=false
        }else if(this.currentNodeType==='sub'){
          this.proForm = {
            id:'',
            name:'',  //服务项目名称
            parentId:'', //所属服务类型
            serviceFee:'',//人工费不低于
            hasDtdServiceFee:'',//是否收取上门费
            dtdServiceFee:'',//上门费金额
            isPrepayDtd:'',//是否需要支付上门费
            iconCode:'',//图片名称
            isUserCanUse:'',//用户下单是否可选
            isShow:'Y',//是否在APP上显示
            longName:'',
            sortIndex:'',
            description:'', //textarea描述信息
            serviceDescription:'',//富文本编辑器内的内容
          };
          this.eidtImg = null;
          this.btnLoading = false;
          this.editProForm=false // 可编辑项目状态
        }
      },
      // 新增项目类型
      addNewProjectType(){
        this.editTypeForm = true;
        this.currentNodeType='first';
        this.editTypeFormType = 'add';
        this.typeForm={
          name:'',
          sortIndex:null,
          isShow:'',
          iconCode:'',//图片名称
          id:'',
        }
      },
      // 新增项目
      addNewProject(){
        // 未选中一级菜单时
        if(!this.currentNode.id || this.currentNode.parentId != '0'){
          this.$Message.info('请先选择要添加到的项目分类');
          return false;
        }
        this.editProForm = true;
        this.editProFormType = 'add';
        this.currentNodeType='sub';
        this.eidtImg = null;
        this.proForm={
          id:'',
          name:'',  //服务项目名称
          parentId:this.currentNode.id, //所属服务类型
          serviceFee:'',//人工费不低于
          hasDtdServiceFee:'',//是否收取上门费
          dtdServiceFee:'',//上门费金额
          isPrepayDtd:'',//是否需要支付上门费
          iconCode:'',//图片名称
          isUserCanUse:'',//用户下单是否可选
          isShow:'Y',//是否在APP上显示
          longName:'',
          sortIndex:'',
          description:'', //textarea描述信息
          serviceDescription:'',//富文本编辑器内的内容
        }
      },
      //删除
      delThis(){
        let _this = this;
        let id = this.currentNode.id;
        this.$store.commit('setDeleteModal',{model:true,callback:function(){
            _this.$http.post(`/yyht/v1/repair/category/delete?id=${id}`).then(res=>{
              if(res.data.code===0){
                _this.$Message.success('删除成功');
                _this.$store.commit('setDeleteModal',{model:false});
                _this.getTreeLists();
                _this.initialForm();
                _this.$forceUpdate(); //强制刷新
              }else{
                _this.$Message.info('删除失败：'+res.data.msg);
                _this.$store.commit('setDeleteModal',{model:false});
              }
            })
          }});
      },
      // 获取节点详情
      getDetail(id){
        this.$http.get(`/yyht/v1/repair/category/info?id=${id}`).then(res=>{
          if(res.data.code===0){
            let data = res.data.data;
            if(this.currentNode.parentId == '0'){
              // 一级节点
              this.currentNodeType = 'first';
              this.eidtImg = [{name: data.imgName, url: data.iconCode, status: 'finished'}];
              this.typeForm=_.cloneDeep(data);
            }else{
              // 二级节点
              this.currentNodeType = 'sub';
              this.eidtImg = [{name: data.imgName, url: data.iconCode, status: 'finished'}];
              this.proForm=_.cloneDeep(data);
            }
            this.loading = false
          }
        })
      },
      // 选择图标
      // selectIcon(icon){
      //   if(!this.editProForm){
      //     return;
      //   }
      //   this.$set(this.proForm,'iconCode',icon.iconCode)
      //   // this.proForm.iconCode = icon.iconCode;
      //   console.log( this.proForm.iconCode )
      // },
      // changePort(nodeList,currentNode){
      //   this.currentNode = currentNode;
      //   this.getDetail(currentNode.id)
      //   this.editTypeForm=false; // 可编辑分类关态
      //   this.editProForm=false; // 可编辑项目状态
      // },
      getTreeLists(){
        this.$http.get(`/yyht/v1/repair/category/tree`).then(res=>{
          if(res.data.code===0){
            let data = res.data.data;
            this.treeLists=this.formatDataTree(data);
            this.treeLoading = false;
            this.getTypeList();
          }
        })
      },
      formatDataTree(data){
        let res = data.map(item=>{
          item.title = item.name;
          item.expand=false;
          if(item.children.length>0){
            item.children = this.formatDataTree(item.children)
          }
          return item;
        });
        return res;
      },
      // Excel导入模板下载
      // downExcelTpl(){
      //   this.$http.get(`/repair/category/import/template`,{responseType:'blob'}).then(res=>{
      //     util.downloadExcel(res)
      //   })
      // },
      // // Excel导入服务项目
      // importExcel(){
      //   if(this.currentNodeType!=='first'){
      //     this.$Message.info('请先选择要导入的项目服务分类结点')
      //     return false;
      //   }else{
      //     return true;
      //   }
      // },
      // 上传结束
      // uploadSuccess(res,file,fileList){
      //   if(res.code!==0){
      //     this.$Message.info(res.msg)
      //   }else{
      //     this.$Message.success('导入成功')
      //     this.getTreeLists();
      //   }
      // },
    },
    mounted(){
      this.getTreeLists();
      this.getTypeList()
    }
  }
</script>

<style scoped lang="scss">
  .form-box{
    width:400px;
  }
  .form-item{
    width:400px;
  }
  .icon-lists{
    width: 700px;
    padding: 10px;
    max-height: 400px;
    overflow-y: auto;
    overflow-x: hidden;
    .icon-wrap{
      width:120px;
      float: left;
      cursor:pointer;
      margin: 5px;
      text-align: center;
      &.active{
        position: relative;
        &::before{
          content: '';
          display: block;
          width: 100%;
          height: 100%;
          border: 3px solid #57a3f3;
          position: absolute;
          left:0;
          top:-3px;
        }
      }
      img{
        width:40px;
        height: 40px;
        display: block;
        margin: 0 auto;
      }
    }
  }
  .inline-button{
    display: inline-block;
  }
  .editor-item{
    width: 100%;
  }
  .inline-button{
    display: inline-block;
  }
</style>
