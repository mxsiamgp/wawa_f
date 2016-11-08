'use strict';

import BuyTicketListCompetition from '../../vue/wechat/buy-ticket/list-competition.vue';
import BuyTicketListTicket from '../../vue/wechat/buy-ticket/list-ticket.vue';
import InspectTicketListCompetition from '../../vue/wechat/inspect-ticket/list-competition.vue';
import InspectTicketInspect from '../../vue/wechat/inspect-ticket/inspect.vue';

export default {

    consoleSubRoutes: {
        '/competition/wechat/buy-ticket/competition/list': {
            component: BuyTicketListCompetition
        },
        '/competition/wechat/buy-ticket/competition/:competitionId/ticket/list': {
            component: BuyTicketListTicket
        },
        '/competition/wechat/inspect-ticket/competition/list': {
            component: InspectTicketListCompetition
        },
        '/competition/wechat/inspect-ticket/competition/:competitionId/inspect': {
            component: InspectTicketInspect
        }
    }

};
