<style scoped lang="scss">
  @import "./system.scss";
</style>

<template>
    <div>
      <Card>
        <div>
          <div class="clearfix mb-15">
            <div class="pull-left">
              <Button icon="md-add" @click="newFaultModal">新建</Button>
              <Button icon="ios-funnel" @click="filter=true" >筛选</Button>
            </div>
            <div class="pull-right">
              <Button @click="download">excel导入模板下载</Button>
              <div class="inline-block">
                <Upload :action="uploadUrl"
                        :with-credentials="true"
                        :on-success="uploadSuccess"
                        :before-upload="uploading"
                        :show-upload-list="false"
                >
                  <Button icon="ios-cloud-upload-outline">excel导入</Button>
                </Upload>
              </div>
            </div>
          </div>
          <div class="table-wrapper">
            <Table :data="lists" :columns="tableColumn" ></Table>
          </div>
        </div>
      </Card>
      <!--报修弹窗-->
      <Modal v-model="faultModal"
             :mask-closable="false"
             :title="modalTitle+'故障原因管理'"
             @on-visible-change="modalHide"
      >
        <div  class="modal_wrap_form">
          <Form ref="typeForm" :model="typeForm" :rules="typeFormRule" label-position="top">
            <FormItem class="must" label="服务类型">
              <Select v-model="typeForm.repairCategoryParentId" @on-change="(id)=>firstTypeChange(id,'modal')">
                <Option v-for="item in repairTypeFirst" :key="item.id" :value="item.id">{{item.name}}</Option>
              </Select>
            </FormItem>
            <FormItem label="服务项目" prop="repairCategoryId">
              <Select v-model="typeForm.repairCategoryId">
                <Option v-for="repair in repairLists" :key="repair.id" :value="repair.id">{{repair.name}}</Option>
              </Select>
            </FormItem>
            <FormItem label="故障名称" prop="name">
              <Input v-model="typeForm.name"/>
            </FormItem>
          </Form>
        </div>
        <div slot="footer">
          <Button @click="faultModal=false">取消</Button>
          <Button :loading="loadingSend" @click="saveFaultType" type="primary">{{modalTitle==='新增'?'添加':'保存'}}</Button>
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
        <Form :model="faultFilter" >
          <FormItem label="服务分类">
            <Select v-model="faultFilter.repairCategoryParentId" @on-change="(id)=>firstTypeChange(id,'filter')">
              <Option v-for="item in repairTypeFirst" :key="item.id" :value="item.id">{{item.name}}</Option>
            </Select>
          </FormItem>
          <FormItem label="服务项目">
            <Select v-model="faultFilter.repairCategoryId">
              <Option v-for="repair in repairFilterLists" :key="repair.id" :value="repair.id">{{repair.name}}</Option>
            </Select>
          </FormItem>

          <FormItem label="故障名称">
            <Input v-model="faultFilter.name" />
          </FormItem>
        </Form>

      </Drawer>
    </div>
</template>

