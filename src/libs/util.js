import axios from 'axios';
import packjson from '../../package.json';
import {appRouter} from '../router/router';
let util={};
util.title=function(title){
  let Title='天富呼叫中心';
  if(title){
    Title+='-'+title;
  }
  window.document.title=Title;
};

//判断数组是否包含某一个数组
util.inOf=function(arr,targetArr){
  let res = true;
  arr.forEach(item=>{
    if(targetArr.indexOf(arr)<0){
      res = false;
    }
  })
  return res;
};
//判断元素是否在数组中
util.oneOf=function(ele,targetArr){
  if(!targetArr) return
  if(targetArr.indexOf(ele)<0){
    return false;
  }else{
    return true;
  }
};
//根据路由name获取Router对象中的当前对象
util.getRouterObjByName=function(routers,name){
  if(!name||!routers||!router.length){
    return null;
  }
  let routerObj=null;
  for(let item of routers){
    if(item.name===name){
      return item;
    }
    routerObj=util.getRouterObjByName(item.children,name);
    if(routerObj){
      return routerObj;
    }
  }
  return null;
};
util.handleTitle=function(vm,item){
    return item.title;
};
//返回当前路由的全部路径值 数组
util.setCurrentPath=function(vm,name){
  let title = '';
  let isOtherRouter = false;
  //获取 title，并判断当前是否为otherRouter中的组件
  vm.$store.state.app.routers.forEach(item => {
    //只有一个子路由
    if (item.children.length === 1) {
      //匹配设置的name
      if (item.children[0].name === name) {
        title = util.handleTitle(vm, item);
        if (item.name === 'forbid') {
          isOtherRouter = true;
        }
      }
    } else {
      //多个子路由【只考虑一级子路由】
      item.children.forEach(child => {
        if (child.name === name) {
          title = util.handleTitle(vm, child);
          if (item.name === 'otherRouter') {
            isOtherRouter = true;
          }
        }
      });
    }
  });

//获取当前页面 完整路径值
  let currentPathArr = [];
//如果当前name为home主页时
  if (name === 'home') {
    currentPathArr = [
      {
        title:'首页',
        path: '/content/home',
        name: 'home'
      }
    ];
    /*
    * else if ((name.indexOf('_index') >= 0 || isOtherRouter) && name !== 'home')
    *  _index：匹配“个人中心，消息中心等单独页面）
    * */
    //当前 name为不在菜单栏中显示的Main组件,如单独的个人中心页面等。
  } else if (isOtherRouter&& name !== 'home') {
    currentPathArr = [
      {
        title: '首页',
        path: '/content/home',
        name: 'home'
      },
      {
        title: title,
        path: '',
        name: name
      }
    ];
  } else {
    //当前 name为左侧菜单栏中的组件

    //获取当前路由对象所属一级路由
    let currentPathObj = vm.$store.state.app.routers.filter(item => {
      //单个菜单如首页
      if (item.children.length <= 1) {
        return item.children[0].name === name;
      }else {
        let i = 0;
        let childArr = item.children;
        let len = childArr.length;
// 二级目录
        while (i < len) {

          if (childArr[i].name === name) {
            return true;
          }else if(childArr[i].children){

            //有三级路由
            let j=0;
            let subChildArr = childArr[i].children;
            let subLen = subChildArr.length;
            while(j<subLen){
              if(subChildArr[j].name===name){
                return true;
              }
              j++;
            }
          }
          i++;
        }
      }
    })[0];
    if (currentPathObj.children.length <= 1 && currentPathObj.name === 'home') {

        currentPathArr = [
          {
            title: '首页',
            path: '/content/home',
            name: 'home'
          }
        ];
      } else if (currentPathObj.children.length <= 1 && currentPathObj.name !== 'home') {
        currentPathArr = [
          {
            title: '首页',
            path: '/content/home',
            name: 'home'
          },
          {
            title: currentPathObj.title,
            path: '',
            name: name
          }
        ];
      } else {

      let childObj = null;
        let thirdChildObj = null;
        currentPathObj.children.map((child) => {
          if(child.name===name) childObj = child;
          if(child.children){
            let i = 0;
            let subChild = child.children;
            let len = subChild.length;
            while(i<len){
              if(subChild[i].name===name){
                childObj=child;
                thirdChildObj= subChild[i];
              }
              i++;
            }
          }
        });

      if(thirdChildObj){
        //三级菜单中有像工单管理这样的特殊情况
        let isSingle=currentPathObj.meta.single;
          currentPathArr = [
            {
              title: isSingle?currentPathObj.children[0].title:currentPathObj.title,
              path: isSingle?currentPathObj.path+ '/'+currentPathObj.children[0].path:'',
              name: currentPathObj.name
            },
            {
              title: childObj.title,
              path: '',
              name: childObj.name
            },
            {
              title:thirdChildObj.title,
              name:thirdChildObj.name,
              path:currentPathObj.path + '/' + childObj.path+'/'+thirdChildObj.path,
            }
          ];

      }else{
          currentPathArr = [
            {
              title: currentPathObj.title,
              path: '',
              name: currentPathObj.name
            },
            {
              title: childObj.title,
              path: currentPathObj.path + '/' + childObj.path,
            }
          ];
        }

      }
  }

  vm.$store.commit('setCurrentPath', currentPathArr);
  return currentPathArr;
};
util.openNewPage = function (vm, name, argu, query) {
  let pageOpenedList = vm.$store.state.app.pageOpenedList;
  let openedPageLen = pageOpenedList.length;
  let i = 0;
  let tagHasOpened = false;
  while (i < openedPageLen) {
    if (name === pageOpenedList[i].name) { // 页面已经打开
      vm.$store.commit('pageOpenedList', {
        index: i,
        argu: argu,
        query: query
      });
      tagHasOpened = true;
      break;
    }
    i++;
  }
  if (!tagHasOpened) {
    let tag = vm.$store.state.app.tagsList.filter((item) => {
      if (item.children) {
        return name === item.children[0].name;
      } else {
        return name === item.name;
      }
    });
    tag = tag[0];

    // let tag = null;
    vm.$store.state.app.tagsList.forEach(item=>{
      if(item.children){
        item.children.forEach(child=>{
          if(child.name===name){
            tag = child;
          }
        })
      }else{
        if(item.name===name){
          tag=item;
        }
      }
    });


    if (tag) {
      tag = tag.children ? tag.children[0] : tag;
      if (argu) {
        tag.argu = argu;
      }
      if (query) {
        tag.query = query;
      }
      vm.$store.commit('increateTag', tag);
    }
  }
  vm.$store.commit('setCurrentPageName', name);
};

