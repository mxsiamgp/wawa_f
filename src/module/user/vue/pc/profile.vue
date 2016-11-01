<template>
    <h1 class="header-dividing">我的账户</h1>
    <div class="container">
        <div class="row">
            <h2 class="header-dividing">基本信息</h2>
            <div class="col-lg-offset-3 col-lg-6">
                <validator name="validation">
                    <form @submit.prevent="update">
                        <div class="form-group" :class="{ 'has-error': $validation.nickname.invalid }">
                            <label>昵称</label>
                            <input class="form-control" v-validate:nickname="{ required: true, maxlength: 30 }" v-model="updateForm.nickname">
                        </div>
                        <div class="clearfix">
                            <button class="btn btn-primary pull-right" type="submit" :disabled="$validation.invalid" v-loading-button="isUpdateInProgress">保存</button>
                        </div>
                    </form>
                </validator>
            </div>
        </div>
        <div class="row">
            <h2 class="header-dividing">修改密码</h2>
            <div class="col-lg-offset-3 col-lg-6">
                <validator name="passwordValidation">
                    <form @submit.prevent="updatePassword">
                        <div class="form-group" :class="{ 'has-error': $passwordValidation.password.invalid }">
                            <label>密码</label>
                            <input class="form-control" type="password" v-validate:password="{ required: true, maxlength: 30 }" v-model="updatePasswordForm.password">
                        </div>
                        <div class="clearfix">
                            <button class="btn btn-primary pull-right" type="submit" :disabled="$passwordValidation.invalid" v-loading-button="isUpdatePasswordInProgress">保存</button>
                        </div>
                    </form>
                </validator>
            </div>
        </div>
        <div class="row">
            <h2 class="header-dividing">查看权限</h2>
            <div class="col-lg-offset-3 col-lg-6">
                <flat-permissions :readonly="true" v-ref:flat-permissions></flat-permissions>
            </div>
        </div>
    </div>
</template>
<script>
    import Vue from 'vue';
    import _ from 'lodash';

    import CurrentUserMixin from '../../js/current-user-mixin';
    import FlatPermissions from './flat-permissions.vue';
    import RPC from '../../../rest-json-rpc/js/rest-json-rpc';
    import failHandler from '../../../fail-handler/js/fail-handler';

    export default {
        mixins: [CurrentUserMixin()],

        data() {
            return {
                isUpdateInProgress: false,
                isUpdatePasswordInProgress: false,
                updateForm: {
                    nickname: ''
                },
                updatePasswordForm: {
                    password: ''
                }
            };
        },

        events: {
            'user.currentUserLoaded': (vm) => {
                vm.updateForm.nickname = vm.currentUser.nickname;
                vm.$refs.flatPermissions.load(vm.currentUser);
            }
        },

        methods: {
            update() {
                const that = this;
                that.isUpdateInProgress = true;
                RPC.call('user.update', _.merge(_.pick(that.updateForm, ['nickname']), {
                    id: that.currentUser.id
                }))
                        .always(() => {
                            that.isUpdateInProgress = false;
                        })
                        .then(failHandler(that))
                        .then(() => {
                            that.$dispatch('alertOk', '已保存');
                        });
            },

            updatePassword() {
                const that = this;
                that.isUpdatePasswordInProgress = true;
                RPC.call('user.update_password', _.merge(_.pick(that.updatePasswordForm, ['password']), {
                    id: that.currentUser.id
                }))
                        .always(() => {
                            that.isUpdatePasswordInProgress = false;
                        })
                        .then(failHandler(that))
                        .then(() => {
                            that.$dispatch('alertOk', '已修改');
                        });
            }
        },

        components: {
            flatPermissions: FlatPermissions
        }
    }
</script>
