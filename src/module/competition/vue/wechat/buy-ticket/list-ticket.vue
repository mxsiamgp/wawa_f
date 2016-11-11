<template>
    <group :title="competition.name">
        <template v-for="ticket in competition.tickets">
            <x-number :title="ticketTitle(ticket)" :fillable="false" :min="0" :value.sync="form.tickets[ticket.id]"></x-number>
        </template>
        <box gap="10px 10px">
            <x-button type="primary" @click.prevent="createOrder" :disabled="isInProgress">立即购买</x-button>
        </box>
    </group>
</template>
<script>
    import BigNumber from 'bignumber.js';
    import Vue from 'vue';
    import _ from 'lodash';

    import RPC from '../../../../rest-json-rpc/js/rest-json-rpc';
    import failHandler from '../../../../fail-handler/js/fail-handler';

    export default {
        data() {
            return {
                BigNumber,
                competition: null,
                form: {
                    tickets: {}
                },
                isInProgress: false
            };
        },

        methods: {
            ticketTitle(ticket) {
                return `${ticket.name} ￥${new BigNumber(ticket.priceFee).dividedBy(100).toFormat(2)}`;
            },

            createOrder() {
                const that = this;

                if(!_.some(this.form.tickets, (quantity) => {
                            return quantity !== 0;
                })) {
                    that.$dispatch('alertFail', '请选择购买门票的数量');
                    return;
                }

                that.isInProgress = true;
                RPC.call('competition.create_order', {
                    competitionId: that.competition.id,
                    tickets: _.filter(_.map(that.form.tickets, (quantity, ticketId) => {
                        return {
                            ticketId,
                            quantity
                        };
                    }), (item) => {
                        return item.quantity !== 0;
                    })
                })
                        .always(() => {
                            that.isInProgress = false;
                        })
                        .then(() => {
                            that.$dispatch('alertOk', '已创建订单');
                            that.$router.go('/console/order/wechat/my-orders?payFirst=true');
                        });
            }
        },

        ready() {
            const that = this;
            RPC.call('competition.get', {
                id: that.$route.params.competitionId
            })
                    .then(failHandler(that))
                    .then((res) => {
                        const cmpt = res.result;
                        that.competition = cmpt;
                        _.forEach(cmpt.tickets, (ticket) => {
                            Vue.set(that.form.tickets, ticket.id, 0);
                        });
                    });
        }
    };
</script>
