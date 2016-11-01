'use strict';

import _ from 'lodash';

import RPC from '../../rest-json-rpc/js/rest-json-rpc';
import failHandler from '../../fail-handler/js/fail-handler';

export default (process = 'user.get_current_user') => {
    return {
        data() {
            return {
                currentUser: null
            };
        },

        methods: {
            // 判断当前用户是否有这些权限
            hasPermissions(perms) {
                return _.intersection(this.currentUser.flatPermissions, perms).length === perms.length;
            }
        },

        ready() {
            const that = this;
            RPC.call(process, {})
                .then(failHandler(that))
                .then((res) => {
                    that.currentUser = res.result;
                    that.$emit('user.currentUserLoaded', that);
                });
        }
    };
}
