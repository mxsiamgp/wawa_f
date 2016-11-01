<template>
    <div class="modal fade" v-el:modal>
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span><span class="sr-only">关闭</span></button>
                    <h3 class="modal-title">编辑权限</h3>
                </div>
                <div class="modal-body">
                    <flat-permissions :readonly="false" v-ref:flat-permissions></flat-permissions>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import $ from 'jquery';

    import FlatPermissions from './flat-permissions.vue';
    import RPC from '../../../rest-json-rpc/js/rest-json-rpc';
    import failHandler from '../../../fail-handler/js/fail-handler';

    export default {
        methods: {
            load(id) {
                const that = this;
                RPC.call('user.get', {
                    id
                })
                        .then(failHandler(that))
                        .then((res) => {
                            that.$refs.flatPermissions.load(res.result);
                            $(that.$els.modal).modal('show');
                        });
            }
        },

        components: {
            flatPermissions: FlatPermissions
        }
    }
</script>
