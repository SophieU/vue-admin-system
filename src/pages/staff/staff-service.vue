<template>
    <Card>
      <div class="mb-15">
        <Button type="primary" @click="teachModal = true">新增</Button>
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
          <form-item label="姓名" >
            <Input v-model="filterForm.trueName" />
          </form-item>
          <form-item label="手机">
            <Input  v-model="filterForm.mobile" />
          </form-item>
          <form-item label="工号">
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
           <form-item label="上班状态">
            <Select v-model="filterForm.workState">
              <Option  value="IN_WORK">值班</Option>
              <Option  value="VACATION">休假</Option>
            </Select>
          </form-item>
          <form-item label="账号状态">
            <Select v-model="filterForm.accountsState">
              <Option  value="-1">审核失败</Option>
              <Option  value="0">待审核</Option>
              <Option  value="1">正常</Option>
              <Option  value="2">停用</Option>
            </Select>
          </form-item>
        </i-form>
      </Drawer>
      <Modal
        v-model="teachModal"
        :mask-closable="false"
        title="新增服务师傅"
        @on-visible-change="modalHide"
      >
          <i-form ref="teachForm" :rules="teachRule" :model="teachForm" :label-width="110">
                <form-item label="服务网点：" prop="repairStationId">
                  <Select v-model="teachForm.repairStationId" @on-change="changeStation" style="width: 200px">
                    <Option v-for="item in modalStation" :key="item.id" :value="item.id">{{item.name}}</Option>
                  </Select>
                </form-item>
                <form-item label="员工姓名：" prop="trueName">
                  <Input v-model="teachForm.trueName" style="width: 200px"/>
                </form-item>
                <form-item label="手机号码：" prop="mobile">
                  <Input v-model="teachForm.mobile" style="width: 200px"/>
                </form-item>
                <form-item label="工号：" prop="workNumber">
                  <Input  v-model="teachForm.workNumber" style="width: 200px"/>
                </form-item>
                <form-item label="上班状态：" prop="accountsState">
                  <Select v-model="teachForm.accountsState" style="width: 200px">
                    <Option value="NORMAL">正常</Option>
                    <Option value="DISABLE">停用</Option>
                  </Select>
                </form-item>
                <form-item label="是否备用师傅：" prop="isSlave">
                  <Select v-model="teachForm.isSlave" style="width: 200px">
                    <Option value="Y">是</Option>
                    <Option value="N">否</Option>
                  </Select>
                </form-item>
                <form-item label="服务区域列表" class="must" prop="repairRegionIds">
                  <Select v-model="teachForm.repairRegionIds" multiple @on-change="changeArea" style="width: 200px">
                    <Option v-for="item in teachArea" :key="item.id" :value="item.id">{{item.name}}</Option>
                  </Select>
                </form-item>
                <form-item label="服务类型：" class="must" prop="repairCategoryIds">
                  <Tree :data="repairTree" show-checkbox @on-check-change="changeCheck"></Tree>
                </form-item>
                <form-item label="头像：" class="must" prop="showFaceImage">
                  <UploadImage :eidtImg="eidtImg" ref="upImg" :flag="0" @uploadCallback="uploadUrl"></UploadImage>
                </form-item>
          </i-form>
        <div slot="footer">
          <Button @click="teachModal=false">取消</Button>
          <Button :loading="loadingSend" @click="saveTeach('teachForm')" type="primary">保存</Button>
        </div>
      </Modal>
    </Card>
</template>

