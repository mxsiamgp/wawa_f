<template>
    <group title="用户登录">
        <form @submit.prevent="login">
            <x-input title="用户名" :value.sync="form.name" v-ref:name></x-input>
            <x-input title="密码" type="password" :value.sync="form.password" v-ref:password></x-input>
            <box gap="10px 10px">
                <x-button type="primary" :disabled="!$refs.name.valid || !$refs.password.valid || isInProgress">登录</x-button>
                <x-button v-link="{ path: '/user/wechat/retake-password' }">找回密码</x-button>
                <x-button v-link="{ path: '/user/wechat/register' }">注册</x-button>
            </box>
        </form>
    </group>
</template>
<script>
    import _ from 'lodash';

    import RPC from '../../../rest-json-rpc/js/rest-json-rpc';
    import failHandler from '../../../fail-handler/js/fail-handler';

    export default {
        data() {
            return {
                form: {
                    name: '',
                    password: ''
                },
                isInProgress: false
            };
        },

        methods: {
            login() {
                const that = this;

                that.isInProgress = true;
                RPC.call('user.login', _.pick(that.form, ['name', 'password']))
                        .always(() => {
                            that.isInProgress = false;
                        })
                        .then(failHandler(that))
                        .then(() => {
                            that.$router.replace('/');
                        });
            }
        }
    };
</script>
