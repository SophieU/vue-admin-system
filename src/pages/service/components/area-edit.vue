<template>
    <div style="position: relative">
      <Spin size="large" :fix="true"  v-if="loading"></Spin>
      <div class="clearfix">
        <Button class="pull-right" @click="cancel">返回上一页</Button>
      </div>
      <Form :label-width="120">
        <FormItem class="must" label="区域名称">
            <Input v-model="form.name" placeholder="请填写区域名称" style="width: 250px;"/>
        </FormItem>
        <FormItem class="must" label="服务说明">
          <div id="fullDescribe"></div>
        </FormItem>
         <FormItem  class="must" label="备注">
            <Input v-model="form.remark" type="textarea" placeholder="请填写备注信息" style="width: 250px;"/>
        </FormItem>
        <FormItem  class="must" label="区域选点">
          <div class="control">
            <div v-show="pageType==='add'" class="btn-group">
              <Button @click="drawPolygon" type="primary">开始绘制区域</Button>
              <Button @click="clearPolygon">清除区域</Button>
            </div>
            <div v-show="pageType==='detail'" class="btn-group">
              <Button @click="startEdit" type="primary">开始编辑</Button>
              <Button @click="finishEdit" type="success">结束编辑</Button>
              <Button @click="clearPolygon">清除区域</Button>
            </div>
          </div>
            <p class="tips">Tips：绘制完成后，点击鼠标右击自动完成绘制</p>
            <div id="map">
              <div class="map-mask" v-show="!candraw" @contextmenu="e=>e.preventDefault()" @click="mapTip"></div>

              <div id="container"></div>
            </div>
        </FormItem>
        <FormItem>
          <Button @click="saveForm" type="primary">保存</Button>
          <Button @click="cancel">取消</Button>
        </FormItem>
      </Form>
    </div>
</template>

