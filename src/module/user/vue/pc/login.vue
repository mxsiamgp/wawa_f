<template>
    <h1 class="header-dividing">用户注册</h1>
    <div class="container">
        <div class="row">
            <div class="col-lg-offset-3 col-lg-6">
                <validator name="validation">
                    <form @submit.prevent="login">
                        <div class="form-group" :class="{ 'has-error': $validation.name.invalid }">
                            <label>用户名</label>
                            <input class="form-control" v-validate:name="{ required: true }" v-model="form.name">
                        </div>
                        <div class="form-group" :class="{ 'has-error': $validation.password.invalid }">
                            <label>密码</label>
                            <input class="form-control" type="password" v-validate:password="{ required: true }" v-model="form.password">
                        </div>
                        <div>
                            <button class="btn btn-warning btn-block" type="submit" :disabled="$validation.invalid" v-loading-button="isInProgress">登录</button>
                            <a class="btn btn-link btn-block" v-link="{ path: '/user/pc/retake-password' }">找回密码</a>
                            <a class="btn btn-link btn-block" v-link="{ path: '/user/pc/register' }">注册</a>
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
