<template>
    <group title="我的账户">
        <cell title="基本信息" is-link v-link="{ path: '/console/user/wechat/update' }"></cell>
        <cell title="修改密码" is-link v-link="{ path: '/console/user/wechat/update-password' }"></cell>
    </group>
    <group title="赛事">
        <cell title="入场验票" is-link v-link="{ path: '/console/competition/wechat/inspect-ticket/competition/list' }" v-if="hasPermissions(['COMPETITION.DRAWN_TICKET.INSPECT'])"></cell>
        <cell title="身份二维码" is-link v-link="{ path: '/console/user/wechat/current-user-id-qrcode' }"></cell>
    </group>
    <group title="系统">
        <cell title="注销" @click.prevent="logout"></cell>
    </group>
</template>
<script>
    import CurrentUserMixin from '../../user/js/current-user-mixin';
    import RPC from '../../rest-json-rpc/js/rest-json-rpc';
    import failHandler from '../../fail-handler/js/fail-handler';

    export default {
        mixins: [CurrentUserMixin('user.get_current_wechat_user')],

        methods: {
            logout() {
                const that = this;
                RPC.call('user.logout', {})
                        .then(failHandler(that))
                        .then(() => {
                            RPC.call('user.get_current_wechat_user', {})
                                    .then(failHandler(that));
                        });
            }
        }

    };
</script>
