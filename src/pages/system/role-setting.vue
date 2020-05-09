<template>
  <div class="role-setting">
    <Spin fix v-show="loading == true">加载中...</Spin>
    <Card style="padding-bottom: 30px;">
      <div class="clearfix mb-15">
        <div class="pull-left">
          <Button type="primary" @click="goback()">返回上一页</Button>
        </div>
        <div class="pull-right">
          <Button @click="goback" v-if="!viewInfo">取消</Button>
          <Button type="primary" v-if="viewInfo" @click="viewInfo=false">编辑</Button>
          <Button :loading="loadingSend" v-if="!viewInfo" type="primary" @click="saveThis">保存</Button>
        </div>
      </div>
      <div class="role-panel">
        <Form ref="roleInfo" :model="roleInfo" label-position="top" :rules="roleInfoRule">
          <Row :gutter="40">
            <Col span="12">
              <h4>基础信息</h4>
                <FormItem label="角色名称" prop="name">
                  <Input :disabled="viewInfo" v-model="roleInfo.name"/>
                </FormItem>
                <FormItem label="角色描述" prop="description">
                  <Input :maxlength="150" placeholder="最多150字" :disabled="viewInfo" v-model="roleInfo.description" type="textarea" :rows="10"/>
                </FormItem>
            </Col>
            <Col span="12">
              <h4>功能权限</h4>
              <Tree class="role-tree" ref="authTree" :data="authLists" show-checkbox multiple @on-check-change="checkNodes"></Tree>
            </Col>
          </Row>
        </Form>
      </div>
    </Card>
  </div>
</template>

<script>
    export default {
        name: "role-control",
      data(){
        return {
          loadingSend:false,
          type:1, //页面操作类型—— 1:新建，0：编辑，2：查看
          id:'',
          loading:true,
          viewInfo:false, //查看/编辑 状态
          roleInfo:{
            name:'',
            description:'',
            menuIds:'',
            id:'',
            callCenterId:'',
          },
          authLists:[],
          authListsCheck:[],
          roleInfoRule:{
            name:[{required:true,message:'请输入角色名称',trigger:'blur'}],
            description:[{required:true,message:'请输入角色描述',trigger:'blur'}],
          }
        }
      },
      methods:{
          checkNodes(arr){
            this.authListsCheck=arr.map(item=>{
              return item.id;
            })
          },
        goback(){
          this.$router.back();
        },
        // 待查看接口返回数据
        getRoleInfo(id){
          this.$http.get(`/sys/v1/role/info?id=${id}`)
            .then(res=>{
              if(res.data.code===0){
                this.roleInfo=res.data.data;
                this.authListsCheck=res.data.data.menuIds;
                this.getAuth();
              }else{
                console.log(res.data.msg)
              }
            })
        },
        saveThis(){
          this.loadingSend=true;
          let url='';
          let params=this.roleInfo;
          url='/sys/v1/role/defend';
          this.$refs['roleInfo'].validate(valid=>{
            if(valid){
              let data = {
                name:params.name,
                description:params.description,
                menuIds:this.authListsCheck,
                roleId:params.id,
                roleId:this.$route.query.id
              };
              if(this.$route.query.type == 1){delete data.id}
              this.$http.post(url,data).then(res=>{
                if(res.data.code===0){
                  this.$Message.success('保存成功');
                  this.$router.push({name:'role'});
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
        //获取所有资源列表
        getAuth(){
          this.$http.get(`/sys/v1/role/findAllMenuTree`)
            .then(res=>{
              if(res.data.code===0){
                let data = res.data.data;
                let checkedLists = this.authListsCheck;
                let transformRes = {};
                let _this = this;
               if(checkedLists.length>0){
                 transformRes = this.iteratorTree(data,function(item){
                   item.title=item.title;
                   item.expand=true;
                   item.disabled=_this.viewInfo;
                   checkedLists.forEach(check=>{
                     if(item.id===check){
                       item.checked=true;
                     }
                   })
                 })
               }else{
                 transformRes = this.iteratorTree(data,function(item){
                   item.title=item.title;
                   item.expand=true;
                   item.disabled=_this.viewInfo;
                   // item.selected=true;
                 });
               }
                  this.authLists=transformRes;
                  this.loading = false;
              }else{
                console.log(res.data.msg);
              }
            })
        },
        //深度遍历
        iteratorTree(obj,cb){
          let result = [];
          let _this = this;
            if(obj instanceof Array){
             result= obj.map(item=>{
                typeof cb==='function'&&cb(item);
                item.disabled=_this.viewInfo;
                if(item.children&&item.children.length>0){
                  this.iteratorTree(item.children,cb)
                }
                return item;
              })
            }
          return result;
        }
      },
      mounted(){
          /*
          type:角色类型  1:新建，0：编辑，2：查看
          * */
          this.type = this.$route.query.type;
          this.id = this.$route.query.id;
          if(this.type*1===0){
            this.getRoleInfo(this.id);
          }else if(this.type*1===2){
            this.viewInfo=true;
            this.getRoleInfo(this.id);
          }else{
            this.getAuth();
          }

      },
      watch:{
        viewInfo(val){
          this.getAuth();
        },
      }
    }
</script>

<style scoped lang="scss">
  h4{
    margin-bottom: 20px;
    margin-top: 20px;
  }
  .role-panel{
    position: relative;
    .footer-right{
      position: absolute;
      bottom: 15px;
      right: 50%;
      transform: translateX(335%);
    }
    .auth-lists{
      dt{
        color: #000;
        font-size: 16px;
      }
      dd{
        padding-left: 20px;
        font-size: 15px;
      }
      li{
        display: inline-block;
      }
      /*margin-bottom: 50px;*/
    }
    .third-auth{
      .auth-lists{
        padding-left: 20px;
      }
    }
  }

  .role-tree{
    display: flex;
    flex-wrap: wrap;
  }

</style>
