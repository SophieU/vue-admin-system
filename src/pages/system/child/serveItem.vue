<template>
    <div class="serve-item">
      <Form ref="typeForm" class="form-box" :model="typeForm" :rules="typeRule" :label-width="150">
        <FormItem class="must" label="名称" prop="name">
          <Input :maxlength="10" :disabled="!editTypeForm" v-model="typeForm.name"/>
        </FormItem>
        <FormItem class="must" prop="sortIndex" label="用户端排序顺序">
          <InputNumber :disabled="!editTypeForm" :min="1" :precision="0" v-model="typeForm.sortIndex"/>
        </FormItem>
        <FormItem class="must" prop="isShow" label="状态">
          <RadioGroup v-model="typeForm.isShow">
            <Radio :disabled="!editTypeForm"  label="Y">正常</Radio>
            <Radio :disabled="!editTypeForm"  label="N">不显示</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem    v-show="editTypeForm">
          <Button  @click="saveTypeForm" type="primary">保存</Button>
          <Button  @click="cancelForm">取消</Button>
        </FormItem>
      </Form>
    </div>
</template>

<script>
    export default {
        name: "serveItem",
      props:{
        editTypeForm:{
          type:Boolean
        },
        editTypeFormType:{
          type:String
        },
      },
      data(){
          return{
            typeForm:{
              id:'',
              name:'',
              sortIndex:null,
              isShow:'Y'
            },
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
        // 保存项目分类
        saveTypeForm(){
          let formData = this.typeForm;
          let params = {
            name:formData.name,
            sortIndex:formData.sortIndex,
            isShow:formData.isShow,
            id:formData.id,
          };
          this.$refs['typeForm'].validate(res=>{
            if(res){
              if(this.editTypeFormType==='add'){
                // 新增项目分类
                this.addNodeAPI(params)
              }else{
                // 编辑项目分类
                this.editNodeAPI(params);
              }
            }
          })
        },
        // 新增节点（接口调用）
        addNodeAPI(params){
          this.$http.post(`/yyht/v1/repair/category/addOrUpdate`,{...params}).then(res=>{
            if(res.data.code===0){
              this.$Message.success('保存成功');
              this.$emit('initInput');
              this.typeForm={
                name:'',
                sortIndex:null,
                isShow:'Y',
                id:'',
              };
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
              // 初始化表单
              this.typeForm={
                name:'',
                sortIndex:null,
                isShow:'Y',
                id:'',
              };
              this.$emit('initInput');
            }else{
              this.$Message.error(res.data.msg)
            }
          })
        },
        // 取消当前编辑表单状态（类型，项目通用）
        cancelForm(){
          this.typeForm = {
            name:'',
            sortIndex:null,
            isShow:''
          };
          this.editTypeForm=false
          // if(this.currentNodeType==='first'){
          //
          // }else if(this.currentNodeType==='sub'){
          //   this.proForm = {
          //     name:'',
          //     parentId:'',
          //     serviceFee:'',
          //     isUserCanUse:'',
          //     hasDtdServiceFee:'',
          //     dtdServiceFee:'',
          //     isPrepayDtd:'',
          //     description:'',
          //     sortIndex:'',
          //     iconCode:'',
          //     isShow:'Y',
          //   };
          //   this.editProForm=false // 可编辑项目状态
          // }
        },
      }
    }
</script>

<style scoped lang="scss">
  .serve-item{
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
  }
</style>
