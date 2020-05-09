// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import {appRouter} from './router/router'
import axios from './libs/api';
import 'default-passive-events';
Vue.config.productionTip = false
Vue.config.silent = true;
Vue.prototype.$http = axios;

//重写iview InputNumber浮点方法
iview.InputNumber.computed.precisionValue = function () {
  let arr = (this.currentValue + '').split('.')
  if (this.precision && arr[1] && this.precision < arr[1].length)
    return this.currentValue.toFixed(this.precision)
  return this.currentValue;
};

Vue.use(iview);

//格式化日期
Date.prototype.Format = function (fmt) {
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}
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
    loadGaoDe()

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

function loadGaoDe(){
  var script = document.createElement('script')
  script.src='https://webapi.amap.com/maps?v=1.4.15&key=8a1c307c3702ccf7303aae5617321199&plugin=AMap.MouseTool&plugin=AMap.Geocoder&plugin=AMap.PolyEditor'
  document.body.append(script)
}
