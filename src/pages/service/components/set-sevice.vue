<template>
    <div>
      <div class="title-btn">
        <Button type="default" @click="$router.back()">返回上一页</Button>
      </div>
      <div class="content content-tree">
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
                <span>暂无数据</span>
              </div>
              <div  v-show="currentNodeType==='sub'">
                <Form ref="proForm" class="form-wrap" :model="proForm" :label-width="150">
                  <FormItem label="服务项目名称">
                    <Input :maxlength="10"  v-model="proForm.name" :disabled="true" style="width: 200px"/>
                  </FormItem>
                  <FormItem label="人工费不低于">
                    <template>
                      <Input  v-model="proForm.serviceFee" style="width: 200px"/>
                    </template>
                  </FormItem>
                  <FormItem label="是否收取上门费">
                    <Select v-model="proForm.hasDtdServiceFee" style="width: 200px">
                      <Option value="Y">收取</Option>
                      <Option value="N">不收取</Option>
                    </Select>
                  </FormItem>
                  <template v-if="proForm.hasDtdServiceFee==='Y'">
                    <FormItem label="上门费金额">
                      <template>
                        <Input v-model="proForm.dtdServiceFee" style="width: 200px"/>
                      </template>
                    </FormItem>
                    <FormItem label="是否需先支付上门费">
                      <Select  v-model="proForm.isPrepayDtd" style="width: 200px">
                        <Option value="Y">是</Option>
                        <Option value="N">否</Option>
                      </Select>
                    </FormItem>
                  </template>
                  <FormItem label="服务备注">
                    <Input  type="textarea" v-model="proForm.description" style="width: 200px"/>
                  </FormItem>
                  <FormItem>
                    <Button  @click="saveProForm" :loading="btnLoading" type="primary">保存</Button>
                  </FormItem>
                </Form>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
</template>

<script>
    export default {
        name: "set-sevice",
      data(){
          return{
            treeLoading:true, //树加载的按钮
            saveLoading:false, //保存按钮
            btnLoading:false,
            typeLists:[],
            treeLists:[],
            currentNodeType:'', // first-一级节点，sub-二级节点
            currentNode:{},//当前节点
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
            typeRule:{ //父节点的校验规则
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
                      data.parentId == '0'?_this.currentNodeType = 'first':_this.currentNodeType = 'sub';
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
        // 获取节点详情
        getDetail(id){
          this.$http.get(`/yyht/v1/repair/region/getRepairCategoryRegionRef?repairRegionId=${this.$route.query.id}&repairCategoryId=${id}`).then(res=>{
            if(res.data.code===0){
                this.proForm= res.data.data;
                this.loading = false
            }
          })
        },
        getTreeLists(){  //树结构
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
        // 新增节点（接口调用）
        addNodeAPI(params){
          this.$http.post(`/yyht/v1/repair/region/setRepairCategoryRegionRef`,{...params}).then(res=>{
            if(res.data.code===0){
              this.$Message.success('保存成功');
              this.cancelForm();
              this.getTreeLists();
              this.currentNodeType ='first'
            }else{
              this.$Message.error(res.data.msg)
            }
            this.btnLoading = false;
            this.saveLoading = false;
          })
        },
        // 获取一级分类
        getTypeList(){
          this.$http.get(`/yyht/v1/repair/category/select/first`).then(res=>{
            if(res.data.code===0){
              this.typeLists = res.data.data;
            }
          })
        },
        // 保存项目
        saveProForm(){
          this.btnLoading = true;
          if(this.proForm.hasDtdServiceFee == 'N'){
            this.proForm.dtdServiceFee = 0;
            this.proForm.isPrepayDtd = 'N'
          }
          let params = {
            "id":this.proForm.id,
            "repairRegionId":this.$route.query.id,
            "repairCategoryId":this.currentNode.id,
            "name":this.proForm.name,
            "parentId":this.currentNode.parentId,
            "serviceFee":this.proForm.serviceFee,
            "hasDtdServiceFee":this.proForm.hasDtdServiceFee,
            "dtdServiceFee":this.proForm.dtdServiceFee,
            "isPrepayDtd":this.proForm.isPrepayDtd,
            "description":this.proForm.description
          };
          this.addNodeAPI(params)
        },
      },
      mounted() {
          this.getTreeLists();
      }
    }
</script>

<style scoped>
  .title-btn{
    margin-bottom: 8px;
  }
</style>
