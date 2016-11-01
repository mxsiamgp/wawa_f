<template>
    <div class="weui_panel weui_panel_access">
        <div class="weui_panel_hd">我的订单</div>
        <div class="weui_panel_bd">
            <div class="weui_media_box weui_media_text" v-for="order in orders">
                <h4 class="weui_media_title">{{lodash.join(lodash.map(order.items, 'sellableValue'), ' / ')}}</h4>
                <p class="weui_media_desc">
                    {{moment(order.createdTime).tz('Asia/Shanghai').format('YYYY/MM/DD HH:mm:ss')}} {{OrderStatusMessage[order.status]}} <span style="font-weight: bold; color: red;">{{`￥${new BigNumber(order.totalPriceFee).dividedBy(100).toFormat(2)}`}}</span>
                </p>
                <divider></divider>
                <p>
                    <x-button style="float: right;" type="warn" mini :disabled="isPayInProgress" @click.prevent="pay(order)" v-if="order.status === OrderStatusCode.UNPAID">支付</x-button>
                    <div style="clear: both;"></div>
                </p>
            </div>
        </div>
        <a class="weui_panel_ft" :href="getUrl(footer.url)" v-if="footer && type !== '3'" @click.prevent="onClickFooter" v-html="footer.title"></a>
    </div>
    <box gap="10px 10px">
        <x-button @click="next(true)" :disabled="isNextInProgress">查看更多</x-button>
    </box>
</template>
<script>
    import BigNumber from 'bignumber.js';
    import moment from 'moment-timezone';
    import Vue from 'vue';
    import _ from 'lodash';

    import CurrentUserMixin from '../../../user/js/current-user-mixin';
    import { Code as OrderStatusCode, Message as OrderStatusMessage } from '../../../order/js/order-status';
    import RPC from '../../../rest-json-rpc/js/rest-json-rpc';
    import failHandler from '../../../fail-handler/js/fail-handler';
    import jWeixin from '../../../wechat-jssdk/js/wechat-jssdk';

    export default {
        mixins: [CurrentUserMixin('user.get_current_wechat_user')],

        data() {
            return {
                BigNumber,
                OrderStatusCode,
                OrderStatusMessage,
                lodash: _,
                moment,
                isNextInProgress: false,
                isPayInProgress: false,
                lastId: null,
                orders: []
            };
        },

        computed: {
            displayOrders() {
                return _.map(this.orders, (order) => {
                    return {
                        title: _.join(_.map(order.items, 'sellableValue'), '、'),
                        desc: `${moment(order.createdTime).tz('Asia/Shanghai').format('YYYY/MM/DD HH:mm:ss')} ${OrderStatusMessage[order.status]} ￥${new BigNumber(order.totalPriceFee).dividedBy(100).toFormat(2)}`
                    }
                });
            }
        },

        events: {
            'user.currentUserLoaded': (vm) => {
                vm.next(false);
            }
        },

        methods: {
            next(isNext) {
                const that = this;
                if (isNext) {
                    that.isNextInProgress = true;
                }
                RPC.call('order.get_all_orders_by_user_id', {
                    lastId: that.lastId,
                    userId: that.currentUser.id
                })
                        .always(() => {
                            if (isNext) {
                                that.isNextInProgress = false;
                            }
                        })
                        .then(failHandler(that))
                        .then((res) => {
                            const orders = res.result;
                            if (orders.length) {
                                that.lastId = _.last(orders).id;
                            }
                            that.orders.push(...orders);
                        });
            },

            pay(order) {
                const that = this;
                that.isPayInProgress = true;
                RPC.call('order.pay_by_wechat_h5', {
                    orderId: order.id
                })
                        .always(() => {
                            that.isPayInProgress = false;
                        })
                        .then(failHandler(that))
                        .then((res) => {
                            const prepayId = res.result;
                            jWeixin.ready(() => {
                                that.isPayInProgress = true;
                                RPC.call('wechat_pay.get_wechat_pay_jssdk_config', {
                                    prepayId
                                })
                                        .always(() => {
                                            that.isPayInProgress = false;
                                        })
                                        .then(failHandler(that))
                                        .then((res) => {
                                            const cfg = res.result;
                                            jWeixin.chooseWXPay({
                                                timestamp: cfg.timestamp,
                                                nonceStr: cfg.nonceString,
                                                package: `prepay_id=${prepayId}`,
                                                signType: 'MD5',
                                                paySign: cfg.signature,
                                                success() {
                                                    order.status = OrderStatusCode.PAID;
                                                }
                                            });
                                        });
                            });
                        });
            }
        },

        ready() {
            RPC.call('wechat.get_wechat_jssdk_config', {})
                    .then((res) => {
                        const cfg = res.result;
                        jWeixin.config({
                            appId: cfg.appId,
                            timestamp: cfg.timestamp,
                            nonceStr: cfg.nonceString,
                            signature: cfg.signature,
                            jsApiList: ['chooseWXPay']
                        });
                    });
        }
    }
</script>
