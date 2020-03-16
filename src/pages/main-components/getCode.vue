<template>
    <Button long type="primary" :disabled="disabled" @click="getCode" :loading="loading">{{font}}</Button>
</template>
<script>
    // import { signCode } from '../assets/js/sign'
    // import {
    //     sendVerificationCode,
    //     getLogiCode,
    //     reqBindBankCard,
    //     drawCashCode,
    //     applyRechargeCode
    // } from '../assets/js/api/merchant'

    export default {
        props: ['mobile', 'type', 'cardNo', 'amount', 'result'],
        data() {
            return {
                font: '发送验证码',
                loading: false,
                canget: true,
                disabled: true
            }
        },
        watch: {
            mobile(val) {
                this.checkDisabled(val)
            },
            canget() {
                this.checkDisabled(this.mobile)
            }
        },
        mounted() {
            // this.checkDisabled(this.mobile)
        },
        methods: {
            // 按妞状态
            checkDisabled(val) {
                const reg = /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/
                this.disabled = !(reg.test(val) && this.canget)
            },
            //  点击获取验证码
            getCode() {
                this.loading = true
                if (this.type === 'loginCode') {
                    this.getLoginCode()
                } else if (this.type === 'bindCard') {
                    this.getBindCard()
                } else if (this.type === 'drawCash') {
                    this.getCashCode()
                } else if (this.type === 'applyRecharge') {
                    this.getApplyRechargeCode()
                } else {
                    this.bingTelCode()
                }
            },
            //  绑定手机获取验证码
            bingTelCode() {
                sendVerificationCode({
                    phone: this.mobile,
                    verificationCodeType: 'BIND_PHONE'
                }).then(res => {
                    if (res.code === 0) {
                        this.canget = false
                        this.cuntTime()
                    } else {
                        this.$Message.error(res.msg)
                    }
                    this.loading = false
                })
            },
            // 登录获取验证码
            getLoginCode() {
                const mobile = this.mobile
                const merradstr = Math.round(Math.random() * 10000000)
                const timestamp = new Date().getTime()
                const paramStr = `merradstr=${merradstr}&mobile=${mobile}&timestamp=${timestamp}&verificationCodeType=LOGIN_OR_REGISTER`
                const rsa = KEYUTIL.getKey(signCode)
                const sig = new KJUR.crypto.Signature({ 'alg': 'SHA256withRSA' })
                sig.init(rsa)
                sig.updateString(paramStr)
                let sign = hextob64(sig.sign())
                sign = encodeURIComponent(sign)
                getLogiCode({
                    query: paramStr,
                    sign: sign
                }).then(res => {
                    if (res.code === 0) {
                        this.canget = false
                        this.cuntTime()
                    } else {
                        this.$Message.error(res.msg)
                    }
                    this.loading = false
                })
            },
            // 绑定银行卡获取验证码
            getBindCard() {
                reqBindBankCard({
                    cardNo: this.cardNo,
                    phone: this.mobile
                }).then(res => {
                    if (res.code === 0) {
                        this.$emit('update:result', res.data)
                        this.canget = false
                        this.cuntTime()
                    } else {
                        this.$Message.error(res.msg)
                    }
                    this.loading = false
                })
            },
            // 提现申请获取验证码
            getCashCode() {
                drawCashCode({
                    withdrawCardId: this.cardNo,
                    amount: this.amount
                }).then(res => {
                    if (res.code === 0) {
                        this.$emit('update:result', res.data)
                        this.canget = false
                        this.cuntTime()
                    } else {
                        this.$Message.error(res.msg)
                    }
                    this.loading = false
                })
            },
            // 充值申请获取验证码
            getApplyRechargeCode() {
                applyRechargeCode({
                    bankCardId: this.cardNo,
                    amount: this.amount
                }).then(res => {
                    if (res.code === 0) {
                        this.$emit('update:result', res.data)
                        this.canget = false
                        this.cuntTime()
                    } else {
                        this.$Message.error(res.msg)
                    }
                    this.loading = false
                })
            },
            // 倒计时
            cuntTime() {
                let cunt = 59
                this.font = `${cunt}″后重新获取`
                this.timeInterval = setInterval(() => {
                    if (cunt === 1) {
                        clearInterval(this.timeInterval)
                        this.font = `发送验证码`
                        this.canget = true
                        return
                    }
                    cunt--
                    this.font = `${cunt}″后重新获取`
                }, 1000)
            }
        }
    }
</script>