<script>
  import UploadImage from '../main-components/upload-img'
  import util from '../../libs/util'
    export default {
        name: "staff-admin",
      components: {UploadImage},
      data(){
          return {
            eidtImg:null,
            teachModal:false, //弹窗状态
            loadingSend:false, //弹窗保存状态
            teachForm:{ //弹窗modal
              id:'',
              repairStationId:'',//网点ID
              trueName:'',//员工姓名
              mobile:'',//手机号码
              isSlave:'',
              workNumber:'',//工号
              accountsState:'',//上班状态
              showFaceImage:'',//头像
              repairCategoryIds:[],//报修分类
              repairRegionIds:[]//服务区域
            },
            teachRule:{  //模态框规则
              repairStationId:[{required:true,message:'请选择服务网点',trigger:'change'}],
              trueName:[{required:true,message:'请填写员工姓名',trigger:'blur'}],
              mobile:[{required:true,message:'请填写手机号码',trigger:'blur'}],
              workNumber:[{required:true,message:'请填写工号',trigger:'blur'}],
              accountsState:[{required:true,message:'请选择上班状态',trigger:'change'}],
              isSlave:[{required:true,message:'是否备用师傅',trigger:'change'}],
              // repairRegionIds:[{required:true,message:'请选择服务区域列表',trigger:'change'}],
              // repairCategoryIds:[{required:true,message:'请选择服务网点分类',trigger:'blur'}],
              // showFaceImage:[{required:true,message:'请上传头像',trigger:'blur'}],
            },
            modalStation:[], //网点下拉数组
            repairTree:[],//报修分类数组
            teachArea:[],//服务区域数组
            filter:false,
            columns:[
              {title:'姓名',key:'trueName',align:'center'},
              {title:'手机',key:'mobile',align:'center'},
              {title:'工号',key:'workNumber',align:'center'},
              {title:'所属网点',key:'repairStationName',align:'center'},
              {title:'值班状态',key:'workStateName',align:'center'},
              {title:'账号状态',key:'accountsStateName',align:'center'},
              {title:'接单数',key:'singularNumber',align:'center',"sortable": true},
              {title:'业务状态',key:'businessStateName',align:'center'},
              {title:'满意度',key:'goodCommentRate',align:'center',render:(h,params)=>{
                  let rate = params.row.goodCommentRate;
                  return h('span',`${rate}%`)
                }},
              {title:'操作',align:'center',render:(h,param)=> {
                  let _this = this;
                  return h('div', [
                    h('Button', {
                      props: {
                        type: 'default',
                        size: 'small'
                      },
                      style:{
                        marginRight:'5px'
                      },
                      on: {
                        click: () => {
                          let id = param.row.id;
                          _this.$router.push({name: 'staffDetail', query: {id: id, queryType: 'service'}})
                        }
                      }
                    }, '查看'),
                    // h('Button', {
                    //   props: {
                    //     type: 'primary',
                    //     size: 'small'
                    //   },
                    //   on: {
                    //     click: () => {
                    //       this.$http.get(`/yyht/v1/service/user/detail?id=${param.row.id}`).then(res=>{
                    //         if(res.data.code == 0){
                    //           let data = res.data.data;
                    //           this.getArea(data.repairStationId);
                    //           this.teachForm = { //弹窗modal
                    //               id:data.id,
                    //               repairStationId:data.repairStationId,//网点ID
                    //               trueName:data.trueName,//员工姓名
                    //               mobile:data.mobile,//手机号码
                    //               workNumber:data.workNumber,//工号
                    //               accountsState:data.accountsState,//上班状态
                    //               showFaceImage:data.showFaceImage,//头像
                    //               repairCategoryIds:data.repairCategoryTree,//报修分类
                    //               repairRegionIds:data.regionList//服务区域
                    //           };
                    //           data.repairCategoryTree.forEach(ele=>{
                    //             ele.title = ele.name;
                    //             ele.checked = true;
                    //             if(ele.children.length != 0){
                    //               ele.title = ele.name;
                    //               ele.checked = true;
                    //             }
                    //           });
                    //           this.eidtImg = [{name: '', url: data.showFaceImage, status: 'finished'}];
                    //           this.repairTree = data.repairCategoryTree;
                    //           this.teachModal = true;
                    //         }
                    //       })
                    //     }
                    //   }
                    // }, '编辑')
                  ])
                }}],
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
              accountsState:'', // 帐号状态（1、正常NORMAL；2、停用DISABLE；）
              singularNumberStart:null,
              singularNumberEnd:null,
              repairStationId:'',
            }
          }
      },
      methods:{
        changeArea(arr){  //区域改变触发
          arr.forEach(ele=>{
            this.teachForm.repairRegionIds.push(ele.id)
          })
        },
        changeCheck(arr){ //改变树节点
          this.teachForm.repairCategoryIds = [];
          arr.forEach(ele=>{
           this.teachForm.repairCategoryIds.push(ele.id)
         })
          // console.log(this.teachForm.repairCategoryIds)
        },
        uploadUrl(data){ //子组件传过来的URL
          this.teachForm.showFaceImage = data.imageUrl
        },
        modalHide(data){ //新增师傅模态框的显示和隐藏
          if(data == false){
            this.teachForm = { //弹窗modal
              repairStationId:'',//网点ID
                trueName:'',//员工姓名
                mobile:'',//手机号码
                workNumber:'',//工号
                accountsState:'',//上班状态
                showFaceImage:'',//头像
                repairCategoryIds:[],//报修分类
                repairRegionIds:''//服务区域
            }
          }
        },
        toggleStation(stationId){
          if(stationId){
            this.showFilterGroup=true;
            // this.getGroup(stationId)
          }else{
            this.showFilterGroup=false;
            this.groupLists=[];
          }
        },
        saveTeach(name){ //增加师傅弹窗保存
          this.loadingSend = true;
          this.$refs[name].validate((valid) => {
            if (valid) {
              if(this.teachForm.repairCategoryIds.length == 0){
                this.$Message.error('请选择网点服务类');
                return
              }
              if(!this.teachForm.showFaceImage){
                this.$Message.error('请上传头像');
                return
              }
              if(this.teachForm.repairRegionIds.length == 0){
                this.$Message.error('请选择服务区域列表')
              }
              if(this.teachForm.id == ''){
                delete this.teachForm.id;
              }
              this.$http.post(`/yyht/v1/service/user/saveOrUpdate`,this.teachForm).then(res=>{
                if(res.data.code == 0){
                  this.teachModal = false;
                  this.getLists();
                }else{
                  this.$Message.error(res.data.msg)
                }
                this.loadingSend = false;
              })
            } else {
              this.$Message.error('表单填写不完整！');
              this.loadingSend = false;
            }
          })
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
          getStation(){ //获取弹窗网点下拉列表
            this.$http.get(`/yyht/v1/repair/station/select/list`)
              .then(res=>{
                if(res.data.code===0){
                  this.stationLists=res.data.data;
                  this.modalStation = res.data.data;
                }else{
                  console.log('网点下拉'+res.data.msg);
                }
              })
          },
        changeStation(data){ //服务网点下拉选择改变，获取报修分类和网点关联服务区域
          this.$http.get(`/yyht/v1/repair/category/getStationCategoryTree?repairStationId=${data}`).then(res=>{
            if(res.data.code == 0){
              res.data.data.forEach(ele=>{
                if(ele.children.length != 0){
                   ele.children.forEach(v=>{
                     v.title = v.name
                   })
                }
                ele.title = ele.name
              });
              this.repairTree = res.data.data;
            }else{
              this.$Message.warning(res.data.msg)
            }
          })
          this.getArea(data)
        },
        getArea(data){
          this.$http.get(`/yyht/v1/repair/category/findRegionList?repairStationId=${data}`).then(res=>{
            if(res.data.code == 0){
              this.teachArea = res.data.data
            }
          })
        },
        getLists(filter){
          let param = `pageNo=${this.pageNo}&pageSize=${this.pageSize}`;
          if(filter){
            param=param+'&'+util.formatterParams(filter);
          }
          this.$http.get(`/yyht/v1/service/user/findUserListWithPage?${param}`)
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

      }
    }
</script>

<style scoped lang="scss">

</style>
