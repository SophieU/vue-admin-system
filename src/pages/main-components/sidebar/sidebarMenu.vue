<style scoped lang="scss">
  @import './menu.scss';
</style>
<template>
  <Menu accordion ref="sideMenu" :active-name="$route.name" :open-names="openNames" theme="dark" width="auto" @on-select="changeMenu">
    <template v-for="item in menuList">
      <MenuItem v-show="!item.meta.hideInMenu" v-if="item.meta.single" :name="item.children[0].name" :key="'menuitem' + item.name">
        <Icon :type="item.children[0].icon || item.icon" :size="16" :key="'menuicon' + item.name"></Icon>
        <span class="layout-text" :key="'title' + item.name">{{ item.children[0].title }}</span>
      </MenuItem>
      <Submenu v-else  :name="item.name" :key="item.name" v-show="!item.meta.hideInMenu">
        <template slot="title">
          <Icon  :type="item.icon" :size="16"></Icon>
          <span class="layout-text">{{item.title}}</span>
        </template>
        <template v-for="child in item.children" >
          <MenuItem v-show="!child.meta.hideInMenu" :name="child.name?child.name:child.children[0].name" :key="'menuitem'+child.name+child.path" v-if="!child.children||child.meta.hideChild">
            <Icon size="16" :type="child.icon" :key="'icon'+child.name"></Icon>
            <span class="layout-text" :key="'title'+child.name">{{child.title}}</span>
          </MenuItem>
          <Submenu :name="child.name" v-else-if="child.children&&child.children.length>0">
            <template slot="title">
              <Icon :type="child.icon" :size="16"></Icon>
              <span class="layout-text">{{child.title}}</span>
            </template>
            <template v-for="sub in child.children" >
              <MenuItem v-show="!sub.meta.hideInMenu"  :name="sub.name" :key="'menuitem'+sub.name" >
                <Icon size="16" :type="sub.icon" :key="'icon'+sub.name"></Icon>
                <span class="layout-text" :key="'title'+sub.name">{{sub.title}}</span>
              </MenuItem>
            </template>
          </Submenu>

        </template>

      </Submenu>
    </template>

  </Menu>
</template>

<script>
    export default {
        name: "sidebarMenu",
      data:()=>{
        return{
        }
      },
      props:{
          menuList:Array,
          openNames:Array
      },
      methods:{
        changeMenu(active){
          this.$emit('on-change',active);
        },

      },
      //手动更新菜单展开项
      updated(){
        this.$nextTick(()=>{
          if(this.$refs.sideMenu){
            this.$refs.sideMenu.updateOpened();
            this.$refs.sideMenu.updateActiveName();
          }
        })
      }
    }
</script>


