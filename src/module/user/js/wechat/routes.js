'use strict';

import Login from '../../vue/wechat/login.vue';
import Register from '../../vue/wechat/register.vue';
import RetakePassword from '../../vue/wechat/retake-password.vue';
import Update from '../../vue/wechat/update.vue';
import UpdatePassword from '../../vue/wechat/update-password.vue';

export default {

    routes: {
        '/user/wechat/register': {
            component: Register
        },
        '/user/wechat/login': {
            component: Login
        },
        '/user/wechat/retake-password': {
            component: RetakePassword
        }
    },

    consoleSubRoutes: {
        '/user/wechat/update': {
            component: Update
        },
        '/user/wechat/update-password': {
            component: UpdatePassword
        }
    }

};
