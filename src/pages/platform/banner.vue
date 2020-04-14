<template>
  <Card>
    <search-bar :searchForm="searchForm" ref="searchBar"
                @on-add="showAdd" :typeId="adTypeId" @search="getAdLists" @onReset="resetSearch"
                @dateChange="dateChange"
    ></search-bar>
    <Spin fix v-show="loading == true" >加载中...</Spin>
    <Tabs type="card" @on-click="tabChange">
      <TabPane v-for="tab in AdTypeList" :label="tabLabel(tab)" :name="tab.id" :key="tab.id">
        <advert-table :domain="domain" :advertLists="advertLists" :pageConfig="pageConfig"
                      @pageConfigChange="pageConfigChange"
                      @sortChange="sortChange"
                      @onDrag="commitDrag"
                      @onEdit="showEdit"
                      @onDelete="showDelete"
                      @setTips="commitTips"
        ></advert-table>
      </TabPane>
    </Tabs>
    <Modal
      v-model="deleteModal.show"
      :mask-closable="false"
      @close="deleteModal.id = ''"
      width="30%"
    >
      <div>
        确定删除该广告吗
      </div>
      <span slot="footer" class="dialog-footer">
        <Button type="error" :disabled="disabledBtn" @click="submitDelete">删除</Button>
        <Button @click="deleteModal.show = false">取 消</Button>
      </span>
    </Modal>
    <bannerPoput :modalShow.sync="modalShow" :modalType="modalType" :adTypeId="adTypeId" @getListImage="getListImage" @completeModal="completeModal" :editorData="editorData"/>
  </Card>
</template>

