<template>
    <validator name="validation">
        <form @submit.prevent="grant">
            <table class="table table-striped">
                <thead>
                <tr>
                    <th>权限类</th>
                    <th>权限集</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="permCls in flatPermissionClasses">
                    <td>{{permCls.name}}</td>
                    <td>
                        <div class="form-group">
                            <label class="checkbox-inline" v-for="perm in permCls.flatPermissions">
                                <input type="checkbox" :value="perm.value" v-model="flatPermissions" :disabled="readonly || !hasPermissions([perm.value])"> {{perm.name}}
                            </label>
                        </div>
                    </td>
                </tr>
                </tbody>
            </table>
            <div class="clearfix">
                <button class="btn btn-primary pull-right" type="submit" :disabled="$validation.invalid" v-if="!readonly" v-loading-button="isGrantInProgress">保存</button>
            </div>
        </form>
    </validator>
</template>
<script>
    import CurrentUserMixin from '../../js/current-user-mixin';
    import RPC from '../../../rest-json-rpc/js/rest-json-rpc';
    import failHandler from '../../../fail-handler/js/fail-handler';

    export default {
        mixins: [CurrentUserMixin()],

        props: ['readonly'],

        data() {
            return {
                flatPermissionClasses: [
                    {
                        name: '赛事验票',
                        flatPermissions: [
                            {
                                name: '验票',
                                value: 'COMPETITION.DRAWN_TICKET.INSPECT'
                            }
                        ]
                    },
                    {
                        name: '商家员工管理',
                        flatPermissions: [
                            {
                                name: '检索',
                                value: 'MERCHANT.STAFF.RETRIEVE'
                            }, {
                                name: '修改',
                                value: 'MERCHANT.STAFF.MODIFY'
                            }
                        ]
                    },
                    {
                        name: '商家管理',
                        flatPermissions: [
                            {
                                name: '检索',
                                value: 'MERCHANT.RETRIEVE'
                            }, {
                                name: '修改',
                                value: 'MERCHANT.MODIFY'
                            }
                        ]
                    },
                    {
                        name: '赛事管理',
                        flatPermissions: [
                            {
                                name: '检索',
                                value: 'COMPETITION.RETRIEVE'
                            }, {
                                name: '修改',
                                value: 'COMPETITION.MODIFY'
                            }
                        ]
                    },
                    {
                        name: '用户管理',
                        flatPermissions: [
                            {
                                name: '检索',
                                value: 'USER.RETRIEVE'
                            }, {
                                name: '修改',
                                value: 'USER.MODIFY'
                            }
                        ]
                    },
                ],
                flatPermissions: [],
                isGrantInProgress: false,
                user: null,
            };
        },

        methods: {
            load(user) {
                this.user = user;
                this.flatPermissions = user.flatPermissions;
            },

            grant() {
                const that = this;
                that.isGrantInProgress = true;
                RPC.call('user.grant_flat_permissions', {
                    granterId: that.currentUser.id,
                    granteeId: that.user.id,
                    flatPermissions: that.flatPermissions
                })
                        .always(() => {
                            that.isGrantInProgress = false;
                        })
                        .then(failHandler(that))
                        .then(() => {
                            that.$dispatch('alertOk', '已授权');
                        });
            }
        }
    }
</script>
