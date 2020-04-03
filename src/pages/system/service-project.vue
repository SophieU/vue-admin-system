<template>
  <Card>
    <div class="clearfix mb-15">
<!--      <div class="pull-right">-->
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
<!--      </div>-->
    </div>
    <div class="content">
      <Row :gutter="15">
        <Col span="8">
          <Card>
            <p slot="title">服务分类树</p>
            <div class="pull-right">
             <Button type="primary" @click="addNewProjectType" icon="md-add">新建服务项目分类</Button>
            </div>
            <div style="height: 50px"></div>
            <Tree :render="renderContent" :data="treeLists" class="demo-tree-render"></Tree>
          </Card>
        </Col>
        <Col span="16">
          <Card>
            <p slot="title">{{currentNodeType!=='sub'?'服务项目分类':'服务项目'}}</p>
              <div class="pull-right">
                <Button  @click="editNode" type="primary">编辑</Button>
              </div>
            <div v-if="currentNodeType!=='sub'">
              <serveItem :editTypeForm="editTypeForm" :editTypeFormType="editTypeFormType" @initInput="clearInput"></serveItem>
            </div>
            <div v-else>
              <serverProject :detail="detail" :editProForm="editProForm" :editProFormType="editProFormType" @initInput="clearInput" :parentData="parentData"></serverProject>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  </Card>
</template>

