<style scoped lang="scss">
  @import "../staff.scss";
</style>
<template>
  <div v-if="info">
    <Row :gutter="15">
      <Col :lg="12" :sm="24">
        <Card class="mb-15">
            <p slot="title">基础信息：</p>
            <div slot="extra" style="margin-top:-5px;">
              <Button @click="saveInfo" v-if="edit" type="primary" >保存</Button>
              <Button type="primary" :disabled="edit" @click="edit=true;showGroupSelect=true">编辑</Button>
            </div>
            <div class="info-panel">
              <ul class="form-ul">
                <li>
                  <span class="label">姓名：</span>
                  <span>{{info.trueName}}</span>
                </li>
                <li>
                  <span class="label">电话：</span>
                  <span>{{info.mobile}}</span>
                </li>
                <li>
                  <span class="label">工号：</span>
                  <span>{{info.workNumber}}</span>
                </li>
                <li>
                  <span class="label">上班状态：</span>
                  <span class="text-grey">{{info.workStateName}}</span>
                </li>
                <li>
                  <span class="label">所属网点：</span>
                  <Select @on-change="changeStation" v-model="info.repairStationId" :disabled="!edit" style="width: 200px;">
                    <Option :key="station.id" v-for="station in stationLists" :value="station.id">{{station.name}}</Option>
                  </Select>
                </li>
                <li>
                  <span class="label">所属组：</span>
                  <div v-show="!showGroupSelect">
                    <span style="margin-right: 15px;">{{info.groupName}}</span>
                    <!-- <Button class="text-blue" type="text" @click="viewGroup(info.groupId)">查看组信息</Button> -->
                  </div>
                  <Select v-model="info.groupId" @on-change="selectedGroup" style="width:160px;" v-show="showGroupSelect">
                    <Option v-for="(group,index) in groupLists" :key="index" :value="group.id">{{group.name}}</Option>
                  </Select>
                </li>
                <li style="align-items: flex-start;">
                  <span class="label" style="display:block;padding-top: 7px;">该组服务区域：</span>
                  <div class="area-lists" v-show="showDistrict">
                    <Tag type="dot" v-for="(region,index) in regionList" :key="index">{{region}}</Tag>
                  </div>
                </li>
                <li>
                  <span class="label">账号状态：</span>
                  <span class="text-grey">{{info.accountsStateName}}</span>
                </li>
                <li>
                  <span class="label">账号管控：</span>
                  <span class="text-grey">{{info.businessStateName}}</span>
                </li>
              </ul>
            </div>
        </Card>
        <Card>
          <p slot="title">账号信息：</p>
          <div slot="extra" style="margin-top:-5px;">
            <Button type="primary" @click="$router.push({name:'staffAccountInfo',query:{id:info.id}})">查看</Button>
          </div>
          <ul class="form-ul">
            <li>
              <span class="label">账号：</span>
              <span>{{info.username}}</span>
            </li>
          </ul>
        </Card>
      </Col>
      <Col :lg="12" :sm="24">
        <Card class="mb-15">
          <p slot="title">服务类型：</p>
          <div slot="extra" style="margin-top:-5px;">
            <Button type="primary" @click="$router.push({name:'staffServiceType',query:{id:info.id}})">查看</Button>
          </div>
          <ul class="service-lists">
            <!--<li class="service-tag" :key="service" v-for="service in info.serviceCategoryList">{{service}}</li>-->
            <!--分类树-->
            <Tree ref="repairTree" class="column_3" :data="info.repairCategoryTree" ></Tree>
          </ul>
        </Card>
        <Card>
          <p slot="title">统计：</p>
          <div slot="extra" style="margin-top:-5px;">
            <Button type="primary" @click="$router.push({name:'staffOrderIncome',query:{id:info.id}})">查看</Button>
          </div>
          <ul class="form-ul_column2">
            <li>历史处理工单：<span>{{info.orderCountInfo.totalOrderNum}}</span></li>
            <li>本月处理工单：<span>{{info.orderCountInfo.currentMonthOrderNum}}</span></li>
            <li>历史售后工单：<span>{{info.orderCountInfo.totalAfterSaleOrderNum}}</span></li>
            <li>本月售后工单：<span>{{info.orderCountInfo.currentMonthAfterSaleOrderNum}}</span></li>
            <li>历史申述次数：<span>{{info.orderCountInfo.totalAppealNum}}</span></li>
            <li>本月申述次数：<span>{{info.orderCountInfo.currentMonthAppealNum}}</span></li>
          </ul>
        </Card>
      </Col>
    </Row>

    <!-- <Modal :title="userGroupInfo.stationName+'-'+userGroupInfo.groupName" v-model="showGroupModal">
      <div >
        <h4 style="font-size: 14px;margin-bottom:5px;">服务区域：</h4>
        <div class="areaWrap">
          <span :key="item" v-for="item in userGroupInfo.regionNames" class="tag">{{item}}</span>
        </div>
      </div>
      <div slot="footer">
        <Button @click="showGroupModal=false">关闭</Button>
      </div>
    </Modal> -->
  </div>
