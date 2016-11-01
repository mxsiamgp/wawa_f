'use strict';

import $ from 'jquery';
import Vue from 'vue';

Vue.directive('confirm-button', {
    bind() {
        const $el = $(this.el);
        $el.click(() => {
            $el.data('confirm-modal').confirm($el.data('action'));
        });
    },

    update(arg) {
        const $el = $(this.el);
        $el.data('confirm-modal', arg.confirm);
        $el.data('action', arg.action);
    }
});
