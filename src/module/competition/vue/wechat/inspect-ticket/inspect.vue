<template>
    <group title="购买的门票">
        <cell :title="ticket.ticketName" v-for="ticket in tickets">
            <div slot="value">
                <span style="color: green">{{ticket.quantity}}</span>
            </div>
        </cell>
    </group>
    <box gap="10px 10px">
        <x-button type="primary" @click.prevent="next">下一个</x-button>
    </box>
</template>
<script>
    import RPC from '../../../../rest-json-rpc/js/rest-json-rpc';
    import failHandler from '../../../../fail-handler/js/fail-handler';
    import jWeixin from '../../../../wechat-jssdk/js/wechat-jssdk';

    export default {
        data() {
            return {
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
                        RPC.call('competition.drawn_ticket.get_all_by_competition_id_and_user_id', {
                            competitionId: that.$route.params.competitionId,
                            userId: userId
                        })
                                .then(failHandler(that))
                                .then((res) => {
                                    that.tickets = res.result;
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
