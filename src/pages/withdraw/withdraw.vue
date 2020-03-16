<template>
    <div class="fund">
        <div class="nav-title">资金管理</div>
        <div class="nav-inner fund-inner">
            <Tabs v-model="tab">
                <TabPane label="申请提现" name="cash">
                    <drawCash></drawCash>
                </TabPane>
                <TabPane label="提现记录" name="list">
                    <recordsList :tab="tab"></recordsList>
                </TabPane>
            </Tabs>
        </div>
    </div>
</template>
<script>
    import recordsList from './records.vue'
    import drawCash from './drawcash.vue'

    export default {
        components: { recordsList, drawCash },
        data() {
            return {
                tab: 'cash'
            }
        }
    }
</script>
<style lang="scss">
    .fund-inner {
        padding: 15px;
    }
</style>
