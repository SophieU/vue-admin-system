<style scoped lang="scss">
  @import './service.scss';

</style>
<template>
    <Card class="area-setting">
      <Row :gutter="30">
        <Col span="12">
          <Card>
            <p slot="title">区域列表</p>
            <Button @click="addArea" slot="extra" type="primary" style="margin-top: -5px;">添加区域</Button>
            <ul class="area-lists">
              <li @click="editThis(ind)" :class="editInd===ind?'active':''" :title="area.name" v-for="(area,ind) in areaLists">{{area.name}}</li>
            </ul>
          </Card>
        </Col>
        <Col span="12">
          <Card >
            <p slot="title">区域信息</p>
            <Button @click="deleteArea" slot="extra" type="error" style="margin-top:-5px;">删除该区域</Button>
            <div>
              <i-form :label-width="100">
                <form-item label="区域名称">
                  <Input @on-keydown="noSpace" :clearable="true" type="text" :maxlength="32" style="width: 300px;" v-model="areaName"/>
                </form-item>
                <div class="inner-center">
                  <Button :loading="loadingSave" @click="saveThis" class="lang-btn" type="primary" >保存</Button>
                </div>
              </i-form>
            </div>
          </Card>
          <Card class="mt-15" >
            <p slot="title">已支持的服务商</p>
            <div>
              <Table :columns="stationColumn" :data="stationLists"></Table>
            </div>
          </Card>
        </Col>
      </Row>
    </Card>
</template>

<script>
    export default {
        name: "area-admin",
        data(){
          return {
            areaLists:[],
            editInd:'',
            areaName:'',
            editId:'', //编辑的Id
            radioCheck:'',
            loadingSave:false,
            stationColumn:[
              {title:'服务商名称',key:'name',align:'center'},
              {title:'网点地址',key:'address',align:'center'},
              {title:'联系电话',key:'phone',align:'center'},
            ],
            stationLists:[]
          }
        },
      methods:{
        noSpace(event){
          let code = event.code;
          if(code==="Space"){
            event.preventDefault();
            return false;
          }
        },
          getAreaLists(){
            this.$http.get('/repair/region/list')
              .then(res=>{
                let data = res.data;
                if(data.code===0){
                  this.areaLists=data.data;
                }
                //首次设置默认
                if(this.editInd===''&&this.areaLists.length>0){
                  this.editInd=0;
                }
              })
          },
          editThis(ind){
            this.editInd=ind;
            // this.editId=this.areaLists[ind].id;
            // this.areaName=this.areaLists[ind].name;
          },
        //保存设置
          saveThis(){
              let name = this.areaName;
              let id = this.editId;
              let apiUrl='';
              let paramStr='';
              let control='edit';
              if(!name){
                this.$Message.info('请设置区域名');
                return ;
              }
              //修改
              if(name.length>0&&id.length>0){
                apiUrl='/repair/region/edit';
                paramStr=`name=${name}&id=${id}`;
              }else if(name.length>0&&!id.length){
                //新增
                apiUrl='/repair/region/add';
                paramStr=`name=${name}`;
                control='add';
              }
              this.loadingSave=true;
              this.$http.post(`${apiUrl}?${paramStr}`)
                .then(res=>{
                  let data = res.data;
                  if(data.code===0){
                    this.$Message.success('保存成功');
                    this.getAreaLists();
                  }else{
                    this.$Message.error(`保存失败,${data.msg}`);
                  }
                  this.loadingSave=false;
                })
          },
        //添加区域
        addArea(){
            if(this.areaLists[this.areaLists.length-1].name==='新建小区'){
              this.$Message.info('请修改新建小区的默认名称');
            }else{
              this.areaLists.push({name:'新建小区',id:''});
              this.editInd=this.areaLists.length-1;
              this.areaName='新建小区';
              this.editId='';
            }
            //新增置空服务网点
            this.stationLists=[];
        },
        deleteArea(){
            let id = this.editId;
            let len = this.areaLists.length;
            let editIndex = this.editInd;
            if(!id){
              this.areaLists.splice(len-1,1);
            }else{
              this.$http.delete(`/repair/region/delete?id=${id}`)
                .then(res=>{
                  let data = res.data;
                  if(data.code===0){
                    this.$Message.success('删除成功');
                    this.editInd = 0;
                    this.getAreaLists();
                  }else{
                    this.$Message.error(`删除失败，${data.msg}`)
                  }
                })
            }
            if(editIndex===this.areaLists.length){
              this.editInd=this.areaLists.length-1;
            }

        },
        getAreaStations(areaId){
          this.$http.get(`/repair/region/support/station/list?regionId=${areaId}`)
            .then(res=>{
              if(res.data.code===0){
                this.stationLists=res.data.data;
              }else{
                this.$Message.error(res.data.msg);
              }
            })
        }
      },
      mounted(){
          this.getAreaLists();
      },
      watch:{
          editInd(newVal,oldVal){
            this.areaName = this.areaLists[newVal].name;
            this.editId = this.areaLists[newVal].id;
            this.getAreaStations(this.editId);
            console.log(newVal)
          }
      }
    }
</script>

