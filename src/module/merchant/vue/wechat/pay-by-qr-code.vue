<template>
    <group title="扫码付款">
        <form @submit.prevent="createOrder">
            <cell title="商家"><div slot="value">{{form.merchant.name}}</div></cell>
            <x-input title="金额" :value.sync="form.priceYuan" v-ref:price-yuan></x-input>
            <box gap="10px 10px">
                <x-button type="primary" :disabled="!form.merchant">支付</x-button>
                <x-button @click.prevent="scan">扫码</x-button>
            </box>
        </form>
    </group>
</template>
<script>
    import BigNumber from 'bignumber.js';

    import CurrentUserMixin from '../../../user/js/current-user-mixin';
    import RPC from '../../../rest-json-rpc/js/rest-json-rpc';
    import failHandler from '../../../fail-handler/js/fail-handler';
    import jWeixin from '../../../wechat-jssdk/js/wechat-jssdk';

    export default {
        mixins: [CurrentUserMixin('user.get_current_wechat_user')],

        data() {
            return {
                form: {
                    competitionId: null,
                    merchant: null,
                    priceYuan: '0'
                },
                isInProgress: false
            };
        },

        methods: {
            scan() {
                const that = this;

                jWeixin.scanQRCode({
                    needResult: 1,
                    scanType: ['qrCode'],
                    success: (res) => {
                        const scanResult = JSON.parse(res.resultStr);
                        that.form.competitionId = scanResult.competitionId;
                        RPC.call('merchant.get', {
                            id: scanResult.merchantId
                        })
                                .then(failHandler(that))
                                .then((res) => {
                                    that.form.merchant = res.result;
                                });
                    }
                });
            },

            createOrder() {
                const that = this;

                if (!/^\d+(\.\d{1,2})?$/.test(that.form.priceYuan)) {
                    that.$dispatch('alertFail', '请填写正确的金额');
                    return;
                }
                const priceFee = new BigNumber(this.form.priceYuan).mul(100);
                if (priceFee.isZero()) {
                    this.$dispatch('alertFail', '金额不能为0.00');
                    return;
                }

                RPC.call('merchant.create_merchant_order', {
                    competitionId: that.form.competitionId,
                    merchantId: that.form.merchant.id,
                    priceFee: priceFee.toNumber(),
                    userId: that.currentUser.id
                })
                        .then(failHandler(that))
                        .then(() => {
                            that.$dispatch('alertOk', '已创建订单');
                            that.$router.go('/console/order/wechat/my-orders?payFirst=true');
                        });
            }
        },

        ready() {
            const that = this;
            RPC.call('wechat.get_wechat_jssdk_config', {})
                    .then(failHandler(that))
                    .then((res) => {
                        const cfg = res.result;
                        jWeixin.config({
                            appId: cfg.appId,
                            timestamp: cfg.timestamp,
                            nonceStr: cfg.nonceString,
                            signature: cfg.signature,
                            jsApiList: ['scanQRCode']
                        });
                        jWeixin.ready(() => {
                            that.scan();
                        });
                    });
        }
    };
</script>
