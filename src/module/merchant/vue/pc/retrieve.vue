<template>
    <div class="panel">
        <div class="panel-heading">
            <validator name="validation">
                <form @submit.prevent="retrieve">
                    <div class="container">
                        <div class="row">
                            <div class="col-lg-12">
                                <div class="form-group" :class="{ 'has-error': $validation.name.invalid }">
                                    <label for="field-name">商家店名</label>
                                    <input class="form-control" id="field-name" v-model="form.name">
                                </div>
                                <div class="clearfix">
                                    <button class="btn btn-primary pull-right" type="submit" :disabled="$validation.invalid || !hasPermissions(['MERCHANT.RETRIEVE'])" v-loading-button="isRetrieveInProgress">检索</button>
                                    <button class="btn btn-warning pull-right" :disabled="$validation.invalid || !hasPermissions(['MERCHANT.MODIFY'])" @click.prevent="register">注册</button>
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
                    <th>商家店名</th>
                    <th>经营项目</th>
                    <th>联系人姓名</th>
                    <th>联系人手机号码</th>
                    <th>联系人身份证号码</th>
                    <th>联系人地址</th>
                    <th>操作</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="merchant in merchants">
                    <td>{{merchant.name}}</td>
                    <td>{{merchant.itemsOfBusiness}}</td>
                    <td>{{merchant.contactsName}}</td>
                    <td>{{merchant.contactsMobile}}</td>
                    <td>{{merchant.contactsIdCard}}</td>
                    <td>{{merchant.contactsAddress}}</td>
                    <td>
                        <button class="btn btn-primary btn-sm" :disabled="!hasPermissions(['MERCHANT.MODIFY'])" @click.prevent="edit(merchant.id)">编辑</button>
                        <button class="btn btn-danger btn-sm" :disabled="!hasPermissions(['MERCHANT.MODIFY'])" v-confirm-button="{ confirm: $refs.deleteConfirmModal, action: deleteCarried(merchant) }">删除</button>
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
    <register v-ref:register></register>
    <edit v-ref:edit></edit>
    <confirm-modal title="提示" content="确认要删除这个商家？" v-ref:delete-confirm-modal></confirm-modal>
</template>
<script>
    import Vue from 'vue';
    import _ from 'lodash';

    import RPC from '../../../rest-json-rpc/js/rest-json-rpc';
    import Edit from './edit.vue';
    import Register from './register.vue';
    import failHandler from '../../../fail-handler/js/fail-handler';

    let lastForm = null;

    export default {
        data() {
            return {
                form: {
                    name: ''
                },
                isRetrieveInProgress: false,
                isNextInProgress: false,
                lastId: null,
                merchants: []
            };
        },

        methods: {
            retrieve() {
                const that = this;
                lastForm = _.cloneDeep(_.pick(that.form, ['name']));
                that.lastId = null;
                that.merchants = [];
                that.next('isRetrieveInProgress');
            },

            next(isInProgressProp) {
                const that = this;
                Vue.set(that, isInProgressProp, true);
                RPC.call('merchant.retrieve', _.merge(lastForm, {
                    lastId: that.lastId
                }))
                        .always(() => {
                            Vue.set(that, isInProgressProp, false);
                        })
                        .then(failHandler(that))
                        .then((res) => {
                            const merchants = res.result;
                            if (merchants.length) {
                                that.lastId = _.last(merchants).id;
                            }
                            that.merchants.push(...merchants);
                        });
            },

            deleteCarried(merchant) {
                const that = this;
                return (confirm) => {
                    RPC.call('merchant.delete', {
                        id: merchant.id
                    })
                            .then(failHandler(that))
                            .then(() => {
                                that.merchants.$remove(merchant);
                                that.$dispatch('alertOk', '已删除');
                                confirm.close();
                            });
                }
            },

            register() {
                this.$refs.register.load();
            },

            edit(id) {
                this.$refs.edit.load(id);
            }
        },

        components: {
            Edit,
            Register
        }
    }
</script>
