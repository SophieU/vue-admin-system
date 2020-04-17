<template>
    <div>
      <Modal
         v-model="addService"
         :title="addTitle"
         :closable="false"
         @on-visible-change="statusChange">
         <Select v-model="addHomeInfo.col" style="width:200px" placeholder="请选择栏目">
           <Option v-for="(item,index) in serverOption" :value="item.id" :key="index">{{ item.typeName }}</Option>
         </Select>
           <Input v-model="addHomeInfo.inputInfo" placeholder="" style="width: 200px"/>
           <Button type="default" @click="getNotAdd">搜索</Button>
           <div class="gap"></div>
           <div class="limitTable">
<!--@on-row-click="rowClick"-->
             <Table :columns="serverCol" :data="serverData" :show-header=false highlight-row @on-row-click="rowClick($event)"></Table>
           </div>
           <div>
             <Form :model="addHomeInfo.model" :label-width="100">
                <FormItem label="是否限时:">
                   <RadioGroup v-model="addHomeInfo.model.limitTime" @on-change="radioChange">
                      <Radio label="N">是</Radio>
                      <Radio label="Y">否</Radio>
                   </RadioGroup>
                </FormItem>
                <FormItem label="开始时间:" v-show="radioFlag == true">
                  <DatePicker type="datetime" format="yyyy-MM-dd HH:mm" v-model="addHomeInfo.model.startTime" @on-change="changeStartTime" style="width: 200px"></DatePicker>
                </FormItem>
                <FormItem label="结束时间:" v-show="radioFlag == true">
                  <DatePicker type="datetime" format="yyyy-MM-dd HH:mm" v-model="addHomeInfo.model.endTime" @on-change="changeEndTime" style="width: 200px"></DatePicker>
                </FormItem>
             </Form>
           </div>
           <div slot="footer">
            <Button type="default" @click="cancleFn()">取消</Button>
            <Button type="primary" @click="functionAdd()">确认</Button>
           </div>
       </Modal>
    </div>
</template>

