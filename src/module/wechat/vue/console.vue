<template>
    <div class="weui_tab">
        <div class="weui_tab_bd">
            <router-view></router-view>
        </div>
        <tabbar>
            <tabbar-item v-link="{ path: '/console/competition/wechat/buy-ticket/competition/list' }" :selected="$route.path === '/console/competition/wechat/buy-ticket/competition/list'">
                <span slot="label">门票购买</span>
            </tabbar-item>
            <tabbar-item v-link="{ path: '/console/merchant/wechat/pay-by-qr-code' }" :selected="$route.path === '/console/merchant/wechat/pay-by-qr-code'">
                <span slot="label">扫码付款</span>
            </tabbar-item>
            <tabbar-item v-link="{ path: '/console/order/wechat/my-orders' }" :selected="$route.path === '/console/order/wechat/my-orders'">
                <span slot="label">我的订单</span>
            </tabbar-item>
            <tabbar-item v-link="{ path: '/console/wechat/settings' }" :selected="$route.path === '/console/wechat/settings'">
                <span slot="label">个人设置</span>
            </tabbar-item>
        </tabbar>
    </div>
</template>
<script>
    import CurrentUserMixin from '../../user/js/current-user-mixin';

    export default {
        mixins: [CurrentUserMixin('user.get_current_wechat_user')],

        ready() {
            document.querySelector('body').style.height = '100%';
            document.querySelector('html').style.height = '100%';
        }
    }
</script>
