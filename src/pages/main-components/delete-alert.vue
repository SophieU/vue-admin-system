<template>
  <Modal v-model="modelInner" @on-visible-change="deleteChange" width="360">
    <p slot="header" style="color:#f60;text-align:center">
      <Icon type="ios-information-circle"></Icon>
      <span>删除提醒</span>
    </p>
    <div style="text-align:center">
      <p>数据一旦删除，将不可恢复</p>
      <p>确认要删除吗?</p>
    </div>
    <div slot="footer">
      <Button type="default" size="large" @click="cancelDelet">取消</Button>
      <Button type="error" size="large" :loading="delete_loading" @click="del">删除</Button>
    </div>
  </Modal>
</template>

<script>
    export default {
        name: "delete-alert",
      data(){
          return {
            deleteAlter:false,
            delete_loading:false
          }
      },
      props:{
          model:Boolean,
          callback:Function,
          loading:Boolean
      },
      computed:{
          modelInner:{
            get:function(){
              return this.model;
            },
            set:function(val){
              if(!val){
                this.$store.commit('setDeleteModal',{model:false})
              }
            }
          }
      },
      methods:{
        deleteChange(data){
          data == false?this.delete_loading = false:'';
        },
        del(){
          this.delete_loading = true;
          this.callback();
        },
        cancelDelet(){
          this.$store.commit('setDeleteModal',{model:false})
        }
      }
    }
</script>

