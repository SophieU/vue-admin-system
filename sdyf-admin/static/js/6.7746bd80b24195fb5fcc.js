webpackJsonp([6],{"4fr3":function(e,t){},"Hc+b":function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=r("lZPY"),n=r.n(a);function i(e){var t=0,r="";return e<1e3?t=e:e>=1e3&&e<1e6?(t=parseInt(e/1e3),r="K+"):e>=1e6&&e<1e10?(t=parseInt(e/1e6),r="M+"):(t=parseInt(e/1e9),r="B+"),{val:t,unit:r}}var o={data:function(){return{unit:"",demo:{}}},name:"countUp",props:{idName:String,className:String,startVal:{type:Number,default:0},endVal:{type:Number,required:!0},decimals:{type:Number,default:0},duration:{type:Number,default:2},delay:{type:Number,default:300},options:{type:Object,default:function(){return{useEasing:!0,useGrouping:!0,separator:",",decimal:"."}}},color:String,countSize:{type:String,default:"30px"},countWeight:{type:Number,default:700},introText:[String,Number]},mounted:function(){var e=this;this.$nextTick(function(){setTimeout(function(){var t=i(e.endVal),r=t.val;e.unit=t.unit;var a={};e.demo=a=new n.a(e.idName,e.startVal,r,e.decimals,e.duration,e.options),a.error||a.start()},e.delay)})},watch:{endVal:function(e){var t=this,r=i(e),a=r.val;this.unit=r.unit;var n=setInterval(function(){t.demo.update&&(clearInterval(n),t.demo.update(a))},100)}}},s={render:function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"infor-card-total"},[r("p",{staticClass:"total-count",style:{width:"100%",textAlign:"center",color:e.color,fontSize:e.countSize,fontWeight:e.countWeight}},[r("span",{attrs:{id:e.idName}},[e._v(e._s(e.startVal))]),r("span",[e._v(e._s(e.unit))])]),e._v(" "),e._t("intro")],2)},staticRenderFns:[]};var l={name:"infoCard",components:{countUp:r("VU/8")(o,s,!1,function(e){r("QZmR")},"data-v-46c60f0e",null).exports},props:{idName:String,color:{type:String,default:"#2d8cf0"},icon:{type:String,default:"md-analytics"},title:{type:String},endVal:{type:Number},countSize:{type:String,default:"30px"},countWeight:{type:Number,default:700},iconSize:{type:Number,default:40}}},c={render:function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("Card",{attrs:{padding:0}},[r("div",{staticClass:"info-card-con"},[r("Col",{staticClass:"infor-card-total-con",style:{backgroundColor:e.color,color:"white"},attrs:{span:"8"}},[r("Row",{staticClass:"height-100",attrs:{type:"flex",align:"middle",justify:"center"}},[r("Icon",{attrs:{type:e.icon,size:"42"}})],1)],1),e._v(" "),r("Col",{staticClass:"height-100",attrs:{span:"16"}},[r("Row",{staticClass:"data-card height-100",attrs:{type:"flex",justify:"space-between",align:"middle"}},[r("count-up",{staticClass:"infor-card-count user-created-count",attrs:{"id-name":e.idName,"end-val":e.endVal,color:e.color,countSize:e.countSize,countWeight:e.countWeight}},[r("p",{staticClass:"total-text",attrs:{slot:"intro"},slot:"intro"},[e._v(e._s(e.title))])])],1)],1)],1)])},staticRenderFns:[]};var d=r("VU/8")(l,c,!1,function(e){r("Xgsw")},"data-v-17fa4135",null).exports,u={render:function(){var e=this.$createElement;return(this._self._c||e)("div",{staticStyle:{width:"100%",height:"100%"},attrs:{id:"order_week_trend"}})},staticRenderFns:[]};var p=r("VU/8")({name:"orderWeekTrend",data:function(){return{}},mounted:function(){}},u,!1,function(e){r("jvuT")},"data-v-288cf711",null).exports,m=r("spv5"),f=r("TVG1"),v={name:"createOrder",props:{initiateService:Boolean},data:function(){var e=this;return{newService:{regionName:"",repairCategoryId:"",orderSn:"",userPhone:"",serverName:"",searchType:2},orderIdSearch:!1,repairLists:[],repairListsSecond:[],totalCount:0,pageNo:1,pageSize:5,orderLists:[],orderColumn:[{title:"工单详情",align:"left",render:function(e,t){var r=t.row;return e("span","工单"+r.orderSn+"，\n              "+r.regionName+"，\n              "+r.stationName+"，\n              "+r.repairCategoryName+"，\n              "+r.userPhone+"，\n              "+r.orderState+"，\n              "+("-"===r.isInWarrantyPeriod?"":"质保中，")+"\n              "+(r.orderAmount>0?"￥"+r.orderAmount+"，":"")+"\n              "+(r.materialNames?"辅材使用："+r.materialNames:""))}},{title:"操作",align:"center",width:80,render:function(t,r){var a=e;return t("Button",{props:{type:"primary",size:"small"},on:{click:function(){var e=r.row.id,t=r.row.orderState,n=r.row.isInWarrantyPeriod;a.$router.push({name:"orderControl",query:{id:e,state:t,isWarranty:n}})}}},"查看")}}]}},computed:{activeModal:{get:function(){return this.initiateService},set:function(e){this.$emit("close","initiateService")}}},methods:{firstTypeChange:function(e){var t=this;f.a.getRepairTypeNext(e,function(e){t.repairListsSecond=e})},searchOrder:function(e){var t=this,r=e.pageNo?e.pageNo:1,a=f.a.formatterParams(this.newService),n="pageNo="+r+"&pageSize="+this.pageSize;this.$http.post("/index/search/order?"+n+"&"+a).then(function(e){if(0===e.data.code){var r=e.data.data;t.totalCount=r.totalCount,t.orderLists=r.list,t.pageNo=r.pageNo}})},pageChange:function(e){this.pageNo=e,this.searchOrder({pageNo:e})},modalChange:function(e){e||(this.newService={regionName:"",repairCategoryId:"",orderSn:"",userPhone:"",searchType:1,pageNo:1},this.orderLists=[])}},mounted:function(){}},h={render:function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",[r("Modal",{attrs:{"mask-closable":!1,title:"发起售后",width:"650"},on:{"on-visible-change":e.modalChange},model:{value:e.activeModal,callback:function(t){e.activeModal=t},expression:"activeModal"}},[r("div",{staticClass:"create_service"},[r("Form",{attrs:{model:e.newService,inline:"","label-width":80}},[r("FormItem",{attrs:{label:"服务区域"}},[r("Input",{model:{value:e.newService.regionName,callback:function(t){e.$set(e.newService,"regionName",t)},expression:"newService.regionName"}})],1),e._v(" "),r("FormItem",{attrs:{label:"工单编号"}},[r("Input",{model:{value:e.newService.orderSn,callback:function(t){e.$set(e.newService,"orderSn",t)},expression:"newService.orderSn"}})],1),e._v(" "),r("FormItem",{attrs:{label:"师傅名称"}},[r("Input",{model:{value:e.newService.serverName,callback:function(t){e.$set(e.newService,"serverName",t)},expression:"newService.serverName"}})],1),e._v(" "),r("FormItem",{attrs:{label:"联系手机"}},[r("Input",{model:{value:e.newService.userPhone,callback:function(t){e.$set(e.newService,"userPhone",t)},expression:"newService.userPhone"}})],1),e._v(" "),r("FormItem",{attrs:{label:"服务分类"}},[r("Select",{attrs:{clearable:!0},on:{"on-change":e.firstTypeChange}},e._l(e.repairLists,function(t){return r("Option",{key:t.id,attrs:{value:t.id}},[e._v(e._s(t.name))])}))],1),e._v(" "),r("FormItem",{attrs:{label:"服务项目"}},[r("Select",{staticStyle:{width:"162px"},attrs:{clearable:!0},model:{value:e.newService.repairCategoryId,callback:function(t){e.$set(e.newService,"repairCategoryId",t)},expression:"newService.repairCategoryId"}},e._l(e.repairLists,function(t){return r("Option",{key:t.id,attrs:{value:t.id}},[e._v(e._s(t.name))])}))],1),e._v(" "),r("Button",{staticStyle:{"margin-left":"20px"},attrs:{type:"primary"},on:{click:e.searchOrder}},[e._v("搜索")])],1),e._v(" "),r("div",{staticClass:"table-wrapper"},[r("Table",{attrs:{size:"small",columns:e.orderColumn,data:e.orderLists}}),e._v(" "),e.orderLists.length>0?r("div",{staticClass:"pagination"},[r("Page",{attrs:{current:e.pageNo,"page-size":5,total:e.totalCount},on:{"update:current":function(t){e.pageNo=t},"on-change":e.pageChange}})],1):e._e()],1)],1),e._v(" "),r("div",{attrs:{slot:"footer"},slot:"footer"},[r("Button",{on:{click:function(t){e.activeModal=!1}}},[e._v("关闭")])],1)])],1)},staticRenderFns:[]};var g=r("VU/8")(v,h,!1,function(e){r("gcz4")},"data-v-a233ee90",null).exports,y={name:"cancelOrder",data:function(){var e=this;return{cancelOrder:{regionName:"",repairCategoryId:"",orderSn:"",userPhone:"",searchType:1},orderIdSearch:!1,repairLists:[],totalCount:0,pageNo:1,pageSize:5,orderLists:[],orderColumn:[{title:"工单详情",align:"left",render:function(e,t){var r=t.row;return e("span","工单"+r.orderSn+"，\n              "+r.regionName+"，\n             "+r.stationName+"，\n              "+r.repairCategoryName+"，\n              "+r.orderState+"，\n              "+r.userPhone+"，\n              "+r.createTime)}},{title:"操作",align:"center",width:80,render:function(t,r){var a=e;return t("Button",{props:{type:"primary",size:"small"},on:{click:function(){var e=r.row.id,t=r.row.orderState,n=r.row.isInWarrantyPeriod;a.$router.push({name:"orderControl",query:{id:e,state:t,isWarranty:n}})}}},"查看")}}]}},props:{cancelModal:Boolean},computed:{activeModal:{get:function(){return this.cancelModal},set:function(e){this.$emit("close","cancelModal")}}},methods:{searchOrder:function(e){var t=this,r=e.pageNo?e.pageNo:1,a=f.a.formatterParams(this.cancelOrder),n="pageNo="+r+"&pageSize="+this.pageSize;this.$http.post("/index/search/order?"+n+"&"+a).then(function(e){if(0===e.data.code){var r=e.data.data;t.totalCount=r.totalCount,t.orderLists=r.list,t.pageNo=r.pageNo}})},sureSearch:function(e,t){this.cancelOrder[e]=t,this[e+"Search"]=!1},pageChange:function(e){this.pageNo=e,this.searchOrder({pageNo:e})},modalChange:function(e){e||(this.cancelOrder={regionName:"",repairCategoryId:"",orderSn:"",userPhone:"",searchType:1},this.orderLists=[])}},mounted:function(){}},w={render:function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",[r("Modal",{attrs:{"mask-closable":!1,title:"取消工单",width:"700"},on:{"on-visible-change":e.modalChange},model:{value:e.activeModal,callback:function(t){e.activeModal=t},expression:"activeModal"}},[r("div",{staticClass:"new_order_wrapper"},[r("i-form",{attrs:{model:e.cancelOrder,"label-width":80,inline:""}},[r("form-item",{attrs:{label:"服务区域"}},[r("Input",{model:{value:e.cancelOrder.regionName,callback:function(t){e.$set(e.cancelOrder,"regionName",t)},expression:"cancelOrder.regionName"}})],1),e._v(" "),r("form-item",{attrs:{label:"联系手机"}},[r("Input",{model:{value:e.cancelOrder.userPhone,callback:function(t){e.$set(e.cancelOrder,"userPhone",t)},expression:"cancelOrder.userPhone"}})],1),e._v(" "),r("form-item",{attrs:{label:"工单编号"}},[r("Input",{model:{value:e.cancelOrder.orderSn,callback:function(t){e.$set(e.cancelOrder,"orderSn",t)},expression:"cancelOrder.orderSn"}})],1),e._v(" "),r("form-item",{attrs:{label:"报修分类"}},[r("Select",{staticStyle:{width:"162px"},attrs:{clearable:!0},model:{value:e.cancelOrder.repairCategoryId,callback:function(t){e.$set(e.cancelOrder,"repairCategoryId",t)},expression:"cancelOrder.repairCategoryId"}},e._l(e.repairLists,function(t){return r("Option",{key:t.id,attrs:{value:t.id}},[e._v(e._s(t.name))])}))],1),e._v(" "),r("Button",{attrs:{type:"primary"},on:{click:e.searchOrder}},[e._v("搜索")])],1),e._v(" "),r("div",{staticClass:"table-wrapper"},[r("Table",{attrs:{size:"small",columns:e.orderColumn,data:e.orderLists}}),e._v(" "),e.orderLists.length>0?r("div",{staticClass:"pagination"},[r("Page",{attrs:{current:e.pageNo,"page-size":5,total:e.totalCount},on:{"update:current":function(t){e.pageNo=t},"on-change":e.pageChange}})],1):e._e()],1)],1),e._v(" "),r("div",{attrs:{slot:"footer"},slot:"footer"},[r("Button",{on:{click:function(t){e.activeModal=!1}}},[e._v("关闭")])],1)])],1)},staticRenderFns:[]};var _=r("VU/8")(y,w,!1,function(e){r("dOoe")},"data-v-c926a900",null).exports,C={name:"Index",components:{infoCard:d,orderWeekTrend:p,createOrder:m.a,initiateService:g,cancelOrder:_},data:function(){return{createModal:!1,initiateService:!1,cancelModal:!1,count:{todayNum:0,currentMonthNum:0,totalNum:0}}},methods:{closeModal:function(e){this[e]=!1},getCount:function(){var e=this;this.$http.get("/index/order/count").then(function(t){0===t.data.code?e.count=t.data.data:console.log("首页统计数据："+t.data.msg)})}},mounted:function(){}},S={render:function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"home-index"},[r("Row",{attrs:{gutter:15}},[r("Col",{attrs:{sm:24,md:24,lg:16}},[r("Card",[r("p",{attrs:{slot:"title"},slot:"title"},[e._v("工单统计")]),e._v(" "),r("Row",{attrs:{gutter:15}},[r("Col",{attrs:{xs:24,sm:12,md:8}},[r("router-link",{attrs:{to:{name:"order_filter",query:{from:"home",type:"today"}}}},[r("info-card",{attrs:{"id-name":"today_new_order",title:"今日新增工单","end-val":e.count.todayNum,icon:"md-list"}})],1)],1),e._v(" "),r("Col",{attrs:{xs:24,sm:12,md:8}},[r("router-link",{attrs:{to:{name:"order_filter",query:{from:"home",type:"month"}}}},[r("info-card",{attrs:{"id-name":"month_new_order",title:"本月新增工单","end-val":e.count.currentMonthNum,color:"#FED478"}})],1)],1),e._v(" "),r("Col",{attrs:{xs:24,sm:12,md:8}},[r("router-link",{attrs:{to:{name:"order_filter",query:{from:"home",type:"total"}}}},[r("info-card",{attrs:{"id-name":"history_order",title:"历史工单","end-val":e.count.totalNum,color:"#68D576",icon:"ios-filing-outline"}})],1)],1)],1)],1)],1),e._v(" "),r("Col",{attrs:{sm:24,lg:8}},[r("Card",{staticStyle:{width:"100%","margin-bottom":"10px"}},[r("p",{attrs:{slot:"title"},slot:"title"},[e._v("常用操作")]),e._v(" "),r("div",{staticClass:"controls"},[r("div",{staticClass:"control-btn",on:{click:function(t){e.createModal=!0}}},[r("Icon",{attrs:{type:"ios-create",size:"40"}}),e._v(" "),r("p",[e._v("创建工单")])],1),e._v(" "),r("div",{staticClass:"control-btn",on:{click:function(t){e.initiateService=!0}}},[r("Icon",{attrs:{type:"logo-skype",size:"40"}}),e._v(" "),r("p",[e._v("发起售后")])],1),e._v(" "),r("div",{staticClass:"control-btn",on:{click:function(t){e.cancelModal=!0}}},[r("Icon",{attrs:{type:"md-easel",size:"40"}}),e._v(" "),r("p",[e._v("取消工单")])],1)])])],1)],1),e._v(" "),r("Row",[r("Col",{attrs:{lg:24,md:24,sm:24}},[r("Card",{style:{width:"100%"}},[r("p",{attrs:{slot:"title"},slot:"title"},[e._v("工单趋势")]),e._v(" "),r("div",{staticClass:"weekChart",staticStyle:{height:"500px"}},[r("order-week-trend")],1)])],1)],1),e._v(" "),r("create-order",{attrs:{createOrder:e.createModal},on:{close:e.closeModal}}),e._v(" "),r("initiate-service",{attrs:{initiateService:e.initiateService},on:{close:e.closeModal}}),e._v(" "),r("cancel-order",{attrs:{cancelModal:e.cancelModal},on:{close:e.closeModal}})],1)},staticRenderFns:[]};var b=r("VU/8")(C,S,!1,function(e){r("4fr3")},"data-v-03426aee",null);t.default=b.exports},QZmR:function(e,t){},Xgsw:function(e,t){},dOoe:function(e,t){},fCQE:function(e,t){},gcz4:function(e,t){},jvuT:function(e,t){},lZPY:function(e,t,r){var a,n;void 0===(n="function"==typeof(a=function(e,t,r){return function(e,t,r,a,n,i){for(var o=0,s=["webkit","moz","ms","o"],l=0;l<s.length&&!window.requestAnimationFrame;++l)window.requestAnimationFrame=window[s[l]+"RequestAnimationFrame"],window.cancelAnimationFrame=window[s[l]+"CancelAnimationFrame"]||window[s[l]+"CancelRequestAnimationFrame"];window.requestAnimationFrame||(window.requestAnimationFrame=function(e,t){var r=(new Date).getTime(),a=Math.max(0,16-(r-o)),n=window.setTimeout(function(){e(r+a)},a);return o=r+a,n}),window.cancelAnimationFrame||(window.cancelAnimationFrame=function(e){clearTimeout(e)});var c=this;for(var d in c.options={useEasing:!0,useGrouping:!0,separator:",",decimal:".",easingFn:null,formattingFn:null},i)i.hasOwnProperty(d)&&(c.options[d]=i[d]);""===c.options.separator&&(c.options.useGrouping=!1),c.options.prefix||(c.options.prefix=""),c.options.suffix||(c.options.suffix=""),c.d="string"==typeof e?document.getElementById(e):e,c.startVal=Number(t),c.endVal=Number(r),c.countDown=c.startVal>c.endVal,c.frameVal=c.startVal,c.decimals=Math.max(0,a||0),c.dec=Math.pow(10,c.decimals),c.duration=1e3*Number(n)||2e3,c.formatNumber=function(e){var t,r,a,n;if(e=e.toFixed(c.decimals),r=(t=(e+="").split("."))[0],a=t.length>1?c.options.decimal+t[1]:"",n=/(\d+)(\d{3})/,c.options.useGrouping)for(;n.test(r);)r=r.replace(n,"$1"+c.options.separator+"$2");return c.options.prefix+r+a+c.options.suffix},c.easeOutExpo=function(e,t,r,a){return r*(1-Math.pow(2,-10*e/a))*1024/1023+t},c.easingFn=c.options.easingFn?c.options.easingFn:c.easeOutExpo,c.formattingFn=c.options.formattingFn?c.options.formattingFn:c.formatNumber,c.version=function(){return"1.7.1"},c.printValue=function(e){var t=c.formattingFn(e);"INPUT"===c.d.tagName?this.d.value=t:"text"===c.d.tagName||"tspan"===c.d.tagName?this.d.textContent=t:this.d.innerHTML=t},c.count=function(e){c.startTime||(c.startTime=e),c.timestamp=e;var t=e-c.startTime;c.remaining=c.duration-t,c.options.useEasing?c.countDown?c.frameVal=c.startVal-c.easingFn(t,0,c.startVal-c.endVal,c.duration):c.frameVal=c.easingFn(t,c.startVal,c.endVal-c.startVal,c.duration):c.countDown?c.frameVal=c.startVal-(c.startVal-c.endVal)*(t/c.duration):c.frameVal=c.startVal+(c.endVal-c.startVal)*(t/c.duration),c.countDown?c.frameVal=c.frameVal<c.endVal?c.endVal:c.frameVal:c.frameVal=c.frameVal>c.endVal?c.endVal:c.frameVal,c.frameVal=Math.round(c.frameVal*c.dec)/c.dec,c.printValue(c.frameVal),t<c.duration?c.rAF=requestAnimationFrame(c.count):c.callback&&c.callback()},c.start=function(e){return c.callback=e,c.rAF=requestAnimationFrame(c.count),!1},c.pauseResume=function(){c.paused?(c.paused=!1,delete c.startTime,c.duration=c.remaining,c.startVal=c.frameVal,requestAnimationFrame(c.count)):(c.paused=!0,cancelAnimationFrame(c.rAF))},c.reset=function(){c.paused=!1,delete c.startTime,c.startVal=t,cancelAnimationFrame(c.rAF),c.printValue(c.startVal)},c.update=function(e){cancelAnimationFrame(c.rAF),c.paused=!1,delete c.startTime,c.startVal=c.frameVal,c.endVal=Number(e),c.countDown=c.startVal>c.endVal,c.rAF=requestAnimationFrame(c.count)},c.printValue(c.startVal)}})?a.call(t,r,t,e):a)||(e.exports=n)},spv5:function(e,t,r){"use strict";var a=r("Dd8w"),n=r.n(a),i=r("TVG1"),o={name:"createOrder",data:function(){return{serviceType:"",repairFirst:[],filterRegionLists:[],userType:null,userDiscount:[],needAccept:!1,loadingSubmit:!1,loadingSearch:!1,acceptFee:!1,filterRegionListsTemp:[],searchTelRes:[],newOrder:{repairRegionId:"",repairCategoryId:"",userPhone:"",ysyUserPhone:"",repairAddress:"",username:"",door:null,unit:null,estate:""},newOrderRule:{unit:[{required:!0,message:"请输入楼栋号",trigger:"change",type:"number"}],door:[{required:!0,message:"请输入门牌号",trigger:"change",type:"number"}],repairCategoryId:[{required:!0,message:"请选择报修分类",trigger:"change"}],estate:[{required:!0,message:"请选择报修区域",trigger:"change"}],username:[{required:!0,message:"请输入联系人姓名",trigger:"blur"}],userPhone:[{required:!0,message:"请输入联系电话",trigger:"blur"},{validator:function(e,t,r){/^1[3456789]\d{9}$/.test(t)||t.length<=0?r():r(new Error("请输入正确格式的手机号码"))},trigger:"blur"}]},ysyTelSearch:!1,repairDisSearch:!1,repairLists:[],regionList:[],ysyUserPhoneValid:!0}},props:{createOrder:Boolean},computed:{activeModal:{get:function(){return this.createOrder},set:function(e){this.filterRegionLists=this.filterRegionListsTemp,this.needAccept=!1,this.newOrder.door=null,this.newOrder.unit=null,this.userType=null,this.$emit("close","createModal"),this.$refs.newOrder.resetFields()}}},methods:{repairFirstChange:function(e){var t=this;i.a.getRepairTypeNext(e,function(e){t.repairLists=e,t.newOrder.repairCategoryId=""})},setEstate:function(e){if(e){var t="";this.filterRegionLists.map(function(r){r.name===e&&(t=r.id)}),this.newOrder.repairRegionId=t}},repairChange:function(e){if(e){var t=e.split("+"),r=t[0],a=this.repairLists.some(function(e){if(e.id===r&&"免上门费"===e.discount)return!0});t[1]>0&&!a?this.needAccept=!0:this.needAccept=!1}},setTel:function(e){if(e.length<=0)return this.ysyUserPhoneValid=!0,void(this.newOrder.ysyUserPhone="");/^1[3456789]\d{9}$/.test(e)?(this.ysyUserPhoneValid=!0,this.newOrder.ysyUserPhone=e):this.ysyUserPhoneValid=!1},searchThis:function(e){this[e+"Search"]=!0},sureSearch:function(e,t){this.newOrder[e]=t,this[e+"Search"]=!1},localFilterRegion:function(e){this.userType=null;var t=this.regionList.filter(function(t){return t.name.indexOf(e)>-1});this.filterRegionLists=t},getRegionLists:function(){var e=this;this.$http.get("/repair/region/list").then(function(t){0===t.data.code?(e.regionList=t.data.data,e.filterRegionLists=e.filterRegionListsTemp=e.regionList):console.log("新建工单获取报修区域："+t.data.msg)})},sureSend:function(){var e=this;this.loadingSubmit=!0,this.$refs.newOrder.validate(function(t){if(t){var r=n()({},e.newOrder);r.repairAddress=r.estate+"-"+r.unit+"-"+r.door,delete r.unit,delete r.door,delete r.estate;var a=e.newOrder.repairCategoryId.split("+");if(r.repairCategoryId=a[0],e.needAccept&&!e.acceptFee)return e.$Message.info("请先勾选接受上门费，再继续"),e.loadingSubmit=!1,!1;e.$http.post("/repair/order/add",n()({},r)).then(function(t){0===t.data.code?(e.$Message.success("保存成功"),e.activeModal=!1,e.newOrder={repairRegionId:"",repairCategoryId:"",userPhone:"",ysyUserPhone:"",repairAddress:"",username:"",door:null,unit:null,estate:null},e.needAccept=!1):(e.$Message.error("保存失败："+t.data.msg),e.activeModal=!1),e.loadingSubmit=!1})}else e.loadingSubmit=!1})},searchTel:function(e){var t=this;""!==e?(this.loadingSearch=!0,this.$http.get("/repair/order/user/list?phone="+e).then(function(e){t.loadingSearch=!1,0===e.data.code&&(t.searchTelRes=e.data.data)})):this.searchTelRes=[]},searchUser:function(){var e=this,t=this.newOrder.estate,r=this.newOrder.unit,a=this.newOrder.door;if(t)if(r&&a){if(console.log(this.serviceType),this.serviceType.length<=0)return this.$Message.info("请选择服务分类"),!1;i.a.getRepairTypeNext(this.serviceType,function(t){e.repairLists=t,e.newOrder.repairCategoryId=""}),this.$http.get("/repair/order/discount/dtd/categories?address="+t+"-"+r+"-"+a).then(function(t){if(0===t.data.code){var r=t.data.data;e.userDiscount=r,r.length>0?e.userType="SVIP用户":e.userType="普通用户";var a=e.repairLists;r.forEach(function(e){var t=e.id,r=void 0;r=0===e.rate?"免上门费":e.rate>0?"折扣："+e.rate:"",a.forEach(function(e){e.id===t&&(e.discount=r)})}),e.repairLists=a}})}else this.$Message.info("请输入楼栋以及门牌号");else this.$Message.info("请选择报修区域")}},mounted:function(){}},s={render:function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",[r("Modal",{attrs:{"mask-closable":!1,title:"新建工单"},model:{value:e.activeModal,callback:function(t){e.activeModal=t},expression:"activeModal"}},[r("div",{staticClass:"new_order_wrapper"},[r("i-form",{ref:"newOrder",attrs:{model:e.newOrder,rules:e.newOrderRule,"label-position":"top"}},[r("form-item",{attrs:{label:"一生约绑定手机（非必填）",prop:"ysyUserPhone"}},[r("Select",{attrs:{filterable:"",remote:"","remote-method":e.searchTel,loading:e.loadingSearch},on:{"on-query-change":e.setTel},model:{value:e.newOrder.ysyUserPhone,callback:function(t){e.$set(e.newOrder,"ysyUserPhone",t)},expression:"newOrder.ysyUserPhone"}},e._l(e.searchTelRes,function(t,a){return r("Option",{key:a,attrs:{value:t}},[e._v(e._s(t))])})),e._v(" "),e.ysyUserPhoneValid?e._e():r("span",{staticClass:"text-red"},[e._v("请填写正确的手机号")])],1),e._v(" "),r("form-item",{attrs:{label:"联系人姓名",prop:"username"}},[r("Input",{attrs:{maxlength:10},model:{value:e.newOrder.username,callback:function(t){e.$set(e.newOrder,"username",t)},expression:"newOrder.username"}})],1),e._v(" "),r("form-item",{attrs:{label:"联系电话",prop:"userPhone"}},[r("Input",{model:{value:e.newOrder.userPhone,callback:function(t){e.$set(e.newOrder,"userPhone",t)},expression:"newOrder.userPhone"}})],1),e._v(" "),r("form-item",{attrs:{label:"报修小区",prop:"estate"}},[r("Select",{attrs:{filterable:"",loading:e.loadingSearch},on:{"on-change":e.setEstate},model:{value:e.newOrder.estate,callback:function(t){e.$set(e.newOrder,"estate",t)},expression:"newOrder.estate"}},e._l(e.filterRegionLists,function(t,a){return r("Option",{key:a,attrs:{value:t.name}},[e._v(e._s(t.name))])})),e._v(" "),e.ysyUserPhoneValid?e._e():r("span",{staticClass:"text-red"},[e._v("请设置报修小区")])],1),e._v(" "),r("form-item",{attrs:{label:"详细地址"}},[r("Row",{attrs:{gutter:10}},[r("Col",{attrs:{span:"5"}},[r("form-item",{attrs:{prop:"unit"}},[r("InputNumber",{attrs:{precision:0},on:{"on-change":function(t){e.userType=null}},model:{value:e.newOrder.unit,callback:function(t){e.$set(e.newOrder,"unit",t)},expression:"newOrder.unit"}})],1)],1),e._v(" "),r("Col",{attrs:{span:"3"}},[e._v("楼栋")]),e._v(" "),r("Col",{attrs:{span:"5"}},[r("form-item",{attrs:{prop:"door"}},[r("InputNumber",{attrs:{precision:0},on:{"on-change":function(t){e.userType=null}},model:{value:e.newOrder.door,callback:function(t){e.$set(e.newOrder,"door",t)},expression:"newOrder.door"}})],1)],1),e._v(" "),r("Col",{attrs:{span:"3"}},[e._v("门牌号")]),e._v(" "),r("Col",{attrs:{span:"8"}},[r("Button",{attrs:{size:"small",type:"primary"},on:{click:e.searchUser}},[e._v("查询客户身份")])],1)],1)],1),e._v(" "),r("form-item",{staticClass:"must",attrs:{label:"服务类型"}},[r("Select",{on:{"on-change":function(t){return e.repairFirstChange(t)}},model:{value:e.serviceType,callback:function(t){e.serviceType=t},expression:"serviceType"}},e._l(e.repairFirst,function(t){return r("Option",{key:t.id,attrs:{value:t.id}},[e._v(e._s(t.name))])}))],1),e._v(" "),r("form-item",{attrs:{label:"服务项目"+(null===e.userType?"":"（"+e.userType+"）"),prop:"repairCategoryId"}},[r("Row",{attrs:{gutter:15}},[r("Col",{attrs:{span:"14"}},[r("Select",{attrs:{placeholder:"请先查询客户身份",disabled:null===e.userType},on:{"on-change":e.repairChange},model:{value:e.newOrder.repairCategoryId,callback:function(t){e.$set(e.newOrder,"repairCategoryId",t)},expression:"newOrder.repairCategoryId"}},e._l(e.repairLists,function(t){return r("Option",{key:t.id,attrs:{value:t.id+"+"+t.dtdServiceFee}},[e._v("\n                  "+e._s(t.name)+e._s(t.dtdFee?"(上门费：￥"+t.dtdFee+")":"")+" "+e._s(t.discount?"-"+t.discount:"")+"\n                ")])}))],1),e._v(" "),e.needAccept?r("Col",{attrs:{span:"8"}},[r("Checkbox",{attrs:{disabled:null===e.userType},model:{value:e.acceptFee,callback:function(t){e.acceptFee=t},expression:"acceptFee"}},[e._v("接受上门费")])],1):e._e()],1)],1)],1)],1),e._v(" "),r("div",{attrs:{slot:"footer"},slot:"footer"},[r("Button",{on:{click:function(t){e.activeModal=!1}}},[e._v("取消")]),e._v(" "),r("Button",{attrs:{loading:e.loadingSubmit,type:"primary"},on:{click:e.sureSend}},[e._v(e._s("svip"===e.userType?"发送至服务网点":"确认"))])],1)])],1)},staticRenderFns:[]};var l=r("VU/8")(o,s,!1,function(e){r("fCQE")},"data-v-a9ce3ac4",null);t.a=l.exports}});