</template>

<script>
    export default {
        name: "staff-base",
      data(){
        return {
          info:null,
          edit:false,
          stationLists:[],
          showGroupModal:false,
          userGroupInfo:{}, //员工服务组信息
          showGroupSelect:false,
          showDistrict:true,
          groupLists:[], //组信息
          regionList:[], //组的服务区域
        }
      },
      methods:{
        selectedGroup(val){
          if(!val) return;
          this.showDistrict=true;
          this.$http.get(`/server/group/region?groupId=${val}`)
            .then(res=>{
              if(res.data.code===0){
                let data = res.data.data;
                this.regionList=data;
              }
            })
        },
        changeStation(val){
          this.showGroupSelect=true;
          this.showDistrict=false;
          this.info.groupId='';
          this.$http.get(`/server/find/group?stationId=${val}`)
            .then(res=>{
              if(res.data.code===0){
                let data = res.data.data;
                this.groupLists=data;
              }
            })
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
        formatTreeData(data){
          let res = data.map(item=>{
            item.title=  item.name;
            if(item.children&&item.children.length>0){
              item.children = this.formatTreeData(item.children)
            }
            return item
          })
          return res
        },
        getInfo(id){
          this.$http.get(`/server/info?id=${id}`)
            .then(res=> {
              if(res.data.code===0){
                this.info=res.data.data;
                let repairCategoryTree = res.data.data.repairCategoryTree;
                this.info.repairCategoryTree = this.formatTreeData(repairCategoryTree);
                this.groupLists= res.data.data.groupList;
                this.regionList=res.data.data.regionList;
                this.$store.commit('setStaffServiceType',this.info.repairCategoryTree);
                //员工账号信息不可编辑，密码只为显示
                this.$store.commit('setStaffAccount',{username:this.info.username});
              }else{
                console.log('人员基础信息获取失败：'+res.data.msg)
              }

            })
        },
        saveInfo(){
          let stationId=this.info.repairStationId;
          let id = this.info.id;
          let serviceGroupId=this.info.groupId;
          this.$http.post(`/server/change/station?id=${id}&stationId=${stationId}&serviceGroupId=${serviceGroupId}`)
            .then(res=>{
              if(res.data.code===0){
                this.$Message.success('网点修改成功');
                this.edit=false;
                this.showGroupSelect=false; //返回显示组信息
                this.getInfo(this.id);
              }else{
                this.$Message.error(res.data.msg);
              }
            })
        },
        // viewGroup(id){
        //   this.$http.get(`/server/group/info?id=${id}`)
        //     .then(res=>{
        //       if(res.data.code===0){
        //         this.userGroupInfo = res.data.data;
        //         this.showGroupModal=true;

        //       }else{
        //         this.$Message.error('获取组信息失败：'+res.data.msg);
        //       }
        //     })
        // }
      },
      mounted(){
          this.id= this.$route.query.id;
          this.getInfo(this.id);
          this.getStation();

      }
    }
</script>

