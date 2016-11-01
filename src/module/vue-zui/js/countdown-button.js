'use strict';

import Vue from 'vue';
import $ from 'jquery';
import _ from 'lodash';

Vue.directive('countdown-button', {
    bind() {
        const name = _.camelCase(this.arg);

        const $el = $(this.el);

        const model = {
            loading: false,
            timeout: 0,
            disabled: false
        };

        Vue.set(this.vm, name, model);
        this.vm.$watch(`${name}.loading || !!${name}.timeout`, (d) => {
            model.disabled = d;
        });

        function decrementTimeout() {
            if (model.timeout) {
                --model.timeout;
            }
            if (model.timeout) {
                setTimeout(decrementTimeout, 1000);
            }
        }

        function actionCallback(start) {
            if (start) {
                model.timeout = $el.data('interval');
                setTimeout(decrementTimeout, 0);
            }
            model.loading = false;
        }

        $el.click(() => {
            if (model.loading || model.timeout) return;
            model.loading = true;
            $el.data('action')(actionCallback);
        });
    },

    update(arg) {
        const $el = $(this.el);
        $el.data('name', arg.name);
        $el.data('interval', arg.interval);
        $el.data('action', arg.action);
    }
});