//格式化get请求参数
util.formatterParams=function(obj){
  let params = '';
  for(let key in obj){
    if(obj[key]){
      if(obj[key].length>0||obj[key]>0){
        let item = key+'='+obj[key]+'&';
        params+=item;
      }
    }
  }
  params = params.substr(0,params.length-1);
  return params;
};
//格式化时间
util.formateTime=function(date,isDate){
  let dateParam = new Date(date);
  let year = dateParam.getFullYear();
  let month = dateParam.getMonth()+1;
  let day = dateParam.getDate()<10?'0'+dateParam.getDate():dateParam.getDate();
  let hh = dateParam.getHours()<10?'0'+dateParam.getHours():dateParam.getHours();
  let mm = dateParam.getMinutes()<10?'0'+dateParam.getMinutes():dateParam.getMinutes();
  if(isDate){
    return `${year}-${month}-${day}`
  }else{
    return `${year}-${month}-${day} ${hh}:${mm}`
  }
};
/*格式化参数，将'Y'转化为true
  params:
      obj:待转对象
      prop:属性名称，转化后，将生成 prop+'Bool'属性用于承载值
      toBoolean: 为true则转化为Bool值，为false则转为’Y/N'
 */
util.formateParamBool=function(obj,prop,toBoolean){
  if(toBoolean){
    obj=obj.map(item=>{
      if(obj[prop]==='Y'){
        obj[prop+'Bool']=true;
      }else{
        obj[prop+'Bool']=true;
      }
      return obj;
    })
  }else{
    obj=obj.map(item=>{
      if(obj[prop+'Bool']){
        obj[prop]='Y'
      }else{
        obj[prop]='N'
      }
      delete obj[prop+'Bool'];
      return obj;
    })
  }
  return obj;
};
// 获取报修分类下拉
util.getRepairType=function(cb){
  axios.get('/repair/category/list')
    .then(res=>{
      if(res.data.code===0){
        typeof cb==='function'&&cb(res.data.data);
      }else{
        console.log('util.getRepairType失败：'+res.data.msg);
      }
    })
};
//获取服务网点下拉
util.getStationLists=function(cb){
  axios.get('/repair/station/select/list')
    .then(res=>{
      if(res.data.code===0){
        typeof cb==='function'&&cb(res.data.data);
      }else{
        console.log('util.getStationLists失败：'+res.data.msg);
      }
    })
};
//获取组织列表下拉（包含 网点和组织）
util.getDepartment=function(cb){
  axios.get('/common/departmentList')
    .then(res=>{
      if(res.data.code===0){
        typeof cb==='function'&&cb(res.data.data);
      }else{
        console.log('util.getDepartment组织列表失败：'+res.data.msg);
      }
    })
};
//获取报修区域下拉
util.getRegion = function(cb){
  axios.get('/repair/region/list')
    .then(res=>{
      if(res.data.code===0){
        typeof cb==='function'&&cb(res.data.data);
      }else{
        console.log('util.getRegion报修区域列表失败：'+res.data.msg);
      }
    })
}
// 获取服务类型列表数
util.getTreeLists=(cb)=>{
  axios.get(`/repair/category/tree`).then(res=>{
    if(res.data.code===0){
      typeof cb === 'function' &&cb(res.data.data);
    }else{
      console.log('获取服务类型列表数失败：'+res.data.msg)
    }
  })
},
// 获取服务类型一级列表下拉
util.getRepairTypeDropdown = function(cb){
  axios.get(`/repair/category/select/first`)
    .then(res=>{
      if(res.data.code===0){
        typeof cb === 'function' &&cb(res.data.data);
      }else{
        console.log('获取服务类型一级下拉列表失败：'+res.data.msg)
      }
    })
}
// 获取服务类型二级列表下拉
util.getRepairTypeNext = function(id,cb){
  axios.get(`/repair/category/select/next?parentId=${id}`)
    .then(res=>{
      if(res.data.code===0){
        typeof cb === 'function' &&cb(res.data.data);
      }else{
        console.log('获取服务类型二级下拉列表失败：'+res.data.msg)
      }
    })
}
// 获取服务类型树
util.getRepairTypeTree = function(cb){
  axios.get(`/repair/category/tree`).then(res=>{
    if(res.data.code===0){
      typeof cb === 'function' &&cb(res.data.data);
    }else{
      console.log('获取服务类型树结构失败：'+res.data.msg)
    }
  })
}
//下载excel文件
util.downloadExcel=function(res,fileName){
  let blob = new Blob([res.data], {type: 'application/vnd.ms-excel'}); //application/vnd.openxmlformats-officedocument.spreadsheetml.sheet这里表示xlsx类型
  let downloadElement = document.createElement('a');
  let href = window.URL.createObjectURL(blob); //创建下载的链接
  downloadElement.href = href;
  let header = res.headers['content-disposition'];
  header = header.split(';');
  let headerObject={};
  header.forEach(item=>{
    let param=item.split('=');
    let key =param[0].trim();
    let val = param[1]?param[1]:'';
     headerObject=Object.assign({},headerObject,{[key]:val});

  });
  let resFileName = decodeURI(headerObject['filename']);
  downloadElement.download =resFileName?resFileName:fileName; //下载后文件名
  document.body.appendChild(downloadElement);
  downloadElement.click(); //点击下载
  document.body.removeChild(downloadElement); //下载完成移除元素
  window.URL.revokeObjectURL(href); //释放掉blob对象
}

util.getQiNiuToken = function(callback){
  axios.get(`/base/qiniu/token`).then(res=>{
    if(res.data.code===0){
      let token = res.data.data.token;
      let qnPrefix=res.data.data.imagePrefix;
      localStorage.setItem('qnToken',token);
      localStorage.setItem('qnPrefix',qnPrefix)
      typeof callback === 'function' &&callback(res.data.data)
    }
  });
}

export default util;
