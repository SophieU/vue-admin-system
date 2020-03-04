<template>
  <div>
    <Card>
      <div class="clearfix mb-15">
        <div class="pull-right">
          <Button icon="md-add" @click="$router.push({name:'mealInfo',query:{type:'new'}})">新建</Button>
          <Button icon="ios-funnel" @click="showFilter=true">筛选</Button>
        </div>
      </div>
      <div class="table-wrapper">
        <Table :data="lists" :columns="tableColumn" @on-sort-change="sortData"></Table>
        <div class="pagination">
          <Page show-elevator :total="totalCount" :current="pageNo" :page-size="pageSize"
                @on-change="(page)=>getLists('page',page)"
                @on-page-size-change="(size)=>getLists('size',size)"
          ></Page>
        </div>
      </div>
    </Card>
    <!--筛选-->
    <Drawer title="套餐筛选"  v-model="showFilter" width="460">
      <div class="filter-top mb-15 clearfix">
        <div class="pull-left">
          <Button @click="clearFilter" icon="md-close-circle">清空筛选条件</Button>
        </div>
        <div class="pull-right">
          <Button @click="filterData" type="primary">确定筛选</Button>
        </div>
      </div>
      <Form :model="mealForm" ref="mealForm">
        <FormItem label="套餐类型" >
          <Select v-model="mealForm.serviceType" style="width: 100%;">
            <Option value="NORMAL">固定金额</Option>
            <Option value="PRICE_CUSTOM">可变动金额</Option>
          </Select>
        </FormItem>
        <FormItem label="套餐名称">
          <Input v-model="mealForm.name" />
        </FormItem>
        <FormItem label="套餐价格">
          <br>
          <Row>
            <Col span="10"> <InputNumber style="width:100%" :precision="2" v-model="mealForm.minPrice"/></Col>
            <Col span="4"><div style="text-align: center">至</div></Col>
            <Col span="10" ><InputNumber style="width:100%" :precision="2" v-model="mealForm.maxPrice" /></Col>
          </Row>
        </FormItem>
        <FormItem label="销售数量">
          <br>
          <Row>
            <Col span="10"> <InputNumber style="width:100%" :precision="0" v-model="mealForm.minSaleNum"/></Col>
            <Col span="4"><div style="text-align: center">至</div></Col>
            <Col span="10"><InputNumber style="width:100%" :precision="0" v-model="mealForm.maxSaleNum" /></Col>
          </Row>
        </FormItem>
        <FormItem label="创建日期">
          <DatePicker type="daterange" v-model="mealForm.dateRange" style="width:100%" @on-change="formatDateRange"></DatePicker>
        </FormItem>
        <FormItem label="套餐状态">
          <Select v-model="mealForm.saleState">
            <Option value="">全部</Option>
            <Option value="1">在售</Option>
            <Option value="0">停售</Option>
          </Select>
        </FormItem>
      </Form>
    </Drawer>
  </div>
</template>

