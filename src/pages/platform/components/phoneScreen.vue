<template>
    <div class="phone-viewList">
      <vuedraggable class="wrapper" v-model="screenList" @end="dragEnd">
        <transition-group>
          <div :class="{'active':item.screenActive}" class="screen-layout" v-for="(item,index) in screenList" :key="item.sortIndex" @click="selectScreen(item)">
            <Button  size="small" icon="md-trash" circle class="delete-btn" @click.stop="deleteView(index)"></Button>
            <div class="screen-layout-block type-1" v-if="item.recommendFormatCode === '1'">
              <div class="screen-layout-item">
                <div class="screen-mask" :class="{'gray-mask':item.id}">
                  <div class="mask-title">
                    <p>目标：{{item.details[0].targetShowName}}</p>
                    <p>尺寸：{{item.details[0].adviseSizeDes || item.details[0].recommendFormatImgAdviceSizeDes}}</p>
                  </div>
                </div>
                <div class="screen-content">
                  <img :src="domain+item.details[0].targetImage" v-if="item.details[0].targetImage">
                </div>
              </div>
            </div>
            <div class="screen-layout-block type-1 type-2" v-if="item.recommendFormatCode === '2'">
              <div class="screen-layout-item item-2-1" v-for="(image,index) in item.details" :key="index">
                <div class="screen-mask" :class="{'gray-mask':item.id}">
                  <div class="mask-title">
                    <p>目标：{{image.targetShowName}}</p>
                    <p>尺寸：{{image.adviseSizeDes || image.recommendFormatImgAdviceSizeDes}}</p>
                  </div>
                </div>
                <div class="screen-content">
                  <img :src="domain+image.targetImage" v-if="image.targetImage">
                </div>
              </div>
            </div>
            <div class="screen-layout-block type-3" v-if="item.recommendFormatCode === '3'">
              <div class="screen-layout-item item-3-1">
                <div class="screen-mask" :class="{'gray-mask':item.id}">
                  <div class="mask-title">
                    <p>目标：{{item.details[0].targetShowName}}</p>
                    <p>尺寸：{{item.details[0].adviseSizeDes || item.details[0].recommendFormatImgAdviceSizeDes}}</p>
                  </div>
                </div>
                <div class="screen-content">
                  <img :src="domain+item.details[0].targetImage" v-if="item.details[0].targetImage">
                </div>
              </div>
              <div class="screen-layout-item item-3-1 item-3-2">
                <div class="item-3-2-1">
                  <div class="screen-mask" :class="{'gray-mask':item.id}">
                    <div class="mask-title">
                      <p>目标：{{item.details[1].targetShowName}}</p>
                      <p>尺寸：{{item.details[1].adviseSizeDes || item.details[1].recommendFormatImgAdviceSizeDes}}</p>
                    </div>
                  </div>
                  <div class="screen-content">
                    <img :src="domain+item.details[1].targetImage" v-if="item.details[1].targetImage">
                  </div>
                </div>
                <div class="item-3-2-1">
                  <div class="screen-mask" :class="{'gray-mask':item.id}">
                    <div class="mask-title">
                      <p>目标：{{item.details[2].targetShowName}}</p>
                      <p>尺寸：{{item.details[2].adviseSizeDes || item.details[2].recommendFormatImgAdviceSizeDes}}</p>
                    </div>
                  </div>
                  <div class="screen-content">
                    <img :src="domain+item.details[2].targetImage" v-if="item.details[2].targetImage">
                  </div>
                </div>
              </div>
            </div>
            <div class="screen-layout-block type-3" v-if="item.recommendFormatCode === '4'">
              <div class="screen-layout-item item-3-1 item-3-2">
                <div class="item-3-2-1">
                  <div class="screen-mask" :class="{'gray-mask':item.id}">
                    <div class="mask-title">
                      <p>目标：{{item.details[0].targetShowName}}</p>
                      <p>尺寸：{{item.details[0].adviseSizeDes || item.details[0].recommendFormatImgAdviceSizeDes}}</p>
                    </div>
                  </div>
                  <div class="screen-content">
                    <img :src="domain+item.details[0].targetImage" v-if="item.details[0].targetImage">
                  </div>
                </div>
                <div class="item-3-2-1">
                  <div class="screen-mask" :class="{'gray-mask':item.id}">
                    <div class="mask-title">
                      <p>目标：{{item.details[2].targetShowName}}</p>
                      <p>尺寸：{{item.details[2].adviseSizeDes || item.details[1].recommendFormatImgAdviceSizeDes}}</p>
                    </div>
                  </div>
                  <div class="screen-content">
                    <img :src="domain+item.details[2].targetImage" v-if="item.details[2].targetImage">
                  </div>
                </div>
              </div>
              <div class="screen-layout-item item-3-1">
                <div class="screen-mask" :class="{'gray-mask':item.id}">
                  <div class="mask-title">
                    <p>目标：{{item.details[1].targetShowName}}</p>
                    <p>尺寸：{{item.details[1].adviseSizeDes || item.details[2].recommendFormatImgAdviceSizeDes}}</p>
                  </div>
                </div>
                <div class="screen-content">
                  <img :src="domain+item.details[1].targetImage" v-if="item.details[1].targetImage">
                </div>
              </div>
            </div>
            <div class="screen-layout-block type-5" v-if="item.recommendFormatCode === '5'">
              <div class="screen-layout-item item-5-1">
                <div class="item-5-1-1">
                  <div class="screen-mask" :class="{'gray-mask':item.id}">
                    <div class="mask-title">
                      <p>目标：{{item.details[0].targetShowName}}</p>
                      <p>尺寸：{{item.details[0].adviseSizeDes || item.details[0].recommendFormatImgAdviceSizeDes}}</p>
                    </div>
                  </div>
                  <div class="screen-content">
                    <img :src="domain+item.details[0].targetImage" v-if="item.details[0].targetImage">
                  </div>
                </div>
                <div class="item-5-1-2">
                  <div class="screen-mask" :class="{'gray-mask':item.id}">
                    <div class="mask-title">
                      <p>目标：{{item.details[1].targetShowName}}</p>
                      <p>尺寸：{{item.details[1].adviseSizeDes || item.details[1].recommendFormatImgAdviceSizeDes}}</p>
                    </div>
                  </div>
                  <div class="screen-content">
                    <img :src="domain+item.details[1].targetImage" v-if="item.details[1].targetImage">
                  </div>
                </div>
              </div>
              <div class="screen-layout-item item-5-1">
                <div class="item-5-1-2">
                  <div class="screen-mask" :class="{'gray-mask':item.id}">
                    <div class="mask-title">
                      <p>目标：{{item.details[2].targetShowName}}</p>
                      <p>尺寸：{{item.details[2].adviseSizeDes || item.details[2].recommendFormatImgAdviceSizeDes}}</p>
                    </div>
                  </div>
                  <div class="screen-content">
                    <img :src="domain+item.details[2].targetImage" v-if="item.details[2].targetImage">
                  </div>
                </div>
                <div class="item-5-1-1">
                  <div class="screen-mask" :class="{'gray-mask':item.id}">
                    <div class="mask-title">
                      <p>目标：{{item.details[3].targetShowName}}</p>
                      <p>尺寸：{{item.details[3].adviseSizeDes || item.details[3].recommendFormatImgAdviceSizeDes}}</p>
                    </div>
                  </div>
                  <div class="screen-content">
                    <img :src="domain+item.details[3].targetImage" v-if="item.details[3].targetImage">
                  </div>
                </div>
              </div>
            </div>
            <div class="screen-layout-block type-6" v-if="item.recommendFormatCode === '6'">
              <div class="screen-layout-item item-6-1" v-for="(image,index) in item.details" :key="index">
                <div class="screen-mask" :class="{'gray-mask':item.id}">
                  <div class="mask-title">
                    <p>目标：{{image.targetShowName}}</p>
                    <p>尺寸：{{image.adviseSizeDes || image.recommendFormatImgAdviceSizeDes}}</p>
                  </div>
                </div>
                <div class="screen-content">
                  <img :src="domain+image.targetImage" v-if="image.targetImage">
                </div>
              </div>
            </div>
            <div class="screen-layout-block type-7" v-if="item.recommendFormatCode === '7'">
              <div class="screen-layout-item item-7-1" v-for="(image,index) in item.details" :key="index">
                <div class="screen-mask" :class="{'gray-mask':item.id}">
                  <div class="mask-title">
                    <p>目标：{{image.targetShowName}}</p>
                    <p>尺寸：{{image.adviseSizeDes || image.recommendFormatImgAdviceSizeDes}}</p>
                  </div>
                </div>
                <div class="screen-content">
                  <img :src="domain+image.targetImage" v-if="image.targetImage">
                </div>
              </div>
            </div>
          </div>
        </transition-group>
      </vuedraggable>
        <div class="add-new">
            <Button type="primary" icon="el-icon-circle-plus-outline" @click="addNew">添加推荐位</Button>
        </div>
    </div>
