'use strict';

import $ from 'jquery';
import Vue from 'vue';

Vue.directive('loading-button', {
    bind() {
        $(this.el).data('loading-text', '进行中...');
    },

    update(isLoading) {
        $(this.el).button(isLoading ? 'loading' : 'reset');
    }
});
