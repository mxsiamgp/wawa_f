'use strict';

import {} from 'vux/dist/vux.css';

import {} from 'vux';
import FastClick from 'fastclick';
import Vue from 'vue';
import VueRouter from 'vue-router';
import VueValidator from 'vue-validator';
import _ from 'lodash';

import {} from '../../vue/js/vue';
import {} from '../../vux/js/vux';
import Settings from '../vue/settings.vue';
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
    },
    consoleSubRoutes: {
        '/wechat/settings': {
            component: Settings
        }
    }
};

routes.unshift(rootRoutes);
rootRoutes.routes['/console'].subRoutes = _.merge(..._.map(routes, 'consoleSubRoutes'));

Vue.use(VueRouter);
Vue.use(VueValidator);

const router = new VueRouter();

const app = Vue.extend({
    data() {
        return {
            alert: {
                isShown: false,
                message: ''
            }
        };
    },

    events: {
        alertOk(msg) {
            router.app.alertMessage(msg);
        },

        alertFail(msg) {
            router.app.alertMessage(msg);
        },

        notLoggedIn() {
            router.replace('/user/wechat/login');
        }
    },

    methods: {
        alertMessage(msg) {
            this.alert.message = msg;
            this.alert.isShown = true;
        }
    }
});

router.map(_.merge(..._.map(routes, 'routes')));
router.redirect(_.merge(..._.map(routes, 'redirectRoutes')));

router.start(app, 'body');

FastClick.attach(document.body);
