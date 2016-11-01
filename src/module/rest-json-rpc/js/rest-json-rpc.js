'use strict';

import URI from 'urijs';
import $ from 'jquery';
import _ from 'lodash';

function xCaseObject(obj, caseFn) {
    if (_.isPlainObject(obj)) {
        const result = {};
        _.forEach(obj, (v, k) => {
            result[caseFn(k)] = xCaseObject(v, caseFn);
        });
        return result;
    } else if (_.isArray(obj)) {
        return _.map(obj, (elem) => {
            return xCaseObject(elem, caseFn);
        });
    } else {
        return obj;
    }
}

export default {

    call(proc, param, opts) {
        opts = _.merge(opts, {
            timeout: 30000
        });
        return $.ajax({
            cache: false,
            contentType: 'application/json',
            crossDomain: true,
            data: JSON.stringify(xCaseObject(param, _.snakeCase)),
            dataType: 'json',
            processData: false,
            timeout: opts.timeout,
            type: 'POST',
            url: new URI({
                protocol: 'http',
                hostname: '/* @echo config.module.rest_json_rpc.hostname */',
                port: '/* @echo config.module.rest_json_rpc.port */'
            }).pathname('/rest_json_rpc').query({
                process: proc
            }).toString(),
            xhrFields: {
                withCredentials: true
            }
        })
            .then((res) => {
                return xCaseObject(res, _.camelCase);
            });
    }

};
