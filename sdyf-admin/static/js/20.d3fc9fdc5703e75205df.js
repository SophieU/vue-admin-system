webpackJsonp([20],{EpmY:function(e,t){},c8eA:function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=i("TVG1"),n={name:"model",data:function(){var e=this;return{display:"none",radioFlag:!1,serverCol:[{title:"选择",key:"chose",width:70,align:"center",render:function(t,i){var a=i.row.serviceId,n=!1;n=e.serverId==a;return t("div",[t("Radio",{props:{value:n}})])}},{key:"iconName",render:function(e,t){return e("img",{attrs:{src:t.row.iconName},style:{height:"40px",width:"50px"}})}},{key:"title"}],serverId:"",serverData:[],addHomeInfo:{col:"",inputInfo:"",model:{limitTime:"",startTime:"",endTime:""}},serverOption:[]}},props:{addService:{type:Boolean},current:{type:Number},size:{type:Number},addTitle:{type:String},singleId:{type:String},functionId:{type:String},functionFlag:{type:Boolean}},methods:{changeStartTime:function(e){this.addHomeInfo.model.startTime=e},changeEndTime:function(e){this.addHomeInfo.model.endTime=e},cancleFn:function(){this.$emit("getStatus",!1)},rowClick:function(e){this.serverId=e.serviceId},functionAdd:function(){var e=this;if(""==this.serverId)return this.$Message.warning("请选择未添加的服务"),!1;if(!this.addHomeInfo.model.limitTime)return this.$Message.warning("请选择是否限时"),!1;var t={endTime:this.addHomeInfo.model.endTime,id:this.functionId,idService:this.serverId,isLongValid:this.addHomeInfo.model.limitTime,startTime:this.addHomeInfo.model.startTime};this.functionId||delete t.id,this.$http.post("/eService/addOrUpdateServiceDefault",t).then(function(t){0==t.data.code?(e.$emit("updateCol",!0),e.$emit("deleteId",!0)):e.$Message.warning(t.data.msg)})},addOk:function(){var e=this;if(""==this.serverId)return this.$Message.warning("请选择未添加的服务"),!1;if(!this.addHomeInfo.model.limitTime)return this.$Message.warning("请选择是否限时"),!1;var t={endTime:this.addHomeInfo.model.endTime,id:this.singleId,idService:this.serverId,isLongValid:this.addHomeInfo.model.limitTime,startTime:this.addHomeInfo.model.startTime};this.singleId||delete t.id,this.$http.post("/service/default/addOrUpdateServiceDefault",t).then(function(t){0==t.data.code?(e.$emit("updateCol",!0),e.$emit("deleteId",!0)):e.$Message.warning(t.data.msg)})},radioChange:function(e){this.radioFlag="N"==e},statusChange:function(e){0==e?(this.addHomeInfo.col="",this.addHomeInfo.inputInfo="",this.getNotAdd(),this.serverId="",this.radioFlag=!1,this.addHomeInfo.model.limitTime="",this.addHomeInfo.model.startTime="",this.addHomeInfo.model.endTime=""):(this.addHomeInfo.model.limitTime="Y",this.singleId&&this.getSingleInfo(),this.functionId&&this.getFunctionSingle(),1==this.serverOption.length?this.addHomeInfo.col=this.serverOption[0].id:this.addHomeInfo.col="")},getSingleInfo:function(){var e=this;this.$http.get("/service/default/getServiceDefaultById?id="+this.singleId).then(function(t){0==t.data.code?(e.addHomeInfo.model.limitTime=t.data.data.isLongValid,"N"==t.data.data.isLongValid?(e.radioFlag=!0,e.addHomeInfo.model.startTime=t.data.data.startTime,e.addHomeInfo.model.endTime=t.data.data.endTime):(e.radioFlag=!1,e.addHomeInfo.model.startTime="",e.addHomeInfo.model.endTime="")):e.$Message.warning(t.data.msg)})},getFunctionSingle:function(){var e=this;this.$http.get("/eService/getServiceDefaultById?id="+this.functionId).then(function(t){0==t.data.code?(e.addHomeInfo.model.limitTime=t.data.data.isLongValid,"N"==t.data.data.isLongValid?(e.radioFlag=!0,e.addHomeInfo.model.startTime=t.data.data.startTime,e.addHomeInfo.model.endTime=t.data.data.endTime):(e.radioFlag=!1,e.addHomeInfo.model.startTime="",e.addHomeInfo.model.endTime="")):e.$Message.warning(t.data.msg)})},getServerCol:function(){var e=this;this.$http.get("/service/type/getAllServiceType?pageNo="+this.current+"&pageSize="+this.size+"&flag=up").then(function(t){0==t.data.code?e.serverOption=t.data.data.list:e.$Message.warning(t.data.msg)})},getNotAdd:function(){var e=this,t=this.addHomeInfo.col,i=this.addHomeInfo.inputInfo;this.$http.get("/service/getAllServiceByInner?serviceTypeId="+t+"&serviceTypeName="+i).then(function(t){0==t.data.code?e.serverData=t.data.data:e.$Message.warning(t.data.msg)})}},mounted:function(){this.getServerCol(),this.getNotAdd()}},o={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",[i("Modal",{attrs:{title:e.addTitle,closable:!1},on:{"on-visible-change":e.statusChange},model:{value:e.addService,callback:function(t){e.addService=t},expression:"addService"}},[i("Select",{staticStyle:{width:"200px"},attrs:{placeholder:"请选择栏目"},model:{value:e.addHomeInfo.col,callback:function(t){e.$set(e.addHomeInfo,"col",t)},expression:"addHomeInfo.col"}},e._l(e.serverOption,function(t,a){return i("Option",{key:a,attrs:{value:t.id}},[e._v(e._s(t.typeName))])})),e._v(" "),i("Input",{staticStyle:{width:"200px"},attrs:{placeholder:""},model:{value:e.addHomeInfo.inputInfo,callback:function(t){e.$set(e.addHomeInfo,"inputInfo",t)},expression:"addHomeInfo.inputInfo"}}),e._v(" "),i("Button",{attrs:{type:"default"},on:{click:e.getNotAdd}},[e._v("搜索")]),e._v(" "),i("div",{staticClass:"gap"}),e._v(" "),i("div",{staticClass:"limitTable"},[i("Table",{attrs:{columns:e.serverCol,data:e.serverData,"show-header":!1,"highlight-row":""},on:{"on-row-click":e.rowClick}})],1),e._v(" "),i("div",[i("Form",{attrs:{model:e.addHomeInfo.model,"label-width":100}},[i("FormItem",{attrs:{label:"是否限时:"}},[i("RadioGroup",{on:{"on-change":e.radioChange},model:{value:e.addHomeInfo.model.limitTime,callback:function(t){e.$set(e.addHomeInfo.model,"limitTime",t)},expression:"addHomeInfo.model.limitTime"}},[i("Radio",{attrs:{label:"N"}},[e._v("是")]),e._v(" "),i("Radio",{attrs:{label:"Y"}},[e._v("否")])],1)],1),e._v(" "),i("FormItem",{directives:[{name:"show",rawName:"v-show",value:1==e.radioFlag,expression:"radioFlag == true"}],attrs:{label:"开始时间:"}},[i("DatePicker",{staticStyle:{width:"200px"},attrs:{type:"datetime",format:"yyyy-MM-dd HH:mm"},on:{"on-change":e.changeStartTime},model:{value:e.addHomeInfo.model.startTime,callback:function(t){e.$set(e.addHomeInfo.model,"startTime",t)},expression:"addHomeInfo.model.startTime"}})],1),e._v(" "),i("FormItem",{directives:[{name:"show",rawName:"v-show",value:1==e.radioFlag,expression:"radioFlag == true"}],attrs:{label:"结束时间:"}},[i("DatePicker",{staticStyle:{width:"200px"},attrs:{type:"datetime",format:"yyyy-MM-dd HH:mm"},on:{"on-change":e.changeEndTime},model:{value:e.addHomeInfo.model.endTime,callback:function(t){e.$set(e.addHomeInfo.model,"endTime",t)},expression:"addHomeInfo.model.endTime"}})],1)],1)],1),e._v(" "),i("div",{attrs:{slot:"footer"},slot:"footer"},[i("Button",{attrs:{type:"default"},on:{click:function(t){e.cancleFn()}}},[e._v("取消")]),e._v(" "),i("Button",{attrs:{type:"primary"},on:{click:function(t){1==e.functionFlag?e.functionAdd():e.addOk()}}},[e._v("确认")])],1)],1)],1)},staticRenderFns:[]};var d={name:"functionSet",data:function(){var e=this;return{loading:!0,pageConfig:{current:1,size:10,bigSize:100,totalCount:0},functionFlag:!1,functionId:"",addTitle:"新增服务",addService:!1,columns:[{title:"编号",key:"",align:"center",render:function(e,t){return e("span",t.index+1)}},{title:"图片",key:"imageName",align:"center",render:function(e,t){return e("img",{attrs:{src:t.row.imageName},style:{height:"40px",width:"60px"}})}},{title:"服务名称",align:"center",key:"serviceName"},{title:"类型",align:"center",key:"categoryName"},{title:"是否长期有效",align:"center",key:"isLongValid"},{title:"开始时间",align:"center",key:"startTime"},{title:"结束时间",align:"center",key:"endTime"},{title:"操作",align:"center",key:"",render:function(t,i){return t("div",[t("Button",{props:{type:"primary",size:"small"},on:{click:function(){e.functionFlag=!0,e.functionId=i.row.id,e.addService=!0,e.addTitle="编辑服务"}}},"编辑"),t("Button",{props:{type:"error",size:"small"},on:{click:function(){var t=e;t.$store.commit("setDeleteModal",{model:!0,callback:function(){t.deleteSingle(i.row.id)}})}}},"删除")])}}],lists:[]}},components:{Model:i("VU/8")(n,o,!1,function(e){i("EpmY")},"data-v-5965351f",null).exports},methods:{dragRow:function(e,t){var i=a.a.sortTableRow(e,t,this.lists);this.lists=i},changeSize:function(e){this.pageConfig.size=e,this.getCols()},changeCurrent:function(e){this.pageConfig.current=e,this.getCols()},functionFn:function(){this.addService=!0,this.functionFlag=!0},deleteSingleId:function(e){1==e&&(this.functionId="")},updateList:function(e){1==e&&(this.getCols(),this.addService=!1)},modelStatus:function(e){0==e&&(this.addService=!1,this.functionId="",this.addTitle="新增服务")},deleteSingle:function(e){var t=this;this.$http.delete("/eService/deleteServiceDefaultById?id="+e).then(function(e){0==e.data.code?(t.$Message.success("删除成功"),t.$store.commit("setDeleteModal",{model:!1}),t.getCols()):t.$Message.warning(e.data.msg)})},getCols:function(){var e=this;this.loading=!0,this.$http.get("/eService/getAllServiceDefault?PageSize="+this.pageConfig.size+"&pageNo="+this.pageConfig.current).then(function(t){0==t.data.code?(e.lists=t.data.data.list,e.pageConfig.totalCount=t.data.totalCount,e.loading=!1):e.$Message.warning(t.data.msg)})}},mounted:function(){this.getCols()}},s={render:function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",[i("Card",[i("div",{staticClass:"clearfix mb-15"},[i("div",{staticClass:"pull-right"},[i("Button",{attrs:{icon:"md-add",type:"primary"},on:{click:e.functionFn}},[e._v("新增")])],1)]),e._v(" "),i("Table",{attrs:{columns:e.columns,data:e.lists,draggable:"",loading:e.loading},on:{"on-drag-drop":e.dragRow}}),e._v(" "),i("div",{staticClass:"pagination mt-15"},[i("Page",{attrs:{current:e.pageConfig.current,"page-size":e.pageConfig.size,total:e.pageConfig.totalCount,"show-elevator":"","show-sizer":""},on:{"update:current":function(t){e.$set(e.pageConfig,"current",t)},"on-change":e.changeCurrent,"on-page-size-change":e.changeSize}})],1)],1),e._v(" "),i("Model",{attrs:{addService:e.addService,current:e.pageConfig.current,size:e.pageConfig.bigSize,addTitle:e.addTitle,functionId:e.functionId,functionFlag:e.functionFlag},on:{updateCol:e.updateList,getStatus:e.modelStatus,deleteId:e.deleteSingleId}})],1)},staticRenderFns:[]},r=i("VU/8")(d,s,!1,null,null,null);t.default=r.exports}});