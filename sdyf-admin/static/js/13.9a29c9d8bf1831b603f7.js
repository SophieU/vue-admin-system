webpackJsonp([13],{EuWY:function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var o=i("Dd8w"),a=i.n(o),n=i("TVG1"),r=i("M4fF"),s=i.n(r),l={name:"port-info",props:["viewPortInfo","page","title","refresh"],computed:{viewInfo:{get:function(){return this.viewPortInfo},set:function(t){this.formatDataTree(this.repairTypes,{disableCheckbox:t},this.portSettingForm.categoryList),this.$emit("update:viewPortInfo",t)}},pageInfo:{get:function(){return this.page},set:function(t){this.checkAllCategory=!1,this.checkAllRegion=!1,this.$emit("update:page",t)}}},data:function(){return{checkAllCategory:!1,checkAllRegion:!1,loadingSave:!1,portSettingForm:{name:"",address:"",phone:"",isSlave:!1,regionList:[],loginName:"",password:"",buttCode:"",categoryList:[],state:"",isSelf:""},stationLists:[],initialRepairTypes:[],repairTypes:[],portSettingRule:{name:[{required:!0,message:"请输入网点名称",trigger:"blur"}],address:[{required:!0,message:"请输入网点地址",trigger:"blur"}],phone:[{required:!0,message:"请输入网点电话",trigger:"blur"},{validator:function(t,e,i){""===e?i(new Error("请输入联系电话")):""!==e&&(/^1[3456789]\d{9}/.test(e)||/0\d{2,3}-\d{7,8}/.test(e)?i():i(new Error("请输入正确格式的电话")))},trigger:"blur"}],loginName:[{required:!0,message:"管理员账号",trigger:"blur"}],password:[{required:!0,message:"管理员密码",trigger:"blur"},{validator:function(t,e,i){e.length<6?i(new Error("密码至少6位")):e.length>10?i(new Error("密码最多10位")):i()},trigger:"blur"}],categoryList:[{validator:function(t,e,i){e.length<=0?i(new Error("请选择服务类型")):i()},message:"请选择服务类型",trigger:"blur"}],state:[{required:!0,message:"请选择服务商权限",trigger:"change"}],isSelf:[{required:!0,message:"请选择是否自营",trigger:"change"}]}}},methods:{handleCheckAll:function(t){this[t]=!this[t],this[t]?this.portSettingForm.regionList=this.stationLists.map(function(t){return t.id}):this.portSettingForm.regionList=[]},judgeCheckAll:function(t){var e;e=this.stationLists,this.portSettingForm[t].length<e.length?this.checkAllRegion=!1:this.checkAllRegion=!0},newStation:function(){var t=this;this.portSettingForm={name:"",address:"",phone:"",isSlave:!1,regionList:[],loginName:"",password:"",isSelf:""},n.a.getTreeLists(function(e){t.repairTypes=t.formatDataTree(e,{disableCheckbox:t.viewInfo},[])}),this.getStation()},toggleSlave:function(t){t&&(this.portSettingForm.regionList=[])},validateInputTel:function(t){var e=t.key;if(!/(\d|\-)/.test(e)&&"Backspace"!==e)return t.preventDefault(),!1},getStation:function(t){var e=this,i=t?"id="+t:"";this.$http.get("/yyht/v1/repair/station/region/list?"+i).then(function(t){if(0===t.data.code){var i=t.data.data;e.stationLists=i}})},saveStation:function(t){var e=this;this.loadingSave=!0;var i=this.$refs.repairTree.getCheckedAndIndeterminateNodes();this.portSettingForm.categoryList=i.map(function(t){return t.id});var o=this.portSettingForm,n={name:o.name,address:o.address,phone:o.phone,isSlave:o.isSlave?"Y":"N",stationAdmin:{loginName:o.loginName},regionList:o.regionList,categoryList:o.categoryList,state:o.state,isSelf:o.isSelf};o.id?(n.id=o.id,n.stationAdmin.id=o.stationId,"000000"!==o.password&&(n.stationAdmin.password=o.password)):n.stationAdmin.password=o.password,o.buttCode&&(n.buttCode=o.buttCode),this.$refs[t].validate(function(t){t?e.$http.post("/yyht/v1/repair/station/addOrUpdate",a()({},n)).then(function(t){e.loadingSave=!1,0===t.data.code?(e.$Message.success("保存成功"),e.pageInfo="list",e.newStation()):e.$Message.error("保存失败,"+t.data.msg)}):e.loadingSave=!1})},getStationInfo:function(t){var e=this;this.$http.get("/yyht/v1/repair/station/info?repairStationId="+t).then(function(t){if(0===t.data.code){var i=t.data.data;e.portSettingForm={name:i.name,address:i.address,phone:i.phone,isSlave:"Y"===i.isSlave,regionList:i.regionList,loginName:i.stationAdmin?i.stationAdmin.loginName:"",password:i.stationAdmin?"000000":"",stationId:i.stationAdmin?i.stationAdmin.id:"",id:i.id,state:i.state,categoryList:i.categoryList,isSelf:i.isSelf},e.repairTypes=e.formatDataTree(e.repairTypes,{disableCheckbox:e.viewInfo},i.categoryList),console.table(e.repairTypes),e.judgeCheckAll("regionList")}})},init:function(){this.$refs.portSet.resetFields()},formatDataTree:function(t,e,i){var o=this,a=s.a.cloneDeep(t);return a=a.map(function(t){if(t.title=t.name,t.expand=!1,e&&e.toString().length>0)for(var a in e)t[a]=e[a];return i&&i.length>0&&(t.parentId.length>0&&i.indexOf(t.id)>-1?t.checked=!0:t.checked=!1),t.children&&t.children.length>0&&(t.children=o.formatDataTree(t.children,e,i)),t})}},mounted:function(){var t=this;n.a.getTreeLists(function(e){t.repairTypes=t.formatDataTree(e,{disableCheckbox:t.viewInfo},[]),t.initialRepairTypes=t.formatDataTree(e,{disableCheckbox:t.viewInfo},[])}),this.getStation()},watch:{page:function(t){"list"===t&&(this.repairTypes=s.a.cloneDeep(this.initialRepairTypes)),console.log(t)},viewInfo:function(t){this.repairTypes=this.formatDataTree(this.repairTypes,{disableCheckbox:t},[])}}},p={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("Card",[i("div",{staticClass:"card-head",attrs:{slot:"title"},slot:"title"},[t._v(t._s(t.title))]),t._v(" "),i("div",{attrs:{slot:"extra"},slot:"extra"},[i("div",{staticClass:"btn-wrapper"},[t.viewInfo?[i("Button",{attrs:{type:"primary"},on:{click:function(e){t.viewInfo=!1}}},[t._v("编辑")]),t._v(" "),i("Button",{on:{click:function(e){t.pageInfo="list"}}},[t._v("返回")])]:[i("Button",{on:{click:function(e){t.pageInfo="list"}}},[t._v("取消")]),t._v(" "),i("Button",{attrs:{loading:t.loadingSave,type:"primary"},on:{click:function(e){t.saveStation("portSet")}}},[t._v("确认")])]],2)]),t._v(" "),i("Form",{ref:"portSet",staticClass:"portForm",attrs:{model:t.portSettingForm,rules:t.portSettingRule,"label-width":120,"label-position":"right"}},[i("FormItem",{attrs:{label:"服务网点名称",prop:"name"}},[i("Input",{staticClass:"form-input",attrs:{placeholder:"请输入服务网点名称",disabled:t.viewInfo},model:{value:t.portSettingForm.name,callback:function(e){t.$set(t.portSettingForm,"name",e)},expression:"portSettingForm.name"}})],1),t._v(" "),i("FormItem",{attrs:{label:"服务网点地址",prop:"address"}},[i("Input",{staticClass:"form-input",attrs:{placeholder:"请输入服务网点地址",disabled:t.viewInfo},model:{value:t.portSettingForm.address,callback:function(e){t.$set(t.portSettingForm,"address",e)},expression:"portSettingForm.address"}})],1),t._v(" "),i("FormItem",{attrs:{label:"服务网点电话",prop:"phone"}},[i("Input",{staticClass:"form-input",attrs:{disabled:t.viewInfo,placeholder:"请输入手机或座机号"},on:{"on-keydown":t.validateInputTel},model:{value:t.portSettingForm.phone,callback:function(e){t.$set(t.portSettingForm,"phone",e)},expression:"portSettingForm.phone"}})],1),t._v(" "),i("FormItem",{attrs:{label:"服务区域设置",prop:"regionList"}},[i("Checkbox",{attrs:{disabled:t.viewInfo},nativeOn:{click:function(e){e.preventDefault(),t.handleCheckAll("checkAllRegion","regionList")}},model:{value:t.checkAllRegion,callback:function(e){t.checkAllRegion=e},expression:"checkAllRegion"}},[t._v("全选")]),t._v(" "),i("CheckboxGroup",{staticClass:"area-box",on:{"on-change":function(e){t.judgeCheckAll("regionList")}},model:{value:t.portSettingForm.regionList,callback:function(e){t.$set(t.portSettingForm,"regionList",e)},expression:"portSettingForm.regionList"}},[i("ul",{staticClass:"column_3"},t._l(t.stationLists,function(e){return i("li",[i("Checkbox",{attrs:{disabled:t.viewInfo||t.portSettingForm.isSlave,label:e.id}},[t._v(t._s(e.name))])],1)}))])],1),t._v(" "),i("FormItem",{staticClass:"must",attrs:{label:"服务类型选择",prop:"categoryList"}},[i("Tree",{ref:"repairTree",staticClass:"column_3",attrs:{data:t.repairTypes,"show-checkbox":""}})],1),t._v(" "),i("FormItem",{attrs:{label:"管理员账号",prop:"loginName"}},[i("Input",{staticClass:"form-input",attrs:{placeholder:"请输入管理员账号",disabled:t.viewInfo},model:{value:t.portSettingForm.loginName,callback:function(e){t.$set(t.portSettingForm,"loginName",e)},expression:"portSettingForm.loginName"}})],1),t._v(" "),i("FormItem",{attrs:{label:"登陆密码",prop:"password"}},[i("Input",{staticClass:"form-input",attrs:{disabled:t.viewInfo,type:"password",placeholder:"请设置6~10位密码"},model:{value:t.portSettingForm.password,callback:function(e){t.$set(t.portSettingForm,"password",e)},expression:"portSettingForm.password"}})],1),t._v(" "),i("FormItem",{attrs:{label:"服务商权限管控：",prop:"state"}},[i("Select",{staticStyle:{width:"300px"},attrs:{disabled:t.viewInfo,placeholder:"请选择服务商权限管控"},model:{value:t.portSettingForm.state,callback:function(e){t.$set(t.portSettingForm,"state",e)},expression:"portSettingForm.state"}},[i("Option",{attrs:{value:"NORMAL"}},[t._v("正常")]),t._v(" "),i("Option",{attrs:{value:"DISABLE_ACCEPT_REPAIR_ORDER"}},[t._v("禁止新接工单")]),t._v(" "),i("Option",{attrs:{value:"DISABLE_SALE_DISCOUNT_SERVICE"}},[t._v("禁止销售套餐")]),t._v(" "),i("Option",{attrs:{value:"DISABLE_STATION"}},[t._v("禁用该服务商")])],1)],1)],1)],1)},staticRenderFns:[]};var c={name:"service-port",components:{PortInfo:i("VU/8")(l,p,!1,function(t){i("UcOB")},"data-v-291f6756",null).exports},data:function(){var t=this;return{page:"list",viewPortInfo:!1,modalTitle:"添加",pageNo:1,loading:!0,totalCount:0,pageSize:10,columns:[{title:"网点名称",key:"name",align:"center"},{title:"备用网点",key:"isSlave",align:"center"},{title:"网点地址",key:"address",align:"center"},{title:"联系电话",key:"phone",align:"center"},{title:"服务区域数量",key:"regionNum",align:"center"},{title:"服务状态",key:"state",align:"center"},{title:"操作",align:"center",render:function(e,i){var o=t;return e("div",[e("Button",{props:{type:"primary",size:"small"},style:{marginRight:"8px"},on:{click:function(){var t=i.row.id;o.viewPortInfo=!0,o.modalTitle="查看",o.page="info",o.$nextTick(function(){o.$refs.portInfo.getStation(t),o.$refs.portInfo.getStationInfo(t)})}}},"查看"),e("Button",{props:{type:"success",size:"small"},on:{click:function(){var t=i.row.id;o.viewPortInfo=!1,o.modalTitle="编辑",o.page="info",o.$nextTick(function(){o.$refs.portInfo.getStation(t),o.$refs.portInfo.getStationInfo(t)})}}},"编辑")])}}],portLists:[],portSetting:!1}},methods:{getLists:function(){var t=this,e="pageNo="+this.pageNo+"&pageSize="+this.pageSize;this.$http.get("/yyht/v1/repair/station/pageList?"+e).then(function(e){var i=e.data;0===i.code&&(t.loading=!1,t.portLists=i.data.list,t.pageSize=i.data.pageSize,t.totalCount=i.data.totalCount)})},pageToggle:function(t){this.pageNo=t,this.getLists()},pageSizeToggle:function(t){this.pageSize=t,this.getLists()},init:function(){this.pageNo=1,this.hasNextPage=!0,this.$refs.portInfo.init()},newStation:function(){var t=this;this.page="info",this.modalTitle="添加",this.viewPortInfo=!1,this.$nextTick(function(){t.$refs.portInfo.newStation()})},modalHide:function(t){t||this.$refs.portSet.resetFields()}},mounted:function(){this.getLists()},watch:{page:function(t,e){"list"===t&&(this.init(),this.getLists())}}},g={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",[i("Card",{directives:[{name:"show",rawName:"v-show",value:"list"===t.page,expression:"page==='list'"}]},[i("div",{staticClass:"clearfix mb-15"},[i("div",{staticClass:"pull-left"},[i("Button",{attrs:{type:"primary"},on:{click:t.newStation}},[t._v("新建")])],1)]),t._v(" "),i("div",{staticClass:"table-wrapper"},[i("Table",{attrs:{loading:t.loading,data:t.portLists,columns:t.columns}}),t._v(" "),i("div",{staticClass:"pagination"},[i("Page",{attrs:{current:t.pageNo,"page-size":t.pageSize,total:t.totalCount,"show-elevator":""},on:{"update:current":function(e){t.pageNo=e},"on-change":t.pageToggle,"on-page-size-change":t.pageSizeToggle}})],1)],1)]),t._v(" "),i("PortInfo",{directives:[{name:"show",rawName:"v-show",value:"info"===t.page,expression:"page==='info'"}],ref:"portInfo",attrs:{title:t.modalTitle+"服务网点",refresh:t.getLists,viewPortInfo:t.viewPortInfo,page:t.page},on:{"update:viewPortInfo":function(e){t.viewPortInfo=e},"update:page":function(e){t.page=e}}})],1)},staticRenderFns:[]};var d=i("VU/8")(c,g,!1,function(t){i("pB9t")},"data-v-73fb789f",null);e.default=d.exports},UcOB:function(t,e){},pB9t:function(t,e){}});