<script>
  import _ from 'lodash'
  import E from 'wangeditor';
    export default {
        name: "area-edit",
      props:['pageType','detailId'],
      data(){
          return {
            loading:false,
            map:null, // 地图实例
            searchPoint:'',
            showDrawToast:false, // toast提示
            overlay:null, // 已绘制覆盖物
            form:{
              name:'',
              fullDescribe:'',
              remark:'',
              geoProvinceName:'',
              geoCityName:'',
              geoDistrict:[],
              areaInfo:'',
              rangeGd:[],
            },
            mouseTool:null,
            candraw:true,
            polyEditor:null,
          }
      },
      mounted(){
        if(window.AMap){
          this.renderMap()
        }else{
          setTimeout(this.renderMap,1000)
        }
            if(this.pageType==='detail'){
              this.getDetail(this.detailId)
            }else{
              this.renderRichText()
            }
      },
      methods:{
          cancel(){
            this.$emit('update:pageType','list');
            this.form={
              name:'',
                fullDescribe:'',
                remark:'',
                geoProvinceName:'',
                geoCityName:'',
                geoDistrict:[],
                areaInfo:'',
                rangeGd:[],
            }
          },
          renderRichText(data){
            let config=[
              'head',  // 标题
              'bold',  // 粗体
              'fontSize',  // 字号
              'fontName',  // 字体
              'italic',  // 斜体
              'underline',  // 下划线
              'strikeThrough',  // 删除线
              'foreColor',  // 文字颜色
              'backColor',  // 背景颜色
              'link',  // 插入链接
              'list',  // 列表
              'justify',  // 对齐方式
              'emoticon',  // 表情
              'undo',  // 撤销
              'redo'  // 重复
            ]
            this.editor1 = new E('#fullDescribe');
            let editor1 = this.editor1;
            editor1.customConfig.menus =config;
            editor1.create();
            if(data){
              editor1.txt.html(data);
            }
          },
        renderMap(){
          var map = new AMap.Map("container", {
            resizeEnable: true,
            zoom: 14
          });
          this.map=map
          // 输入联想
          AMap.plugin(['AMap.Autocomplete','AMap.PlaceSearch'],function(){
            var autoOptions = {
              // 使用联想输入的input的id
              input: "searchPoint"
            }
            var autocomplete= new AMap.Autocomplete(autoOptions)

            var placeSearch = new AMap.PlaceSearch({
              city:'全国',
              map:map
            })
            AMap.event.addListener(autocomplete, 'select', function(e){
              //TODO 针对选中的poi实现自己的功能
              placeSearch.search(e.poi.name)
            })
          })

          this.map.on('click',()=>{
            var overlays = this.map.getAllOverlays('polygon')
            if(!this.candraw){
              this.map.remove(this.overlay)
            }
          })
        },
        drawPolygon(path){
            var _this = this
          // 新增 - 绘制区域
          if(this.pageType=='add'){
            this.$Message.info({
              content:'点击地图开始绘制，右键结束绘制',
              duration:3
            })
            this.mouseTool = new AMap.MouseTool(this.map)

            this.mouseTool.polygon({
              strokeColor: "#FF33FF",
              strokeOpacity: 1,
              strokeWeight: 6,
              strokeOpacity: 0.2,
              fillColor: '#1791fc',
              fillOpacity: 0.4,
              strokeStyle: "solid",
            })
            this.mouseTool.on('draw', function(event) {
              _this.$Message.success({
                content:'覆盖物对象绘制完成',
                top:300
              })
              _this.candraw = false
              _this.overlay = event.obj
              _this.searchDistrict(_this.overlay.getPath())
              // event.obj 为绘制出来的覆盖物对象
            })
          }else{
            var polygon = new AMap.Polygon({
              map: _this.map,
              path: path,
              strokeColor: "#FF33FF",
              strokeWeight: 6,
              strokeOpacity: 0.2,
              fillOpacity: 0.4,
              fillColor: '#1791fc',
              zIndex: 50,
            })

            this.map.add(polygon)
            // 缩放地图到合适的视野级别
            this.map.setFitView()
            this.polyEditor = new AMap.PolyEditor(this.map, polygon)
          }


        },
        startEdit(){
          this.polyEditor.open()
          this.form.rangeGd=[]
          this.form.geoDistrict=[]
        },
        finishEdit(){
          this.polyEditor.close()
          let path = this.polyEditor.Yt[0]?this.polyEditor.Yt[0]:[]
         if(path){
           this.searchDistrict(path)
         }
          this.candraw = false
          this.overlay = this.polyEditor
        },

        clearPolygon(){
            this.map.remove(this.overlay)
           this.overlay = null
          this.candraw=true
        },
       async searchDistrict(path){
          var geocoder;
          let _this = this;
          path.map(async item=>{
            let lng = item.lng
            let lat = item.lat
            var lnglats = [lng,lat]
            if (!geocoder) {
              geocoder = new AMap.Geocoder({
                // city: "010", //城市设为北京，默认：“全国”
                radius: 500 //范围，默认：500
              });
            }
           await geocoder.getAddress(lnglats, function (status, result) {
              if(status==='complete'){
                let data = result.regeocode.addressComponent
                if(!_this.form.geoProvinceName ) _this.form.geoProvinceName = data.province
                if(!_this.form.geoCityName) _this.form.geoCityName = data.city
                if(!_this.form.areaInfo) _this.form.areaInfo = data.district
                if(!_this.form.geoDistrict.includes(data.adcode)){
                  _this.form.geoDistrict.push(data.adcode)
                }
                _this.form.rangeGd.push(`${lng},${lat}`)
              }
            });
          })
        },
        async saveForm(){
            let param = _.cloneDeep(this.form)
          console.log(param)
            if(!this.form.name) {
              this.$Message.info('请填写区域名称')
              return
            }
            let fullDescribe = this.editor1.txt.html();
            if(fullDescribe.length<0){
              this.$Message.info('请填写区域服务说明')
              return
            }
            if(!this.form.remark) {
              this.$Message.info('请填写区域名称')
              return
            }
            param.fullDescribe = fullDescribe
            if(!this.overlay){
              this.$Message.info('请绘制服务区域')
              return
            }
           //  var paths = this.overlay.getPath()
           // await this.searchDistrict(paths)

            param.geoDistrict = param.geoDistrict.join(',')
            param.rangeGd = param.rangeGd.join(';')

            this.$http.post(`/yyht/v1/repair/region/addOrUpdate`,param).then(res=>{
              if(res.data.code===0){
                this.$Message.success('保存成功')
                this.$emit('update:pageType','list')
              }else{
                this.$Message.error('保存失败')
              }
            })
        },
        mapTip(){
            this.$Message.info('区域只能绘制一个，请先清除再重新绘制区域')
        },
        getDetail(id){
            this.loading = true
            this.$http.post(`/yyht/v1/repair/region/getRegionInfo?repairRegionId=${id}`).then(res=>{
              if(res.data.code===0){
                this.loading=false;
                let data = res.data.data;
                let rangeGd = data.rangeGd.split(';')
                this.form=data
                this.form.rangeGd = rangeGd
                this.form.geoDistrict = data.geoDistrict.split(',')

                // this.editor1.txt.html=data.fullDescribe
                this.renderRichText(data.fullDescribe)
                let path = rangeGd.map(item=>item.split(','))
                this.drawPolygon(path)
              }
            })
        }
      }
    }
</script>

<style scoped lang="scss">
  #fullDescribe{
    width: 700px;
  }
  #map{
    width: 100%;
    max-width: 1000px;
    border: 1px solid #efefef;
    position: relative;
    #container{
      width: 100%;
      height: 500px;
    }
    .control{
      position: absolute;
      z-index:999;
      right: 10px;
      top: 15px;
    }
  }
  .btn-group{
    margin-bottom: 15px;
  }
  #searchPoint{
    height: 32px;
    border: 1px solid #efefef;
    background: #fff;
    font-size: 12px;
    padding: 2px 10px;
    outline: none;
    width: 200px;
  }
  .map-mask{
    background: rgba(0,0,0,0.1);
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 998;
  }
</style>
