'use strict';

import Login from '../../vue/pc/login.vue';
import Master from '../../vue/pc/master.vue';
import Profile from '../../vue/pc/profile.vue';
import Register from '../../vue/pc/register.vue';
import RetakePassword from '../../vue/pc/retake-password.vue';

export default {

    routes: {
        '/user/pc/register': {
            component: Register
        },
        '/user/pc/login': {
            component: Login
        },
        '/user/pc/retake-password': {
            component: RetakePassword
        }
    },

    consoleSubRoutes: {
        '/user/pc/profile': {
            component: Profile
        },
        '/user/pc/master': {
            component: Master
        }
    }

};
