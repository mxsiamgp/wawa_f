<template>
    <group title="扫码付款">
        <form @submit.prevent="createOrder">
            <cell title="商家"><div slot="value">{{form.merchant.name}}</div></cell>
            <x-input title="金额" :value.sync="form.priceYuan" v-ref:price-yuan></x-input>
            <box gap="10px 10px">
                <x-button type="primary" :disabled="!form.merchant || isInProgress">支付</x-button>
                <x-button @click.prevent="scan">扫码</x-button>
            </box>
        </form>
    </group>
</template>
<script>
    import BigNumber from 'bignumber.js';

    import RPC from '../../../rest-json-rpc/js/rest-json-rpc';
    import failHandler from '../../../fail-handler/js/fail-handler';
    import jWeixin from '../../../wechat-jssdk/js/wechat-jssdk';

    export default {
        data() {
            return {
                form: {
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
                        const merchantId = res.resultStr;
                        RPC.call('merchant.get', {
                            id: merchantId
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
