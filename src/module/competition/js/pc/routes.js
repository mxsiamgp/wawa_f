'use strict';

import Add from '../../vue/pc/add.vue';
import Edit from '../../vue/pc/edit.vue';
import Master from '../../vue/pc/master.vue';

export default {

    consoleSubRoutes: {
        '/competition/pc/add': {
            component: Add
        },
        '/competition/:id/pc/edit': {
            component: Edit
        },
        '/competition/pc/master': {
            component: Master
        }
    }

};