<script>
  import searchBar from './components/searchBar.vue'
  import advertTable from './components/advertTable.vue'
  import bannerPoput from './components/bannerPoput.vue'
  import util from "../../libs/util";
  export default {
    name: "banner",
    components:{
      searchBar,
      advertTable,
      bannerPoput
    },
    data:()=>{
      return{
        editorData:null,
        modalShow:false,
        modalType:'add',//区分弹窗的新增和编辑
        loading:true,
        showTargetName:'',
        advertLists:[],
        disabledBtn:false,
        tipsData:[],
        tabLabel:(params) => {
          return (h)=>{
            let name = params.typeName;
            let num = params.tipsCount;
            return h('div', [
              h('span', name),
              h('Badge', {
                props: {
                  count: num
                }
              })
            ])
          };
        },
        searchForm: {
          adOwnerId:'',
          adTypeId:1,
          isLongValid:'',
          adTitle:'',
          adState:'',// 广告状态 全部:'',生效中:IN_EFFECT,已失效:IS_INVALID,即将过期:IMMINENT_EXPIRY,未生效:NOT_EFFECTIVE
          beginStartTime:'',
          beginEndTime:'',
          endEndTime:'',
          endStartTime:''
        },
        AdTypeList:[],
        startTimeArr:[],
        endTimeArr:[],
        adTypeId:1,//广告类型Id,插屏广告默认传：7，启动页广告默认传：4，banner广告默认传：1
        pageConfig:{
          current:1,
          size:10,
          total:0
        },
        domain:'',
        adOwnerList:[],
        deleteModal:{
          show:false,
          id:''
        },
      }
    },
    watch:{
      'pageConfig.size':function () {
        this.getAdLists()
      },
      'pageConfig.current':function () {
        this.getAdLists()
      },
    },
    methods:{
      completeModal(data){  //子组件弹窗完成按钮
        this.modalShow = false;
        if(data == true) {
          this.pageConfig.current = 1;
          this.getAdLists()
        }
      },
      getListImage(data){   //获取图片展示给List
        this.domain = data;
      },
      // 列表
      getAdLists(flag,type){
        this.loading = true;
        if (this.startTimeArr[0]) {
          this.searchForm.beginStartTime = new Date(this.startTimeArr[0]).Format('yyyy-MM-dd hh:mm:ss');
        }
        if (this.startTimeArr[1]) {
          this.searchForm.beginEndTime = new Date(this.startTimeArr[1]).Format('yyyy-MM-dd hh:mm:ss');
        }
        if (this.endTimeArr[0]) {
          this.searchForm.endStartTime = new Date(this.endTimeArr[0]).Format('yyyy-MM-dd hh:mm:ss');
        }
        if (this.endTimeArr[1]) {
          this.searchForm.endEndTime = new Date(this.endTimeArr[1]).Format('yyyy-MM-dd hh:mm:ss');
        }
        let parmas = this.searchForm;
        parmas.flag=flag;
        parmas.type=type;
        parmas.adTypeId=this.adTypeId;
        // parmas = util.formatterParams(parmas);

        this.$http.post(`/yyht/v1/ad/config/getPageListAdByTypeId?pageNo=${this.pageConfig.current}&pageSize=${this.pageConfig.size}`,parmas).then(res=>{
          if (res.data.code === 0){
            this.advertLists = res.data.data.list;
            this.pageConfig.total = res.data.data.totalCount;
            this.loading = false;
          } else {
            this.$Message.error(res.data.msg)
          }
        })
      },
      resetSearch(){   //重置搜索
        this.searchForm = {
          adOwnerId:'',
          adTypeId:this.adTypeId,
          isLongValid:'',
          adTitle:'',
          adState:'',// 广告状态 全部:'',生效中:IN_EFFECT,已失效:IS_INVALID,即将过期:IMMINENT_EXPIRY,未生效:NOT_EFFECTIVE
          beginStartTime:'',
          beginEndTime:'',
          endEndTime:'',
          endStartTime:''
        };
        this.startTimeArr = [];
        this.endTimeArr = [];
        this.getAdLists();
      },
      dateChange(data){
        if (data.type === 1){
          this.startTimeArr = data.date
        }else {
          this.endTimeArr = data.date
        }
      },
      sortChange(data){  //列表排序
        let type = data.key;
        let flag = 'up';
        if (data.order === 'desc') {
          flag = 'down'
        }
        this.getAdLists(flag,type)
      },
      commitDrag(data){  //列表点击拖动
        this.$http.post(`/yyht/v1/ad/config/updateAdSort?id=${data.id}&sortIndex=${data.sortIndex}`).then(res=>{
          if (res.data.code !== 0){
            this.$Message.error(res.data.msg)
          }else {
            this.getAdLists()
          }
        })
      },
      showDelete(data){
        this.deleteModal.id = data;
        this.deleteModal.show = true;
      },
      commitTips(row){
        let adConfigId = row.id;
        let optionValue = '';
        if (row.needExpireRemind === 'Y'){
          optionValue = 'CLOSE'
        }else {
          optionValue = 'OPEN'
        }
        this.$http.post(`/ad/banner/set/expire/remind?adConfigId=${adConfigId}&optionValue=${optionValue}`).then(res=>{
          if (res.data.code === 0){
            this.getAdLists();
            this.$Message.success('操作成功')
          } else {
            this.$Message.error('操作失败')
          }
        })
      },
      showEdit(data){   //编辑服务
        this.modalShow = true;
        this.modalType = 'editor';
        this.editorData = data;
      },
      showAdd(){
        this.modalType = 'add';
        this.modalShow= true;
      },
      tabChange(name){   //table上方卡片切换
        this.loading = true;
        this.adTypeId = Number(name);
        this.searchForm.adTypeId = Number(name);
        this.getAdLists();
      },
      pageConfigChange(data){  //分页变化事件
        this.pageConfig = data;
        this.getAdLists()
      },
      // 栏目列表-Tab
      getAdTypeList(){
        this.$http.get(`/yyht/v1/ad/config/getAdTypeListByType`).then(res=>{
          if (res.data.code === 0){
            this.AdTypeList=res.data.data;  //table上方替换卡片
            this.adTypeId = Number(this.AdTypeList[0].id)
          } else {
            this.$Message(res.data.msg)
          }
        })
      },
      submitDelete(){
        this.disabledBtn = true;
        let id = this.deleteModal.id;
        this.$http.post(`/yyht/v1/ad/config/deleteAdById?id=${id}`).then(res=>{
          this.disabledBtn = false;
          if (res.data.code === 0){
            this.deleteModal.show = false;
            this.$Message.success('删除成功');
            this.getAdLists();
          } else {
            this.$Message.error(res.data.msg);
            this.deleteModal.show = false;
          }
        })
      },
    },
    mounted() {
      this.getAdLists();
      this.getAdTypeList();
    }
  }
</script>

<style scoped lang="scss">
  @import "./advert-manage.scss";
  .serve-item{
    font-size: 16px;
    margin-top: 5px;
  }
  .typeChoose .ivu-btn{
  border:none;
  margin-right: 3px;
  }
  .gap{
    margin-top:25px;
  }
</style>
