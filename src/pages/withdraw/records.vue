<template>
    <div class="fund_list">
        <Form :model="search" inline label-position="left" :label-width="60">
            <FormItem label="申请时间" style="margin-right: 20px">
                <DatePicker style="width: 220px" v-model="search.date" format="yyyy/MM/dd" type="daterange"
                            placement="bottom-end" placeholder="选择时间范围"></DatePicker>
            </FormItem>
            <FormItem label="提现状态" style="margin-right: 20px">
                <Select v-model="search.type" style="width: 180px">
                    <Option :value="-1">全部</Option>
                    <Option value="PAYING">系统处理中</Option>
                    <Option value="SUCCESS">提现成功</Option>
                    <Option value="FAIL">提现失败</Option>
                </Select>
            </FormItem>
            <Button type="primary" @click="searchList"> 查 询 </Button>
        </Form>
        <Table :columns="columns" :data="list" :loading="loading"></Table>
        <Page class="page-box" :current="current" :total="total" @on-change="pageChange" show-total/>
    </div>
</template>
<script>
    // import { drawList } from '@/assets/js/api/merchant'
    // import { timeFormat } from '@/assets/js/until'

    export default {
        props: ['tab'],
        data() {
            return {
                loading: true,
                search: {
                    type: -1,
                    date: ['', '']
                },
                total: 0,
                current: 0,
                columns: [
                    {
                        title: '申请时间',
                        key: 'createTime'
                    },
                    {
                        title: '提现金额',
                        key: 'amount',
                        render: (h, p) => {
                            return h('div', {}, '¥ ' + (p.row.amount - 0).toFixed(2))
                        }
                    },
                    {
                        title: '提现方式',
                        key: 'type',
                        render: (h, p) => {
                            return h('div', {}, p.row.type === 'PRIVATE' ? '对私' : '对公')
                        }
                    },
                    {
                        title: '处理时间',
                        key: 'updateTime'
                    },
                    {
                        title: '提现银行 | 户名 | 卡号',
                        minWidth: 300,
                        render: (h, p) => {
                            const font = `${p.row.bankName} | ${p.row.name} | ${p.row.cardNo}`
                            return h('div', {}, font)
                        }
                    },
                    {
                        title: '状态',
                        render: (h, p) => {
                            let font
                            switch (p.row.status) {
                                case 'PAYING':
                                    font = '系统处理中'
                                    break
                                case 'FAIL':
                                    font = '提现失败'
                                    break
                                case 'SUCCESS':
                                    font = '提现成功'
                                    break
                            }
                            return h('div', {}, font)
                        }
                    }
                ],
                list: []
            }
        },
        computed: {
            beginDate() {
                if (this.search.date[0]) {
                    return timeFormat(this.search.date[0])
                } else {
                    return ''
                }
            },
            endDate() {
                if (this.search.date[1]) {
                    return timeFormat(this.search.date[1])
                } else {
                    return ''
                }
            }
        },
        watch: {
            tab(val) {
                if (val === 'list' && this.current === 0) {
                    this.getList(1)
                }
            }
        },
        methods: {
            getList(pageNo) {
                const data = {
                    beginDate: this.beginDate,
                    endDate: this.endDate,
                    status: this.search.type === -1 ? null : this.search.type,
                    pageSize: 10,
                    pageNo: pageNo
                }
                this.loading = true
                drawList(data).then(res => {
                    if (res.code === 0) {
                        this.list = res.data.list
                        this.total = res.data.totalCount
                        this.current = res.data.pageNo
                    } else {
                        this.$Message.error(res.msg)
                    }
                    this.loading = false
                })
            },
            searchList() {
                this.getList(1)
            },
            pageChange(e) {
                this.getList(e)
            }
        }
    }
</script>
<style lang="scss">
    .fund_list {
        margin-top: 15px;
        .page-box {
            text-align: center;
            margin-top: 20px;
        }
    }
</style>
