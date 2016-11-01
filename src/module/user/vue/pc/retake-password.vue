<template>
    <h1 class="header-dividing">找回密码</h1>
    <div class="container">
        <div class="row">
            <div class="col-lg-offset-3 col-lg-6">
                <validator name="validation">
                    <form @submit.prevent="update">
                        <div class="form-group" :class="{ 'has-error': $validation.name.invalid }">
                            <label for="field-name">用户名</label>
                            <input class="form-control" id="field-name" v-validate:name="{ required: true }" v-model="form.name">
                            <button class="btn btn-block" :class="{ disabled: sendMobileCaptchaCountdownButton.disabled }" type="button" :disabled="$validation.name.invalid || sendMobileCaptchaCountdownButton.disabled" v-countdown-button:send-mobile-captcha-countdown-button="{ interval: 60, action: sendMobileCaptcha }">发送验证码<span v-if="!!sendMobileCaptchaCountdownButton.timeout"> ({{sendMobileCaptchaCountdownButton.timeout}})</span></button>
                        </div>
                        <div class="form-group" :class="{ 'has-error': $validation.mobileCaptchaCode.invalid }">
                            <label for="field-mobile-captcha-code">验证码</label>
                            <input class="form-control" id="field-mobile-captcha-code" v-validate:mobile-captcha-code="['required']" v-model="form.mobileCaptchaCode">
                        </div>
                        <div class="form-group" :class="{ 'has-error': $validation.password.invalid }">
                            <label for="field-password">密码</label>
                            <input class="form-control" type="password" id="field-password" placeholder="1-30位任意字符串" v-validate:password="{ required: true, maxlength: 30 }" v-model="form.password">
                        </div>
                        <div>
                            <button class="btn btn-primary btn-block" type="submit" :disabled="$validation.invalid" v-loading-button="isInProgress">修改</button>
                            <a class="btn btn-link btn-block" v-link="{ path: '/user/pc/login' }">登录</a>
                        </div>
                    </form>
                </validator>
            </div>
        </div>
    </div>
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
    }
</script>
