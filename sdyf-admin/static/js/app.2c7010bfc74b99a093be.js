webpackJsonp([36],{1363:function(e,t){},"1R2i":function(e,t){e.exports=iview},"7YgM":function(e,t){e.exports={name:"wy-pc",version:"1.0.0",description:"A Vue.js project",author:"SophieU <j.u.sophia@qq.com>",private:!0,scripts:{dev:"webpack-dev-server --inline --progress --config build/webpack.dev.conf.js",start:"npm run dev",unit:"jest --config test/unit/jest.conf.js --coverage",e2e:"node test/e2e/runner.js",test:"npm run unit && npm run e2e",build:"node build/build.js"},dependencies:{axios:"^0.18.0",countup:"^1.8.2",echarts:"^4.2.0-rc.1",iview:"^3.5.4","js-cookie":"^2.2.0",lodash:"^4.17.15",moment:"^2.24.0","qiniu-js":"^2.5.1",vue:"^2.5.2","vue-router":"^3.0.1",vuedraggable:"^2.23.2",vuex:"^3.0.1",wangeditor:"^3.1.1"},devDependencies:{autoprefixer:"^7.1.2","babel-core":"^6.22.1","babel-helper-vue-jsx-merge-props":"^2.0.3","babel-jest":"^21.0.2","babel-loader":"^7.1.1","babel-plugin-dynamic-import-node":"^1.2.0","babel-plugin-syntax-jsx":"^6.18.0","babel-plugin-transform-es2015-modules-commonjs":"^6.26.0","babel-plugin-transform-runtime":"^6.22.0","babel-plugin-transform-vue-jsx":"^3.5.0","babel-preset-env":"^1.3.2","babel-preset-stage-2":"^6.22.0","babel-register":"^6.22.0",chalk:"^2.0.1",chromedriver:"^2.27.2","copy-webpack-plugin":"^4.0.1","cross-spawn":"^5.0.1","css-loader":"^0.28.0","extract-text-webpack-plugin":"^3.0.0","file-loader":"^1.1.4","friendly-errors-webpack-plugin":"^1.6.1","html-webpack-plugin":"^2.30.1",jest:"^22.0.4","jest-serializer-vue":"^0.3.0",nightwatch:"^0.9.12","node-notifier":"^5.1.2","node-sass":"^4.9.2","optimize-css-assets-webpack-plugin":"^3.2.0",ora:"^1.2.0",portfinder:"^1.0.13","postcss-import":"^11.0.0","postcss-loader":"^2.0.8","postcss-url":"^7.2.1",rimraf:"^2.6.0","sass-loader":"^7.0.3","selenium-server":"^3.0.1",semver:"^5.3.0",shelljs:"^0.7.6","uglifyjs-webpack-plugin":"^1.1.1","url-loader":"^0.5.8","vue-jest":"^1.0.2","vue-loader":"^13.3.0","vue-style-loader":"^3.0.1","vue-template-compiler":"^2.5.2",webpack:"^3.6.0","webpack-bundle-analyzer":"^2.9.0","webpack-dev-server":"^2.9.1","webpack-merge":"^4.1.0"},engines:{node:">= 6.0.0",npm:">= 3.0.0"},browserslist:["> 1%","last 2 versions","not ie <= 8"]}},BTZy:function(e,t){},JU1R:function(e,t,n){"use strict";var a={name:"sidebarMenu",data:function(){return{}},props:{menuList:Array,openNames:Array},methods:{changeMenu:function(e){this.$emit("on-change",e)}},updated:function(){var e=this;this.$nextTick(function(){e.$refs.sideMenu&&(e.$refs.sideMenu.updateOpened(),e.$refs.sideMenu.updateActiveName())})}},o={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("Menu",{ref:"sideMenu",attrs:{accordion:"","active-name":e.$route.name,"open-names":e.openNames,theme:"dark",width:"auto"},on:{"on-select":e.changeMenu}},[e._l(e.menuList,function(t){return[t.meta.single?n("MenuItem",{directives:[{name:"show",rawName:"v-show",value:!t.meta.hideInMenu,expression:"!item.meta.hideInMenu"}],key:"menuitem"+t.name,attrs:{name:t.children[0].name}},[n("Icon",{key:"menuicon"+t.name,attrs:{type:t.children[0].icon||t.icon,size:16}}),e._v(" "),n("span",{key:"title"+t.name,staticClass:"layout-text"},[e._v(e._s(t.children[0].title))])],1):n("Submenu",{directives:[{name:"show",rawName:"v-show",value:!t.meta.hideInMenu,expression:"!item.meta.hideInMenu"}],key:t.name,attrs:{name:t.name}},[n("template",{slot:"title"},[n("Icon",{attrs:{type:t.icon,size:16}}),e._v(" "),n("span",{staticClass:"layout-text"},[e._v(e._s(t.title))])],1),e._v(" "),e._l(t.children,function(t){return[!t.children||t.meta.hideChild?n("MenuItem",{directives:[{name:"show",rawName:"v-show",value:!t.meta.hideInMenu,expression:"!child.meta.hideInMenu"}],key:"menuitem"+t.name+t.path,attrs:{name:t.name?t.name:t.children[0].name}},[n("Icon",{key:"icon"+t.name,attrs:{size:"16",type:t.icon}}),e._v(" "),n("span",{key:"title"+t.name,staticClass:"layout-text"},[e._v(e._s(t.title))])],1):t.children&&t.children.length>0?n("Submenu",{attrs:{name:t.name}},[n("template",{slot:"title"},[n("Icon",{attrs:{type:t.icon,size:16}}),e._v(" "),n("span",{staticClass:"layout-text"},[e._v(e._s(t.title))])],1),e._v(" "),e._l(t.children,function(t){return[n("MenuItem",{directives:[{name:"show",rawName:"v-show",value:!t.meta.hideInMenu,expression:"!sub.meta.hideInMenu"}],key:"menuitem"+t.name,attrs:{name:t.name}},[n("Icon",{key:"icon"+t.name,attrs:{size:"16",type:t.icon}}),e._v(" "),n("span",{key:"title"+t.name,staticClass:"layout-text"},[e._v(e._s(t.title))])],1)]})],2):e._e()]})],2)]})],2)},staticRenderFns:[]};var i=n("VU/8")(a,o,!1,function(e){n("tSML")},"data-v-97028f2a",null).exports,r={name:"sidebarMenuCollapse",props:{menuList:{type:Array},iconColor:{type:String,default:"white"},menuTheme:{type:String,default:"darck"}},methods:{itemTitle:function(e){return e.title},handleClick:function(e){this.$emit("on-change",e)}}},s={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"sidebarMenuCollapse"},[e._l(e.menuList,function(t,a){return[n("div",{key:a,staticStyle:{"text-align":"center"}},[n("Dropdown",{attrs:{transfer:"",placement:"right-start"},on:{"on-click":e.handleClick}},[n("Button",{staticClass:"menu-icon",staticStyle:{width:"70px","margin-left":"-5px",padding:"10px 0"},attrs:{type:"text"}},[n("Icon",{attrs:{size:20,color:e.iconColor,type:t.icon}})],1),e._v(" "),n("DropdownMenu",{staticStyle:{width:"200px"},attrs:{slot:"list"},slot:"list"},[e._l(t.children,function(t,a){return[t.children?[t.children?n("Dropdown",{attrs:{placement:"right-start"}},[n("DropdownItem",[n("Icon",{attrs:{type:t.icon}}),e._v(" "),n("span",{staticStyle:{"padding-left":"10px"}},[e._v(e._s(t.title))]),e._v(" "),n("Icon",{attrs:{type:"ios-arrow-forward"}})],1),e._v(" "),n("DropdownMenu",{attrs:{slot:"list"},slot:"list"},[e._l(t.children,function(t,a){return[n("DropdownItem",{key:a,attrs:{name:t.name}},[n("span",{staticStyle:{"padding-left":"10px"}},[e._v(e._s(e.itemTitle(t)))])])]})],2)],1):e._e()]:[n("DropdownItem",{key:a,attrs:{name:t.name}},[n("Icon",{attrs:{type:t.icon}}),n("span",{staticStyle:{"padding-left":"10px"}},[e._v(e._s(e.itemTitle(t)))])],1)]]})],2)],1)],1)]})],2)},staticRenderFns:[]};var l={name:"autoMenu",components:{sidebarMenu:i,sidebarMenuCollapse:n("VU/8")(r,s,!1,function(e){n("1363")},"data-v-88d08dfa",null).exports},props:{collapse:{type:Boolean,default:!1},menuList:{type:Array,required:!0},openNames:{type:Array}},methods:{handleChange:function(e){var t=!0;void 0!==this.beforePush&&(this.beforePush(e)||(t=!1)),t&&this.$router.push({name:e}),this.$emit("on-change",e)}}},c={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"ivu-shrinkable-menu"},[e._t("top"),e._v(" "),n("sidebar-menu",{directives:[{name:"show",rawName:"v-show",value:!e.collapse,expression:"!collapse"}],attrs:{"menu-list":e.menuList,"open-names":e.openNames},on:{"on-change":e.handleChange}}),e._v(" "),n("sidebar-menu-collapse",{directives:[{name:"show",rawName:"v-show",value:e.collapse,expression:"collapse"}],attrs:{"menu-list":e.menuList,"open-names":e.openNames},on:{"on-change":e.handleChange}})],2)},staticRenderFns:[]};var u=n("VU/8")(l,c,!1,function(e){n("rQA7")},"data-v-d4552844",null).exports,d={name:"breadcrumb-nav",data:function(){return{}},props:{currentPath:Array},methods:{itemTitle:function(e){return e.title}}},m={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("Breadcrumb",{attrs:{separator:">"}},e._l(e.currentPath,function(t){return n("BreadcrumbItem",{key:t.name,attrs:{to:t.path}},[e._v(e._s(e.itemTitle(t)))])}))},staticRenderFns:[]};var p=n("VU/8")(d,m,!1,function(e){n("BTZy")},"data-v-9f23e900",null).exports,h=n("TVG1"),f={name:"message-tip",props:{value:{type:Number,default:0}},methods:{showMessage:function(){console.log("跳转到新页面")}}},g={render:function(){var e=this.$createElement,t=this._self._c||e;return t("div",{staticClass:"message-con",on:{click:this.showMessage}},[t("Tooltip",{attrs:{content:this.value>0?"有"+this.value+"条未读消息":"无未读消息",placement:"bottom"}},[t("Badge",{attrs:{count:this.value,dot:""}},[t("Icon",{attrs:{type:"ios-notifications",size:22}})],1)],1)],1)},staticRenderFns:[]};var v=n("VU/8")(f,g,!1,function(e){n("NlXT")},"data-v-54108430",null).exports,b=n("lbHh"),y=n.n(b),w={name:"delete-alert",data:function(){return{deleteAlter:!1,delete_loading:!1}},props:{model:Boolean,callback:Function},computed:{modelInner:{get:function(){return this.model},set:function(e){e||this.$store.commit("setDeleteModal",{model:!1})}}},methods:{del:function(){this.callback()}}},P={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("Modal",{attrs:{width:"360"},model:{value:e.modelInner,callback:function(t){e.modelInner=t},expression:"modelInner"}},[n("p",{staticStyle:{color:"#f60","text-align":"center"},attrs:{slot:"header"},slot:"header"},[n("Icon",{attrs:{type:"ios-information-circle"}}),e._v(" "),n("span",[e._v("删除提醒")])],1),e._v(" "),n("div",{staticStyle:{"text-align":"center"}},[n("p",[e._v("数据一旦删除，将不可恢复")]),e._v(" "),n("p",[e._v("确认要删除吗?")])]),e._v(" "),n("div",{attrs:{slot:"footer"},slot:"footer"},[n("Button",{attrs:{type:"error",size:"large",long:"",loading:e.delete_loading},on:{click:e.del}},[e._v("删除")])],1)])},staticRenderFns:[]},L=n("VU/8")(w,P,!1,null,null,null).exports,_={name:"upload-progress",props:{model:Boolean,percent:Number}},k={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("Modal",{attrs:{title:"正在上传中...","mask-closable":!1,"footer-hide":!0,closable:!1},model:{value:e.model,callback:function(t){e.model=t},expression:"model"}},[n("Progress",{attrs:{percent:e.percent,status:"active"}})],1)},staticRenderFns:[]};var M=n("VU/8")(_,k,!1,function(e){n("rXMn")},"data-v-60d7ef06",null).exports,C=n("mvHQ"),T=n.n(C),O={name:"tags-page-opened",data:function(){return{currentPage:this.$route.name,tagBodyLeft:0,tagsCount:1,refsTag:[]}},props:{pageTagsList:Array,beforePush:{type:Function,default:function(e){return!0}}},computed:{tagsList:function(){return this.$store.state.app.pageOpenedList},title:function(){return this.$store.state.app.currentTitle}},methods:{moveToView:function(e){e.offsetLeft<-this.tagBodyLeft?this.tagBodyLeft=10-e.offsetLeft:e.offsetLeft+10>-this.tagBodyLeft&&e.offsetLeft+e.offsetWidth<-this.tagBodyLeft+this.$refs.scrollCon.offsetWidth-100?this.tagBodyLeft=Math.min(0,this.$refs.scrollCon.offsetWidth-100-e.offsetWidth-e.offsetLeft-20):this.tagBodyLeft=-(e.offsetLeft-(this.$refs.scrollCon.offsetWidth-100-e.offsetWidth)+20)},closePage:function(e,t){var n=this.$store.state.app.pageOpenedList,a=n[0];if(this.currentPage===t){for(var o=n.length,i=1;i<o;i++)if(n[i].name===t){a=i<o-1?n[i+1]:n[i-1];break}}else{var r=e.target.parentNode.offsetWidth;this.tagBodyLeft=Math.min(this.tagBodyLeft+r,0)}this.$store.commit("removeTag",t),this.$store.commit("closePage",t),n=this.$store.state.app.pageOpenedList,localStorage.pageOpenedList=T()(n),this.currentPage===t&&this.linkTo(a)},linkTo:function(e){var t={};t.name=e.name,e.argu&&(t.params=e.argu),e.query&&(t.query=e.query),this.beforePush(e)&&this.$router.push(t)},handleScroll:function(e){var t=e.type,n=0;"DOMMouseScroll"!==t&&"mousewheel"!==t||(n=e.wheelDelta?e.wheelDelta:40*-(e.detail||0));var a=0;n>0?a=Math.min(0,this.tagBodyLeft+n):this.$refs.scrollCon.offsetWidth-100<this.$refs.scrollBody.offsetWidth?a=this.tagBodyLeft<-(this.$refs.scrollBody.offsetWidth-this.$refs.scrollCon.offsetWidth+100)?this.tagBodyLeft:Math.max(this.tagBodyLeft+n,this.$refs.scrollCon.offsetWidth-this.$refs.scrollBody.offsetWidth-100):this.tagBodyLeft=0,this.tagBodyLeft=a},handleTagsOption:function(e){"clearAll"===e?(this.$store.commit("clearAllTags"),this.$router.push({name:"home_index"})):this.$store.commit("clearOtherTags",this),this.tagBodyLeft=0}},mounted:function(){var e=this;this.refsTag=this.$refs.tagsPageOpened,setTimeout(function(){e.refsTag.forEach(function(t,n){if(e.$route.name===t.name){var a=e.refsTag[n].$el;e.moveToView(a)}},1),e.tagsCount=e.tagsList.length})},watch:{$route:function(e){var t=this;this.currentPage=e.name,this.$nextTick(function(){t.refsTag.forEach(function(n,a){if(e.name===n.name){var o=t.refsTag[a].$el;t.moveToView(o)}})}),this.tagsCount=this.tagsList.length}}},S={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{ref:"scrollCon",staticClass:"tags-outer-scroll-con",on:{DOMMouseScroll:e.handleScroll,mousewheel:e.handleScroll}},[n("div",{staticClass:"close-all-tag-on"},[n("Dropdown",{attrs:{transfer:""}},[n("Button",{attrs:{size:"small",type:"primary"}},[n("Icon",{attrs:{type:"ios-arrow-down"}})],1),e._v(" "),n("DropdownMenu",{attrs:{slot:"list"},slot:"list"},[n("DropdownItem",{attrs:{name:"clearAll"}},[e._v("关闭所有")]),e._v(" "),n("DropdownItem",{attrs:{name:"clearOthers"}},[e._v("关闭其他")])],1)],1)],1),e._v(" "),n("div",{ref:"scrollBody",staticClass:"tags-inner-scroll-body",style:{left:e.tagBodyLeft+"px"}},[n("transition-group",{attrs:{name:"taglist-moving-animation"}},e._l(e.pageTagsList,function(t,a){return n("Tag",{key:t.name,ref:"tagsPageOpened",refInFor:!0,attrs:{type:"dot",name:t.name,closable:"home"!==t.name,color:t.name===e.currentPage?"primary":"default"},on:{"on-close":e.closePage},nativeOn:{click:function(n){e.linkTo(t)}}},[e._v(e._s(t.title))])}))],1)])},staticRenderFns:[]};var $={name:"Main",components:{sidebar:u,breadcrumbNav:p,messageTip:v,deleteModal:L,uploadProgress:M,tagsPageOpened:n("VU/8")(O,S,!1,function(e){n("kaz5")},"data-v-7be77d60",null).exports},data:function(){return{collapse:!1,userName:""}},computed:{uploadProgressVisible:function(){return this.$store.state.app.uploadProgressVisible},uploadProgressPercent:function(){return this.$store.state.app.uploadProgressPercent},cachePage:function(){return this.$store.state.app.cachePage},menuList:function(){return this.$store.state.app.menuList},openedSubmenuArr:function(){return this.$store.state.app.openedSubmenuArr},pageTagsList:function(){return this.$store.state.app.pageOpenedList},currentPath:function(){return this.$store.state.app.currentPath},curVillage:function(){return this.$store.state.app.curVillage},showDelete:function(){return this.$store.state.app.deleteModal}},methods:{toggleCollapse:function(){this.collapse=!this.collapse},init:function(){this.$store.commit("updateMenulist");var e=h.a.setCurrentPath(this,this.$route.name);if(e.length>=3){var t=[e[0].name,e[1].name];this.$store.commit("addOpenSubmenu",t,!0)}else e.length>=2&&this.$store.commit("addOpenSubmenu",e[0].name);this.checkTag(this.$route.name),this.userName=y.a.get("user")},handleUserDropdown:function(e){var t=this;"logOut"===e&&(this.$store.commit("logout",this),this.$http.post("/sys/v1/user/login/out").then(function(e){0!==e.data.code&&console.log(e.data.msg),t.$router.push({name:"login"}),t.$store.commit("clearOpenSubmenu")}))},checkTag:function(e){this.pageTagsList.some(function(t){if(t.name===e)return!0})||h.a.openNewPage(this,e,this.$route.params||{},this.$route.query||{})},handleSubmenuChange:function(){}},mounted:function(){this.init()},created:function(){this.$store.commit("setOpenedList")},watch:{$route:function(e){this.$store.commit("setCurrentPageName",e.name);var t=h.a.setCurrentPath(this,this.$route.name);if(t.length>=3){var n=[t[0].name,t[1].name];this.$store.commit("addOpenSubmenu",n,!0)}else t.length>=2&&this.$store.commit("addOpenSubmenu",t[0].name);this.checkTag(e.name),localStorage.currentPageName=e.name},uploadProgressVisible:function(e){var t=this;if(e)var n=0,a=setInterval(function(){n>=95?clearTimeout(a):n+=5,t.$store.commit("setUploadPercent",n)},100)}}},x={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"main"},[a("div",{staticClass:"sidebar-menu",style:{width:"240px",overflow:e.collapse?"visible":"auto"}},[a("sidebar",{attrs:{"menu-list":e.menuList,"open-names":e.openedSubmenuArr,collapse:e.collapse},on:{"on-change":e.handleSubmenuChange}},[a("div",{staticClass:"logo-con",attrs:{slot:"top"},slot:"top"},[a("div",{directives:[{name:"show",rawName:"v-show",value:!e.collapse,expression:"!collapse"}],staticClass:"top-logo"},[a("img",{key:"max-logo",attrs:{src:n("c7+C")}}),e._v(" "),a("span",[e._v("天富一生约")]),e._v(" "),a("span",[e._v(" · ")]),e._v(" "),a("span",[e._v("呼叫中心")])]),e._v(" "),a("img",{directives:[{name:"show",rawName:"v-show",value:e.collapse,expression:"collapse"}],key:"min-logo",attrs:{src:n("c7+C")}})])])],1),e._v(" "),a("div",{staticClass:"main-header-con",style:{paddingLeft:"240px"}},[a("div",{staticClass:"main-header"},[a("div",{staticClass:"header-middle-con"},[a("div",{staticClass:"header-middle-con"},[a("div",{staticClass:"main-breadcrumb"},[a("breadcrumb-nav",{attrs:{currentPath:e.currentPath}})],1)])]),e._v(" "),a("div",{staticClass:"header-avator-con"},[a("div",{staticClass:"user-dropdown-menu-con"},[a("Row",{staticClass:"user-dropdown-innercon",attrs:{type:"flex",justify:"end",align:"middle"}},[a("Dropdown",{attrs:{transfer:"",trigger:"click"},on:{"on-click":e.handleUserDropdown}},[a("a",{attrs:{href:"javascript:void(0)"}},[a("span",{staticClass:"main-user-name"},[e._v(e._s(e.userName))]),e._v(" "),a("Icon",{attrs:{type:"md-arrow-dropdown"}})],1),e._v(" "),a("DropdownMenu",{attrs:{slot:"list"},slot:"list"},[a("DropdownItem",{attrs:{name:"logOut"}},[e._v("退出")])],1)],1),e._v(" "),a("Avatar",{staticStyle:{"background-color":"#87d068","margin-left":"15px"},attrs:{icon:"ios-person"}})],1)],1)])]),e._v(" "),a("div",{staticClass:"tags-con"},[a("tags-page-opened",{attrs:{pageTagsList:e.pageTagsList}})],1)]),e._v(" "),a("div",{staticClass:"main-content",style:{left:"240px"}},[a("div",{staticClass:"single-page"},[a("keep-alive",{attrs:{include:e.cachePage}},[a("router-view")],1)],1)]),e._v(" "),a("delete-modal",{attrs:{model:e.showDelete.model,callback:e.showDelete.callback}}),e._v(" "),a("upload-progress",{attrs:{model:e.uploadProgressVisible,percent:e.uploadProgressPercent}})],1)},staticRenderFns:[]};var A=n("VU/8")($,x,!1,function(e){n("yOXi")},null,null).exports;n.d(t,"b",function(){return N}),n.d(t,"c",function(){return R}),n.d(t,"a",function(){return B}),n.d(t,"d",function(){return I});var N={path:"/forbid",meta:{title:"没有权限"},component:A,children:[{path:"",title:"无权限",name:"forbid",component:function(){return n.e(11).then(n.bind(null,"gWGR"))}}]},R={path:"/",name:"otherRouter",redirect:"/home",component:A,children:[{path:"advertiserDetail",title:"广告主管理",name:"advertiserDetail",component:function(){return Promise.all([n.e(0),n.e(2)]).then(n.bind(null,"Gidk"))}},{path:"staffDetail",title:"人员详情",name:"staffDetail",meta:{hideInMenu:!0},component:function(){return n.e(32).then(n.bind(null,"eLkD"))},children:[{path:"",name:"staffDetail",title:"基本信息",meta:{},component:function(){return n.e(28).then(n.bind(null,"+qbu"))}},{path:"inviteRecord",title:"邀请记录",meta:{hideInMenu:!0},name:"inviteRecord",component:function(){return n.e(21).then(n.bind(null,"QeWd"))}},{path:"walletRecord",title:"钱包记录",meta:{hideInMenu:!0},name:"walletRecord",component:function(){return n.e(17).then(n.bind(null,"azOz"))}},{path:"orderLists",title:"工单列表",meta:{hideInMenu:!0},name:"serviceOrderLists",component:function(){return Promise.all([n.e(0),n.e(31)]).then(n.bind(null,"MKC6"))}}]}]},B=[{path:"/content",icon:"md-home",name:"content",title:"首页",component:A,meta:{single:!0},children:[{path:"home",meta:{},title:"首页",name:"home",component:function(){return Promise.all([n.e(0),n.e(6)]).then(n.bind(null,"Hc+b"))}}]},{path:"/systems",icon:"md-aperture",title:"系统管理",name:"systems",component:A,meta:{single:!1},children:[{path:"type",meta:{},name:"type",title:"分类管理",component:function(){return n.e(1).then(n.bind(null,"gK4R"))},children:[{path:"repair",meta:{},title:"服务项目",name:"repair",component:function(){return Promise.all([n.e(0),n.e(12)]).then(n.bind(null,"2nae"))}}]},{path:"systemAdmin",meta:{},name:"systemAdmin",title:"系统管理",component:function(){return n.e(1).then(n.bind(null,"gK4R"))},children:[{path:"role",meta:{},title:"角色管理",name:"role",component:function(){return n.e(24).then(n.bind(null,"NSIP"))}},{path:"appeal",meta:{},title:"申述原因配置",name:"appeal",component:function(){return n.e(18).then(n.bind(null,"Chc0"))}},{path:"editRole",meta:{hideInMenu:!0},title:"设置角色",name:"editRole",component:function(){return n.e(4).then(n.bind(null,"h59p"))}},{path:"account",meta:{},title:"账号管理",name:"account",component:function(){return Promise.all([n.e(0),n.e(22)]).then(n.bind(null,"54F/"))}},{path:"tips",meta:{},title:"温馨提示",name:"tips",component:function(){return Promise.all([n.e(0),n.e(29)]).then(n.bind(null,"aB0X"))}}]}]},{path:"/service",icon:"logo-codepen",title:"网点管理",name:"service-address",component:A,meta:{single:!1},children:[{path:"address",meta:{},icon:"md-locate",title:"服务网点管理",name:"address",component:function(){return Promise.all([n.e(0),n.e(13)]).then(n.bind(null,"EuWY"))}},{path:"district",meta:{},icon:"ios-compass",title:"服务区域管理",name:"district",component:function(){return Promise.all([n.e(0),n.e(8)]).then(n.bind(null,"DsPz"))}}]},{path:"/user-admin",icon:"logo-codepen",title:"用户管理",name:"user-admin",component:A,meta:{single:!1},children:[{path:"normal",meta:{},icon:"md-locate",title:"普通用户",name:"normal",component:function(){return n.e(16).then(n.bind(null,"NF9+"))}},{path:"worker",meta:{},icon:"ios-compass",title:"服务师傅",name:"worker",component:function(){return n.e(33).then(n.bind(null,"Ym+j"))}}]},{path:"/order",title:"工单管理",name:"order",component:A,icon:"ios-briefcase",meta:{single:!0},children:[{path:"order-filter",meta:{},name:"order_filter",icon:"ios-briefcase",title:"报修工单管理",component:function(){return Promise.all([n.e(0),n.e(9)]).then(n.bind(null,"0PqJ"))}},{path:"order-detail",name:"orderDetailParent",meta:{hideInMenu:!0},title:"工单详情",component:function(){return n.e(26).then(n.bind(null,"HBtY"))},children:[{path:"",meta:{},name:"orderDetail",title:"处理流程",component:function(){return n.e(19).then(n.bind(null,"Rk97"))}},{path:"visited-info",meta:{hideInMenu:!0},title:"回访信息",name:"visitedInfo",component:function(){return n.e(25).then(n.bind(null,"b7nQ"))}}]}]},{path:"/visit",title:"回访管理",name:"visit",component:A,meta:{single:!0},children:[{path:"visit-admin",meta:{},icon:"ios-call",title:"回访管理",name:"visit-admin",component:function(){return Promise.all([n.e(0),n.e(27)]).then(n.bind(null,"WgNQ"))}}]},{path:"/withdraw",title:"提现管理",component:A,meta:{single:!0},children:[{path:"/",meta:{},icon:"ios-call",title:"提现管理",name:"withdraw",component:function(){return n.e(15).then(n.bind(null,"HNRI"))}}]},{path:"/platform",icon:"md-aperture",title:"平台管理",name:"platform",component:A,meta:{single:!1},children:[{path:"service",meta:{},name:"service",title:"服务管理",component:function(){return n.e(1).then(n.bind(null,"gK4R"))},children:[{path:"servicePro",meta:{},title:"服务栏目管理",name:"servicePro",component:function(){return Promise.all([n.e(0),n.e(23)]).then(n.bind(null,"j8Xd"))}},{path:"allService",meta:{},title:"全部服务管理",name:"allService",component:function(){return Promise.all([n.e(0),n.e(34)]).then(n.bind(null,"mbRy"))}},{path:"functionSet",meta:{},title:"小程序功能区配置",name:"functionSet",component:function(){return n.e(20).then(n.bind(null,"c8eA"))}}]},{path:"broadcast",meta:{},name:"broadcast",title:"广告管理",component:function(){return n.e(1).then(n.bind(null,"gK4R"))},children:[{path:"advertiser",meta:{},title:"广告主管理",name:"advertiser",component:function(){return n.e(30).then(n.bind(null,"NhQq"))}},{path:"advertiserDetail",meta:{hideInMenu:!0},title:"广告主详情",name:"advertiserDetail",component:function(){return Promise.all([n.e(0),n.e(2)]).then(n.bind(null,"Gidk"))}},{path:"banner",meta:{},title:"banner广告",name:"banner",component:function(){return Promise.all([n.e(0),n.e(5)]).then(n.bind(null,"UIoj"))}},{path:"repairRecommend",meta:{},title:"报修服务推荐管理",name:"repairRecommend",component:function(){return Promise.all([n.e(0),n.e(7)]).then(n.bind(null,"vH+I"))}}]}]}],I=[{path:"/",name:"default",meta:{title:"Login-登录"},component:function(){return n.e(3).then(n.bind(null,"vdVF"))}},{path:"/login",name:"login",meta:{title:"Login-登录"},component:function(){return n.e(3).then(n.bind(null,"vdVF"))}},R].concat(B,[N,{path:"/500",name:"error-500",meta:{title:"500-服务端错误"},component:function(){return n.e(14).then(n.bind(null,"bdPn"))}},{path:"/*",name:"error-404",meta:{title:"404-页面不存在"},component:function(){return n.e(10).then(n.bind(null,"dN+j"))}}])},NHnr:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=n("Gu7T"),o=n.n(a),i={render:function(){var e=this.$createElement,t=this._self._c||e;return t("div",{attrs:{id:"app"}},[t("router-view")],1)},staticRenderFns:[]};var r=n("VU/8")({name:"App",methods:{}},i,!1,function(e){n("fmYl")},null,null).exports,s=n("YaEn"),l=n("lRwf"),c=n.n(l),u=n("NYxO"),d=n("mvHQ"),m=n.n(d),p=n("JU1R"),h=n("TVG1"),f=(n("mtWM"),n("lbHh")),g=n.n(f),v={state:{cachePage:[],openedSubmenuArr:[],pageOpenedList:[{title:"首页",path:"/",name:"home"}],currentPageName:"",currentPath:[{title:"首页",path:"/content/home",name:"home"}],menuList:[],routers:[p.c,p.b].concat(o()(p.a)),dontCache:["notice"],tagsList:[p.b].concat(o()(p.a)),staffServiceType:[],staffAccount:{},deleteModal:{model:!1,callback:function(){}},uploadProgressPercent:0,uploadProgressVisible:!1},mutations:{setUploadProgress:function(e,t){e.uploadProgressVisible=t},setUploadPercent:function(e,t){e.uploadProgressPercent=t},setDeleteModal:function(e,t){t.model?e.deleteModal={model:t.model,callback:t.callback}:e.deleteModal={model:t.model,callback:function(){}}},setStaffServiceType:function(e,t){e.staffServiceType=t},setStaffAccount:function(e,t){e.staffAccount=t},setTagsList:function(e,t){var n;(n=e.tagsList).push.apply(n,o()(t))},updateMenulist:function(e){e.menuList=p.a},addOpenSubmenu:function(e,t){var n=!1,a=!1,o=!1;0===t.length&&(a=!0),e.openedSubmenuArr.indexOf(t)>-1&&(n=!0),t instanceof Array&&(o=!0),n||a||o?n||a||!o||(e.openedSubmenuArr=t):e.openedSubmenuArr=[t]},clearOpenSubmenu:function(e,t){e.openedSubmenuArr=[]},closePage:function(e,t){e.cachePage.forEach(function(n,a){n===t&&e.cachePage.splice(a,1)})},initCachepage:function(e){localStorage.cachePage&&(e.cachePage=JSON.parse(localStorage.cachePage))},removeTag:function(e,t){e.pageOpenedList.map(function(n,a){n.name===t&&e.pageOpenedList.splice(a,1)})},setCurVillage:function(e,t){localStorage.setItem("village",t),e.curVillage=t},pageOpenedList:function(e,t){var n=e.pageOpenedList[t.index];t.argu&&(n.argu=t.argu),t.query&&(n.query=t.query),e.pageOpenedList.splice(t.index,1,n),localStorage.pageOpenedList=m()(e.pageOpenedList)},clearAllTags:function(e){e.pageOpenedList.splice(1),e.cachePage.length=0,localStorage.pageOpenedList=m()(e.pageOpenedList)},clearOtherTags:function(e,t){var n=t.$route.name,a=0;e.pageOpenedList.forEach(function(e,t){e.name===n&&(a=t)}),0===a?e.pageOpenedList.splice(1):(e.pageOpenedList.splice(a+1),e.pageOpenedList.splice(1,a-1));var o=e.cachePage.filter(function(e){return e===n});e.cachePage=o,localStorage.pageOpenedList=m()(e.pageOpenedList)},setOpenedList:function(e){e.pageOpenedList=localStorage.pageOpenedList?JSON.parse(localStorage.pageOpenedList):[]},setCurrentPath:function(e,t){e.currentPath=t},setCurrentPageName:function(e,t){e.currentPageName=t},increateTag:function(e,t){h.a.oneOf(t.name,e.dontCache)||(e.cachePage.push(t.name),localStorage.cachePage=m()(e.cachePage)),e.pageOpenedList.push(t),localStorage.pageOpenedList=m()(e.pageOpenedList)}}},b={state:{},mutations:{logout:function(e,t){g.a.remove("user"),g.a.remove("password"),g.a.remove("access")}}};c.a.use(u.a);var y=new u.a.Store({state:{},mutations:{},actions:{},modules:{app:v,user:b}}),w=n("h2kg");Vue.config.productionTip=!1,Vue.prototype.$http=w.a,iview.InputNumber.computed.precisionValue=function(){var e=(this.currentValue+"").split(".");return this.precision&&e[1]&&this.precision<e[1].length?this.currentValue.toFixed(this.precision):this.currentValue},Vue.use(iview),new Vue({el:"#app",router:s.a,store:y,render:function(e){return e(r)},data:{currentPageName:""},mounted:function(){var e;this.currentPage=this.$route.name,this.$store.commit("setOpenedList"),this.$store.commit("initCachepage"),(e=document.createElement("script")).src="https://webapi.amap.com/maps?v=1.4.15&key=8a1c307c3702ccf7303aae5617321199&plugin=AMap.MouseTool&plugin=AMap.Geocoder&plugin=AMap.PolyEditor",document.body.append(e)},created:function(){var e=[];p.a.map(function(t){t.children.length<=1?e.push(t.children[0]):e.push.apply(e,o()(t.children))})}})},NlXT:function(e,t){},TVG1:function(e,t,n){"use strict";var a=n("bOdI"),o=n.n(a),i=n("woOf"),r=n.n(i),s=n("BO1k"),l=n.n(s),c=n("mtWM"),u=n.n(c),d=n("7YgM"),m=(n.n(d),n("JU1R"),{sortTableRow:function(e,t,n){var a=[],o=n[e];return n.forEach(function(t,n){n!=e&&a.push(t)}),a.splice(t,0,o),n=a},title:function(e){var t="天富呼叫中心";e&&(t+="-"+e),window.document.title=t},inOf:function(e,t){var n=!0;return e.forEach(function(a){t.indexOf(e)<0&&(n=!1)}),n},oneOf:function(e,t){if(t)return!(t.indexOf(e)<0)},getRouterObjByName:function(e,t){if(!t||!e||!router.length)return null;var n=null,a=!0,o=!1,i=void 0;try{for(var r,s=l()(e);!(a=(r=s.next()).done);a=!0){var c=r.value;if(c.name===t)return c;if(n=m.getRouterObjByName(c.children,t))return n}}catch(e){o=!0,i=e}finally{try{!a&&s.return&&s.return()}finally{if(o)throw i}}return null},handleTitle:function(e,t){return t.title},setCurrentPath:function(e,t){var n="",a=!1;e.$store.state.app.routers.forEach(function(o){1===o.children.length?o.children[0].name===t&&(n=m.handleTitle(e,o),"forbid"===o.name&&(a=!0)):o.children.forEach(function(i){i.name===t&&(n=m.handleTitle(e,i),"otherRouter"===o.name&&(a=!0))})});var o=[];if("home"===t)o=[{title:"首页",path:"/content/home",name:"home"}];else if(a&&"home"!==t)o=[{title:"首页",path:"/content/home",name:"home"},{title:n,path:"",name:t}];else{var i=e.$store.state.app.routers.filter(function(e){if(e.children.length<=1)return e.children[0].name===t;for(var n=0,a=e.children,o=a.length;n<o;){if(a[n].name===t)return!0;if(a[n].children)for(var i=0,r=a[n].children,s=r.length;i<s;){if(r[i].name===t)return!0;i++}n++}})[0];if(i.children.length<=1&&"home"===i.name)o=[{title:"首页",path:"/content/home",name:"home"}];else if(i.children.length<=1&&"home"!==i.name)o=[{title:"首页",path:"/content/home",name:"home"},{title:i.title,path:"",name:t}];else{var r=null,s=null;if(i.children.map(function(e){if(e.name===t&&(r=e),e.children)for(var n=0,a=e.children,o=a.length;n<o;)a[n].name===t&&(r=e,s=a[n]),n++}),s&&"otherRouter"!==i.name){var l=i.meta.single;o=[{title:l?i.children[0].title:i.title,path:l?i.path+"/"+i.children[0].path:"",name:i.name},{title:r.title,path:"",name:r.name},{title:s.title,name:s.name,path:i.path+"/"+r.path+"/"+s.path}]}else o="otherRouter"===i.name?[{title:"首页",path:"/content/home",name:"home"},{title:r.title,path:i.path+"/"+r.path,name:t}]:[{title:i.title,path:"",name:i.name},{title:r.title,path:i.path+"/"+r.path}]}}return e.$store.commit("setCurrentPath",o),o},openNewPage:function(e,t,n,a){for(var o=e.$store.state.app.pageOpenedList,i=o.length,r=0,s=!1;r<i;){if(t===o[r].name){e.$store.commit("pageOpenedList",{index:r,argu:n,query:a}),s=!0;break}r++}if(!s){var l=e.$store.state.app.tagsList.filter(function(e){return e.children?t===e.children[0].name:t===e.name});l=l[0],e.$store.state.app.tagsList.forEach(function(e){e.children?e.children.forEach(function(e){e.name===t?l=e:e.children&&e.children.forEach(function(e){e.name===t&&(l=e)})}):e.name===t&&(l=e)}),l&&(l=l.children?l.children[0]:l,n&&(l.argu=n),a&&(l.query=a),e.$store.commit("increateTag",l))}e.$store.commit("setCurrentPageName",t)},formatterParams:function(e){var t="";for(var n in e){if(e[n])if(e[n].length>0||e[n]>0)t+=n+"="+e[n]+"&"}return t=t.substr(0,t.length-1)},formateTime:function(e,t){var n=new Date(e),a=n.getFullYear(),o=n.getMonth()+1,i=n.getDate()<10?"0"+n.getDate():n.getDate(),r=n.getHours()<10?"0"+n.getHours():n.getHours(),s=n.getMinutes()<10?"0"+n.getMinutes():n.getMinutes();return t?a+"-"+o+"-"+i:a+"-"+o+"-"+i+" "+r+":"+s},formateParamBool:function(e,t,n){return e=n?e.map(function(n){return e[t],e[t+"Bool"]=!0,e}):e.map(function(n){return e[t+"Bool"]?e[t]="Y":e[t]="N",delete e[t+"Bool"],e})},getStationLists:function(e){u.a.get("/yyht/v1/repair/station/select/list").then(function(t){0===t.data.code?"function"==typeof e&&e(t.data.data):console.log("util.getStationLists失败："+t.data.msg)})},getDepartment:function(e){u.a.get("/common/departmentList").then(function(t){0===t.data.code?"function"==typeof e&&e(t.data.data):console.log("util.getDepartment组织列表失败："+t.data.msg)})},getRegion:function(e){u.a.get(" /yyht/v1/repair/region/list").then(function(t){0===t.data.code?"function"==typeof e&&e(t.data.data):console.log("util.getRegion报修区域列表失败："+t.data.msg)})},getTreeLists:function(e){u.a.get("/yyht/v1/repair/category/tree").then(function(t){0===t.data.code?"function"==typeof e&&e(t.data.data):console.log("获取服务类型列表数失败："+t.data.msg)})},getRepairTypeDropdown:function(e){u.a.get("/yyht/v1/repair/category/select/first").then(function(t){0===t.data.code?"function"==typeof e&&e(t.data.data):console.log("获取服务类型一级下拉列表失败："+t.data.msg)})},getRepairTypeNext:function(e,t){u.a.get("/yyht/v1/repair/category/select/next?parentId="+e).then(function(e){0===e.data.code?"function"==typeof t&&t(e.data.data):console.log("获取服务类型二级下拉列表失败："+e.data.msg)})},getRepairTypeTree:function(e){u.a.get("/yyht/v1/repair/category/tree").then(function(t){0===t.data.code?"function"==typeof e&&e(t.data.data):console.log("获取服务类型树结构失败："+t.data.msg)})},downloadExcel:function(e,t){var n=new Blob([e.data],{type:"application/vnd.ms-excel"}),a=document.createElement("a"),i=window.URL.createObjectURL(n);a.href=i;var s=e.headers["content-disposition"],l={};(s=s.split(";")).forEach(function(e){var t=e.split("="),n=t[0].trim(),a=t[1]?t[1]:"";l=r()({},l,o()({},n,a))});var c=decodeURI(l.filename);a.download=c||t,document.body.appendChild(a),a.click(),document.body.removeChild(a),window.URL.revokeObjectURL(i)},getQiNiuToken:function(e){u.a.get("/base/qiniu/token").then(function(t){if(0===t.data.code){var n=t.data.data.token,a=t.data.data.imagePrefix;localStorage.setItem("qnToken",n),localStorage.setItem("qnPrefix",a),"function"==typeof e&&e(t.data.data)}})}});t.a=m},YaEn:function(e,t,n){"use strict";var a=n("lRwf"),o=n.n(a),i=n("/ocq"),r=n("JU1R"),s=n("1R2i"),l=n.n(s),c=n("TVG1"),u=n("lbHh"),d=n.n(u);o.a.use(i.a);var m={routes:r.d},p=new i.a(m);p.beforeEach(function(e,t,n){if(l.a.LoadingBar.start(),c.a.title(e.meta.title),d.a.get("user")||"login"===e.name)if(d.a.get("user")&&"login"===e.name)n({name:"home"});else{var a=c.a.getRouterObjByName(e.name);a&&a.title&&c.a.title(a.title)}else n({name:"login"});n()}),p.afterEach(function(e){l.a.LoadingBar.finish(),window.scrollTo(0,0)}),t.a=p},"c7+C":function(e,t){e.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAMAAADyHTlpAAAAtFBMVEUAAAD////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////oK74hAAAAO3RSTlMA+gr2vRvveFUO8uSZTee4pZ+C4YtwQwbclY9oNhPTy8exfWNfIevBhm0sKM9JFsOuWyrXq1E5JD8xGNAHL90AAALySURBVDjLhdXnlqJAEIbhr0GiImLOOTvq6KTdee//vhYFd/Lu8wdOnz7VdbqqQF81q3FtaYeF/czSvxzWRTLVI2Fnq59Y1ZCrNpwNqe4PkbcPZGKbwh5w4c7RN+Y2uSqc6sAKqL3qixI3D1Vc6w7ur3mPrJ930jvSGVyeXCX6aErGLRK+Gvo+HD0yv/TejFwJunuGSp/Risyd3tkZMuEGXuo01OYhMJgyF029KZCrl4h1ZwYOzJ6gkoWo6C+fnO202Q941JyyVcLe5MuWclZWTONSWtCWz14Vpiqyvl3Ls3K9/HBjFjMa6hSlsj3Y4g5qZDbKjbgYPlFRJQzUrupMRx7THbjXbEu30ueH1DmrWJLDQhuzUKFsNSC720dlulx0dDfRjq3mBWnyqMBsFJNkyRWUKZKqWQP66qVryUly+3qqtVp227rnYqQrB9wGe/nptscnaWipv5JKczVNXy4usLpdavm3X5FKTelO2nUkL5JiqT7VM90pEN9SXfudQ2vhyXFOgdU8O+q1nMN+EDS08CPF46PJy3XJJnkZz7VLF7qBDh1pFqXJDBTcS35PXby3+hdCnNaop0VBqvrSKpAzkqaeBssogacPBVCdF1U8WcuDdmNp3U1f+6owBPIBG3LRbdLWlq02Q6m+VmsZqREqyhr2QwOeinQ0KUrtrlrlpuYmaBUnVi0bS2USUiaGqE8in0iRbWk0Vto6da4WylTJmKCAr5EJNCnombXazA0Xk899vWqmu38x1qvxVKF5Yjn6NIaB4cobs9KEqjz6r8a2huTu9Vf895PinS8hHlxNWUXk7Bfp4xAsh/A7wW49M2mVmY7JNfTGKpMyUHYMsRI2J5iSi/Veg0yyBs8K2Y4Jj2TaB73Xyqdt5qY5zNKehJDM8kUf9e1rClVwdaSScOP29dmc1LgG9zvwbHLFs75qGHgAenUokSs4+k6zzMWuTC3PPGzoB07HhmIE2fF2ffDPH1EtmWQB43mg/7Ca/mwTLfSdP1KPsbNwgZPMAAAAAElFTkSuQmCC"},fmYl:function(e,t){},h2kg:function(e,t,n){"use strict";var a,o=n("//Fk"),i=n.n(o),r=n("mtWM"),s=n.n(r),l=n("YaEn"),c=n("lbHh"),u=n.n(c);window.location.hostname;a="http://182.254.234.236:9001",s.a.defaults.headers.common["Content-Type"]="application/json",s.a.defaults.headers.post["Content-Type"]="application/x-www-form-urlencoded",s.a.defaults.baseURL=a,s.a.defaults.timeout=1e4,s.a.defaults.withCredentials=!0,s.a.interceptors.request.use(function(e){return e},function(e){return i.a.reject(e)});s.a.interceptors.response.use(function(e){var t=e.data.code,n=e.config.method;return 904===t&&"option"!==n?(u.a.remove("user"),l.a.push({name:"login"}),e):905===t&&"option"!==n?(l.a.replace({name:"forbid"}),e):e},function(e){return console.log("interceptor error--------"+e),i.a.reject(e)}),t.a=s.a},kaz5:function(e,t){},lRwf:function(e,t){e.exports=Vue},rQA7:function(e,t){},rXMn:function(e,t){},tSML:function(e,t){},yOXi:function(e,t){}},["NHnr"]);