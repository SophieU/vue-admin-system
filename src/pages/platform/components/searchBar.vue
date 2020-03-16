<template>
    <div class=" clearfix mb-15">
        <div class="pull-left">
          <Form class="pull-left" inline :label-width="100">
            <FormItem label="广告主：">
            <Select :transfer="true" v-model="searchForm.adOwnerId" placeholder="请选择" style="width:190px">
              <Option
                v-for="item in advertiserList"
                :key="item.id"
                :label="item.ownerName"
                :value="item.id">
              </Option>
            </Select>
          </FormItem>
            <FormItem label="是否长期有效：">
            <Select :transfer="true" v-model="searchForm.isLongValid" placeholder="请选择"  style="width:190px">
              <Option
                label="全部"
                value="">
              </Option>
              <Option
                label="是"
                value="Y">
              </Option>
              <Option
                label="否"
                value="N">
              </Option>
            </Select>
          </FormItem>
            <FormItem label="广告标题：">
            <Input v-model="searchForm.adTitle"  style="width:190px"></Input>
          </FormItem>
            <FormItem label="状态：">
            <Select :transfer="true" v-model="searchForm.adState" placeholder="请选择" style="width:190px">
              <Option
                label="全部"
                value="">
              </Option>
              <Option
                label="生效中"
                value="IN_EFFECT">
              </Option>
              <Option
                label="已失效"
                value="IS_INVALID">
              </Option>
              <Option
                label="即将过期"
                value="IMMINENT_EXPIRY">
              </Option>
              <Option
                label="未生效"
                value="NOT_EFFECTIVE">
              </Option>
            </Select>
          </FormItem>
            <FormItem label="广告开始时间：">
            <DatePicker :editable="false"
                        @on-change="dataTimeChange($event,1)"
                        :transfer="true"
                        v-model="startTimeArr"
                        type="datetimerange"
                        placeholder="请选择开始时间"
                        style="width:200px"
                        :default-time="['12:00:00']">
            </DatePicker>
          </FormItem>
            <FormItem label="广告结束时间：">
            <DatePicker :editable="false"
                        @on-change="dataTimeChange($event,2)"
                        :transfer="true"
                        v-model="endTimeArr"
                        type="datetimerange"
                        style="width:190px"
                        placeholder="请选择结束时间"
                        :default-time="['12:00:00']">
            </DatePicker>
          </FormItem>
            <FormItem class="no-label-form-item">
              <Button type="primary" @click="onSearch"  >查询</Button>
              <Button type="primary" @click="onReset"  >重置</Button>
            </FormItem>
          </Form>
        </div>
        <div class="pull-right">
          <Button type="primary" icon="md-add" @click="showAdd" class="pull-right">新增广告</Button>
        </div>

    </div>
</template>

<script>
    export default {
        name: "searchBar",
        props:{
          typeId:{
              type:Number
          },
          searchForm:{
            type: Object
          },
        },
        data:()=>{
            return{
                advertiserList:[],
              startTimeArr:[],
              endTimeArr:[]
            }
        },
        methods:{
            onSearch(){
              this.$emit('search')
            },
            onReset(){
              this.startTimeArr = [];
              this.endTimeArr = [];
              this.$emit('onReset')
            },
          dataTimeChange(date,flag){
            let data = {
              date:date,
              type:flag
            };
            this.$emit('dateChange',data)
          },
            getAllOwner(){
              this.$http.get(`/ad/owner/getOwnerName`).then(res=>{
                  if (res.data.code === 0){
                      this.advertiserList = res.data.data
                  } else {
                      this.$message.error(res.data.msg)
                  }
              })
            },
            showAdd(){
                this.$emit('on-add');
            }
        },
        mounted() {
            this.getAllOwner();
        }
    }
</script>

<style scoped lang="scss">
    @import "./../advert-manage.scss";
</style>
