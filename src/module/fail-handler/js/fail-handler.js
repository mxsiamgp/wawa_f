'use strict';

import alertFailLogic from './alert-fail-logic';
import specialFailLogic from './special-fail-logic';

export default function (vm) {
    return function (res) {
        specialFailLogic(vm, res);
        alertFailLogic(vm, res);
        return res;
    };
}
