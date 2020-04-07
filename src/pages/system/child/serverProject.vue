<template>
    <div class="server-project">
      <div style="height:30px"></div>
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
          <Input :disabled="!editProForm" v-model="proForm.serviceFee"/>
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
        <FormItem label="选择图标样式">
          <UploadImage :eidtImg="eidtImg" ref="upImg" :qiniuToken="qiniuToken" :imgDisabled="!editProForm" @uploadCallback="uploadUrl"></UploadImage>
        </FormItem>
        <FormItem class="form-item" label="服务备注">
          <Input :disabled="!editProForm" type="textarea" v-model="proForm.description"/>
        </FormItem>
        <FormItem class="form-item editor-item" label="服务说明">
          <tinymce @input="changeInput" :editProForm="!editProForm"  @on-upload-complete="uploadComplete" :content="proForm.serviceDescription" @on-upload-fail="uploadFile" ref="editor"></tinymce>
        </FormItem>
        <FormItem v-show="editProForm">
          <Button  @click="saveProForm" type="primary">保存</Button>
          <Button  @click="cancelForm">取消</Button>
        </FormItem>
      </Form>
    </div>
</template>

<script>
  import _ from 'lodash'
  import tinymce from '../../main-components/tinymce';
  import UploadImage from '../../main-components/upload-img'
  import InputNumber from "../../main-components/input-money";
    export default {
      name: "serverProject",
      components: {UploadImage,InputNumber,tinymce},
      props:{
        editProForm:{
          type:Boolean
        },
        editProFormType:{
          type:String
        },
        parentData:{
          type:Object
        },
        deleteClear:{
          type:String
        }
      },
      watch:{
        parentData:{
          handler(newValue,oldValue){
            if(newValue.parentId != '0'){this.getDetail(newValue.id)}
            // else{this.cancelForm()}
          }
        },
        deleteClear:{
          handler(){
            this.cancelForm()
          }
        },
        editProFormType:{
          handler(newValue){
            console.log(1111,newValue)
           if(newValue == 'add'){this.cancelForm()}
          }
        }
      },
      data(){
          return{
            typeLists:[],
            imgDisabled:false, //控制图片的可编辑与不可编辑，false为不可编辑
            eidtImg:null,  //图片的操作
            qiniuToken:{
              key:''
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
          }
      },
      methods:{
        // 取消当前编辑表单状态（类型，项目通用）
        cancelForm(){
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
          this.$emit('initInput');
          this.eidtImg = null;
          this.$nextTick(()=>{
          this.$refs['upImg'].clearFiles();
          })
        },
        // 保存项目
        saveProForm(){
          this.$emit('saveLoading');
          let formData = this.proForm;
          let params = {
            id:'',
            name:'',  //服务项目名称
            parentId:this.parentData.parentId, //所属服务类型
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
          for(let key in formData){
            params[key] = formData[key];
          }
          if(this.editProFormType==='add'){
            // 新增项目分类
            this.addNodeAPI(params)
          }else{
            // 编辑项目分类
            this.editNodeAPI(params)
          }
        },
        // 所属服务类型下拉框
        getTypeList(){
          this.$http.get(`/yyht/v1/repair/category/select/first`).then(res=>{
            if(res.data.code===0){
              this.typeLists = res.data.data;
            }
          })
        },
        // 获取节点详情
        getDetail(id){
          this.$http.get(`/yyht/v1/repair/category/info?id=${id}`).then(res=>{
            if(res.data.code===0){
              let data = res.data.data;
              this.currentNodeType = 'sub';
              this.proForm=_.cloneDeep(data);
              this.eidtImg = [{name: data.imgName, url: this.proForm.iconCode, status: 'finished'}];
              this.$emit('loadFlag')
            }
          })
        },
        // 新增节点（接口调用）
        addNodeAPI(params){
          this.$http.post(`/yyht/v1/repair/category/addOrUpdate`,{...params}).then(res=>{
            if(res.data.code===0){
              this.$Message.success('保存成功');
              this.$emit('loadFlag');
              this.cancelForm();
            }else{
              this.$Message.error(res.data.msg)
            }
          })
        },
        // 编辑节点（接口调用）
        editNodeAPI(params){
          this.$http.post(`/yyht/v1/repair/category/addOrUpdate`,{...params}).then(res=>{
            if(res.data.code===0){
              this.$Message.success('保存成功');
              this.$emit('loadFlag');
              this.cancelForm();
            }else{
              this.$Message.error(res.data.msg)
            }
          })
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
        uploadUrl(data){     //子组件传过来的图片地址
          this.proForm.iconCode = data.imageUrl
        },
      },
      mounted() {
        if(this.parentData){this.getDetail(this.parentData.id)}
        this.getTypeList();
        this.getDetail(this.parentData.id)
      }
    }
</script>

<style lang="scss">
  .server-project{
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
    /*.form-item .ivu-input,.ivu-select{*/
    /*  width:30%*/
    /*}*/
  }
</style>
