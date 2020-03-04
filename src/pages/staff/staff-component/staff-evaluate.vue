<template>
    <Card>
      <div style="padding: 30px;">
        <table class="native-table">
          <thead>
          <tr>
            <th>总共接单数</th>
            <th>已评价工单数</th>
            <th>好评率</th>
            <th>差评率</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>{{comment.totalNum}}</td>
            <td>{{comment.totalEvaluateNum}}</td>
            <td>{{comment.goodPercent}}% （{{comment.goodNum}}单）</td>
            <td>{{comment.badPercent}}% （{{comment.badNum}}单）</td>
          </tr>
          </tbody>
        </table>
      </div>

    </Card>
</template>

<script>
    export default {
        name: "staff-evaluate",
      data(){
          return {
            id:'',
            comment:{},
          }
      },
      methods:{
          getInfo(id){
            this.$http.get(`/server/comment/info?id=${id}`)
              .then(res=>{
                if(res.data.code===0){
                  let data = res.data.data;
                  let goodNum = data.goodNum;
                  let badNum = data.badNum;
                  let totalEvaluateNum = goodNum+badNum;
                  let goodPercent = 0;
                  let badPercent =0;
                  this.comment=res.data.data;

                  if(goodNum>0){
                    goodPercent=(goodNum/totalEvaluateNum)*100
                  }
                  if(badNum>0){
                    badPercent=(badNum/totalEvaluateNum)*100
                  }
                  this.comment.goodPercent=goodPercent.toFixed(2);
                  this.comment.badPercent=badPercent.toFixed(2);
                  this.comment.totalEvaluateNum=totalEvaluateNum;
                  // this.comment.totalEvaluate=this.comment.goodNum+this.comment.badNum
                }else{
                  this.$Message.error(res.data.msg)
                }
              })
          }
      },
      mounted(){
          this.id=this.$route.query.id;
          this.getInfo(this.id);
      }
    }
</script>

<style scoped>

</style>
