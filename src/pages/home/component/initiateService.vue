<style scoped lang="scss">
  @import './home-components.scss';
  .search-td{
    white-space:normal;
    text-align:left;
    padding: 4px 10px;
  }
</style>
<template>
  <div>
    <Modal
      :mask-closable="false"
      v-model="activeModal"
      title="发起售后"
      width="650"
      @on-visible-change="modalChange"
    >
      <div class="create_service">
        <Form :model="newService" inline :label-width="80">
          <FormItem label="服务区域">
            <Input v-model="newService.regionName"></Input>
          </FormItem>
          <FormItem label="工单编号">
            <Input v-model="newService.orderSn"/>
          </FormItem>
          <FormItem label="师傅名称">
            <Input v-model="newService.serverName"></Input>
          </FormItem>
          <FormItem label="联系手机">
            <Input v-model="newService.userPhone"></Input>
          </FormItem>
          <FormItem label="服务分类">
            <Select :clearable="true"  @on-change="firstTypeChange" >
              <Option v-for="item in repairLists" :key="item.id" :value="item.id">{{item.name}}</Option>
            </Select>
          </FormItem>
          <FormItem label="服务项目">
            <Select :clearable="true" v-model="newService.repairCategoryId" style="width:162px;">
              <Option v-for="item in repairLists" :key="item.id" :value="item.id">{{item.name}}</Option>
            </Select>
          </FormItem>
          <Button type="primary" style="margin-left: 20px;" @click="searchOrder">搜索</Button>
        </Form>
        <div class="table-wrapper">
          <Table size="small" :columns="orderColumn" :data="orderLists"></Table>
          <div  v-if="orderLists.length>0" class="pagination">
            <Page :current.sync="pageNo" :page-size="5" :total="totalCount" @on-change="pageChange"></Page>
          </div>
        </div>
      </div>
      <div slot="footer">
        <Button @click="activeModal=false">关闭</Button>
      </div>

    </Modal>
  </div>

</template>

<script>
  import util from '../../../libs/util'
    export default {
        name: "createOrder",
      props:{
        initiateService:Boolean
      },
      data(){
          return{
            newService: {
              regionName:'',
              repairCategoryId:'',
              orderSn:'',
              userPhone:'',
              serverName:'',
              searchType:2
            },
            orderIdSearch:false,
            repairLists:[],
            repairListsSecond:[],
            totalCount:0,
            pageNo:1,
            pageSize:5,
            orderLists:[],
            orderColumn:[
              {title:'工单详情',align:'left',render:(h,param)=>{
                  let row = param.row;
                  let string = `工单${row.orderSn}，
                ${row.regionName}，
                ${row.stationName}，
                ${row.repairCategoryName}，
                ${row.userPhone}，
                ${row.orderState}，
                ${row.isInWarrantyPeriod==='-'?'':'质保中，'}
                ${row.orderAmount>0?'￥'+row.orderAmount+'，':''}
                ${row.materialNames?'辅材使用：'+row.materialNames:''}`
                  return h('span',string)
                }},
              {title:'操作',align:'center',width:80,render:(h,param)=>{
                  let _this = this;
                  return  h('Button',{
                    props:{
                      type:'primary',
                      size:'small'
                    },
                    on:{
                      click:()=>{
                        let id = param.row.id;
                        let state=param.row.orderState;
                        let isWarranty = param.row.isInWarrantyPeriod;
                        _this.$router.push({name:'orderControl',query:{id:id,state:state,isWarranty:isWarranty}})
                      }
                    }
                  },'查看')
                }}
            ]
          }
      },
      computed:{
          activeModal:{
            get:function(){
              return this.initiateService;
            },
            set:function(newValue){
              this.$emit('close','initiateService');
            }
          }
      },
      methods:{
        firstTypeChange(id){
          util.getRepairTypeNext(id,data=>{
            this.repairListsSecond = data;
          })
        },

        //点击搜索
        searchOrder(page) {
          let pageNo = page.pageNo?page.pageNo:1;
          let newService = util.formatterParams(this.newService);
          let query = `pageNo=${pageNo}&pageSize=${this.pageSize}`;
          this.$http.post(`/index/search/order?${query}&${newService}`)
            .then(res => {
              if (res.data.code === 0) {
                let data = res.data.data;
                this.totalCount = data.totalCount;
                this.orderLists = data.list;
                this.pageNo = data.pageNo;
              }
            })
        },
        pageChange(val){
          this.pageNo=val;
          this.searchOrder({pageNo:val});
        },
        modalChange(visible){
          if(!visible){
            this.newService= {
              regionName:'',
              repairCategoryId:'',
              orderSn:'',
              userPhone:'',
              searchType:1,
              pageNo:1,
            };
            this.orderLists=[]
          }
        }
      },
      mounted(){
        util.getRepairTypeDropdown(data=>{
          this.repairLists = data;
        })
      }
    }
</script>


