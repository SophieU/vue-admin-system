
<style scoped lang="scss">
  @import "../order";
</style>
<template>
  <div>
    <div class="empty-slot" v-if="lists.length===0">暂无回访消息</div>
    <div class="card no-border mb-15" v-for="(item,index) in lists" :key="index">
      <div class="card-header">
        <div class="card-title">回访信息{{index+1}}</div>
      </div>
      <div class="card-body">
        <table class="native-table mb-15">
          <thead>
          <tr>
            <th>回访日期</th>
            <th>回访机构</th>
            <th>回访人</th>
            <th>结果</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>{{item.returnVisitTime}}</td>
            <td>{{item.visitType === 'CALL_CENTER'?'呼叫中心':'服务网点'}}</td>
            <td>{{item.returnVisitUser}}</td>
            <td>{{item.returnVisitResult}}</td>
          </tr>
          </tbody>
        </table>

        <div class="visite-remarks">
          <div class="visite-item">
            <div>
              <span class="label">满意度：</span>
              <span>{{item.satisfaction}}</span>
            </div>
            <div class="text-grey">
              <span class="label">备注：</span>
              <span>{{item.satisfactionRemarks}}</span>
            </div>
          </div>
          <div class="visite-item">
            <div>
              <span class="label">材料更换：</span>
              <span>{{item.materialChange}}</span>
            </div>
            <div class="text-grey">
              <span class="label">备注：</span>
              <span >{{item.materialChangeRemarks}}</span>
            </div>
          </div>
          <div class="visite-item">
            <div>
              <span class="label">取消订单：</span>
              <span>{{item.cancelOrder}}</span>
            </div>
            <div class="text-grey">
              <span class="label">备注：</span>
              <span >{{item.cancelOrderRemarks}}</span>
            </div>
          </div>
          <div class="visite-item">
            <div>
              <span class="label">私自收费：</span>
              <span>{{item.privateCharge}}</span>
            </div>
            <div class="text-grey">
              <span class="label">备注：</span>
              <span >{{item.privateChargeRemarks}}</span>
            </div>
          </div>
          <div class="visite-item">
            <div>
              <span class="label">关闭订单：</span>
              <span>{{item.closeOrder}}</span>
            </div>
            <div class="text-grey">
              <span class="label">备注：</span>
              <span >{{item.closeOrderRemarks}}</span>
            </div>
          </div>
          <div class="visite-item">
            <div>
              <span class="label">其他：</span>
              <span>{{item.other}}</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
        name: "visited-info",
      data(){
          return{
            lists:[]
          }
      },
      methods:{
          getLists(id){
            this.$http.get(`/repair/order/return/visit/list?id=${id}`)
              .then(res=>{
                if(res.data.code===0){
                  this.lists=res.data.data.map(item=>{
                    let satisfaction;
                    switch(item.satisfaction){
                      case 1:
                        satisfaction='非常不满意';
                        break;
                      case 2:
                        satisfaction='不满意';
                        break;
                      case 3:
                        satisfaction='良好';
                        break;
                      case 4:
                        satisfaction='满意';
                        break;
                       case 5:
                        satisfaction='非常满意';
                        break;
                      default:
                        satisfaction='';
                    }
                    item.satisfaction=satisfaction;
                    return item;
                  })
                  console.log(this.lists)

                }else{
                  console.log('回访信息：'+res.data.msg)
                }
              })
          }
      },
      mounted(){
          let id = this.$route.query.id;
          this.getLists(id);
      }
    }
</script>

