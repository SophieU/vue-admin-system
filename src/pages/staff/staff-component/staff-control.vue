<template>
  <div>
    <Card class="mb-15">
      <Form ref="controlFormRef" :model="controlForm">
        <FormItem label="账号权限管控:">
          <Select v-model="controlForm.numControl" @on-change="selectChange" style="width: 200px;">
            <Option :value="item.value" v-for="(item,ind) of numControlList" :key="ind">{{item.label}}</Option>
          </Select>
        </FormItem>
      </Form>
    </Card>
  </div>
</template>

<script>
export default {
  name: "staff-control",
  data(){
    return{
      controlForm:{
        numControl:'NORMAL',
      },
      numControlList:[
        {
          label:'正常',
          value:'NORMAL',
        },
        {
          label:'禁止接工单',
          value:'DISABLE_ACCEPT_REPAIR_ORDER',
        },
        {
          label:'禁止售卖套餐',
          value:'DISABLE_SALE_DISCOUNT_SERVICE',
        },
        {
          label:'禁用账号',
          value:'DISABLE',
        },
      ]
    }
  },
  mounted(){
    const id = this.$route.query.id;
    this.getInfo(id);
  },
  methods:{

    getInfo(id){
      this.$http.get(`/server/info?id=${id}`)
        .then(res=> {
          if(res.data.code===0){
            this.controlForm.numControl = res.data.data.businessState;
          }else{
            console.log('人员基础信息获取失败：'+res.data.msg);
          }
        })
    },
    selectChange(){
      this.$http({
        method: "get",
        url: `server/change/businessState`,
        params: {
          id:this.$route.query.id,
          businessState:this.controlForm.numControl
        }
      }).then(res => {
        if (res.data.code === 0) {
          this.$Message.success('权限修改成功');
        } else {
          this.$Message.error(res.data.msg);
        }
      });
    }
  },
}
</script>

<style scoped>

</style>
