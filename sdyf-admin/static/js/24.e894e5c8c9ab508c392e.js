webpackJsonp([24],{"0Xrw":function(t,e){},NSIP:function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var i={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",[n("Card",[n("div",{staticClass:"clearfix mb-15"},[n("div",{staticClass:"pull-left"},[n("Button",{attrs:{type:"primary",icon:"md-add-circle"},on:{click:function(e){t.goControl(1)}}},[t._v("新建")])],1)]),t._v(" "),n("div",{staticClass:"table-wrapper"},[n("Table",{attrs:{data:t.roleLists,columns:t.roleColumns}})],1)])],1)},staticRenderFns:[]};var o=n("VU/8")({name:"role-admin",data:function(){var t=this;return{roleColumns:[{title:"角色名",key:"name",align:"center"},{title:"角色描述",key:"description",align:"center"},{title:"操作",align:"center",render:function(e,n){var i=t,o=n.row.id;return e("div",[e("Button",{props:{type:"primary",size:"small"},style:{marginRight:"8px"},on:{click:function(){i.viewInfo=!0,i.goControl(2,o)}}},"查看"),e("Button",{props:{type:"success",size:"small"},on:{click:function(){i.viewInfo=!0,i.goControl(0,o)}}},"编辑")])}}],roleLists:[]}},methods:{goControl:function(t,e){this.$router.push({name:"editRole",query:{type:t,id:e}})},getRoleLists:function(){var t=this;this.$http.get("/sys/v1/role/getAllRoleList").then(function(e){if(0===e.data.code){var n=e.data.data;t.roleLists=n}})}},mounted:function(){this.getRoleLists()}},i,!1,function(t){n("0Xrw")},"data-v-4508f8a6",null);e.default=o.exports}});