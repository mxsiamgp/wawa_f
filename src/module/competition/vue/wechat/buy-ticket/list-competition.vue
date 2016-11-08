<template>
    <group title="选择赛事">
        <cell :title="competition.name" is-link v-link="ticketListLink(competition.id)" v-for="competition in competitions"></cell>
    </group>
</template>
<script>
    import RPC from '../../../../rest-json-rpc/js/rest-json-rpc';
    import failHandler from '../../../../fail-handler/js/fail-handler';

    export default {
        data() {
            return {
                competitions: []
            };
        },

        methods: {
            ticketListLink(competitionId) {
                return {
                    path: `/console/competition/wechat/buy-ticket/competition/${competitionId}/ticket/list`
                };
            }
        },

        ready() {
            const that = this;
            RPC.call('competition.list_in_progress', {})
                    .then(failHandler(that))
                    .then((res) => {
                        that.competitions = res.result;
                    });
        }
    };
</script>
