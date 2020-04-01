1. 账号管理接口，roleId，userId为空
2. 账号管理addOrUpdate接口
    - 需要新增一个查询用户信息接口，`/sys/v1/user/info?id=${id}`,用于查询用户角色，账号密码等
    - 新增字段“type"是从哪儿来的，有哪些可能值？
    - 保存报错：系统处理错误
3. 角色列表：
    - 角色列表（下拉选择）没有角色描述description字段
    - 查询所有菜单（返回树形结构)  : 返回的不是树形结构
4. 新增角色：
    - 新增角色（喊资源信息）：报系统错误
5. 服务栏目：
    - 查询所有服务栏目（不分页）  ： 系统处理错误
    - 编辑栏目： 保存时，提示已经存在栏目名称（编辑）
6. 全部服务：
    - 查询服务栏目下服务下拉： 需要分页？
    - 服务项目，二级查询接口`http://192.168.0.133:8887/yyht/v1/repair/category/select/next?categoryId=7d4e8118edae4b6885dea2860bdf8a21`
            ： 查询提示分类不存在
7. 广告主管理：
    - 列表接口`/yyht/v1/ad/owner/get/adOwner/show/pageList`：没有返回联系电话，正在投放广告数
    - 列表接口（上）：搜索无效
    - 详情列表`/yyht/v1/ad/owner/getPageList`: 广告主不存在
    - 缺接口：编辑，删除详情列表中的数据
8. Banner管理：
    - 列表接口 `/yyht/v1/ad/config/getPageListAdByTypeId`: 弹窗查询类型接口(小程序内转)，返回系统处理错误
9. 推荐位管理：
    - 保存接口`/yyht/v1/recommend/config/saveOrUpdate`: "系统处理错误"
10. 网点管理：
    - 列表接口`/yyht/v1/repair/station/pageList?pageNo=1&pageSize=10`: "系统处理错误"
11. 服务分类：
    - 新增/编辑：`/yyht/v1/repair/category/addOrUpdate`:保存新服务时报错："系统处理错误"
12. 申述原因配置：
    - 列表接口：`/yyht/v1/repair/statement/reason/list`:返回的数据结果中，orderStateType字段为空无法区分是“上门前”还是“上门后”
13. 工单列表：
    - 区域列表(下拉选择）：`/repair/call/center/v1/repair/region/list`下拉接口404
    - baseInfo404：/repair/call/center/v1/repair/order/baseInf
    - 处理流程404：/repair/call/center/v1/repair/order/schedule
    - 回访信息列表：/yyht/v1/repair/order/return/visit/list?id=a551164163c64f868ea744d769dac503  系统处理错误
