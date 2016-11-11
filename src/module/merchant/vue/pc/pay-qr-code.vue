<template>
    <div class="modal fade" v-el:modal>
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span><span class="sr-only">关闭</span></button>
                    <h3 class="modal-title">商家支付二维码</h3>
                </div>
                <div class="modal-body">
                    <div class="input-group">
                        <select class="form-control" v-model="competitionId">
                            <option :value="competition.id" v-for="competition in competitions">{{competition.name}}</option>
                        </select>
                        <span class="input-group-btn">
                            <button class="btn" @click.prevent="generate">生成</button>
                        </span>
                    </div>
                    <div style="text-align: center">
                        <img :src="qrCodeUrl">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import URI from 'urijs';
    import $ from 'jquery';

    import RPC from '../../../rest-json-rpc/js/rest-json-rpc';
    import failHandler from '../../../fail-handler/js/fail-handler';

    export default {
        data() {
            return {
                competitionId: null,
                competitions: [],
                merchantId: null,
                qrCodeUrl: ''
            };
        },

        methods: {
            load(merchantId) {
                this.merchantId = merchantId;
                $(this.$els.modal).modal('show');
            },

            generate() {
                this.qrCodeUrl = new URI({
                    protocol: 'http',
                    hostname: 'pan.baidu.com'
                }).pathname('/share/qrcode').query({
                    w: 320,
                    h: 320,
                    url: JSON.stringify({
                        competitionId: this.competitionId,
                        merchantId: this.merchantId
                    })
                }).toString();
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
