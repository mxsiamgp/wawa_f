'use strict';

import AlertFailMessages from './alert-fail-messages';
import StatusCode from '../../rest-json-rpc/js/status-code';

export default function (vm, res) {
    if (res.statusCode === StatusCode.FAIL) {
        const msg = AlertFailMessages[res.failCode];
        if (msg) {
            vm.$dispatch('alertFail', msg);
            throw new Error(res.failCode);
        }
    }
}