<script>
  export default {
      name:'model',
      data(){
          return{
            display:'none',
            radioFlag:false,  //判断开始时间结束时间是否限时
            serverCol:[  //弹出框的未添加到服务的列表
              {
               title: '选择',
               key: 'chose',
               width: 70,
               align: 'center',
               render: (h, params) => {
                 let id = params.row.id;
                 let flag = false;
                 if (this.serverId == id) {
                   flag = true
                 } else {
                   flag = false
                 }
                 return h('div', [
                   h('Radio', {
                     props: {
                       value: flag
                     },
                   })
                 ])
               }},
              {key:'iconName',render:(h,params)=>{
                let src = params.row.iconName;
                return h('img',{
                  attrs:{
                    src:src
                  },
                  style:{
                    height:'40px',
                    width:'50px'
                  }
                })
              }},
              {key:'title'}
            ],
            serverId:'',//服务ID
            serverData:[],//未添加到服务的列表数据
            addHomeInfo:{ //弹出框绑定的数据
              col:'',  //选择栏目item
              inputInfo:'', //选择框旁的输入框
              model:{
                limitTime:'', //是否限时
                startTime:'',
                endTime:''
              }
            },
            serverOption:[],//服务栏目数组
          }
      },
        props:{
            addService:{
                type:Boolean
            },
            // current:{
            //     type:Number
            // },
            // size:{
            //     type:Number
            // },
            addTitle:{
                type:String
            },
            // singleId:{   //全部服务传过来的ID
            //     type:String
            // },
            functionId:{  //功能区传过来的ID
                type:String
            },
            // functionFlag:{   //用于区分是功能区还是全部服务
            //     type:Boolean
            // }
        },
    methods:{
      changeStartTime(e){ //开始时间datepicker变化事件
        this.addHomeInfo.model.startTime = e
      },
      changeEndTime(e){ //结束时间datepicker变化事件
        this.addHomeInfo.model.endTime = e
      },
      cancleFn(){  //模态框取消
        this.$emit('getStatus',false)
      },
      rowClick(data){ //模态框table数据选择(每一行)
        this.serverId = data.id
      },
      functionAdd(){  //功能区模态框确认按钮
        if(this.serverId == ''){
          this.$Message.warning('请选择未添加的服务');
          return false
        }
        if(!this.addHomeInfo.model.limitTime){
          this.$Message.warning('请选择是否限时');
          return false
        }
        let data ={
          "endTime": this.addHomeInfo.model.endTime,
          "id": this.functionId,
          "idService": this.serverId,
          "isLongValid": this.addHomeInfo.model.limitTime,
          "startTime": this.addHomeInfo.model.startTime
        }
        if(!this.functionId){
            delete data.id
        }
        this.$http.post('/yyht/v1/service/default/addOrUpdate',data).then(res=>{
            if(res.data.code == 0){
                this.$emit('updateCol',true);
                this.$emit('deleteId',true)
            }else{
                this.$Message.warning(res.data.msg)
            }
        })
      },
      radioChange(data){ //单选框状态变化
        if(data == 'N'){
          this.radioFlag = true;
        }else{
          this.radioFlag = false;
        }
      },
      statusChange(data){ //模态框状态变化(重置)
        if(data == false){
          this.addHomeInfo.col = '';
          this.addHomeInfo.inputInfo = '';
          this.serverId = '';
          this.radioFlag = false;
          this.addHomeInfo.model.limitTime = '';
          this.addHomeInfo.model.startTime = '';
          this.addHomeInfo.model.endTime = '';
        }else{
          this.addHomeInfo.model.limitTime = 'Y';
          if(this.functionId){  //功能区
            this.getFunctionSingle();
          }
          this.serverOption.length == 1? this.addHomeInfo.col = this.serverOption[0].id : this.addHomeInfo.col = '';
        }
      },
      getFunctionSingle(){  //根据ID获取功能区个人信息
        this.$http.get(`/yyht/v1/service/getServiceInfoById?id=${this.functionId}`).then(res=>{
            if(res.data.code == 0){
                this.addHomeInfo.model.limitTime = res.data.data.isLongValid;
                if(res.data.data.isLongValid == 'N'){
                 this.radioFlag = true;
                 this.addHomeInfo.model.startTime = res.data.data.startTime;
                 this.addHomeInfo.model.endTime = res.data.data.endTime;
             }else{
                 this.radioFlag = false;
                 this.addHomeInfo.model.startTime = '';
                 this.addHomeInfo.model.endTime = '';
             }
            }else{
                 this.$Message.warning(res.data.msg)
            }
        })
      },
      getServerCol(){ //获取服务栏目列表
        this.$http.get(`/yyht/v1/service/type/getAllServiceType`).then(res=>{
          if(res.data.code == 0){
             this.serverOption = res.data.data
          }else{
            this.$Message.warning(res.data.msg)
          }
        })
      },
      getNotAdd(){ //获取未添加的服务列表 ?serviceTypeId=${item}&serviceTypeName=${data}
        let serviceTypeId = this.addHomeInfo.col;
        let serviceTypeName = this.addHomeInfo.inputInfo;
        this.$http.get(`/yyht/v1/service/getAllServiceByInner?serviceTypeId=${serviceTypeId}&serviceTypeName=${serviceTypeName}`).then(res=>{
          if(res.data.code == 0){
            this.serverData = res.data.data
          }else{
            this.$Message.warning(res.data.msg)
          }
        })
      }
    },
    mounted(){
      this.getServerCol();
      this.getNotAdd()
    }

  }
</script>

<style scoped>
  .gap{
    margin:10px
  }
  .limitTable{
    height:300px;
    overflow-y:auto;
    width:100%;
    overflow-x: hidden;
    margin-bottom: 15px;
  }
</style>
