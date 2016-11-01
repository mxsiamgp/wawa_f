'use strict';

import StatusCode from '../../rest-json-rpc/js/status-code';
import UserFailCode from '../../user/js/fail-code';

export default function (vm, res) {
    if (res.statusCode === StatusCode.FAIL) {
        switch (res.failCode) {
            case UserFailCode.USER_NOT_LOGGED_IN:
                vm.$dispatch('notLoggedIn');
                throw new Error(res.failCode);
            case UserFailCode.WECHAT_AUTH_REDIRECT:
                window.location.href = res.failDetail.location;
                throw new Error(res.failCode);
        }
    }
}
