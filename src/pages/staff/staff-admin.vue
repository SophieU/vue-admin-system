<template>
    <Card>
      <div class="mb-15">
        <Button @click="filter=true">筛选</Button>
      </div>
      <div class="table-wrapper">
        <Table :columns="columns" :data="lists"></Table>
        <div class="pagination">
          <Page :total="totalCount"  show-elevator :current.sync="pageNo"
            @on-change="pageChange"
            @on-page-size-change="pageSizeChange"
          ></Page>
        </div>
      </div>
      <!--筛选-->
      <Drawer title="工单筛选" v-model="filter" width="425">
        <div class="clearfix mb-15">
          <div class="pull-left">
            <Button @click="clearFilter">清空筛选条件</Button>
          </div>
          <div class="pull-right">
            <Button @click="sureFilter" type="primary">确定筛选</Button>
          </div>
        </div>
        <i-form ref="filterForm" :model="filterForm" label-position="top">
          <form-item label="员工姓名" >
            <Input v-model="filterForm.trueName" />
          </form-item>
          <form-item label="员工手机">
            <Input  v-model="filterForm.mobile" />
          </form-item>
          <form-item label="员工工号">
            <Input v-model="filterForm.workNumber" />
          </form-item>
          <form-item label="接单单数" >
            <Row>
              <Col span="11">
                <InputNumber :min="0" style="width:100%;" v-model="filterForm.singularNumberStart"></InputNumber>
              </Col>
              <Col span="2" style="text-align:center;">至</Col>
              <Col span="11">
                <InputNumber :min="0" style="width:100%;" v-model="filterForm.singularNumberEnd"></InputNumber>
              </Col>
            </Row>
          </form-item>
          <form-item label="所属服务网点">
            <Select :clearable="true" @on-change="toggleStation" v-model="filterForm.repairStationId">
              <Option  v-for="(item,index) in stationLists" :key="item.id" :value="item.id">{{item.name}}</Option>
            </Select>
          </form-item>
          <form-item label="所属组">
            <Select  v-model="filterForm.serviceGroupId"  not-found-text="请先选择服务网点">
              <Option v-for="group in groupLists" :key="group.id" :value="group.id">{{group.name}}</Option>
            </Select>
          </form-item>
          <form-item class="inline_form_item" label="网点休息中">
            <i-switch v-model="filterForm.workState" true-value="VACATION" :false-value="null"></i-switch>
          </form-item>
          <form-item class="inline_form_item" label="备用网点值班中">
            <i-switch  v-model="filterForm.pareDotWork" true-value="Y" :false-value="null"></i-switch>
          </form-item>
          <form-item class="inline_form_item" label="账号停用">
            <i-switch v-model="filterForm.accountsState" true-value="DISABLE" :false-value="null"></i-switch>
          </form-item>

        </i-form>
      </Drawer>
    </Card>
</template>

<script>
  import util from '../../libs/util'
    export default {
        name: "staff-admin",
      data(){
          return {
            filter:false,
            columns:[
              {title:'姓名',key:'trueName',align:'center'},
              {title:'手机',key:'mobile',align:'center'},
              {title:'工号',key:'workNumber',align:'center'},
              {title:'所属网点',key:'repairStationName',align:'center'},
              {title:'所属组',key:'groupName',align:'center'},
              {title:'值班状态',key:'workStateName',align:'center'},
              {title:'备用网点值班',key:'pareDotWorkName',align:'center'},
              {title:'账号状态',key:'accountsStateName',align:'center'},
              {title:'账号管控',key:'businessState',align:'center'},
              {title:'接单数',key:'singularNumber',align:'center',"sortable": true},
              {title:'满意度',key:'goodCommentRate',align:'center',render:(h,params)=>{
                  let rate = params.row.goodCommentRate;
                  return h('span',`${rate}%`)
                }},
              {title:'操作',align:'center',render:(h,param)=>{
                  let _this = this;
                  return h('Button',{
                    props:{
                      type:'primary',
                      size:'small'
                    },
                    on:{
                      click:()=>{
                        let id = param.row.id;
                        _this.$router.push({name:'staffDetail',query:{id:id}})
                      }
                    }
                  },'查看')
                }}
            ],
            lists:[],
            pageNo:1,
            pageSize:10,
            totalCount:0,
            stationLists:[],//网点列表
            groupLists:[], //组列表
            showFilterGroup:[], //组列表只有在选择了网点时显示
            filterForm:{
              trueName:'',
              mobile:'',
              workNumber:'',
              workState:'', // 上班状态（1、值班IN_WORK；2、休假VACATION；）
              pareDotWork:'', // 备用网点值班（Y、值班 N、不值班)
              accountsState:'', // 帐号状态（1、正常NORMAL；2、停用DISABLE；）
              singularNumberStart:null,
              singularNumberEnd:null,
              repairStationId:'',
              serviceGroupId:'',

            }
          }
      },
      methods:{
        toggleStation(stationId){
          if(stationId){
            this.showFilterGroup=true;
            this.getGroup(stationId)
          }else{
            this.showFilterGroup=false;
            this.groupLists=[];
          }
        },
        pageChange(val){
          this.pageNo=val;
          let filter=this.filterForm;
          this.getLists(filter);
        },
        pageSizeChange(val){
          this.pageSize=val;
          let filter=this.filterForm;
          this.getLists(filter);
        },
          getStation(){
            this.$http.get(`/repair/station/select/list`)
              .then(res=>{
                if(res.data.code===0){
                  this.stationLists=res.data.data;
                }else{
                  console.log('员工列表网点下拉'+res.data.msg);
                }
              })
          },
        getGroup(stationId){
          let stationIdIn=stationId?stationId:''
          this.$http.get(`/server/service/group/list?stationId=${stationIdIn}`)
            .then(res=>{
              if(res.data.code===0){
                this.groupLists=res.data.data;
              }
            })
        },
        getLists(filter){
          let param = `pageNo=${this.pageNo}&pageSize=${this.pageSize}`;
          if(filter){
            param=param+'&'+util.formatterParams(filter);
          }
          this.$http.post(`/server/list?${param}`)
            .then(res=>{
              if(res.data.code===0){
                let data = res.data.data;
                this.lists = data.list;
                this.pageSize=data.pageSize;
                this.totalCount=data.totalCount;
                this.filter=false;
              }else{
                console.log('员工列表获取失败：'+res.data.msg);
              }
            })
        },
        clearFilter(){
            this.filterForm={
              trueName:'',
              mobile:'',
              workNumber:'',
              workState:'', // 上班状态（1、值班IN_WORK；2、休假VACATION；）
              pareDotWork:'', // 备用网点值班（Y、值班 N、不值班)
              accountsState:'', // 帐号状态（1、正常NORMAL；2、停用DISABLE；）
              singularNumberStart:null,
              singularNumberEnd:null,
              repairStationId:'',
              serviceGroupId:'',
            };
          this.pageNo=1;
          this.getLists();
        },
        sureFilter(){
          let filterForm = this.filterForm;
          let filterParam = {};
          for(let key in filterForm){
            if(filterForm[key]){
              filterParam[key]=filterForm[key];
            }
          }
          this.pageNo=1;
          this.getLists(filterParam);

        }
      },
      mounted(){
        this.getLists();
        this.getStation();
        this.getGroup();

      }
    }
</script>

<style scoped lang="scss">

</style>