</template>

<script>
  import vuedraggable from 'vuedraggable';
    export default {
        name: "phoneScreen",
        props:{
          screenList:{
                type:Array
            },
          domain:{
              type: String
          }
        },
      components: {vuedraggable},
        data(){
            return{
              screenListA:[]
            }
        },
        methods:{
            initScreen(){
              this.screenList.forEach(item=>{
                  this.$set(item,"screenActive",false);
              })
            },
            addNew(){
                this.$emit('addNew')
            },
            deleteView(index){
                this.$emit('deleteView',index)
            },
            selectScreen(screen){
              screen.details.forEach(ele=>{
                if(ele.recommendCategoryCode == 'APP_JUMP'){
                  ele.needLogin = 'Y';
                  ele.isLogin = true
                }else{
                  ele.needLogin = 'N';
                  ele.isLogin = false
                }
              });
                this.screenList.forEach(item=>{
                    this.$set(item,"screenActive",false);
                });
                this.$set(screen,"screenActive",true);
                this.$emit('selectView',screen)
            },
          dragEnd(event){
              let data={
                list:this.screenList,
                event:event
              };
            this.$emit('dragEnd',data);
          },
        },
        mounted() {
            this.initScreen();
            this.screenListA = this.screenList;
        }
    }
</script>

<style scoped lang="scss">
    .active:after {
        content: "";
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border: 3px dashed #31A2F3;}
    .screen-layout-item{
        position: relative;
        width: 100%;
        height: 100%;
        background: #fff;
        .screen-content{
          width: 100%;
          height: 100%;
          position: absolute;
          left: 0;
          top:0;
          img{
            width: 100%;
            height: 100%;
            display: block;
          }
        }
        .screen-mask{
            position: absolute;
            z-index: 1;
            border: 0.5px solid #ddd;
            width: 100%;
            height: 100%;
            //background: rgba(0,0,0,0.7);
            color: #fff;
            text-align: center;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 12px;
            user-select: none;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            .mask-title{
                p{
                    font-size: 12px;
                    margin: 0;
                    line-height: 1.4em;
                    display: block;
                    margin-inline-start: 0px;
                    margin-inline-end: 0px;
                }
            }
        }
        .gray-mask{
          background: rgba(0,0,0,0.7)
        }
    }
    .screen-layout{
    background-color: #fff;
    position: relative;
    overflow: hidden;
    .delete-btn{
        position: absolute;
        right: 10px;
        top: 10px;
        z-index: 99;
    }
    .type-2{
        display: flex;
    }
    .screen-layout-block{
        width: 100%;
        overflow: hidden;
        position: relative;
        height: 106px;
        .item-2-1{
            position: relative;
            flex: 1;
        }
    }
    .type-3{
        height: 211px;
        display: flex;
        position: relative;
        .item-3-1{
            width: 50%;
            height: 100%;
            flex: 1;
            position: relative;
            border: 0.5px solid #ddd;
        }
        .item-3-2{
            display: flex;
            flex-direction: column;
            .item-3-2-1{
                position: relative;
                height:105px;
                border: 0.5px solid #ddd;
            }
        }
    }
    .type-5{
        height: 211px;
        .item-5-1{
            height: 50%;
            display: flex;
            .item-5-1-1{
                position: relative;
                border: 0.5px solid #ddd;
                flex: 1.5;
            }
            .item-5-1-2{
                position: relative;
                flex: 3;
                border: 0.5px solid #ddd;
            }
        }
    }
    .type-6{
        height: 143px;
        display: flex;
        .item-6-1{
            position: relative;
            flex: 1;
        }
    }
    .type-7{
        height: 120px;
        width: 325px;
        display: flex;
        .item-7-1{
            position: relative;
            flex: 1 1;
        }
    }
}
    .add-new{
        position: relative;
        text-align: center;
        padding: 8px 0;
    }

</style>
