<template>
    <div>
        <div class="top-search">
            <Row :gutter="20" style="margin-top: 10px;margin-left: 10px">
                <Col :span="6"><div class="grid-content bg-purple">
                    广告主：
                    <el-select v-model="searchForm.adOwnerId" placeholder="请选择" size="small">
                        <el-option
                                v-for="item in advertiserList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </div>
                    <div style="margin-top: 20px">
                        是否长期有效：
                        <el-select v-model="searchForm.isLongValid" placeholder="请选择" size="small">
                            <el-option
                                    label="全部"
                                    value="">
                            </el-option>
                            <el-option
                                    label="是"
                                    value="Y">
                            </el-option>
                            <el-option
                                    label="否"
                                    value="N">
                            </el-option>
                        </el-select>
                    </div>
                </Col>
                <Col :span="6"><div class="grid-content bg-purple">
                    广告标题:<Input v-model="searchForm.adTitle" size="small" style="width: 60%"></Input>
                </div>
                    <div style="margin-top: 20px">
                        状态：
                        <el-select v-model="searchForm.adState" placeholder="请选择" size="small">
                            <el-option
                                    label="全部"
                                    value="">
                            </el-option>
                            <el-option
                                    label="是"
                                    value="Y">
                            </el-option>
                            <el-option
                                    label="否"
                                    value="N">
                            </el-option>
                        </el-select>
                    </div>
                </Col>
                <Col :span="8"><div class="grid-content bg-purple">
                    广告开始时间：
                    <el-date-picker
                            v-model="searchForm.beginStartTime"
                            type="datetimerange"
                            start-placeholder="选择时间"
                            end-placeholder="选择时间"
                            :default-time="['12:00:00']">
                    </el-date-picker>
                </div>
                    <div style="margin-top: 20px">
                        广告结束时间：
                        <el-date-picker
                                v-model="searchForm.endStartTime"
                                type="datetimerange"
                                start-placeholder="选择时间"
                                end-placeholder="选择时间"
                                :default-time="['12:00:00']">
                        </el-date-picker>
                    </div></Col>
                <Col :span="3">
                    <div class="grid-content bg-purple">
                        <Button type="primary" icon="el-icon-plus" @click="showAdd" class="pull-right" style="margin-top: 15%">新增广告</Button>
                    </div>
                </Col>
            </Row>
            <Button type="primary" icon="el-icon-search" @click="onSearch" size="small" style="margin-left: 20px">查询</Button>
            <Button type="primary" @click="onReset" size="small">重置</Button>
        </div>
    </div>
</template>

<script>
    export default {
        name: "bannerPane"
    }
</script>

<style scoped>

</style>
