<style lang="scss">
  @import './main.scss';
</style>
<template>
  <div class="main" >
    <div class="sidebar-menu" :style="{width:'240px',overflow:collapse?'visible':'auto'}">
      <sidebar
        :menu-list="menuList"
        :open-names="openedSubmenuArr"
        :collapse = "collapse"
        @on-change="handleSubmenuChange"
      >
        <div slot="top"  class="logo-con">
          <div class="top-logo" v-show="!collapse">
            <img src="../assets/imgs/logo-ico.png"  key="max-logo">
            <span>天富一生约</span>
            <span>&nbsp;·&nbsp;</span>
            <span>呼叫中心</span>
          </div>
          <img v-show="collapse" src="../assets/imgs/logo-ico.png"  key="min-logo" >
        </div>
      </sidebar>
    </div>
    <!--顶部-->
    <div class="main-header-con" :style="{paddingLeft:'240px'}">
      <div class="main-header">
        <!--收缩按钮-->
        <div class="header-middle-con">
          <!--面包导航-->
          <div class="header-middle-con">
            <div class="main-breadcrumb">
              <breadcrumb-nav :currentPath="currentPath"></breadcrumb-nav>
            </div>
          </div>
        </div>
        <div class="header-avator-con">
          <div class="user-dropdown-menu-con">
            <Row class="user-dropdown-innercon" type="flex" justify="end" align="middle">
              <Dropdown  transfer trigger="click" @on-click="handleUserDropdown">
                <a href="javascript:void(0)">
                  <span class="main-user-name">{{userName}}</span>
                  <Icon type="md-arrow-dropdown" />
                </a>
                <DropdownMenu slot="list">
                  <DropdownItem name="logOut">退出</DropdownItem>
                </DropdownMenu>
              </Dropdown>
              <Avatar style="background-color: #87d068;margin-left:15px;" icon="ios-person" />
            </Row>
          </div>
        </div>
      </div>
       <div class="tags-con">
        <tags-page-opened :pageTagsList="pageTagsList"></tags-page-opened>
      </div>
    </div>
    <div class="main-content" :style="{left:'240px'}">
      <div class="single-page">
        <keep-alive :include="cachePage">
          <router-view></router-view>
        </keep-alive>
      </div>
    </div>
    <delete-modal :model="showDelete.model" :callback="showDelete.callback"></delete-modal>
    <upload-progress :model="uploadProgressVisible" :percent="uploadProgressPercent"></upload-progress>
  </div>
</template>

<script>
  import sidebar from './main-components/sidebar/sidebar'
  import breadcrumbNav from './main-components/breadcrumb-nav'
  import messageTip from './main-components/message-tip'
  import util from '../libs/util'
  import Cookies from 'js-cookie'
  import deleteModal from './main-components/delete-alert'
  import uploadProgress from './main-components/upload-progress'
  import tagsPageOpened from './main-components/tags-page-opened'
    export default {
        name: "Main",
      components:{
        sidebar,
        breadcrumbNav,
        messageTip,
        deleteModal,
        uploadProgress,
        tagsPageOpened
      },
      data:()=>{
          return {
            collapse:false, //菜单收起状态
            userName:'',
          }
      },

      computed:{
          uploadProgressVisible(){
            return this.$store.state.app.uploadProgressVisible
          },
          uploadProgressPercent(){
            return this.$store.state.app.uploadProgressPercent
          },
          cachePage(){
            return this.$store.state.app.cachePage;
          },
          menuList(){
              return this.$store.state.app.menuList;
          },
          openedSubmenuArr(){
              return this.$store.state.app.openedSubmenuArr;
          },
          pageTagsList(){
            return this.$store.state.app.pageOpenedList; //打开的页面标签组合
          },
          currentPath () {
            return this.$store.state.app.currentPath; // 当前面包屑数组
          },
          curVillage(){
              return this.$store.state.app.curVillage;
          },
          showDelete(){
            return this.$store.state.app.deleteModal;
          }
      },
      methods:{
        toggleCollapse(){
          this.collapse=!this.collapse;
        },
        init(){
          this.$store.commit('updateMenulist');
          let pathArr = util.setCurrentPath(this,this.$route.name);
          if(pathArr.length>=3){
            let arr = [pathArr[0].name,pathArr[1].name];
            this.$store.commit('addOpenSubmenu',arr,true); //展开子菜单
          }else if(pathArr.length>=2){
            this.$store.commit('addOpenSubmenu',pathArr[0].name); //展开子菜单
          }
          this.checkTag(this.$route.name);
          this.userName=Cookies.get('user');

        },
        handleSubmenuChange(val){
        },

        //退出
        handleUserDropdown(name){
            if (name === 'logOut') {
            // 退出登录
            this.$store.commit('logout', this);
            this.$http.post('/user/login/out').then(res=>{

              if(res.data.code!==0){
                console.log(res.data.msg);
              }
              this.$router.push({
                name: 'login'
              });
              this.$store.commit('clearOpenSubmenu');
            })

            // this.$store.commit('clearOpenedSubmenu');

          }
        },
        checkTag (name) {
          //打开一个标签（如关闭一个后，打开最近的）
          let openpageHasTag = this.pageTagsList.some(item => {
            if (item.name === name) {
              return true;
            }
          });

          if (!openpageHasTag) { //  解决关闭当前标签后再点击回退按钮会退到当前页时没有标签的问题
            util.openNewPage(this, name, this.$route.params || {}, this.$route.query || {});
          }
        },
      },
      mounted(){
          this.init();
          // window.addEventListener('resize',this.checkScreen);
      },
      created(){
        //显示打开的页面列表
        this.$store.commit('setOpenedList');
      },

      watch:{
          '$route'(to){
            this.$store.commit('setCurrentPageName',to.name);

            let pathArr = util.setCurrentPath(this,this.$route.name);
            if(pathArr.length>=3){
              let arr = [pathArr[0].name,pathArr[1].name];
              this.$store.commit('addOpenSubmenu',arr,true); //展开子菜单
            }else if(pathArr.length>=2){
              this.$store.commit('addOpenSubmenu',pathArr[0].name); //展开子菜单
            }
            this.checkTag(to.name);
            localStorage.currentPageName = to.name;
          },
        uploadProgressVisible(val){
          if(val){
            let percent=0;
            let timer = setInterval(()=>{
              if(percent>=95){
                clearTimeout(timer);
              }else{
                percent=percent+5;
              }
              this.$store.commit('setUploadPercent',percent);
            },100);
          }
        }
      }
    }
</script>



