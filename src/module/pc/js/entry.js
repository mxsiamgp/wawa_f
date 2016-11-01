'use strict';

import {} from 'zui/dist/css/zui.css';
import {} from 'zui/dist/css/zui-theme.css';
import {} from 'zui/dist/js/zui';
import Vue from 'vue';
import VueRouter from 'vue-router';
import VueValidator from 'vue-validator';
import $ from 'jquery';
import _ from 'lodash';

import {} from '../../vue/js/vue';
import {} from '../../vue-zui/js/vue-zui';
import {} from '../../vue-validator/js/vue-validator';
import Console from '../vue/console.vue';
import routes from './routes';

const rootRoutes = {
    routes: {
        '/console': {
            component: Console
        }
    },
    redirectRoutes: {
        '/': '/console'
    }
};

routes.unshift(rootRoutes);
rootRoutes.routes['/console'].subRoutes = _.merge(..._.map(routes, 'consoleSubRoutes'));

Vue.use(VueRouter);
Vue.use(VueValidator);

const router = new VueRouter();

const app = Vue.extend({
    events: {
        alertOk(msg) {
            $.zui.messager.show(msg, {
                type: 'success'
            });
        },

        alertFail(msg) {
            $.zui.messager.show(msg, {
                type: 'danger'
            });
        },

        notLoggedIn() {
            router.replace('/user/pc/login');
        }
    }
});

router.map(_.merge(..._.map(routes, 'routes')));
router.redirect(_.merge(..._.map(routes, 'redirectRoutes')));

router.start(app, 'body');
