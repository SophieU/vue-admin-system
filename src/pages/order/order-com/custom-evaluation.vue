<template>
  <div>
    <div class="evaluate-box">
      <template v-if="commentType==='USER'">
        <div class="result-wrapper">
          <div :class="comment.type==='GOOD'?'evaluation-result':'evaluation-result bad'">
            <Icon v-if="comment.type==='BAD'" type="md-thumbs-down" :size="24"/>
            <Icon v-if="comment.type==='GOOD'" type="md-thumbs-up" :size="24"/>
            <span class="ml-15">{{comment.name}}</span>
          </div>
          <div class="tag-lists mt-15">
            <Tag v-for="tag,index in comment.children" :key="index" :color="tag.type==='GOOD'?'green':'red'">{{tag.name}}</Tag>
          </div>
        </div>
      </template>
      <template v-if="commentType==='SYSTEM'">
        <div class="result-wrapper">
          <div class="evaluation-result">
            <Icon type="md-thumbs-up" :size="24"/>
            <span class="ml-15">满意</span>
          </div>
          <p class="tips mt-15">客户未评价，系统默认为好评！</p>
        </div>
      </template>
      <template v-if="!commentType">
        <h4 class="no-comment">客户暂未评价</h4>
      </template>
    </div>


  </div>
</template>

<script>
    export default {
        name: "custom-evaluation",
      data(){
          return {
            commentType:'',
            comment:{
              name:'',
              type:'',
              children:[]
            },
          }
      },
      methods:{
          getLists(id){
            this.$http.get(`/repair/order/comment/info?id=${id}`)
              .then(res=>{
                if(res.data.code===0){
                  let data = res.data.data;
                  this.comment=data.comment;
                  this.commentType=data.commentType;
                }else{
                  this.$Message.error(res.data.msg);
                }
              })
          }
      },
      mounted(){
        this.id=this.$route.query.id;
        this.getLists(this.id);
      }
    }
</script>

<style scoped lang="scss">
.evaluation-result{
  display: flex;
  width: 200px;
  border-radius: 20px;
  height: 40px;
  align-items: center;
  justify-content: center;
  background: #2d8cf0;
  color: #fff;
  font-size: 16px;
  &.bad{
    background:#ff9900;
  }
}
  .evaluate-box{
    padding: 30px;
    display: flex;
    justify-content: center;
    .no-comment{
      font-size: 16px;
    }
  }
  .result-wrapper{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
</style>
