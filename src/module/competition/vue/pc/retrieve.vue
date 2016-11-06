<template>
    <div class="panel">
        <div class="panel-heading">
            <validator name="validation">
                <form @submit.prevent="retrieve">
                    <div class="container">
                        <div class="row">
                            <div class="col-lg-12">
                                <div class="form-group" :class="{ 'has-error': $validation.name.invalid }">
                                    <label>赛事名</label>
                                    <input class="form-control" v-model="form.name">
                                </div>
                                <div class="clearfix">
                                    <button class="btn btn-primary pull-right" type="submit" :disabled="$validation.invalid || !hasPermissions(['COMPETITION.RETRIEVE'])" v-loading-button="isRetrieveInProgress">检索</button>
                                    <a class="btn btn-warning pull-right" :disabled="$validation.invalid || !hasPermissions(['COMPETITION.MODIFY'])" v-link="{ path: '/console/competition/pc/add' }">添加</a>
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
                    <th>赛事名</th>
                    <th>操作</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="competition in competitions">
                    <td>{{competition.name}}</td>
                    <td>
                        <a class="btn btn-primary btn-sm" :disabled="!hasPermissions(['COMPETITION.MODIFY'])" v-link="{ path: `/console/competition/${competition.id}/pc/edit` }">编辑</a>
                        <button class="btn btn-danger btn-sm" :disabled="!hasPermissions(['COMPETITION.MODIFY'])" v-confirm-button="{ confirm: $refs.deleteConfirmModal, action: deleteCarried(competition) }">删除</button>
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
    <confirm-modal title="提示" content="确认要删除这个赛事？" v-ref:delete-confirm-modal></confirm-modal>
</template>
<script>
    import Vue from 'vue';
    import _ from 'lodash';

    import RPC from '../../../rest-json-rpc/js/rest-json-rpc';
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
                competitions: []
            };
        },

        methods: {
            retrieve() {
                const that = this;
                lastForm = _.cloneDeep(_.pick(that.form, ['name']));
                that.lastId = null;
                that.competitions = [];
                that.next('isRetrieveInProgress');
            },

            next(isInProgressProp) {
                const that = this;
                Vue.set(that, isInProgressProp, true);
                RPC.call('competition.retrieve', _.merge(lastForm, {
                    lastId: that.lastId
                }))
                        .always(() => {
                            Vue.set(that, isInProgressProp, false);
                        })
                        .then(failHandler(that))
                        .then((res) => {
                            const competitions = res.result;
                            if (competitions.length) {
                                that.lastId = _.last(competitions).id;
                            }
                            that.competitions.push(...competitions);
                        });
            },

            deleteCarried(competition) {
                const that = this;
                return (confirm) => {
                    RPC.call('competition.delete', {
                        id: competition.id
                    })
                            .then(failHandler(that))
                            .then(() => {
                                that.competitions.$remove(competition);
                                that.$dispatch('alertOk', '已删除');
                                confirm.close();
                            });
                }
            }
        }
    }
</script>
