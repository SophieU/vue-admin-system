<template>
  <Card>
    <div class="clearfix mb-15">
      <div class="pull-left">
        <Button @click="filter=true">筛选</Button>
      </div>
      <div class="pull-right">
        <Button type="primary">excel导出</Button>
      </div>
    </div>
    <Card style="max-width:400px;margin-bottom:15px;">
      <p slot="title">使用总数</p>
      <p class="text-blue" slot="extra">2018/08/20-2018/08/21</p>
      <div>
        <count-up
          class="infor-card-count user-created-count"
          id-name="total"
          :end-val="200"
          color="#039dff"
          countSize="60px"
          :countWeight="700"
        >
        </count-up>
      </div>
    </Card>
    <Card>
      <p slot="title">明细</p>
      <div class="table-wrapper">
        <Table :columns="columns" :data="lists"></Table>
      </div>
    </Card>
    <Drawer title="领用筛选" width="425"  v-model="filter">
      <div class="clearfix mb-15">
        <div class="pull-left">
          <Button>清空筛选条件</Button>
        </div>
        <div class="pull-right">
          <Button type="primary">确定</Button>
        </div>
      </div>
      <div>
        <Form>
          <FormItem label="报修类型">
            <Select>
              <Option value="">类型1</Option>
            </Select>
          </FormItem>
          <FormItem label="服务人员">
            <Input search enter-button />
          </FormItem>
          <FormItem label="辅材名称">
            <Input search enter-button />
          </FormItem>
          <FormItem label="创建时间">
            <DatePicker type="daterange"></DatePicker>
          </FormItem>
          <FormItem label="组织名称">
            <Select>
              <Option value="">234小区</Option>
            </Select>
          </FormItem>
        </Form>
      </div>
    </Drawer>
  </Card>
</template>

<script>
  import countUp from '../home/component/countUp';
    export default {
        name: "materials-use",
      components:{
        countUp
      },
      data(){
        return{
          filter:false,
          columns:[
            {title:'名称',key:'name',align:'center'},
            {title:'工单号',key:'orderNum',align:'center'},
            {title:'服务项目',key:'type',align:'center'},
            {title:'型号',key:'version',align:'center'},
            {title:'师傅',key:'staff',align:'center'},
            {title:'使用数量',key:'used',align:'center'},
            {title:'日期',key:'date',align:'center'},
            {title:'网点',key:'organName',align:'center'},
            {title:'操作',align:'center',render:(h,params)=>{
              let _this = this;
                return h('Button',{
                  props:{
                    type:'primary',
                    size:'small'
                  },
                  on:{
                    click:function(){
                      let id = params.row.id;
                      _this.$router.push({name:'orderDetail',query:{id:id}});
                    }
                  }
                },'查看订单')
              }},
          ],
          lists:[
            {name:'11',orderNum:'11',type:'11',version:'11',staff:'11',used:'11',date:'11',organName:'11'}
          ]
        }
      }
    }
</script>

<style scoped>

</style>
