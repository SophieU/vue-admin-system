webpackJsonp([26],{HBtY:function(t,s,a){"use strict";Object.defineProperty(s,"__esModule",{value:!0});var e={name:"order-detail",data:function(){return{id:"",baseInfo:{},dispatchInfo:{},repairOrderAmountVos:[],repairOrderOfferPlanVoList:[],stateArr:[{title:"待分配",state:"ASSIGNED"},{title:"待上门",state:"WAIT_DOOR"},{title:"已上门",state:"WAITING_DOOR"},{title:"待付款",state:"STAY_PAY"},{title:"待服务",state:"WAIT_SERVICE"},{title:"已完成",state:"FINISH"},{title:"售后中",state:"AFTER_SALE"},{title:"已取消",state:"CANCEL"},{title:"已关闭",state:"CLOSED"},{title:"异常",state:"EXCEPTION"}],inviteStaffVoList:[]}},methods:{getBaseInfo:function(){var t=this,s=this.id;this.$http.get("/yyht/v1/repair/order/baseInfo?id="+s).then(function(s){if(0===s.data.code){var a=s.data.data,e=a.orderState;t.stateArr.forEach(function(t){t.state===e&&(a.orderState=t.title)}),t.baseInfo=s.data.data.baseInfo,t.dispatchInfo=s.data.data.dispatchInfo,t.repairOrderAmountVos=s.data.data.repairOrderAmountVos,t.repairOrderOfferPlanVoList=s.data.data.repairOrderOfferPlanVoList}else console.log("工单基础信息获取失败："+s.data.msg)})},viewStaff:function(t){this.$router.push({name:"staffDetail",query:{id:t}})}},mounted:function(){var t=this.$route.query.id;this.id=t,this.getBaseInfo(t)},destroyed:function(){sessionStorage.removeItem("viewOrderId")}},i={render:function(){var t=this,s=t.$createElement,a=t._self._c||s;return a("div",{staticClass:"order-detail"},[a("Row",{attrs:{gutter:15}},[a("Col",{attrs:{lg:8,sm:24}},[a("Card",[a("div",{staticClass:"order-title",staticStyle:{"border-bottom":"1px solid #ddd","margin-bottom":"10px"}},[a("h4",[a("Icon",{attrs:{color:"#57a3f3",type:"ios-list",size:"28"}}),t._v(t._s(t.baseInfo.orderSn))],1),t._v(" "),a("span",{staticClass:"status"},[t._v(t._s(t.baseInfo.orderState))])]),t._v(" "),a("div",{staticClass:"order-item"},[a("span",{staticClass:"label"},[t._v("服务项目：")]),t._v(" "),a("span",{staticClass:"item-info"},[a("p",[t._v(t._s(t.baseInfo.repairCategoryName))]),t._v(" "),"Y"===t.baseInfo.isAcceptDtdFee?a("p",{staticClass:"text-grey"},[t._v("(同意上门费)")]):t._e()])]),t._v(" "),a("Divider"),t._v(" "),a("div",{staticClass:"order-item"},[a("span",{staticClass:"label"},[t._v("报修区域：")]),t._v(" "),a("span",{staticClass:"item-info"},[t._v(t._s(t.baseInfo.repairRegionName))])]),t._v(" "),a("div",{staticClass:"order-item"},[a("span",{staticClass:"label"},[t._v("详细地址：")]),t._v(" "),a("span",{staticClass:"item-info"},[t._v(t._s(t.baseInfo.address))])]),t._v(" "),a("div",{staticClass:"order-item"},[a("span",{staticClass:"label"},[t._v("用户手机：")]),t._v(" "),a("span",{staticClass:"item-info"},[t._v(t._s(t.baseInfo.userPhone))])]),t._v(" "),a("div",{staticClass:"order-item"},[a("span",{staticClass:"label"},[t._v("联系人姓名：")]),t._v(" "),a("span",{staticClass:"item-info"},[t._v(t._s(t.baseInfo.username))])]),t._v(" "),a("div",{staticClass:"order-item"},[a("span",{staticClass:"label"},[t._v("联系电话：")]),t._v(" "),a("span",{staticClass:"item-info"},[t._v(t._s(t.baseInfo.userPhone))])]),t._v(" "),a("Divider"),t._v(" "),a("div",{staticClass:"order-item"},[a("span",{staticClass:"label"},[t._v("接单师傅：")]),t._v(" "),a("span",{staticClass:"item-info"},[a("span",[t._v(t._s(t.dispatchInfo.masterName))]),t._v(" "),t.dispatchInfo.id?a("span",{staticClass:"text-blue",staticStyle:{"margin-left":"10px",cursor:"pointer"},on:{click:function(s){t.viewStaff(t.dispatchInfo.id)}}},[t._v("查看")]):t._e()])]),t._v(" "),a("div",{staticClass:"order-item"},[a("span",{staticClass:"label"},[t._v("师傅电话：")]),t._v(" "),a("span",{staticClass:"item-info"},[t._v(t._s(t.dispatchInfo.masterPhone))])]),t._v(" "),a("Divider"),t._v(" "),a("div",{staticClass:"order-item"},[a("span",{staticClass:"label"},[t._v("协作人员：")]),t._v(" "),t.inviteStaffVoList&&t.inviteStaffVoList.length>0?a("div",{staticStyle:{display:"inline-block"}},t._l(t.inviteStaffVoList,function(s,e){return a("span",{key:e,staticClass:"item-info"},[a("span",[t._v(t._s(s.name))]),t._v(" "),a("span",{staticClass:"text-blue",staticStyle:{"margin-left":"10px",cursor:"pointer"},on:{click:function(a){t.$router.push({name:"staffDetail",query:{id:s.id}})}}},[t._v("查看")])])})):a("span",[t._v("无")])]),t._v(" "),a("Divider"),t._v(" "),a("div",{staticClass:"order-item"},[a("span",{staticClass:"label"},[t._v("费用清单：")]),t._v(" "),a("div",{staticClass:"order-sub-item"},t._l(t.repairOrderAmountVos,function(s){return a("p",{key:s.type,staticClass:"sub-item-text"},[a("span",{staticClass:"label"},[t._v(t._s(s.name)+"：")]),t._v(" "),a("span",[t._v(t._s(s.amount))])])}))]),t._v(" "),a("div",{staticClass:"order-item"},[a("span",{staticClass:"label"},[t._v("费用明细：")]),t._v(" "),a("div",{staticClass:"order-sub-item"},t._l(t.repairOrderOfferPlanVoList,function(s){return a("p",{key:s.type,staticClass:"sub-item-text"},[a("span",{staticClass:"label"},[t._v(t._s(s.planName)+"：")]),t._v(" "),a("span",[t._v(t._s(s.amount))])])}))]),t._v(" "),a("Divider"),t._v(" "),a("div",{staticClass:"order-item"},[a("span",{staticClass:"label"},[t._v("服务网点：")]),t._v(" "),a("span",{staticClass:"item-info"},[t._v(t._s(t.baseInfo.stationName))])]),t._v(" "),a("div",{staticClass:"order-item"},[a("span",{staticClass:"label"},[t._v("创建时间：")]),t._v(" "),a("span",{staticClass:"item-info"},[t._v(t._s(t.baseInfo.createTime))])])],1)],1),t._v(" "),a("Col",{attrs:{lg:16,sm:24}},[a("Card",{staticClass:"order-detail-right"},[a("ul",{staticClass:"mb-15 nav-ul"},[a("router-link",{attrs:{exact:"","active-class":"text-blue",replace:"",tag:"li",to:{name:"orderDetail",query:{id:t.id}}}},[t._v("处理流程")]),t._v(" "),a("router-link",{attrs:{"active-class":"text-blue",replace:"",tag:"li",to:{name:"visitedInfo",query:{id:t.id}}}},[t._v("回访信息")])],1),t._v(" "),a("router-view")],1)],1)],1)],1)},staticRenderFns:[]};var r=a("VU/8")(e,i,!1,function(t){a("cgtO")},"data-v-39fc8815",null);s.default=r.exports},cgtO:function(t,s){}});