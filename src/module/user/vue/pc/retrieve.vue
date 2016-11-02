<template>
    <div class="panel">
        <div class="panel-heading">
            <validator name="validation">
                <form @submit.prevent="retrieve">
                    <div class="container">
                        <div class="row">
                            <div class="col-lg-6">
                                <div class="form-group" :class="{ 'has-error': $validation.name.invalid }">
                                    <label>用户名</label>
                                    <input class="form-control" v-model="form.name">
                                </div>
                            </div>
                            <div class="col-lg-6">
                                <div class="form-group" :class="{ 'has-error': $validation.nickname.invalid }">
                                    <label>昵称</label>
                                    <input class="form-control" v-model="form.nickname">
                                </div>
                                <div class="clearfix">
                                    <button class="btn btn-primary pull-right" type="submit" :disabled="$validation.invalid || !hasPermissions(['USER.RETRIEVE'])" v-loading-button="isRetrieveInProgress">检索</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </validator>
        </div>
        <div class="panel-body">
            <table class="table table-striped">
                <thead>
                <tr>
                    <th>用户名</th>
                    <th>昵称</th>
                    <th>操作</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="user in users">
                    <td>{{user.name}}</td>
                    <td>{{user.nickname}}</td>
                    <td>
                        <button class="btn btn-primary btn-sm" :disabled="!hasPermissions(['USER.MODIFY'])" @click.prevent="editFlatPermissions(user.id)">编辑权限</button>
                        <button class="btn btn-danger btn-sm" :disabled="!hasPermissions(['USER.MODIFY'])" v-confirm-button="{ confirm: $refs.deleteConfirmModal, action: deleteCarried(user) }">删除</button>
                    </td>
                </tr>
                </tbody>
            </table>
            <div class="container">
                <div class="row">
                    <div class="col-lg-offset-3 col-lg-6">
                        <button class="btn btn-primary btn-block" @click.prevent="next('isNextInProgress')" v-if="!!lastId" v-loading-button="isNextInProgress">查看更多</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <edit-flat-permissions v-ref:edit-flat-permissions></edit-flat-permissions>
    <confirm-modal title="提示" content="确认要删除这个用户？" v-ref:delete-confirm-modal></confirm-modal>
</template>
<script>
    import Vue from 'vue';
    import _ from 'lodash';

    import CurrentUserMixin from '../../js/current-user-mixin';
    import EditFlatPermissions from './edit-flat-permissions.vue';
    import RPC from '../../../rest-json-rpc/js/rest-json-rpc';
    import failHandler from '../../../fail-handler/js/fail-handler';

    let lastForm = null;

    export default {
        mixins: [CurrentUserMixin()],

        data() {
            return {
                form: {
                    name: '',
                    nickname: ''
                },
                isRetrieveInProgress: false,
                isNextInProgress: false,
                lastId: null,
                users: []
            };
        },

        methods: {
            retrieve() {
                const that = this;
                lastForm = _.cloneDeep(_.pick(that.form, ['name', 'nickname']));
                that.lastId = null;
                that.users = [];
                that.next('isRetrieveInProgress');
            },

            next(isInProgressProp) {
                const that = this;
                Vue.set(that, isInProgressProp, true);
                RPC.call('user.retrieve', _.merge(lastForm, {
                    lastId: that.lastId
                }))
                        .always(() => {
                            Vue.set(that, isInProgressProp, false);
                        })
                        .then(failHandler(that))
                        .then((res) => {
                            const users = res.result;
                            if (users.length) {
                                that.lastId = _.last(users).id;
                            }
                            that.users.push(...users);
                        });
            },

            editFlatPermissions(id) {
                this.$refs.editFlatPermissions.load(id);
            },

            deleteCarried(user) {
                const that = this;
                return (confirm) => {
                    RPC.call('user.delete', {
                        id: user.id
                    })
                            .then(failHandler(that))
                            .then(() => {
                                that.users.$remove(user);
                                that.$dispatch('alertOk', '已删除');
                                confirm.close();
                            });
                }
            }
        },

        components: {
            editFlatPermissions: EditFlatPermissions
        }
    }
</script>
