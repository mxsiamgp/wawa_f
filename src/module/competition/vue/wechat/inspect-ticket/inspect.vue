<template>
    <group title="购买的门票">
        <cell title="验票状态">
            <div slot="value">
                <span :style="{ color: isInspected ? 'red' : 'green' }">{{isInspected ? '已检' : '未检'}}</span>
            </div>
        </cell>
        <cell :title="ticket.ticketName" v-for="ticket in tickets">{{ticket.quantity}}</cell>
    </group>
    <box gap="10px 10px">
        <x-button type="primary" @click.prevent="next">下一个</x-button>
    </box>
    <loading :show="isLoading" text="验票中..."></loading>
</template>
<script>
    import FailCode from '../../../js/fail-code';
    import RPC from '../../../../rest-json-rpc/js/rest-json-rpc';
    import StatusCode from '../../../../rest-json-rpc/js/status-code';
    import failHandler from '../../../../fail-handler/js/fail-handler';
    import jWeixin from '../../../../wechat-jssdk/js/wechat-jssdk';

    export default {
        data() {
            return {
                isInspected: false,
                isLoading: false,
                tickets: []
            };
        },

        methods: {
            next() {
                const that = this;

                jWeixin.scanQRCode({
                    needResult: 1,
                    scanType: ['qrCode'],
                    success: (res) => {
                        const userId = res.resultStr;

                        that.isLoading = true;
                        RPC.call('competition.drawn_ticket.get_all_by_competition_id_and_user_id', {
                            competitionId: that.$route.params.competitionId,
                            userId: userId
                        })
                                .then(failHandler(that))
                                .then((res) => {
                                    that.tickets = res.result;
                                    RPC.call('competition.inspection.mark_inspected', {
                                        competitionId: that.$route.params.competitionId,
                                        userId: userId
                                    })
                                            .then(failHandler(that))
                                            .then((res) => {
                                                if (res.statusCode === StatusCode.OK) {
                                                    that.isInspected = false;
                                                } else {
                                                    if (res.failCode === FailCode.INSPECTION_INSPECTED) {
                                                        that.isInspected = true;
                                                    }
                                                }
                                                that.isLoading = false;
                                            });
                                });
                    }
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
                            that.next();
                        });
                    });
        }
    };
</script>
