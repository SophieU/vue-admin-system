<template>
    <div class="template-tab">
        <div class="card-header">
            <span>选择版面</span>
        </div>
        <div class="card-body">
            <ul class="card-list">
                <li :class="{'activeLi':item.isActive}"  v-for="item in templateList" :key="item.formatCode" @click="selectPane(item)">
                    <div class="item-content" v-if="item.formatCode === '1'">
                        <div class="item-1">

                        </div>
                    </div>
                    <div class="item-content" v-if="item.formatCode === '2'">
                        <div class="item-1 item-2">
                            <div class="item-2-2"></div>
                            <div class="item-2-2"></div>
                        </div>
                    </div>
                    <div class="item-content" v-if="item.formatCode === '3'">
                        <div class="item-1 item-3">
                            <div class="big-item">

                            </div>
                            <div class="big-item">
                                <div class="item-3-2"></div>
                                <div class="item-3-2"></div>
                            </div>
                        </div>
                    </div>
                    <div class="item-content" v-if="item.formatCode === '4'">
                        <div class="item-1 item-3">
                            <div class="big-item">
                                <div class="item-3-2"></div>
                                <div class="item-3-2"></div>
                            </div>
                            <div class="big-item">

                            </div>
                        </div>
                    </div>
                    <div class="item-content" v-if="item.formatCode === '5'">
                        <div class="item-1 item-5">
                            <div class="item-5-line">
                                <div class="item-5-1"></div>
                                <div class="item-5-2"></div>
                            </div>
                            <div class="item-5-line">
                                <div class="item-5-3"></div>
                                <div class="item-5-4"></div>
                            </div>
                        </div>
                    </div>
                    <div class="item-content" v-if="item.formatCode === '6'">
                        <div class="item-1 item-6">
                            <div class="item-6-1"></div>
                            <div class="item-6-1"></div>
                            <div class="item-6-1"></div>
                        </div>
                    </div>
                    <div class="item-content" v-if="item.formatCode === '7'">
                        <div class="item-1 item-7">
                            <div class="item-7-1"></div>
                            <div class="item-7-1"></div>
                            <div class="item-7-1"></div>
                            <div class="item-7-1"></div>
                        </div>
                    </div>
                    <h4>{{item.formatName}}</h4>
                    <p>{{item.imageNum}}个推荐位</p>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    export default {
        name: "templateTab",
        props:{
            templateList:{
                type:Array,
            }
        },
        data:()=>{
          return{
              isActive:false
          }
        },
        methods:{
            selectPane(item){
                this.templateList.forEach(item=>{
                    this.$set(item,"isActive",false);
                });
                this.$set(item,"isActive",true);
                this.$emit('selectTab',item);
            }
        },
        mounted() {
            this.templateList.forEach(item=>{
                this.$set(item,"isActive",false);
            })
        }
    }
</script>

<style scoped lang="scss">
    @import "./commponents-manage.scss";
</style>
