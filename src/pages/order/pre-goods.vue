<template>
  <div>
    <Card>
      <div class="mb-15">
        <Button type="primary" @click="$router.push({name:'set-product',query:{type:'add'}})">新增</Button>
      </div>
      <div class="mb-15">
        <Spin fix v-show="loadingTable == true">加载中...</Spin>
        <Table :columns="goodsCol" :data="goodsData"></Table>
        <div class="pagination ">
          <Page :current.sync="pageConfig.pageNo" :page-size="pageConfig.pageSize" :total="pageConfig.total"
                @on-change="changePage"
                @on-page-size-change="changeSize"
          ></Page>
        </div>
      </div>
    </Card>
  </div>
</template>

<script>
    export default {
        name: "pre-goods",
      data(){
          return{
            loadingTable:true,
            goodsCol:[
              {title:'商品名称',key:'productName',align:'center'},
              {title:'商品广告词',key:'productJingle',align:'center'},
              {title:'商品条形码',key:'productSerial',align:'center'},
              {title:'添加时间',key:'productAddTime',align:'center'},
              {title:'售卖数量',key:'productSaleNum',align:'center'},
              {title:'点击数',key:'productClick',align:'center'},
              {title:'商品主图',key:'productImage',align:'center',render:(h,params)=>{
                return h('div',{
                  style:{
                    height:'50px',
                    width:'50px',
                    marginLeft:'50%',
                    transform:'translateX(-50%)'
                  }
                },[
                  h('img',{
                    attrs:{
                      src:params.row.productImage
                    },
                    style:{
                      width:'100%',
                      height:'100%',
                    }
                  })
                ])
                }},
              {title:'商品市场价格',key:'productMarketPrice',align:'center'},
              {title:'成本价',key:'productCostPrice',align:'center'},
              {title:'商品价格',key:'productPrice',align:'center'},
              {title:'操作',key:'',align:'center',render:(h,params)=>{
                return h('Button',{
                  props:{
                    type:'primary',
                    size:'small'
                  },
                  on:{
                    click:()=>{
                      this.$router.push({name:'set-product',query:{id:params.row.productId,type:'editor'}})
                    }
                  }
                },'查看')
                }},
            ],
            goodsData:[],
            pageConfig:{
              pageNo:1,
              pageSize:10,
              total:0
            }
          }
      },
      methods:{
          getPage(){
            this.loadingTable = true;
            this.$http.get(`/yyht/v1/product/getAllProductForPage?pageNo=${this.pageConfig.pageNo}&pageSize=${this.pageConfig.pageSize}`).then(res=>{
                if(res.data.code == 0){
                  this.goodsData = res.data.data.list;
                  this.pageConfig.total = res.data.data.totalCount;
                }else{
                  this.$Message.error(res.data.msg)
                }
                this.loadingTable = false;
            })
          },
        changePage(e){
            this.pageConfig.pageNo = e;
            this.getPage()
        },
        changeSize(e){
          this.pageConfig.pageSize = e;
          this.getPage()
        }
      },
      mounted() {
          this.getPage()
      }
    }
</script>

<style scoped>

</style>
