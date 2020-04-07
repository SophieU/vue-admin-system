webpackJsonp([31],{MKC6:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i=a("Dd8w"),r=a.n(i),n=a("TVG1"),l={name:"staff-order-income",data:function(){var t=this;return{filter:!1,id:"",orderTotal:"",columns:[{title:"工单号",key:"orderSn",align:"center"},{title:"服务类型",key:"repairCategoryName",align:"center"},{title:"创建时间",key:"createTime",align:"center"},{title:"上门费收益",key:"dtdServiceEarning",align:"center"},{title:"服务费收益",key:"serviceEarning",align:"center"},{title:"辅材费收益",key:"materialEarning",align:"center"},{title:"收益总计",key:"totalEarning",align:"center"},{title:"操作",align:"center",render:function(e,a){var i=t;return e("Button",{props:{type:"primary",size:"small"},on:{click:function(){var t=a.row.id;i.$router.push({name:"orderDetail",query:{id:t}})}}},"查看订单")}}],lists:[],pageNo:1,pageSize:10,totalCount:0,repairTypeLists:[],filterForm:{repairCategoryId:"",dateRange:[],startDate:"",endDate:""},filterDateRange:null}},methods:{dateRangeChange:function(t){this.filterForm.startDate=t[0],this.filterForm.endDate=t[1]},getRepairType:function(){var t=this;n.a.getRepairType(function(e){t.repairTypeLists=e})},getLists:function(t){var e=this,a=this.id,i="pageNo="+this.pageNo+"&pageSize="+this.pageSize+"&id="+a,r=n.a.formatterParams(t);this.$http.post("/yyht/v1/service/user/order/pageList?"+i+"&"+r).then(function(a){if(0===a.data.code){var i=a.data.data;e.lists=i.list,e.pageSize=i.pageSize,e.totalCount=i.totalCount,e.filter=!1,t&&t.startDate?e.filterDateRange=[t.startDate,t.endDate]:e.filterDateRange=null}else console.log("工单收益列表失败："+a.data.msg)})},clearFilter:function(t){this.$refs[t].resetFields(),this.filterDateRange=null,this.filterForm={repairCategoryId:"",dateRange:[],startDate:"",endDate:""},this.getLists()},sureFilter:function(){var t=r()({},this.filterForm);delete t.dateRange;var e={};for(var a in t)(t[a].length>0||t[a]>0)&&(e[a]=t[a]);console.log(t),this.getLists(t)},pageChange:function(t){this.pageNo=t,this.getLists()},pageSizeChange:function(t){this.pageSize=t,this.getLists()}},mounted:function(){this.id=this.$route.query.id,this.getLists(),this.getRepairType()}},s={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("Card",[a("p",{attrs:{slot:"title"},slot:"title"},[t._v("工单列表")]),t._v(" "),a("div",{staticClass:"clearfix mb-15"},[t.filterDateRange?a("div",{staticClass:"pull-left"},[a("span",[t._v("时间："+t._s(t.filterDateRange[0])+" 至 "+t._s(t.filterDateRange[1]))])]):t._e(),t._v(" "),a("div",{staticClass:"pull-right"},[a("Button",{on:{click:function(e){t.filter=!0}}},[t._v("筛选")])],1)]),t._v(" "),a("div",{staticClass:"table-wrapper"},[a("Table",{attrs:{columns:t.columns,data:t.lists}}),t._v(" "),a("div",{staticClass:"pagination"},[a("Page",{attrs:{total:t.totalCount,"show-elevator":""},on:{"on-change":t.pageChange,"on-page-size-change":t.pageSizeChange}})],1)],1)]),t._v(" "),a("Drawer",{attrs:{width:"450",title:"收益筛选"},model:{value:t.filter,callback:function(e){t.filter=e},expression:"filter"}},[a("div",{staticClass:"clearfix mb-15"},[a("div",{staticClass:"pull-left"},[a("Button",{on:{click:function(e){t.clearFilter("filterForm")}}},[t._v("清空筛选条件")])],1),t._v(" "),a("div",{staticClass:"pull-right"},[a("Button",{attrs:{type:"primary"},on:{click:t.sureFilter}},[t._v("确定筛选")])],1)]),t._v(" "),a("i-form",{ref:"filterForm",attrs:{model:t.filterForm,"label-position":"top"}},[a("form-item",{attrs:{label:"服务分类"}},[a("Select",{model:{value:t.filterForm.repairCategoryId,callback:function(e){t.$set(t.filterForm,"repairCategoryId",e)},expression:"filterForm.repairCategoryId"}},t._l(t.repairTypeLists,function(e){return a("Option",{key:e.id,attrs:{value:e.id}},[t._v(t._s(e.name))])}))],1),t._v(" "),a("form-item",{attrs:{label:"工单时间"}},[a("DatePicker",{staticStyle:{width:"100%"},attrs:{type:"daterange"},on:{"on-change":t.dateRangeChange},model:{value:t.filterForm.dateRange,callback:function(e){t.$set(t.filterForm,"dateRange",e)},expression:"filterForm.dateRange"}})],1)],1)],1)],1)},staticRenderFns:[]};var o=a("VU/8")(l,s,!1,function(t){a("ea9z")},"data-v-1b532710",null);e.default=o.exports},ea9z:function(t,e){}});