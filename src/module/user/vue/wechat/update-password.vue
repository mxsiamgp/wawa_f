<template>
    <group title="修改密码">
        <form @submit.prevent="update">
            <x-input title="密码" type="password" placeholder="1-30位任意字符串" :max="30" :value.sync="form.password" v-ref:password></x-input>
            <box gap="10px 10px">
                <x-button type="primary" :disabled="!$refs.password.valid || isInProgress">保存</x-button>
            </box>
        </form>
    </group>
</template>
<script>
    import Vue from 'vue';
    import _ from 'lodash';

    import CurrentUserMixin from '../../js/current-user-mixin';
    import RPC from '../../../rest-json-rpc/js/rest-json-rpc';
    import failHandler from '../../../fail-handler/js/fail-handler';

    export default {
        mixins: [CurrentUserMixin('user.get_current_wechat_user')],

        data() {
            return {
                form: {
                    password: ''
                },
                isInProgress: false
            };
        },

        methods: {
            update() {
                const that = this;
                that.isInProgress = true;
                RPC.call('user.update_password', _.merge(_.pick(that.form, ['password']), {
                    id: that.currentUser.id
                }))
                        .always(() => {
                            that.isInProgress = false;
                        })
                        .then(failHandler(that))
                        .then(() => {
                            that.$router.replace('/console/wechat/settings');
                        });
            }
        }
    }
</script>
