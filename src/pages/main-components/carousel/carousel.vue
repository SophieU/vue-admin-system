<template>
    <div class="carousel-wrapper">
      <Button size="large" @click="arrowEvent(-1)" class="prev" shape="circle" icon="ios-arrow-back"></Button>
      <div  class="carousel-list">
        <div ref="carousel-track" class="carousel-track" :style="{transform:'translateX('+position+'px)'}">
          <div  v-for="item,index in lists" :key="index" :class="[index === value ? 'carousel-item carousel-item-active' : 'carousel-item']"
               :style="{transform:(index===currentIndex?'scale(1.2)':'scale(1)')}"
               @click="chooseImg(index)"
          >
            <img :src="item.fullImageUrl" alt="">
          </div>
        </div>
      </div>
      <Button size="large" @click="arrowEvent(1)" class="next" shape="circle" icon="ios-arrow-forward"></Button>
        <ul class="carousel-dots">
          <li v-for="n,index in lists.length" :key="n" :class="[n-1===currentIndex?'dot carousel-active':'dot']"
            @click="dotClick(index)"
          >
            <button type="button"></button>
          </li>
        </ul>
    </div>
</template>

<script>
  const prefixCls = 'carousel-item';
    export default {
        name: "carousel",
      props:{
        value:{
          type:Number,
          default:null,
        },
        lists:{
          type:Array,
          default:[]
        }
      },
      data(){
        return {
          currentIndex:this.value,
          position:0,
        }
      },
      mounted(){
        console.log(this.lists)
      },
      methods:{
          //点击下方点
        dotClick(index){
          this.currentIndex=index;
          if(index<=2){
            this.position=0;
          }else{
            this.position=-150*(index-2)
          }
        },
          //选择图片
        chooseImg(index){
          this.$emit('update:value',index);
          this.currentIndex=index;
        },
        arrowEvent(offset){
          //无下一页
          if(this.currentIndex===(this.lists.length-1)&&offset===1){
            this.currentIndex=0;
            this.position=0;
          }else if(this.currentIndex===0&&offset===-1){
            //无上一页
            this.currentIndex=this.lists.length-1;
            this.position=-(this.currentIndex-2)*150;
          }else if(offset===1){
            //下一页
            this.currentIndex+=offset;
            if(this.currentIndex<=2){
              this.position=0;
            }else{
              this.position=-150*(this.currentIndex-2);
            }
          }else if(offset===-1){
            //上一页
            this.currentIndex+=offset;
            if(this.currentIndex<=2){
              this.position=0;
            }else{
              this.position+=150;
            }
          }

        }
      },

    }
</script>

<style scoped lang="scss">
  .carousel-wrapper{
    position: relative;
    width:510px;
    padding: 10px 30px;
    .prev{
      font-size: 16px;
      position: absolute;
      left: 0;
      top: 50%;
      z-index: 10;
      transform: translate(0,-85%);
    }
    .next{
      position: absolute;
      right: 0;
      top: 50%;
      transform: translate(0,-85%);
    }

  }
  .carousel-dots{
    position: relative;
    display: block;
    vertical-align: top;
    text-align: center;
    margin: 0 2px;
    padding: 3px 0;
    cursor: pointer;
    .dot{
      position: relative;
      display: inline-block;
      vertical-align: top;
      text-align: center;
      margin: 0 2px;
      padding: 7px 0;
      cursor: pointer;
      &.carousel-active{
        button{
          opacity: 1;
          width: 24px;
        }
      }
    }
    button{
      border: 0;
      cursor: pointer;
      background: #8391a5;
      opacity: .3;
      display: block;
      width: 16px;
      height: 3px;
      border-radius: 1px;
      outline: 0;
      font-size: 0;
      color: transparent;
      transition: all .5s;
    }
  }
  .carousel-item{
    padding:10px 13px;
    cursor: pointer;
    transition:all ease .5s;
    &.carousel-item-active{
      position: relative;
      z-index: 1;
      &:before{
        content: '';
        display: block;
        width:130px;
        height: 85px;
        border: 4px solid #5cadff;
        position: absolute;
        top: 5px;
        left: 8px;
        z-index: -1;
      }
    }
    img{
      width:120px;
      height: 75px;
      display: block;
      background-color: #f5f5f5;
    }
  }
  .carousel-list{
    padding: 10px;
    overflow: hidden;
    width:100%;
  }
  .carousel-track{
    display:flex;
    flex-wrap:nowrap;
    transition:all ease 1s;
  }
</style>