<script>
  import util from '../../libs/util';
  import _ from 'lodash'
    export default {
        name: "fault-type",
      computed:{
        uploadUrl:function(){
          let baseUrl=this.$http.defaults.baseURL;
          let url = baseUrl+'/fault/reason/import';
          return url;
        }
      },
      data(){
          return {
            loadingSend:false,
            uploadingModal:false,
            uploadPercent:0, // 上传进度百分比
            modalTitle:'新建', //1：新建，0：编辑
            faultModal:false,
            filter:false, //筛选
            tableColumn:[
              {
                title:'故障名称',
                key:'name',
                align:'center'
              },
              {
                title:'服务项目',
                key:'repairCategoryName',
                align:'center'
              },
              {
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
                          _this.getInfo(id);

                        }
                      }
                    },'编辑'),
                    h('Button',{
                      props:{
                        type:'error',
                        size:'small'
                      },
                      on:{
                        click(){
                         let id = params.row.id;
                          _this.$store.commit('setDeleteModal',{model:true,callback:function(){
                              _this.deleteType(id);
                            }});

                        }
                      }
                    },'删除'),

                  ])
                }
              },
            ],
            lists:[],
            repairLists:[], //报修分类二级，用于弹窗下拉选项
            repairFilterLists:[],//报修分类二级，用于筛选下拉选项
            typeForm:{
              id:'',
              repairCategoryId:'',
              name:'',
              repairCategoryParentId:'', //一级菜单Id
            },
            typeFormRule:{
              name:[{required:true,message:'请输入故障名称',trigger:'blur'}],
              repairCategoryId:[{required:true,message:'请选择报修分类',trigger: 'change'}],
            },
            faultFilter:{
              name:'',
              repairCategoryId:'',
              repairCategoryParentId:'',
            },
            repairTypeFirst:[], //报修分类一级
          }
      },
      methods:{
          // 新增二级下拉
        /*
        * @params {string} id  父级id
        * @params {string} fromType  二级获取类型（modal/draw)
        * @params {boolean} isInitData   是否用于初始数据
        * */
        firstTypeChange(id,fromType,isInitData){

          util.getRepairTypeNext(id,data=>{
            if(fromType==='modal'){
              this.repairLists = data;
              if(data.length<=0||!isInitData){
                this.typeForm.repairCategoryId='';
              }
            }else{
              this.repairFilterLists = data;
            }
          })
        },
        newFaultModal(){
          this.faultModal=true;
          this.modalTitle='新增';
        },
        //获取列表
        getLists(filter){
          let params = '';
          if(filter){
            params=util.formatterParams(filter);
          }
          this.$http.get(`/fault/reason/list?${params}`)
            .then(res=>{
              if(res.data.code===0){
                this.lists=res.data.data;
              }else{
                console.log(res.data.msg);
              }
              this.filter=false;
            })

        },
        //获取单个信息
        getInfo(id){
            this.$http.get(`/fault/reason/info?id=${id}`)
              .then(res=>{
                if(res.data.code===0){
                  this.typeForm=res.data.data;
                  // 手动更新二级菜单
                  this.firstTypeChange(this.typeForm.repairCategoryParentId,'modal',true);
                  this.modalTitle='编辑';
                  this.faultModal=true;
                }else{
                  this.$Message.error(res.data.msg);
                }
              })
        },
        //下载
        download(){
           this.$http.get(`/fault/reason/import/template`,{responseType:'blob'})
             .then(res=>{
               util.downloadExcel(res)
             })
        },
        uploadSuccess(res,file,fileLists){
          setTimeout(()=>{
            if(res.code===0){
              this.$Message.success('上传成功');
            }else{
              this.$Message.error(res.msg);
            }
            this.$store.commit('setUploadProgress',false);
            this.$store.commit('setUploadPercent',100);
            this.getLists();
          },1000)
        },
        uploading(){
          this.$store.commit('setUploadProgress',true);
          this.$store.commit('setUploadPercent',0);
        },
        //保存
        saveFaultType(){
          this.loadingSend=true;
          this.$refs['typeForm'].validate(valid=>{
            if(valid){
              let url='';
              let typeForm = _.cloneDeep(this.typeForm);
              delete typeForm.repairCategoryParentId;
              if(typeForm.id.length<=0){
                url='/fault/reason/add';
              }else{
                url='/fault/reason/edit';
              }
              this.$http.post(url,{
                ...typeForm
              }).then(res=>{
                  if(res.data.code===0){
                    this.$Message.success('保存成功');
                    this.faultModal=false;
                    this.getLists();
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
        deleteType(id){
          this.$http.delete(`/fault/reason/delete?id=${id}`)
            .then(res=>{
              if(res.data.code===0){
                this.$Message.info('删除成功');
                this.$store.commit('setDeleteModal',{model:false});
                this.getLists();
              }else{
                this.$Message.error('删除失败')
                _this.$store.commit('setDeleteModal',{model:false});
              }
            })
        },
        modalHide(value){
          if(!value){
            this.typeForm={
              id:'',
              repairCategoryId:'',
              name:'',
            };
            this.$refs['typeForm'].resetFields();
          }
        },
        //清空筛选
        clearFilter(){
          this.faultFilter={
            name:'',
            repairCategoryId:'',
            repairCategoryParentId:'',
          };
          this.getLists();
        },
        // 筛选搜索名称
        filterData(){
          let data = {...this.faultFilter};
          this.getLists(data);
        },
      },
      mounted(){
          this.getLists();
          util.getRepairTypeDropdown(data=>{
            this.repairTypeFirst = data;
          })
      }
    }
</script>

