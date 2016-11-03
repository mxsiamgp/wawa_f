<template>
    <group title="用户注册">
        <form @submit.prevent="register">
            <selector title="用户类型" :options="kinds" :value.sync="form.kind" v-ref:kind></selector>
            <x-input title="用户名" placeholder="1-20位任意字符串" :max="20" :value.sync="form.name" v-ref:name></x-input>
            <x-input title="密码"  type="password" placeholder="1-30位任意字符串" :max="30" :value.sync="form.password" v-ref:password></x-input>
            <x-input title="昵称" placeholder="1-30位任意字符串" :max="30" :value.sync="form.nickname" v-ref:nickname></x-input>
            <x-input title="手机" type="tel" placeholder="11位手机号码" :value.sync="form.mobile" v-ref:mobile></x-input>
            <box gap="10px 10px">
                <x-button :disabled="!$refs.mobile.valid || sendMobileCaptchaCountdownButton.disabled" v-countdown-button:send-mobile-captcha-countdown-button="{ interval: 60, action: sendMobileCaptcha }">发送验证码<span v-if="!!sendMobileCaptchaCountdownButton.timeout"> ({{sendMobileCaptchaCountdownButton.timeout}})</span></x-button>
            </box>
            <x-input title="验证码" :value.sync="form.mobileCaptchaCode" v-ref:mobile-captcha-code></x-input>
            <box gap="10px 10px">
                <x-button type="warn" :disabled="!$refs.name.valid || !$refs.password.valid || !$refs.nickname.valid || !$refs.mobile.valid || !$refs.mobileCaptchaCode.valid || isInProgress">注册</x-button>
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
                    kind: 'ANONYMOUS_USER',
                    name: '',
                    password: '',
                    nickname: '',
                    mobile: '',
                    mobileCaptchaCode: ''
                },
                isInProgress: false,
                kinds: [
                    {
                        key: 'ANONYMOUS_USER',
                        value: '匿名用户'
                    }
                ]
            };
        },

        methods: {
            sendMobileCaptcha(cb) {
                const that = this;

                RPC.call('user.send_mobile_captcha_for_register', {
                    mobile: that.form.mobile
                })
                        .then(failHandler(that))
                        .then(() => {
                            that.$dispatch('alertOk', '已发送');
                            cb(true);
                        });
            },

            register() {
                const that = this;
                that.isInProgress = true;
                RPC.call('user.register', _.pick(that.form, ['kind', 'name', 'password', 'nickname', 'mobile', 'mobileCaptchaCode']))
                        .always(() => {
                            that.isInProgress = false;
                        })
                        .then(failHandler(that))
                        .then(() => {
                            that.$dispatch('alertOk', '注册成功');
                        });
            }
        }
    };
</script>
