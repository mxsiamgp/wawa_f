'use strict';

import Master from '../../vue/pc/master.vue';
import StaffMaster from '../../vue/pc/staff/master.vue';

export default {

    consoleSubRoutes: {
        '/merchant/pc/master': {
            component: Master
        },
        '/merchant/pc/staff/master': {
            component: StaffMaster
        }
    }

};
