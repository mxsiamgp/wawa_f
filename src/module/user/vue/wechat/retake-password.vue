<template>
    <group title="找回密码">
        <form @submit.prevent="update">
            <x-input title="用户名" :value.sync="form.name" v-ref:name></x-input>
            <x-input title="验证码" :value.sync="form.mobileCaptchaCode" v-ref:mobile-captcha-code></x-input>
            <box gap="10px 10px">
                <x-button :disabled="!$refs.name.valid || sendMobileCaptchaCountdownButton.disabled" v-countdown-button:send-mobile-captcha-countdown-button="{ interval: 60, action: sendMobileCaptcha }">发送验证码<span v-if="!!sendMobileCaptchaCountdownButton.timeout"> ({{sendMobileCaptchaCountdownButton.timeout}})</span></x-button>
            </box>
            <x-input title="密码" type="password" placeholder="1-30位任意字符串" :max="30" :value.sync="form.password" v-ref:password></x-input>
            <box gap="10px 10px">
                <x-button type="primary" :disabled="!$refs.name.valid || !$refs.mobileCaptchaCode.valid || !$refs.password.valid || isInProgress">修改</x-button>
                <x-button v-link="{ path: '/user/wechat/login' }">登录</x-button>
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
                    mobileCaptchaCode: '',
                    password: ''
                },
                isInProgress: false
            };
        },

        methods: {
            sendMobileCaptcha(cb) {
                const that = this;
                RPC.call('user.send_mobile_captcha_for_retake_password', _.pick(that.form, ['name']))
                        .then(failHandler(that))
                        .then(() => {
                            that.$dispatch('alertOk', '已发送');
                            cb(true);
                        });
            },

            update() {
                const that = this;
                that.isInProgress = true;
                RPC.call('user.retake_password', _.pick(that.form, ['mobileCaptchaCode', 'password']))
                        .always(() => {
                            that.isInProgress = false;
                        })
                        .then(failHandler(that))
                        .then(() => {
                            that.$dispatch('alertOk', '已修改');
                        });
            }
        }
    };
</script>
