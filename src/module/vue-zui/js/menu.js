'use strict';

import $ from 'jquery';
import Vue from 'vue';

Vue.directive('menu', {
    bind() {
        $(this.el).menu();
    }
});
