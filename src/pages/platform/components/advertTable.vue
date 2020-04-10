<template>
    <div class="start-app-body">
      <Spin fix v-show="tabLoading == true">加载中...</Spin>
        <Table :columns="columns"
                :data="advertLists"
               :draggable="true"
               @on-drag-drop="onDrag"
                @on-sort-change="sortChange"
                style="width: 100%">
        </Table>
        <div class="pagination">
            <Page transfer :current="pageConfig.current" :total="pageConfig.total" :page-size="pageConfig.size" show-sizer show-elevator
                  @on-change="handleCurrentChange"
                  @on-page-size-change="handleSizeChange"
                   >
            </Page>
        </div>
    </div>
</template>

<script>
  import moment from 'moment'
    export default {
        name: "advertTable",
        filters:{
            timeFormat(val){
                if (!val)return '';
                return (new Date(val).Format('yyyy-MM-dd hh:mm:ss'))
            }
        },
        props:{
          loading:{
            type:Boolean
          },
          advertLists:{
            type:Array
          },
          pageConfig:{
            type:Object
          },
          domain:{
            type:String
          }
        },
      watch:{
        loading:{
          handler(newV,oldV){
            this.tabLoading = newV
            console.log(newV)
          }
        }
      },
        data(){
            return{
              tabLoading:false,
              adOwnerList:[],
              columns:[
                {title:'编号',width:'80',key:'sortIndex',align:'center'},
                {title:'广告主',key:'ownerName',align:'center'},
                {title:'广告标题',key:'title',align:'center'},
                {title:'图片',width:'118',align:'center',render:(h,params)=>{
                  // let domain = this.domain;
                    return h('img',{attrs:{
                      src:params.row.imgName,
                        'class':'advertImg',
                        'width':'100px',
                        'height':'63px'
                      }})
                  }},
                {title:'类型',key:'serviceCategoryName',align:'center'},
                {title:'是否长期有效' ,align:'center',render:(h,params)=>{
                    return h('span',{},params.row.isLongValid === 'Y'?'是':'否')
                  }},
                {title:'开始时间' , key:'startTime',align:'center',sortable: 'custom',render:(h,params)=>{
                    //let time = moment(params.row.startTime).format('YYYY-MM-DD hh:mm');
                    let time = params.row.startTime;
                    if (!params.row.startTime){
                      time = ''
                    }
                    return h('span',{},time)
                  }},
                {title:'结束时间' ,key:'endTime',align:'center',sortable: 'custom',render:(h,params)=>{
                    //let time = moment(params.row.endTime).format('YYYY-MM-DD hh:mm');
                    let time = params.row.endTime;
                    if (!params.row.endTime){
                      time = ''
                    }
                    return h('span',{},time)
                  }},
                {title:'广告状态',key:'number',align:'center',render:(h,params)=>{
                    let text ='';
                    let color='#333';
                    let state = params.row.adState;
                    if(state==='IN_EFFECT'){
                      text='生效中'
                    }
                    if(state==='IS_INVALID'){
                      text='已失效';
                      color='#f00'
                    }
                    if(state==='NOT_EFFECTIVE'){
                      text='未生效';
                      color='blue'
                    }

                    if (state==='IMMINENT_EXPIRY'){
                      text='即将过期';
                      color='#E6A23C'
                    }
                    return h('span',{style:{color}},text)
                  }},
                {title:'发布日期' ,key:'createTime', align:'center',sortable: 'custom',render:(h,params)=>{
                    let time = moment(params.row.createTime).format('YYYY-MM-DD hh:mm');
                    if (!params.row.createTime){
                      time = ''
                    }
                    return h('span',{},time)
                  }},
                {title:'操作',width:'240',key:'number',align:'center',render:(h,params)=>{
                  let _this = this;
                  let state = params.row.adState;
                    let isTips = params.row.needExpireRemind==='Y';
                    if (state==='IMMINENT_EXPIRY'){
                      return h('div',[
                        h('Button',{
                          props:{
                            type:'primary',
                            size:'small'
                          },
                          style:{
                            marginRight:'5px'
                          },
                          on:{
                            click(){
                              _this.setTips(params.row)
                            }
                          }
                        },isTips?'取消提醒':'开启提醒'),
                        h('Button',{
                          props:{
                            type:'primary',
                            size:'small'
                          },
                          style:{
                            marginRight:'5px'
                          },
                          on:{
                            click(){
                              _this.showEdit(params.row)
                            }
                          }
                        },'编辑'),
                        h('Button',{
                          props:{
                            type:'error',
                            size:'small'
                          },
                          on:{
                            click(){
                              _this.showDelete(params.row.id)
                            }
                          }
                        },'删除')
                      ])
                    }
                    return h('div',[
                      h('Button',{
                        props:{
                          type:'primary',
                          size:'small'
                        },
                        style:{
                          marginRight:'5px'
                        },
                        on:{
                          click(){
                            _this.showEdit(params.row)
                          }
                        }
                      },'编辑'),
                      h('Button',{
                        props:{
                          type:'error',
                          size:'small'
                        },
                        style:{
                          marginRight:'5px'
                        },
                        on:{
                          click(){
                           _this.showDelete(params.row.id)
                          }
                        }
                      },'删除')
                    ])
                  }},
              ]
            }
        },
        methods:{
            handleSizeChange(size){
                this.pageConfig.size = size;
                //this.$emit('pageConfigChange',this.pageConfig)
            },
            handleCurrentChange(page){
                this.pageConfig.current = page;
                //this.$emit('pageConfigChange',this.pageConfig)
            },
            sortChange(column){
              this.$emit('sortChange',column)
            },
          onDrag(index1,index2){
            let tmp = this.advertLists[index1];
            this.advertLists[index1] = this.advertLists[index2];
            this.advertLists[index2] = tmp;
            let parmas = [];
            this.advertLists.forEach((item,index)=>{
              parmas.push(item.id)
            });
            this.$emit('onDrag',parmas);

          },
          setTips(row){
              this.$emit('setTips',row);
          },
          showEdit(row){
              this.$emit('onEdit',row)
          },
          showDelete(id){
              this.$emit('onDelete',id)
          },
            upImgSuccess(){

            },
            beforeImgUpload(){

            }
        }
    }
</script>

<style scoped>

</style>
