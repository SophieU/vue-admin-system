
<style scoped lang="scss">
  @import "../order.scss";
</style>
<template>
<div>
  <div class="card no-border ">
    <div class="card-header">
      <div class="card-title">工单证据</div>
    </div>
    <div class="card-body">
      <ul class="prov-lists">
        <li>
          <h4 class="prov-title">上门证据</h4>
          <div  v-if="orderImg.confirmPresentImage[0]" class="prov-img">
            <img  @click="showCarousel(orderImg.confirmPresentImage)" :src="orderImg.confirmPresentImage[0]?orderImg.confirmPresentImage[0].imageName:''" alt="">
          </div>
        </li>
       <li>
          <h4 class="prov-title">检修前证据</h4>
          <div  v-if="orderImg.beforeOverhaulImage[0]" class="prov-img">
            <img @click="showCarousel(orderImg.beforeOverhaulImage)" :src="orderImg.beforeOverhaulImage[0]?orderImg.beforeOverhaulImage[0].imageName:''" alt="">
          </div>
        </li>
        <li>
           <h4 class="prov-title">辅材证据</h4>
           <div  v-if="orderImg.materialImage[0]" class="prov-img">
             <img @click="showCarousel(orderImg.materialImage)" :src="orderImg.materialImage[0]?orderImg.materialImage[0].imageName:''" alt="">
           </div>
         </li>
          <li>
             <h4 class="prov-title">完工证据</h4>
             <div  v-if="orderImg.closingImage[0]" class="prov-img">
               <img @click="showCarousel(orderImg.closingImage)" :src="orderImg.closingImage[0]?orderImg.closingImage[0].imageName:''" alt="">
             </div>
           </li>
          <li>
             <h4 class="prov-title">电子签名</h4>
             <div  v-if="orderImg.customerConfirmImage" class="prov-img not-lists">
               <img :src="orderImg.customerConfirmImage" alt="">
             </div>
           </li>
      </ul>
    </div>
  </div>
<!--02-18-->
  <div class="card no-border" v-for="(item,index) in addOrderImgList" :key="index">
    <Divider />
    <div class="card-header">
      <div class="card-title">附加辅材证据{{index+1}}</div>
    </div>
    <div class="card-body">
      <ul class="prov-lists">
        <li v-for="(img,ind) in item" :key="ind">
          <div class="prov-img">
            <img   :src="img" alt="">
          </div>
        </li>
      </ul>
    </div>
  </div>
<!--02-18-->
  <div class="card no-border " v-for="(item,index) in afterOrderImgList" :key="index">
    <Divider />
    <div class="card-header">
      <div class="card-title">售后{{index+1}}</div>
    </div>
    <div class="card-body">
      <ul class="prov-lists">
        <li>
          <h4 class="prov-title">上门证据</h4>
          <div class="prov-img">
            <img   @click="showCarousel(item.confirmPresentImage)" :src="item.confirmPresentImage[0]?item.confirmPresentImage[0].imageName:''" alt="">
          </div>
        </li>
        <li>
          <h4 class="prov-title">检修前证据</h4>
          <div class="prov-img">
            <img @click="showCarousel(item.beforeOverhaulImage)" :src="item.beforeOverhaulImage[0]?item.beforeOverhaulImage[0].imageName:''" alt="">
          </div>
        </li>
        <li>
          <h4 class="prov-title">辅材证据</h4>
          <div class="prov-img">
            <img @click="showCarousel(item.materialImage)" :src="item.materialImage[0]?item.materialImage[0].imageName:''" alt="">
          </div>
        </li>
        <li>
          <h4 class="prov-title">完工证据</h4>
          <div class="prov-img">
            <img @click="showCarousel(item.closingImage)" :src="item.closingImage[0]?item.closingImage[0].imageName:''" alt="">
          </div>
        </li>
        <li>
          <h4 class="prov-title">电子签名</h4>
          <div class="prov-img not-lists">
            <img :src="item.customerConfirmImage" alt="">
          </div>
        </li>
      </ul>
    </div>
  </div>
  <Divider />
  <Modal class="carouse_wrap" v-model="carouselModal" title="证明图片" width="700" @on-visible-change="modalHide">
    <Carousel :value="0" loop v-model="carouselVal" :height="500" style="width: 600px;margin:0 auto;">
      <CarouselItem v-for="(item,index) in carouselLists" :key="index">
        <div class="carousel" >
          <img :src="item.imageName" alt="">
        </div>
      </CarouselItem>
    </Carousel>
    <div slot="footer">
      <div class="carousel_footer" >
        <span>{{carouselVal+1}}/{{carouselLists.length}}</span>
      </div>
    </div>
  </Modal>

</div>
</template>

<script>
    export default {
        name: "order-prove",
      data(){
          return {
            carouselModal:false,
            carouselLists:[],
            carouselVal:0,
            orderImg:{
              confirmPresentImage:[],
              beforeOverhaulImage:[],
              materialImage:[],
              closingImage:[],
              customerConfirmImage:'',
            },
            afterOrderImgList:[],
            addOrderImgList:[]
          }
      },
      methods:{
          getProve(id){
            this.$http.get(`/repair/order/prove/list?id=${id}`)
              .then(res=>{
                if(res.data.code===0){
                  let data = res.data.data;

                  this.orderImg=data.orderImg;
                  this.afterOrderImgList=data.afterOrderImgList;
                  this.addOrderImgList=data.addOrderImgList;
                }else{
                  console.log('工单证明获取失败：'+res.data.msg);
                }
              })
          },
          showCarousel(arr){
            if(arr.length>0){
              this.carouselLists=arr;
              this.carouselModal=true;
            }
          },
        modalHide(visible){
            if(!visible){
              this.carouselLists=[];
              this.carouselVal=0;
            }

        }
      },
      mounted(){
          let id = this.$route.query.id;
          this.getProve(id);
      }
    }
</script>

