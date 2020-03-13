<template>
    <div class="drawcash">
        <Form label-position="right" :model="form" :label-width="150" ref="form" :rules="rules">
            <FormItem label="账户余额：">
                <div class="cash_number"><span>{{totalAmount}}</span></div>
            </FormItem>
            <FormItem label="保证金额：">
                <div class="cash_number"><span>{{cautionMoney}}</span></div>
            </FormItem>
            <FormItem label="可提现金额：">
                <div class="cash_number"><span>{{amount}}</span>（为保证账户资金有效运作，请保障充足的账户余额。）</div>
            </FormItem>
            <FormItem label="收款账户：">
                <div class="card_list">
                    <template v-for="(item,index) in cardList">
                        <div class="card_item" :class="{'active':carType===index}" @click="carType=index">
                            <div class="name"> {{item.ownerType === 'PRIVATE' ? '对私银行账户' : '对公银行账户'}}</div>
                            <div class="info"><span>{{item.bankName}}</span>{{item.name}}（{{item.cardNo}}）</div>
                        </div>
                    </template>
                </div>
            </FormItem>
            <template v-if="canWidthDraw" >
                <FormItem label="提现金额：" prop="money" style="padding-bottom: 10px">
                    <Row>
                        <i-col :span="15">
                            <i-input v-model="form.money" :maxlength="20" placeholder="0.00"
                                    @keyup.native="numberParse"></i-input>
                            <div class="min_money">提现手续费：¥{{commissionCharge}}（费率：¥{{commissionCharge}}每笔）</div>
                        </i-col>
                        <i-col :span="8" :offset="1">
                            元
                        </i-col>
                    </Row>
                </FormItem>
                <FormItem label="短信验证码：" prop="code">
                    <Row>
                        <i-col :span="15">
                            <i-input v-model="form.code" :maxlength="6" placeholder="请输入验证码"></i-input>
                        </i-col>
                        <i-col :span="8" :offset="1">
                            <getCode :mobile="replaceMobile" type="drawCash" :amount="this.form.money" :result.sync="result"
                                    :cardNo="withdrawCardId"></getCode>
                        </i-col>
                    </Row>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="applyCash" :disabled="!result.bizOrderNo" :loading="loading"> 提交申请
                    </Button>
                </FormItem>
            </template>
            <!-- <template v-else>
               <FormItem>
                    <Alert type="warning" show-icon>您的提现权限未开放，如需开启请联系管理员</Alert>
               </FormItem>
            </template> -->

        </Form>
        <Spin size="large" fix v-if="spinShow"></Spin>
    </div>
