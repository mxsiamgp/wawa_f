<template>
    <group title="基本信息">
        <form @submit.prevent="update">
            <x-input title="昵称" placeholder="1-30位任意字符串" :max="30" :value.sync="form.nickname" v-ref:nickname></x-input>
            <box gap="10px 10px">
                <x-button type="primary" :disabled="!$refs.nickname.valid || isInProgress">保存</x-button>
            </box>
        </form>
    </group>
</template>
<script>
    import Vue from 'vue';
    import _ from 'lodash';

    import CurrentUserMixin from '../../js/current-user-mixin';
    import RPC from '../../../rest-json-rpc/js/rest-json-rpc';
    import failHandler from '../../../fail-handler/js/fail-handler';

    export default {
        mixins: [CurrentUserMixin('user.get_current_wechat_user')],

        data() {
            return {
                form: {
                    nickname: ''
                },
                isInProgress: false
            };
        },

        events: {
            'user.currentUserLoaded': (vm) => {
                vm.form.nickname = vm.currentUser.nickname;
            }
        },

        methods: {
            update() {
                const that = this;
                that.isInProgress = true;
                RPC.call('user.update', _.merge(_.pick(that.form, ['nickname']), {
                    id: that.currentUser.id
                }))
                        .always(() => {
                            that.isInProgress = false;
                        })
                        .then(failHandler(that))
                        .then(() => {
                            that.$router.replace('/console/wechat/settings');
                        });
            }
        }
    }
</script>
