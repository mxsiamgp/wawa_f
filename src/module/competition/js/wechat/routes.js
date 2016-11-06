'use strict';

import List from '../../vue/wechat/list.vue';
import TicketList from '../../vue/wechat/ticket/list.vue';

export default {

    consoleSubRoutes: {
        '/competition/wechat/list': {
            component: List
        },
        '/competition/:id/wechat/ticket/list': {
            component: TicketList
        }
    }

};
