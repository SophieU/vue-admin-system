<template>
    <Card>
      <Table class="mt-15" :columns="columns" :data="orderLists"></Table>
      <div class="pagination ">
        <Page :current.sync="pageNo" :page-size="pageSize" :total="totalCount"
              @on-change="(page)=>getLists('page',page)"
              @on-page-size-change="(size)=>getLists('size',size)"
        ></Page>
      </div>
      <Modal title="分配服务商" v-model="distributeModal" width="600" @on-visible-change="visibleChange">
        <div>
          <RadioGroup class="radio-group" v-model="stationId">
            <table class="native-table">
              <thead>
              <tr>
                <th>服务商名称</th>
                <th>服务商地址</th>
                <th>联系电话</th>
                <th>状态</th>
                <th>操作</th>
              </tr>
              </thead>
              <tbody>
                <tr v-for="(station,index) in stationLists" :key="index" :class="['禁用网点','禁止接工单'].indexOf(station.state)>-1?'disabledTr':''">
                  <td>{{station.name}}</td>
                  <td>{{station.address}}</td>
                  <td>{{station.phone}}</td>
                  <td>{{station.state}}</td>
                  <td><Radio :disabled="['禁用网点','禁止接工单'].indexOf(station.state)>-1" :label="station.id"><span></span></Radio></td>
                </tr>
              </tbody>
              <tfoot v-if="stationLists.length<=0">
                 <tr>
                  <td class="tips" colspan="5">该区域暂未分配服务商</td>
                </tr>
              </tfoot>

            </table>
          </RadioGroup>
        </div>
        <div slot="footer">
          <Button @click="distributeModal=false">取消</Button>
          <Button @click="sureStaion" type="primary">提交</Button>
        </div>
      </Modal>
    </Card>
</template>

<script>
  import util from '../../libs/util'

    export default {
        name: "distribute-station",
      data(){
          return {
            distributeModal:false,
            resolveId:'',
            stationId:'',
            stationLists:[],
            columns:[
              {title:'创建日期',key:'createTime',align:'center'},
              {title:'客户手机',key:'userPhone',align:'center'},
              {title:'客户姓名',key:'username',align:'center'},
              {title:'服务项目',key:'categoryName',align:'center'},
              {title:'报修区域',key:'regionName',align:'center'},
              {title:' 报修地址\n',key:'address',align:'center'},
              {title:'工单编号',key:'orderSn',align:'center'},
              {title:'操作',fixed:'right',align:'center',render:(h,params)=>{
                  let _this = this;
                  return h('div',[
                    h('Button',{
                      props:{
                        type:'success',
                        size:'small'
                      },
                      on:{
                        click:()=>{
                          let id = params.row.id;
                          //获取可用列表
                          _this.getStationLists(id);
                        }
                      }
                    },'分派工单'),
                  ])
                }},
            ],
            orderLists:[ ],
            pageNo:1,
            pageSize:10,
            totalCount:0,
          }
      },
      methods:{
        visibleChange(show){
          if(!show){
            this.stationId='';
            this.resolveId='';
          }
        },
        sureStaion(){
          let id = this.resolveId;
          let stationId = this.stationId;
          if(!stationId){
            this.$Message.info('请选择网点');
            return false;
          }
          let param = {
            orderId:id,
            stationId:stationId,
          };
          param = util.formatterParams(param);
          this.$http.post(`/manual/repair/order/dispatch?${param}`).then(res=>{
              if(res.data.code===0){
                this.$Message.success('派发成功');
                this.getLists('page',1);
              }else{
                this.$Message.error(res.data.msg);
              }
              this.distributeModal=false;
            })
        },
        //获取网点可用列表
        getStationLists(id){
          this.$http.get(`/manual/repair/order/station/list?id=${id}`)
            .then(res=>{
              if(res.data.code===0){
                this.stationLists = res.data.data;
                this.resolveId = id;
                this.distributeModal=true;
              }else{
                this.$Message.info(res.data.msg);
              }
            })
        },
        //工单列表
        getLists(pageType,num){
          if(pageType==='page'){
            this.pageNo=num;
          }else if(pageType==='size'){
            this.pageNo=1;
            this.pageSize=num;
          }
          let params = {
            pageNo:this.pageNo,
            pageSize:this.pageSize,
          };
          params = util.formatterParams(params);
          this.$http.get(`/manual/repair/order/list?${params}`)
            .then(res=>{
              if(res.data.code===0){
                let data = res.data.data;
                this.totalCount = data.totalCount;
                this.orderLists = data.list;
              }else{
                this.$Message.error(res.data.msg)
              }
            })

        }
      },
      mounted(){
        this.getLists('page',1);
      }
    }
</script>

<style scoped lang="scss">
  .radio-group{
    width: 100%;
  }
  .disabledTr{
    color: #ccc;
  }
</style>
