webpackJsonp([16],{"NF9+":function(t,e,r){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=r("TVG1"),a={name:"staff-admin",data:function(){var t=this;return{filter:!1,columns:[{title:"昵称",key:"nickName",align:"center"},{title:"姓名",key:"trueName",align:"center"},{title:"手机",key:"userName",align:"center"},{title:"微信openId",key:"wxXcxOpenId",align:"center"},{title:"用户状态",align:"center",render:function(t,e){return t("span",{},"OPEN"===e.row.userState?"开启":"关闭")}},{title:"分润类型",align:"center",render:function(t,e){return t("span",{},{FIXED:"固定金额型",PERCENT:"按百分比型",NONE:"无"}[e.row.commissionType])}},{title:"分润值",key:"commissionValue",align:"center",sortable:!0},{title:"操作",align:"center",render:function(e,r){var i=t;return e("Button",{props:{type:"primary",size:"small"},on:{click:function(){var t=r.row.userId;i.$router.push({name:"staffDetail",query:{id:t,queryType:"normal"}})}}},"查看")}}],lists:[],pageNo:1,pageSize:10,totalCount:0,stationLists:[],showFilterGroup:[],filterForm:{trueName:"",mobile:"",workNumber:"",workState:"",pareDotWork:"",accountsState:"",singularNumberStart:null,singularNumberEnd:null,repairStationId:"",serviceGroupId:""}}},methods:{toggleStation:function(t){t?(this.showFilterGroup=!0,this.getGroup(t)):(this.showFilterGroup=!1,this.groupLists=[])},pageChange:function(t){this.pageNo=t;var e=this.filterForm;this.getLists(e)},pageSizeChange:function(t){this.pageSize=t;var e=this.filterForm;this.getLists(e)},getStation:function(){var t=this;this.$http.get("/yyht/v1/repair/station/select/list").then(function(e){0===e.data.code?t.stationLists=e.data.data:console.log("员工列表网点下拉"+e.data.msg)})},getLists:function(t){var e=this,r="pageNo="+this.pageNo+"&pageSize="+this.pageSize;t&&(r=r+"&"+i.a.formatterParams(t)),this.$http.get("/yyht/v1/user/findUserListWithPage?"+r).then(function(t){if(0===t.data.code){var r=t.data.data;e.lists=r.list,e.pageSize=r.pageSize,e.totalCount=r.totalCount,e.filter=!1}else console.log("列表获取失败："+t.data.msg)})},clearFilter:function(){this.filterForm={trueName:"",mobile:"",workNumber:"",workState:"",pareDotWork:"",accountsState:"",singularNumberStart:null,singularNumberEnd:null,repairStationId:"",serviceGroupId:""},this.pageNo=1,this.getLists()},sureFilter:function(){var t=this.filterForm,e={};for(var r in t)t[r]&&(e[r]=t[r]);this.pageNo=1,this.getLists(e)}},mounted:function(){this.getLists()}},n={render:function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("Card",[r("div",{staticClass:"mb-15"},[r("Button",{on:{click:function(e){t.filter=!0}}},[t._v("筛选")])],1),t._v(" "),r("div",{staticClass:"table-wrapper"},[r("Table",{attrs:{columns:t.columns,data:t.lists}}),t._v(" "),r("div",{staticClass:"pagination"},[r("Page",{attrs:{total:t.totalCount,"show-elevator":"",current:t.pageNo},on:{"update:current":function(e){t.pageNo=e},"on-change":t.pageChange,"on-page-size-change":t.pageSizeChange}})],1)],1),t._v(" "),r("Drawer",{attrs:{title:"工单筛选",width:"425"},model:{value:t.filter,callback:function(e){t.filter=e},expression:"filter"}},[r("div",{staticClass:"clearfix mb-15"},[r("div",{staticClass:"pull-left"},[r("Button",{on:{click:t.clearFilter}},[t._v("清空筛选条件")])],1),t._v(" "),r("div",{staticClass:"pull-right"},[r("Button",{attrs:{type:"primary"},on:{click:t.sureFilter}},[t._v("确定筛选")])],1)]),t._v(" "),r("i-form",{ref:"filterForm",attrs:{model:t.filterForm,"label-position":"top"}},[r("form-item",{attrs:{label:"员工姓名"}},[r("Input",{model:{value:t.filterForm.trueName,callback:function(e){t.$set(t.filterForm,"trueName",e)},expression:"filterForm.trueName"}})],1),t._v(" "),r("form-item",{attrs:{label:"员工手机"}},[r("Input",{model:{value:t.filterForm.mobile,callback:function(e){t.$set(t.filterForm,"mobile",e)},expression:"filterForm.mobile"}})],1),t._v(" "),r("form-item",{attrs:{label:"员工工号"}},[r("Input",{model:{value:t.filterForm.workNumber,callback:function(e){t.$set(t.filterForm,"workNumber",e)},expression:"filterForm.workNumber"}})],1),t._v(" "),r("form-item",{attrs:{label:"接单单数"}},[r("Row",[r("Col",{attrs:{span:"11"}},[r("InputNumber",{staticStyle:{width:"100%"},attrs:{min:0},model:{value:t.filterForm.singularNumberStart,callback:function(e){t.$set(t.filterForm,"singularNumberStart",e)},expression:"filterForm.singularNumberStart"}})],1),t._v(" "),r("Col",{staticStyle:{"text-align":"center"},attrs:{span:"2"}},[t._v("至")]),t._v(" "),r("Col",{attrs:{span:"11"}},[r("InputNumber",{staticStyle:{width:"100%"},attrs:{min:0},model:{value:t.filterForm.singularNumberEnd,callback:function(e){t.$set(t.filterForm,"singularNumberEnd",e)},expression:"filterForm.singularNumberEnd"}})],1)],1)],1),t._v(" "),r("form-item",{attrs:{label:"所属服务网点"}},[r("Select",{attrs:{clearable:!0},on:{"on-change":t.toggleStation},model:{value:t.filterForm.repairStationId,callback:function(e){t.$set(t.filterForm,"repairStationId",e)},expression:"filterForm.repairStationId"}},t._l(t.stationLists,function(e,i){return r("Option",{key:e.id,attrs:{value:e.id}},[t._v(t._s(e.name))])}))],1),t._v(" "),r("form-item",{staticClass:"inline_form_item",attrs:{label:"账号停用"}},[r("i-switch",{attrs:{"true-value":"DISABLE","false-value":null},model:{value:t.filterForm.accountsState,callback:function(e){t.$set(t.filterForm,"accountsState",e)},expression:"filterForm.accountsState"}})],1)],1)],1)],1)},staticRenderFns:[]};var l=r("VU/8")(a,n,!1,function(t){r("sP6T")},"data-v-75d37042",null);e.default=l.exports},sP6T:function(t,e){}});