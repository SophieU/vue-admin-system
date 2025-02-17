// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import {appRouter} from './router/router'
import axios from './libs/api';
Vue.config.productionTip = false

Vue.prototype.$http = axios;

//重写iview InputNumber浮点方法
iview.InputNumber.computed.precisionValue = function () {
  let arr = (this.currentValue + '').split('.')
  if (this.precision && arr[1] && this.precision < arr[1].length)
    return this.currentValue.toFixed(this.precision)
  return this.currentValue;
};

Vue.use(iview);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render:h=>h(App),
  data:{
    currentPageName:''
  },
  mounted(){
    this.currentPage=this.$route.name;
    //显示打开的页面列表
    this.$store.commit('setOpenedList');
    this.$store.commit('initCachepage');
    // 权限菜单过滤相关
    // this.$store.commit('updateMenulist');

  },
  created(){
    let tagsList = [];
    appRouter.map(item=>{
      if(item.children.length<=1){
        tagsList.push(item.children[0]);
      }else{
        tagsList.push(...item.children);
      }
    });
    // this.$store.commit('setTagsList',tagsList);
  }
})
