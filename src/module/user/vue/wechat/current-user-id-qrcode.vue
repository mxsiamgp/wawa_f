<template>
    <div style="text-align: center;">
        <divider>入场验票</divider>
        <qrcode :value="currentUserId"></qrcode>
    </div>
</template>
<script>
    import CurrentUserMixin from '../../js/current-user-mixin';

    export default {
        mixins: [CurrentUserMixin('user.get_current_wechat_user')],

        events: {
            'user.currentUserLoaded'(vm) {
                vm.currentUserId = vm.currentUser.id;
            }
        },

        data() {
            return {
                currentUserId: ''
            };
        }
    };
</script>
