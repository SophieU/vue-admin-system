<template>
  <div>
    <Card>
      <Row :gutter="40">
        <Col class="column" span="11">
          <div class="column-header clearfix mb-15">
            <h3 class="pull-left">申述原因（上门前）</h3>
            <Button class="pull-right" type="primary" @click="addAppeal('before')">新增</Button>
          </div>
          <div class="column-body mt-15">
            <div class="appeal-item" v-for="(item,index) in before" :key="index">
              <Input class="appeal-input" v-model="item.statementName"  :maxlength="20" :disabled="editingId!==item.id&&!!item.id"/>
              <div class="btn-groups">
                <template v-if="item.id&&editingId!==item.id">
                  <Button  @click="editThis('before',index)">编辑</Button>
                  <Button type="error" @click="delThis('before',index)">删除</Button>
                </template>
               <template v-if="!item.id||editingId===item.id">
                 <Button @click="saveThis('before',index)" :loading="loading" type="success">保存</Button>
                 <Button @click="formateData(tempData)">取消</Button>
               </template>
              </div>
            </div>
          </div>
        </Col>
        <Col class="column" span="12">
          <div class="column-header clearfix mb-15">
            <h3 class="pull-left">申述原因（上门后）</h3>
            <Button class="pull-right" type="primary"  @click="addAppeal('after')">新增</Button>
          </div>
          <div class="column-body mt-15">
            <div class="appeal-item" v-for="(item,index) in after" :key="index">
              <Input class="appeal-input" v-model="item.statementName"  :maxlength="20" :disabled="editingId!==item.id&&!!item.id"/>
              <div class="btn-groups">
                <template v-if="item.id&&editingId!==item.id">
                  <Button  @click="editThis('after',index)">编辑</Button>
                  <Button type="error" @click="delThis('after',index)">删除</Button>
                </template>
                <template v-if="!item.id||editingId===item.id">
                  <Button @click="saveThis('after',index)" :loading="loading" type="success">保存</Button>
                  <Button @click="formateData(tempData)">取消</Button>
                </template>
              </div>
            </div>
          </div>
        </Col>
<!--        TODO这一版本暂时取消售后-->
<!--        <Col class="column" span="8">-->
<!--          <div class="column-header clearfix mb-15">-->
<!--            <h3 class="pull-left">申述原因（售后）</h3>-->
<!--            <Button class="pull-right" type="primary"  @click="addAppeal('afterSale')">新增</Button>-->
<!--          </div>-->
<!--          <div class="column-body mt-15">-->
<!--            <div class="appeal-item" v-for="(item,index) in afterSale" :key="index">-->
<!--              <Input class="appeal-input" v-model="item.statementName"  :maxlength="20" :disabled="editingId!==item.id&&!!item.id"/>-->
<!--              <div class="btn-groups">-->
<!--                <template v-if="item.id&&editingId!==item.id">-->
<!--                  <Button  @click="editThis('afterSale',index)">编辑</Button>-->
<!--                  <Button type="error" @click="delThis('afterSale',index)">删除</Button>-->
<!--                </template>-->
<!--                <template v-if="!item.id||editingId===item.id">-->
<!--                  <Button @click="saveThis('afterSale',index)" type="success">保存</Button>-->
<!--                  <Button @click="formateData(tempData)">取消</Button>-->
<!--                </template>-->
<!--              </div>-->
<!--            </div>-->
<!--          </div>-->
<!--        </Col>-->
      </Row>
    </Card>
  </div>
</template>

<script>
  import util from '../../libs/util';
    export default {
        name: "appeal",
      data(){
          return{
            loading:false,
            before:[],
            after:[],
            afterSale:[],
            editingId:'', //当前正在编辑
            editingType:'',
            tempData:[], //首次请求的全部数据
          }
      },
    watch:{
      editingItem:{
        handler(newVal){
          console.log(newVal)
        },
        deep:true
      }
    },
      methods:{
          editThis(type,index){
            if(this.editingId!==''){
              this.$Message.info('请先保存正在编辑的内容');
              return;
            }
            this.editingId= this[type][index].id;
          },
        addAppeal(type){
          if(!type) return;

          if(this.editingId!==''){
            this.$Message.info('请先保存正在编辑的内容');
            return;
          }
          let index=this[type].length+1;
          let item = {
            statementType:'',
            orderStateType:'',
            statementName:'',
            sortIndex:index
          };
          switch (type) {
            case 'before':
              item.statementType='ORDER';
              item.orderStateType='1';
              break;
            case 'after':
              item.statementType='ORDER';
              item.orderStateType='2';
              break;
            case 'afterSale':
              item.statementType='AFTER_SALE';
              // delete item.orderStateType;
              break;
          }
          this[type].push(item);
          this.editingId='new';
        },
        saveThis(type,index){
          this.loading = true;
          let val = this[type][index];
          let content =val.statementName;

          if(!type) return;
          if(this[type] instanceof Array){
            if(content.length<=0){
              this.$Message.info('请先填写申述原因再保存');
              return;
            }
            let reg = /^[A-Za-z0-9\u4e00-\u9fa5]+$/;
            if(!reg.test(content)){
              this.$Message.info('申述原因不能含有特殊字符以及空格');
              return;
            }
            //提交新原因
            this.editingId='';
            // let param = util.formatterParams(val);
            this.$http.post(`/yyht/v1/repair/statement/reason/addOrUpdate`,val)
              .then(res=>{
                if(res.data.code===0){
                  this.$Message.success('保存成功');
                  this.getLists();
                  this.loading = false;
                }else{
                  this.$Message.error(res.data.msg);
                }
              })
          }
        },
        delThis(type,index){
          if(!type) return;
          let id=this[type][index].id;
          this.$store.commit('setDeleteModal',{model:true,callback:function(){
              this.$http.post(`/yyht/v1/repair/statement/reason/delete?id=${id}`)
                .then(res=>{
                  if(res.data.code===0){
                    this.$Message.success('删除成功');
                    this.$store.commit('setDeleteModal',{model:false});
                    this.getLists();
                  }else{
                    this.$Message.error(res.data.msg);
                  }
                })
            }});
        },
        getLists(){
          this.$http.get(`/yyht/v1/repair/statement/reason/list`)
            .then(res=>{
              if(res.data.code===0){
                let data = res.data.data;
                this.tempData=data;
                this.formateData(data);
              }
            })
        },
        formateData(data){
          this.editingId='';
          let afterSale=[],before=[],after=[];
          data.forEach(item=>{
            if(item.statementType==='AFTER_SALE'){
              afterSale.push(item);
            }else if(item.statementType==='ORDER'&&item.orderStateType==="1"){
              before.push(item)
            }else if(item.statementType==='ORDER'&&item.orderStateType==="2"){
              after.push(item)
            }
          });
          this.afterSale=afterSale;
          this.before=before;
          this.after=after;
          this.editingId='';
        }
      },
      mounted(){
          this.getLists();
      }
    }
</script>

<style scoped lang="scss">
  .column{
    position: relative;
    margin: 20px 0;
    &:after{
      content: '';
      width:1px;
      border: 1px dashed #eee;
      position: absolute;
      top: 0;
      bottom:0;
      right: 0;
    }
    &:last-child{
      &:after{
        display: none;
      }
    }
  }

  .appeal-item{
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    .appeal-input{
      max-width:70%;
    }
  }

</style>
