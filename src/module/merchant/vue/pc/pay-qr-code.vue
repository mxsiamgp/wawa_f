<template>
    <div class="modal fade" v-el:modal>
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span><span class="sr-only">关闭</span></button>
                    <h3 class="modal-title">商家支付二维码</h3>
                </div>
                <div class="modal-body">
                    <div style="text-align: center">
                        <img :src="url()">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import URI from 'urijs';
    import $ from 'jquery';

    export default {
        data() {
            return {
                merchantId: ''
            };
        },

        methods: {
            load(merchantId) {
                this.merchantId = merchantId;
                $(this.$els.modal).modal('show');
            },

            url() {
                return new URI({
                    protocol: 'http',
                    hostname: 'pan.baidu.com'
                }).pathname('/share/qrcode').query({
                    w: 320,
                    h: 320,
                    url: this.merchantId
                }).toString();
            }
        }
    };
</script>
