系统登录  1
http://localhost:8887/sys/v1/user/login?username=system&password=123456z

退出登录 1
http://localhost:8887/sys/v1/user/login/out
用户管理列表（平台管理员）1
http://localhost:8887/sys/v1/user/pageList?pageNo=1&pageSize=10
> 列表roleId为空，userId为空

管理后台-添加管理用户(管理员） 0.5
http://localhost:8887/sys/v1/user/addOrUpdate
body参数：
{
"loginName":"zhengwei002",
"nickName":"郑先生你最帅",
"password":"e10adc3949ba59abbe56e057f20f883e",
"mobile":"18108241933",
"type":"ADMIN",
"isOpen":"CLOSE",
"roleId":"e01ce21184a54477a9eedfa77ca76f34"
}
> 缺一个获取角色详情接口：密码等信息通过这个接口返回,

管理后台-新增角色（喊资源信息）    0.5
http://localhost:8887/sys/v1/role/defend
body参数：
{
"roleId":"e01ce21184a54477a9eedfa77ca76f34",
"name":"超级管理员",
"description":"这个角色是一个无所不能的超级管理员(被修改)",
"menuIds":["1","2","3","21","211"]
}
管理后台-获取所有角色列表（下拉选择使用）1
http://localhost:8887/sys/v1/role/getAllRoleList
管理后台-查询所有菜单（返回树形结构） 0.5
http://localhost:8887/sys/v1/role/findAllMenu
管理后台-用户基本信息及菜单信息（用户加载）  1
http://localhost:8887/sys/v1/user/basicInfo
管理后台-获取角色信息(查看详情需要)     1
http://localhost:8887/sys/v1/role/info?id=e01ce21184a54477a9eedfa77ca76f34
-----------------
管理后台-添加/编辑服务区域
http://localhost:8887/yyht/v1/repair/region/addOrUpdate
body参数：
{
"name":"三道堰代表大队",（文字输入框）
"fullDescribe":"这个是区域服务说明，比如此区域服务小区啊，乱七八糟的东西都可以放，H5格式的哦",（富文本输入框）
"remark":"这里就是备注，想说说明说什么。",（textare)
"geoProvinceName":"xxxxx",(所属省份【汉子：四川省】）
"geoCityName":"51010",（所属市）【汉子：成都市】
"geoDistrict":"510117,510011,521113",（如果框的多边形跨区时，行政区域编码通过逗号隔开提供）【这个给编码】
"areaInfo":"四川省成都市武侯区服务片区",
"rangeGd":"103.999227,30.777325;103.98392,30.772485;103.992903,30.760445;104.005767,30.758025"
}

/yyht/v1/repair/region/getRegionInfo?repairRegionId=xxx
管理后台-添加/编辑服务区域与报修分类关系（自定义价格等信息）
http://localhost:8887/yyht/v1/repair/region/setRepairCategoryRegionRef
接口说明：
    此接口也是应用在维护服务区域功能中，只是服务区域与报修分类关系，单独维护；
body：
{
"repairRegionId":"73106cd4705444d78ac927042f5025ac（服务区域ID）",
"repairCategoryId":"07b29d6ba2c64b4a9501d05735a57cf5（报修分类ID--报修分类叶子节点）",
"serviceFee":80（服务收费（人工费不得低于））,
"hasDtdServiceFee":"Y"（是否收取上门费（Y/N））,
"dtdServiceFee":20（上门费标准）,
"isPrepayDtd":"Y"（是否需要先支付上门费（Y/N））,
"description":"管道疏通-下水道疏通备注描述信息"
}
管理后台-获取服务区域与报修分类关系信息
http://localhost:8887/yyht/v1/repair/region/getRepairCategoryRegionRef?repairRegionId=73106cd4705444d78ac927042f5025ac&repairCategoryId=07b29d6ba2c64b4a9501d05735a57cf5
返回内容：
{
    "code": 0,
    "data": {
        "id": "a077766114b14edfabf3ac0900279f87",
        "name": "",
        "serviceFee": 80.00,
        "hasDtdServiceFee": "Y",
        "dtdServiceFee": 20.00,
        "isPrepayDtd": "Y",
        "iconCode": "",
        "isUserCanUse": "",
        "parentId": "",
        "isShow": "",
        "sortIndex": "",
        "longName": "",
        "description": "管道疏通-下水道疏通备注描述信息",
        "repairRegionId": "73106cd4705444d78ac927042f5025ac",
        "repairCategoryId": "07b29d6ba2c64b4a9501d05735a57cf5"
    },
    "ts": 1583889666083
}
管理后台-服务区域分页列表       1
http://localhost:8887/yyht/v1/repair/region/pageList?pageNo=1&pageSize=10
管理后台-删除服务区域            1
http://localhost:8887/yyht/v1/repair/region/delete?id=xxxxxx
管理后台-获取支持指定服务区域支持的网点列表
http://localhost:8887/yyht/v1/repair/region/support/station/list?regionId=73106cd4705444d78ac927042f5025ac
-------------------------------------------------------------
服务栏目（新增/修改）     1
http://localhost:8887/yyht/v1/service/type/saveOrUpdate
服务栏目（删除）    1
http://localhost:8887/yyht/v1/service/type/delete?id=284504a1ac9246fdacdd90c493004fa0
查询所有服务栏目（不分页）           1
http://localhost:8887/yyht/v1/service/type/getAllServiceType
返回model:
{
    "code": 0,
    "data": [
        {
            "id": "ce0021eedf5f489fa97c2ea8bf2f62d2",
            "typeName": "报修服务",
            "createTime": "2020-03-11 19:52",
            "serviceNum": 0,
            "typeDes": "报修服务栏目"
        },
        {
            "id": "d361abd8ec404444b66a67f6376c7798",
            "typeName": "报修服务2",
            "createTime": "2020-03-11 19:27",
            "serviceNum": 0,
            "typeDes": "报修服务栏目2"
        }
    ],
    "ts": 1583927892586
}
根据ID查询服务栏目      1
http://localhost:8887/yyht/v1/service/type/getServiceTypeById?id=ce0021eedf5f489fa97c2ea8bf2f62d2
返回model:
{
    "code": 0,
    "data": {
        "id": "ce0021eedf5f489fa97c2ea8bf2f62d2",
        "createTime": "2020-03-11 19:46:52",
        "isValid": "Y",
        "typeName": "报修服务",
        "typeDes": "报修服务栏目",
        "typeCode": "",
        "sortIndex": 1
    },
    "ts": 1583928366642
}

修改栏目排序      1
http://localhost:8887/yyht/v1/service/type/updateServiceTypeSort
说明：排序越小，显示越前面
body参数：
[
{
"id":"ce0021eedf5f489fa97c2ea8bf2f62d2"
},
{
"id":"d361abd8ec404444b66a67f6376c7798"
}
]
服务分类（应用服务业务）（弹窗选项）  1
http://localhost:8887/yyht/v1/service/category/getAllServiceCategory
返回数据model:
{
    "code": 0,
    "data": [
        {
            "id": "12",
            "idParent": "0",
            "name": "E服务",
            "code": "E_SERVICE",
            "nocheck": true
        },
        {
            "id": "3",
            "idParent": "0",
            "name": "小程序内转",
            "code": "APP_JUMP",
            "nocheck": false
        },
        {
            "id": "5",
            "idParent": "0",
            "name": "H5链接类",
            "code": "H5",
            "nocheck": false
        },
        {
            "id": "13",
            "idParent": "12",
            "name": "服务项目",
            "code": "E_PROJECT",
            "nocheck": false
        },
        {
            "id": "14",
            "idParent": "12",
            "name": "服务分类",
            "code": "E_SERVICE_CATEGORY",
            "nocheck": false
        }
    ],
    "ts": 1583931245015
}
--
管理后台-广告主信息（新增/修改）   1
http://localhost:8887/yyht/v1/ad/owner/addOrUpdate
提交body参数：
{
"adOwnerId":"修改时提供的主键ID",
"ownerName":"郑先生来头",
"ownerPhone":"18108242933",
"ownerAddress":"火星妈妈拉拉",
"agentName":"业务员王哥",
"ownerState":"IN_COOPERATION（合作状态 IN_COOPERATION 合作中、PAUSE 暂停中、STOP_COOPERATION 停止合作）"
}
删除广告主       1
http://localhost:8887/yyht/v1/ad/owner/delete?adOwnerId=2
查询广告主（分页）   1
http://localhost:8887/yyht/v1/ad/owner/get/adOwner/show/pageList?pageNo=1&pageSize=10&ownerName=郑先生来头&ownerPhone=18108242933
备注：查询条件可以不提供（提供时，按条件进行查询）

界面效果（新运营后台已有此功能）
查询广告主详情     1
http://localhost:8887/yyht/v1/ad/owner/get/owner?adOwnerId=892b0acb299249378ff61c67e447c1e0
此
http://localhost:8887/yyht/v1/ad/owner/getPageList?pageNo=1&pageSize=10&adOwnerId=892b0acb299249378ff61c67e447c1e0&adState=广告主下面发布的广告状态类型（不含推荐位广告）
adState值说明：
IN_EFFECT("IN_EFFECT","生效中"),【目前只做它】
IS_INVALID("IS_INVALID","已失效"),【目前只做它】
IMMINENT_EXPIRY("IMMINENT_EXPIRY","即将过期"),
NOT_EFFECTIVE("NOT_EFFECTIVE","未生效")


管理后台-获取广告主（列表）      1
http://localhost:8887/yyht/v1/ad/owner/getOwnerList
管理后台-查询banner广告列表信息（分页） 1
http://localhost:8887/yyht/v1/ad/config/getPageListAdByTypeId?pageNo=1&pageSize=10&adTypeId=1
获取广告详情
http://localhost:8887/yyht/v1/ad/config/getDetails?configId=1
管理后台-查询所有的广告位类型
http://localhost:8887/yyht/v1/ad/config/getAdTypeList
管理后台-删除广告，根据广告id删除广告        1
http://localhost:8887/yyht/v1/ad/config/deleteAdById?id=xxxx
广告（新增/编辑）
http://localhost:8887/yyht/v1/ad/config/addOrUpdate
提交model:
{
"adTypeId":"1",
"adOwnerId":"1",
"isLongValid":"Y",
"startTime":"",
"endTime":"",
"title":"title",
"imgName":"imgName",
"idServiceCategory":"xxxxxxx",
"serviceCategoryCode":"服务分类编码",
"target":"目标（具体的操作码/id/h5链接）",
"needLogin":"Y",
"needExpireRemind":"Y"
}
推荐位（新增/修改）  1
http://localhost:8887/yyht/v1/recommend/config/saveOrUpdate
提交body参数：
{
"id":"修改时，提供",
"suSystem":"E_SERVICE（默认--后续业务扩展时，在提供其他的）",
"recommendFormatId":"E1",
"recommendFormatCode":"1",
"suAppModuleCode":"SY（默认--后续业务扩展时，在提供其他的）",
"sortIndex":"1",
"details":[
{
"recommendFormatImgId":"E_D_1",
"recommendCategoryId":"1",
"recommendCategoryCode":"E_SERVICE_CATEGORY",
"target":"111111",
"targetShowName":"sssssss",
"targetImage":"xxxx.jpg",
"needLogin":"Y",
"sortIndex":"1",
"adOwnerId":"广告主ID",
"title":"标题"
}
]
}
管理后台-获取配置列表信息       1
http://localhost:8887/yyht/v1/recommend/config/config/list
管理后台-获取版位模板     1
http://localhost:8887/yyht/v1/recommend/config/template
管理后台-获取目标分类     1
http://localhost:8887/yyht/v1/recommend/config/target/categories
获取目标分类      1
http://localhost:8887/yyht/v1/recommend/config/target/categories
返回数据model:
{
    "code": 0,
    "data": [
        {
            "id": "51",
            "name": "H5",这个就是H5，需要填写H5内容（可以不填）
            "code": "H5"
        },
        {
            "id": "52",
            "name": "APP内转",
            "code": "APP_JUMP"（去获取APP内转接口）
        },
        {
            "id": "53",
            "name": "服务项目",（去获取服务项目接口--一级）
            "code": "E_PROJECT"
        },
        {
            "id": "54",
            "name": "服务分类",去获取服务项目-服务项目分类接口）
            "code": "E_SERVICE_CATEGORY"
        }
    ],
    "ts": 1583995468473
}

删除推荐位   1
/yyht/v1/recommend/config/delete?id=xxxx


管理后台-服务（新增或者修改） 1
http://localhost:8887/yyht/v1/service/addOrUpdate
管理后台-查询所有的服务（列表）    1
http://localhost:8887/yyht/v1/service/getAllService?serviceTypeId=ce0021eedf5f489fa97c2ea8bf2f62d2
管理后台-查询未添加到首页的服务    1
http://localhost:8887/yyht/v1/service/getAllServiceByInner?serviceTypeId=ce0021eedf5f489fa97c2ea8bf2f62d2
根据服务栏目id查询服务（服务首页使用）    1
/yyht/v1/service/getAllServiceByServiceTyId?id=服务栏目ID&type=类型&flag=排列类型
type可选值如下：createTime 创建时间、clickCount 点击量
flag可选值：up 升序 down 降序
根据服务id删除服务  1
/yyht/v1/service/delete?id=服务ID
根据服务id查询信息      1
/yyht/v1/service/getAllServiceByServiceTyIdForPage?id=服务ID
根据类型code查询数据(APP内转调用接口)     1
/yyht/v1/service/getServiceByCategoryByCode?code=xxx&name=xxx(非必填，查询使用)&pageNo=xx&pageSize=xxx
code可选值：
APP_JUMP
E_PROJECT
E_SERVICE_CATEGORY
code实际上就是ServiceCategory的code编码
--注意报修分类联动时，联动数据获取请调用接口（/yyht/v1/repair/category/select/next）进行获取
排序
/yyht/v1/service/updateServiceSort
body参数
[{"serviceId":"xxx"},{"serviceId":"xxx2"}]
备注：拖拽排序，直接将排序后显示的ID；

根据code查询已添加的服务
/yyht/v1/service/getServiceByCode?code=xxx
code值目前有这些
    E_SERVICE
    E_PROJECT
    E_SERVICE_CATEGORY
    APP_JUMP
    H5

/base/qiniu/token?environment=可选（wolf-dev/wolf-prd/wolf-uat）    1
返回model:
{
    "code": 0,
    "data": {
        "domain": "q7adjw5as.bkt.clouddn.com/",
        "token": "aPJ-aQjnkw0IUSnDIr7cwFurzythyDU3OHO2sbFW:vNaQRA0tfEbEPv53ywIG1_iStzc=:eyJzY29wZSI6IndvbGYtdWF0IiwiZGVhZGxpbmUiOjE1ODQzNjk0NDJ9"
    },
    "ts": 1584365845581
}
上传图片
/base/qiniu/upload/image         1
表单提交模式，改为图片上传模式；文件类型是file
