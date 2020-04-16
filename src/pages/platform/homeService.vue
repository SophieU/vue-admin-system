<template>
  <div>
    <Card>
      <div class="clearfix mb-15">
        <div class="pull-right">
          <Button icon="md-add" type="primary" @click="showModalHandle('add')">新增栏目</Button>
        </div>
      </div>
      <Spin fix v-show="loading == true">加载中...</Spin>
<!--      :draggable="true"-->
      <Table :columns="columns" :data="lists"></Table>
    </Card>
    <Modal v-model="showModal" title="新增栏目">
      <Form :label-width="100" :model="modalForm"  :rules="rules" ref="showModalRef">
        <FormItem label="栏目名称" prop="typeName">
          <Input v-model="modalForm.typeName" :maxlength="5"/>
          <p class="tips">（最多5个字）</p>
        </FormItem>
        <FormItem label="栏目描述">
          <Input type="textarea" v-model="modalForm.typeDes" />
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="cancelModal('showModalRef')">取消</Button>
        <Button type="primary" :loading="saveLoading" @click="saveModalForm('showModalRef')">保存</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import util from '../../libs/util'
import _ from 'lodash'
  export default {
    name: "functionSet",
    data(){
      return{
        saveLoading:false,
        loading:true,
        showModal:false,
        modalTitle:'新增栏目',
        columns:[
          {title:'栏目名称',key:'typeName'},
          {title:'服务数量',key:'serviceNum'},
          {title:'服务说明',key:'typeDes'},
          {title:'发布日期',key:'createTime'},
          {title:'操作',key:'',render:(h,params)=>{
              let _this = this;
              return h('div',[
                h('Button',{
                  props:{
                    type:'primary',
                    size:'small'
                  },
                  style:{
                    marginRight:'10px'
                  },
                  on:{
                    click:()=>{
                      _this.showModalHandle('edit',params.row.id)
                    }
                  }
                },'编辑'),
                h('Button',{
                  props:{
                    type:'error',
                    size:'small'
                  },
                  on:{
                    click:()=>{
                       _this.$store.commit('setDeleteModal',{model:true,callback:()=>{
                          _this.deleteSingle(params.row.id);
                        }})
                    }
                  }
                },'删除'),
              ])
            }},
        ],
        lists:[ ],
        modalForm:{
          typeName:'',
          typeDes:'',
        },
        rules:{
          typeName:[{required:true,message:'请输入栏目名称',trigger:'blur'}]
        }
      }
    },
    methods:{
      // 拖拽排序
      // dragSort(index1,index2){
      //   let param = [{id:this.lists[index1].id},{id:this.lists[index2].id}]
      //   this.$http.post(`/yyht/v1/service/type/updateServiceTypeSort`,param).then(res=>{
      //     if(res.data.code===0){
      //       this.$Message.success('排序成功')
      //       let lists = _.cloneDeep(this.lists)
      //       let temp = _.cloneDeep(lists[index1])
      //       lists[index1] = lists[index2]
      //       lists[index2] = temp
      //       this.lists = lists;
      //     }else{
      //       this.$Message.warning('排序失败')
      //     }
      //   })
      // },
      showModalHandle(type,id){
        if(type==='add'){
          this.showModal=true;
          this.modalTitle='新增栏目'
        }else{
          this.searchById(id)
        }
      },
      searchById(id){
        this.$http.get(`/yyht/v1/service/type/getServiceTypeById?id=${id}`)
        .then(res=>{
          if(res.data.code===0){
            this.modalTitle='编辑栏目'
            this.modalForm=res.data.data
            this.showModal=true
          }
        })
      },
      cancelModal(name){
        this.showModal=false;
        this.modalForm={
          typeName:'',
          typeDes: '',
        };
        this.$refs[name].resetFields()
        this.saveLoading = false;
      },
      deleteSingle(id){ //根据ID删除单条信息
        this.$http.post(`/yyht/v1/service/type/delete?id=${id}`).then(res=>{
          if(res.data.code == 0){
             this.$Message.success('删除成功');
             this.getCol();
          }else{
            this.$Message.warning(res.data.msg)
          }
          this.$store.commit('setDeleteModal',{model:false})
        })
      },
      getCol(){ //获取首页服务一进页面的数据
          this.loading = true;
          this.$http.get(`/yyht/v1/service/type/getAllServiceType`).then(res=>{
            if(res.data.code == 0){
              this.lists = res.data.data;
              this.loading = false;
            }else{
              this.$Message.warning(res.data.msg)
            }
          })
      },
      saveModalForm(name){
        this.saveLoading = true;
        this.$refs[name].validate((valid) => {
          if (valid) {
            let params = this.modalForm;
            this.$http.post(`/yyht/v1/service/type/saveOrUpdate`,params).then(res=>{
              if(res.data.code===0){
                this.$Message.success('保存成功');
                this.getCol()
              }else{
                this.$Message.warning('保存失败')
                this.saveLoading = false;
              }
              this.cancelModal('showModalRef')
            })
          } else {
            this.$Message.error('表单填写错误！');
            this.saveLoading = false;
          }
        })
      }
    },
    mounted(){
     this.getCol()
    }
  }
</script>

<style scoped>

</style>


