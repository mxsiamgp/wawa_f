<template>
    <div class="panel">
        <div class="panel-heading">
            <validator name="validation">
                <form @submit.prevent="retrieve">
                    <div class="container">
                        <div class="row">
                            <div class="col-lg-12">
                                <div class="form-group" :class="{ 'has-error': $validation.name.invalid }">
                                    <label>用户名</label>
                                    <input class="form-control" v-model="form.name">
                                </div>
                                <div class="clearfix">
                                    <button class="btn btn-primary pull-right" type="submit" :disabled="$validation.invalid || !hasPermissions(['MERCHANT.STAFF.RETRIEVE'])" v-loading-button="isRetrieveInProgress">检索</button>
                                    <button class="btn btn-warning pull-right" :disabled="$validation.invalid || !hasPermissions(['MERCHANT.STAFF.MODIFY'])" @click.prevent="pullInStaff">拉入</button>
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
                        <button class="btn btn-danger btn-sm" :disabled="!hasPermissions(['MERCHANT.STAFF.MODIFY'])" v-confirm-button="{ confirm: $refs.kickOutStaffConfirmModal, action: kickOutStaffCarried(user) }">踢出</button>
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
    <pull-in-staff v-ref:pull-in-staff></pull-in-staff>
    <confirm-modal title="提示" content="确认要踢出这个员工？" v-ref:kick-out-staff-confirm-modal></confirm-modal>
</template>
<script>
    import Vue from 'vue';
    import _ from 'lodash';

    import CurrentMerchantMixin from '../../../js/current-merchant-mixin';
    import CurrentUserMixin from '../../../../user/js/current-user-mixin';
    import PullInStaff from './pull-in-staff.vue';
    import RPC from '../../../../rest-json-rpc/js/rest-json-rpc';
    import failHandler from '../../../../fail-handler/js/fail-handler';

    let lastForm = null;

    export default {
        mixins: [CurrentUserMixin(), CurrentMerchantMixin],

        data() {
            return {
                form: {
                    name: ''
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
                lastForm = _.cloneDeep(_.pick(that.form, ['name']));
                that.lastId = null;
                that.users = [];
                that.next('isRetrieveInProgress');
            },

            next(isInProgressProp) {
                const that = this;

                if (!that.currentMerchant) {
                    that.$dispatch('alertFail', '当前用户未绑定商家');
                    return;
                }

                Vue.set(that, isInProgressProp, true);
                RPC.call('merchant.retrieve_staffs', _.merge(lastForm, {
                    lastId: that.lastId,
                    merchantId: that.currentMerchant.id
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

            pullInStaff() {
                this.$refs.pullInStaff.load();
            },

            kickOutStaffCarried(user) {
                const that = this;
                return (confirm) => {
                    RPC.call('merchant.kick_out_staff', {
                        userId: user.id
                    })
                            .then(failHandler(that))
                            .then(() => {
                                that.users.$remove(user);
                                that.$dispatch('alertOk', '已踢出');
                                confirm.close();
                            });
                }
            }
        },

        components: {
            PullInStaff
        }
    }
</script>
