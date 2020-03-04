<template>
  <div>
    <Card>
      <div class="clearfix mb-15">
        <div class="pull-right">
          <Button @click="showFilter=true">筛选</Button>
          <Button type="primary">Excel导出</Button>
        </div>
      </div>
      <div class="table-wrapper">
        <Table :columns="columns" :data="lists"></Table>
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
      <Form class="mt-15" :model="insuranceForm" label-width="80">
        <FormItem label="销售人员">
          <Input v-model="insuranceForm.name" />
        </FormItem>
        <FormItem label="创建时间">
          <DatePicker type="daterange"  ></DatePicker>
        </FormItem>
        <FormItem label="有效日期">
          <DatePicker type="daterange" ></DatePicker>
        </FormItem>
        <FormItem label="服务网点">
          <Select>
            <Option>xxx</Option>
          </Select>
        </FormItem>
      </Form>
    </Drawer>
  </div>
</template>

<script>
    export default {
        name: "insurance-order",
      data(){
          return{
            columns:[
              {
                title:'保险名称',
                key:'name',
                align:'center'
              }, {
                title:'服务网点',
                key:'name',
                align:'center'
              }, {
                title:'销售人员',
                key:'name',
                align:'center'
              }, {
                title:'绑定手机号',
                key:'name',
                align:'center'
              }, {
                title:'绑定地址',
                key:'name',
                align:'center'
              }, {
                title:'有效期',
                key:'name',
                align:'center'
              }, {
                title:'创建日期',
                key:'name',
                align:'center'
              }
            ],
            lists:[],
            showFilter:false,
            insuranceForm:{}
          }
      },
      methods:{
        clearFilter(){},
        filterData(){},
      }
    }
</script>

<style scoped>

</style>
