<template>
    <h1 class="header-dividing">用户注册</h1>
    <div class="container">
        <div class="row">
            <div class="col-lg-offset-3 col-lg-6">
                <validator name="validation">
                    <form @submit.prevent="register">
                        <div class="form-group" :class="{ 'has-error': $validation.kind.invalid }">
                            <label>用户类型</label>
                            <select class="form-control" v-validate:kind="['required']" v-model="form.kind">
                                <option value="NORMAL_USER">普通用户</option>
                                <option value="MANAGER">管理员</option>
                            </select>
                        </div>
                        <div class="form-group" :class="{ 'has-error': $validation.name.invalid }">
                            <label>用户名</label>
                            <input class="form-control" placeholder="1-20位任意字符串" v-validate:name="{ required: true, maxlength: 20 }" v-model="form.name">
                        </div>
                        <div class="form-group" :class="{ 'has-error': $validation.password.invalid }">
                            <label>密码</label>
                            <input class="form-control" type="password" placeholder="1-30位任意字符串" v-validate:password="{ required: true, maxlength: 30 }" v-model="form.password">
                        </div>
                        <div class="form-group" :class="{ 'has-error': $validation.nickname.invalid }">
                            <label>昵称</label>
                            <input class="form-control" placeholder="1-30位任意字符串" v-validate:nickname="{ required: true, maxlength: 30 }" v-model="form.nickname">
                        </div>
                        <div class="form-group" :class="{ 'has-error': $validation.mobile.invalid }">
                            <label>手机</label>
                            <input class="form-control" type="tel" placeholder="11位手机号码" v-validate:mobile="['required']" v-model="form.mobile">
                            <button class="btn btn-block" :class="{ disabled: sendMobileCaptchaCountdownButton.disabled }" type="button" :disabled="$validation.mobile.invalid || sendMobileCaptchaCountdownButton.disabled" v-countdown-button:send-mobile-captcha-countdown-button="{ interval: 60, action: sendMobileCaptcha }">发送验证码<span v-if="!!sendMobileCaptchaCountdownButton.timeout"> ({{sendMobileCaptchaCountdownButton.timeout}})</span></button>
                        </div>
                        <div class="form-group" :class="{ 'has-error': $validation.mobileCaptchaCode.invalid }">
                            <label>验证码</label>
                            <input class="form-control" v-validate:mobile-captcha-code="['required']" v-model="form.mobileCaptchaCode">
                        </div>
                        <div>
                            <button class="btn btn-warning btn-block" type="submit" :disabled="$validation.invalid" v-loading-button="isInProgress">注册</button>
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
                    kind: 'NORMAL_USER',
                    name: '',
                    password: '',
                    nickname: '',
                    mobile: '',
                    mobileCaptchaCode: ''
                },
                isInProgress: false
            };
        },

        methods: {
            sendMobileCaptcha(cb) {
                const that = this;
                if (that.$validation.mobile.invalid) {
                    that.$dispatch('alertFail', '请填写正确的手机号码');
                    cb(false);
                    return;
                }
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
