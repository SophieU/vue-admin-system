webpackJsonp([17],{PbOx:function(t,e){},azOz:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var a={name:"staff-control",data:function(){return{userId:"",userMobile:"",columns:[{title:"业务行为",key:"actionTypeName",align:"center"},{title:"业务描述",key:"changeIntro",align:"center"},{title:"变动金额",align:"center",render:function(t,e){var n="-1"==e.row.changeType?"-":"+";return t("span",{style:{color:"-"==n?"#19be6b":"#ed4014"}},n+e.row.changeNum)}},{title:"余额",key:"surplusNum",align:"center"},{title:"时间",key:"createTime",align:"center"},{title:"钱包状态",align:"center",render:function(t,e){var n="1"===e.row.state?"正常":"冻结中";return t("span",{style:{color:"正常"===n?"#2d8cf0":"#ed4014"}},n)}}],lists:[],pageNo:1,pageSize:10,loading:!0,totalCount:0}},mounted:function(){this.userId=this.$route.query.id,this.getLists()},methods:{getLists:function(t){var e=this;this.loading=!0,t&&(this.pageNo=t);var n={pageNo:this.pageNo,pageSize:this.pageSize,userId:this.userId};this.$http.get("/yyht/v1/user/getUserAccountLogPageList",{params:n}).then(function(t){if(e.loading=!1,0===t.data.code){var n=t.data.data;e.lists=n.list,e.totalCount=n.totalCount,console.log(n)}else console.log(t.data.msg)})}}},o={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",[n("Card",{staticClass:"mb-15"},[n("Table",{attrs:{loading:t.loading,columns:t.columns,data:t.lists}}),t._v(" "),n("div",{staticClass:"pagination"},[n("Page",{attrs:{total:t.totalCount,current:t.pageNo,"on-change":function(e){return t.getLists(e)}},on:{"update:current":function(e){t.pageNo=e}}})],1)],1)],1)},staticRenderFns:[]};var i=n("VU/8")(a,o,!1,function(t){n("PbOx")},"data-v-631e2bd6",null);e.default=i.exports}});