<script>
    import _ from 'lodash'
    import InputNumber from "../main-components/input-money";
    import serveItem from "./child/serveItem";
    import serverProject from "./child/serverProject";
    export default {
        name: "service-project",
      components: {
        serveItem,
        serverProject,
        InputNumber,
      },
       //TODO 暂时不需要上传文件和导入导出功能
      computed:{
        // uploadUrl(){
        //   return axios.defaults.baseURL+'/repair/category/import'
        // },
        // uploadData(){
        //   let parentId = this.currentNode.id;
        //   return {parentId};
        // }
      },
      data(){
            return {
              editTypeForm:false, // 可编辑分类关态
              editProForm:false, // 可编辑项目状态
              currentNodeType:'first', // first-一级节点，sub-二级节点
              editTypeFormType:'add', //add-新增，edit-编辑
              editProFormType:'add', //add-新增，edit-编辑
              detail:'',//获取编辑详细信息
              parentData:null,
              treeLists:[],
              currentNode:{},
            }
        },
      methods:{
        renderContent (h, { root, node, data }) {   //树的样式
          let _this = this;
          return h('span',
            {
            style: {
              display: 'inline-block',
              width: '100%'
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
                class:'span',
                style:{
                  cursor:'pointer',
                  display:'inline-block',
                  padding:'2px',
                  backgroundColor:data.background
                },
                on:{
                  click:()=>{
                    // _this.$nextTick(()=>{
                    //   let spanList = document.getElementsByClassName('span');
                    //   Array.prototype.forEach.call(spanList,item=>{
                    //     if (item.style.backgroundColor === '#E6E6FA' && data.background ==='#E6E6FA'){
                    //       return
                    //     }
                    //     item.style.backgroundColor = ''
                    //   });
                    //   _this.$set(data,'background','#E6E6FA');
                    // });
                    _this.currentNode = data;
                    _this.parentData = data;
                    _this.detail = 'getDetail';
                    data.parentId == 0 ? this.currentNodeType='first':this.currentNodeType='sub';
                    _this.editProForm = true;
                    _this.editTypeForm=false; // 可编辑分类关态
                    _this.editProForm=false; // 可编辑项目状态
                  }
                }
              }, data.title)
            ]),
            h('span', {
              style: {
                display: 'inline-block',
                float: 'right',
                marginRight: '32px'
              }
            }, [
              h('Button', {
                props: Object.assign({}, this.buttonProps, {
                  icon: 'md-add'
                }),
                style: {
                  marginRight: '8px',
                  color:'#007fff',
                  display:data.parentId == 0?'block':'none'
                },
                on: {
                  click: () => {
                    _this.parentData = data;
                    _this.currentNode.id = data.id;
                    _this.currentNode.parentId = data.parentId;
                    _this.addNewProject()
                  }
                }
              }),
              h('Button', {
                props: Object.assign({}, this.buttonProps, {
                  icon: 'md-close'
                }),
                style:{
                  color:'red',
                  display:data.parentId != 0?'block':'none'
                },
                on: {
                  click: () => {
                    _this.delThis(data.id)
                  }
                }
              })
            ])
          ])
        },
        // append (data) {
        //   const children = data.children || [];
        //   children.push({
        //     title: '默认名称',
        //     expand: true
        //   });
        //   this.$set(data, 'children', children);
        // },
        clearInput(){  //服务分类保存后清空
          this.getTreeLists();
          this.editTypeForm=false;// 可编辑分类关态
          this.editProForm=false // 可编辑项目状态
        },
        initialForm(){
          // 初始化表单
          this.proForm={
              id:'',
              name:'',
              parentId:'',
              serviceFee:'',
              isUserCanUse:'',
              hasDtdServiceFee:'',
              dtdServiceFee:'',
              isPrepayDtd:'',
              description:'',
              sortIndex:'',
              iconCode:'',
              isShow:'Y',
          };
          this.$refs.upImg.clearFiles();

        },
          // 编辑节点（交互通用）
        editNode(){
          if(!this.currentNodeType){
            this.$Message.info('请先选择项目节点')
            return;
          }else{
            if(this.currentNodeType==='first'){
              this.editTypeForm=true;
              this.editTypeFormType='edit';
            }else{
              this.editProForm=true;
              this.editProFormType='edit';
            }
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
            id:'',
          }
        },
        // 新增项目(子节点）
        addNewProject(){
          // 未选中一级菜单时
          if(!this.currentNode.id||this.currentNode.parentId==''){
            this.$Message.info('请先选择要添加到的项目分类')
            return false;
          }
          this.editProForm = true;
          this.editProFormType = 'add';
          this.currentNodeType='sub';
        },
        delThis(id){
          let _this = this;
          this.$store.commit('setDeleteModal',{model:true,callback:function(){
              _this.$http.delete(`/yyht/v1/repair/category/delete?id=${id}`).then(res=>{
                if(res.data.code===0){
                  _this.$Message.success('删除成功');
                  _this.$store.commit('setDeleteModal',{model:false});
                  _this.getTreeLists();
                  _this.initialForm();
                  _this.$forceUpdate(); //强制刷新
                }else{
                  _this.$Message.info('删除失败：'+res.data.msg)
                  _this.$store.commit('setDeleteModal',{model:false});
                }
              })

            }});
        },
        getTreeLists(){
          this.$http.get(`/yyht/v1/repair/category/tree`).then(res=>{   //获取树数据
            if(res.data.code===0){
              let data = res.data.data;
              this.treeLists=this.formatDataTree(data);
            }
          })
        },
        formatDataTree(data){ //给树形结构添加title属性以及expand属性
          let res = data.map(item=>{
            item.title = item.name;
            item.expand=false;
            if(item.children.length && item.children.length>0){
              item.children = this.formatDataTree(item.children)
            }
            return item;
          });
          return res;
        },
        //TODO 暂时不需要上传文件和导入导出功能
        // Excel导入模板下载
        // downExcelTpl(){
        //   this.$http.get(`/repair/category/import/template`,{responseType:'blob'}).then(res=>{
        //     util.downloadExcel(res)
        //   })
        // },

        // Excel导入服务项目
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
          this.getTreeLists()
           // 接口暂无
          // this.getRepireIcon()
      }
    }
</script>

<style scoped lang="scss">
  .demo-tree-render .ivu-tree-title{
    width: 100%;
  }
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
</style>