<script>
  /*
  * */
  import util from '../../libs/util';
    export default {
        name: "set-meal",
      data(){
          return {
            tableColumn:[
              {title:'套餐名称',key:'name',align:'center'},
              {title:'套餐类型',key:'serviceTypeName',align:'center'},
              {title:'自主下单',key:'isUserCanBuy',align:'center',render:(h,params)=>{
                    let text = params.row.isUserCanBuy==='Y'?'是':'否';
                return h('span',{},text)
                }},
              {title:'套餐价格（元）',key:'price',align:'center'},
              {title:'套餐售价（元）',key:'salePrice',align:'center'},
              {title:'有效期',key:'validMonth',align:'center'},
              {title:'是否一次性',key:'isSingleUse',align:'center'},
              {title:'销售提成',key:'saleCommission',align:'center',render:(h,params)=>{
                  let serviceType = params.row.serviceType;
                  let commission = params.row.saleCommission;
                  if(serviceType==='NORMAL'){
                    return h('span',commission);
                  }else if(serviceType==='PRICE_CUSTOM'){
                    return h('span',commission+'%');
                  }
                }},
              {title:'备注',key:'remark',align:'center'},
              {title:'状态',key:'saleState',align:'center',
                render:(h,params)=>{
                  let state=params.row.saleState==='1'?true:false;
                  let text,color;
                  if(state){
                    text='在售';
                    color='green';
                  }else{
                    text='停售';
                    color='red';
                  }
                  return h('span',{style:{color:color}},text);
                }
              },
              {title:'销售数',key:'saleNum',sortable: 'custom',align:'center',sortMethod:()=>{this.sortData} },
              {title:'创建时间',key:'createTime',sortable: 'custom',align:'center'},
              {title:'操作',width:150,align:'center',
                render:(h,params)=>{
                  let _this = this;
                  let status=params.row.saleState==='1';
                  let id = params.row.id;
                  let text='';
                  if(status){
                    text='暂停销售';
                  }else{
                    text='开启销售'
                  }
                  return h('div',[
                    h('Button',{
                      props:{
                        type:'primary',
                        size:'small',
                      },
                      style:{marginRight:'8px'},
                      on:{
                        click(){
                          _this.toggleState(id,!status)
                        }
                      }
                    },text),
                    h('Button',{
                      props:{
                        type:'primary',
                        size:'small'
                      },
                      on:{
                        click(){
                          _this.$router.push({name:'mealInfo',query:{type:'view',id:id}})
                        }
                      }
                    },'查看'),

                  ])
                }
              },
            ],
            lists:[],
            mealForm:{
              serviceType:'', //套餐类型
              name:'',
              minPrice:null,
              maxPrice:null,
              minSaleNum:null,
              maxSaleNum:null,
              minCreateTime:'',
              maxCreateTime:'',
              saleState:'',
              sortList:[]
            },
            showFilter:false,
            pageNo:1,
            pageSize:10,
            totalCount:100,
          }
      },
      mounted(){
        this.getLists();
      },
      methods:{
          //排序
        sortData(sortColumn){
          let key=sortColumn.key;
          let order=sortColumn.order;
          console.log(sortColumn)
          order=order.toUpperCase();
          if(order!=='NORMAL'){
            let sortFilter = {
              field:key,
              type:order
            };
            this.mealForm.sortList=[sortFilter];
          }

          this.getLists(null,null,this.mealForm);
        },
          getLists(changeType,num,filterData){
            let param;
            if(changeType==='page'){
              this.pageNo=num;
              param=`pageNo=${num}&pageSize=${this.pageSize}`
            }else if(changeType==='size'){
              this.pageSize=num;
              param=`pageNo=${this.pageNo}&pageSize=${num}`
            }else{
              param=`pageNo=${this.pageNo}&pageSize=${this.pageSize}`
            }
            let filterForm=this.mealForm;
            delete filterForm.dateRange;
            this.$http.post(`/discount/service/list?${param}`,{...filterForm})
              .then(res=>{
                if(res.data.code===0){
                  let data = res.data.data;
                  this.lists=data.list;
                  // this.pageNo=data.pageNo;
                  // this.pageSize=data.pageSize;
                  this.totalCount=data.totalCount;
                  this.showFilter=false;
                 }else{
                  this.$Message.error(res.data.msg);
                  // this.clearFilter();
                }
              }).catch(err=>{
                this.$Message.error('列表获取失败，请稍候再试');
                // this.clearFilter();
            })
          },
        clearFilter(){
            this.mealForm={
              serviceType:'',
              name:'',
              minPrice:'',
              maxPrice:'',
              minSaleNum:'',
              maxSaleNum:'',
              minCreateTime:'',
              maxCreateTime:'',
              saleState:'',
              dateRange:'',
            };
            this.showFilter=false;
            this.sureFilter();
        },
        filterData(){
          let mealForm=this.mealForm;
          delete mealForm.dateRange;
          this.pageNo=1;
          this.pageSize=10;
          this.getLists(null,null,mealForm);
        },
        toggleState(id,state){
            let params=`id=${id}&state=${state?'1':'0'}`;
            this.$http.get(`/discount/service/change/saleState?${params}`)
              .then(res=>{
                if(res.data.code===0){
                  this.$Message.success('操作成功');
                  this.getLists();
                }
              }).catch(err=>{
                this.$Message.error('操作失败')
            })

        },
        sureFilter(){
            let filterForm = {...this.mealForm};
            this.getLists(null,null,filterForm);
        },
        formatDateRange(dateRange){
            this.mealForm.minCreateTime=dateRange[0];
            this.mealForm.maxCreateTime=dateRange[1];
        }
      }
    }
</script>

<style scoped lang="scss">
@import "./system.scss";
</style>