</template>
<script>
    import getCode from '../main-components/getCode.vue'
    // import { clearNoNum } from '@/assets/js/until'
    // import { getWithdrawCashInfo, dorawCash } from '@/assets/js/api/merchant'
    // import {getFinanceWithDraw} from '@/assets/js/api/finance'

    export default {
        components: { getCode },
        data() {
            return {
                spinShow: true,
                carType: 0,
                cardList: [],
                result: { bizOrderNo: '' },
                loading: false,
                canWidthDraw:false,
                userInfoAccount: '',
                minimumAmount: '',     // 最小提现金额
                commissionCharge: '', // 手续费
                cautionMoney: '',      // 保证金
                form: {
                    money: '',
                    code: ''
                },
                rules: {
                    money: [
                        { required: true, message: '请输入提现金额', trigger: 'change' },
                        {
                            validator: (rule, value, callback) => {
                                if ((value - 0) > (this.amount - 0)) {
                                    callback(new Error('可提现金额不足'))
                                } else if ((value - 0) < (this.minimumAmount - 0)) {
                                    callback(new Error('提现每笔不得低于' + this.minimumAmount + '元'))
                                } else {
                                    callback()
                                }
                            }, trigger: 'change'
                        }
                    ],
                    code: [
                        { required: true, message: '请输入验证码', trigger: 'blur' },
                        { type: 'string', min: 4, message: '验证码不少于4位', trigger: 'blur' }
                    ]
                }
            }
        },
        computed: {
            withdrawCardId() {
                if (this.cardList.length > 0) {
                    return this.cardList[this.carType].id
                } else {
                    return ''
                }
            },
            replaceMobile() {
                console.log(typeof this.form.money)
                console.log(this.amount)
                if (this.form.money >= this.minimumAmount && this.form.money <= parseFloat(this.amount)) {
                    // 写死只为验证通过 无其他作用
                    return '18888888888'
                } else {
                    return ''
                }
            },
            // 可以提现
            amount() {
                if (this.userInfoAccount) {
                    return (this.userInfoAccount.amount - this.userInfoAccount.freezenAmount - this.cautionMoney).toFixed(2)
                } else {
                    return '0.00'
                }
            },
            // 商户余额
            totalAmount() {
                if (this.userInfoAccount) {
                    return (this.userInfoAccount.amount - this.userInfoAccount.freezenAmount).toFixed(2)
                } else {
                    return '0.00'
                }
            },
            // 用户类型
            userType() {
                let user = this.$store.state.user;
                let userType = user.userType
                return userType
            }
        },
        created() {

            this.getInfo()
        },
        methods: {
            numberParse() {
                this.form.money = clearNoNum(this.form.money)
            },
            getInfo() {
                console.log(this.userType)
                if(this.userType==='PLATFORM_FINANCE'){
                    // getFinanceWithDraw().then(res => {
                    //     if(res.code===0){
                    //         this.minimumAmount = res.data.enterpriseRateConfig.minimumAmount
                    //         this.commissionCharge = res.data.enterpriseRateConfig.rate
                    //         this.cautionMoney = res.data.cautionMoney.toFixed(2)
                    //         this.userInfoAccount = res.data.userInfoAccount
                    //         this.cardList = res.data.userBankCardList
                    //         this.canWidthDraw='Y';
                    //     }else{
                    //         this.$Message.error(res.msg)
                    //     }
                    //     this.spinShow = false
                    // })
                }else if(this.userType==='ENTERPRISE_MEMBERS'){
                    // getWithdrawCashInfo().then(res => {
                    //     if (res.code === 0) {
                    //         this.minimumAmount = res.data.enterpriseRateConfig.minimumAmount
                    //         this.commissionCharge = res.data.enterpriseRateConfig.rate
                    //         this.cautionMoney = res.data.cautionMoney.toFixed(2)
                    //         this.userInfoAccount = res.data.userInfoAccount
                    //         this.cardList = res.data.userBankCardList
                    //         this.canWidthDraw=res.data.openWithdraw==='Y';
                    //     } else {
                    //         this.$Message.error(res.msg)
                    //     }
                    //     this.spinShow = false
                    // })
                }


            },
            applyCash() {
                this.$refs['form'].validate(valid => {
                    if (valid) {
                        this.loading = true
                        // dorawCash({
                        //     bizOrderNo: this.result.bizOrderNo,
                        //     verificationCode: this.form.code
                        // }).then(res => {
                        //     if (res.code === 0) {
                        //         this.result.bizOrderNo = ''
                        //         this.form.code = ''
                        //         this.form.money = ''
                        //         this.getInfo()
                        //         this.$Message.success('提现申请成功')
                        //     } else {
                        //         this.$Message.error(res.msg)
                        //     }
                        //     this.loading = false
                        // })
                    }
                })
            }
        }
    }
</script>
<style lang="scss">
    .drawcash {
        max-width: 600px;
        margin-top: 20px;
        margin-left: 100px;
        position: relative;
        .min_money {
            color: #808695;
            font-size: 10px;
            line-height: 16px;
            padding-top: 6px;
            .min_numner {
                color: #2d8cf0;
            }
        }
        .cash_number {
            color: #808695;
            font-size: 12px;
            line-height: 30px;
            span {
                display: inline-block;
                color: #2d8cf0;
                font-size: 24px;
                font-weight: 700;
                padding-right: 15px;
                &:before {
                    content: '¥ ';
                    font-size: 18px;
                }
            }
        }
        .card_list {
            margin-bottom: -15px;
            .card_item {
                border: 2px solid #c5c8ce;
                margin-bottom: 15px;
                border-radius: 4px;
                cursor: pointer;
                padding: 10px 15px;
                line-height: 26px;
                box-sizing: border-box;
                &.active {
                    border: 2px solid #2d8cf0;
                    .name {
                        color: #2d8cf0;
                    }
                }
                .name {
                    font-size: 15px;
                }
                .info {
                    font-size: 12px;
                    color: #808695;
                    span {
                        display: inline-block;
                        margin-right: 20px;
                    }
                }
            }
        }
    }

</style>
