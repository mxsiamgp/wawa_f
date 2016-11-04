<template>
    <div class="modal fade" v-el:modal>
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span><span class="sr-only">关闭</span></button>
                    <h3 class="modal-title">拉入员工</h3>
                </div>
                <div class="modal-body">
                    <validator name="validation">
                        <form @submit.prevent="pullInStaff">
                            <div class="form-group" :class="{ 'has-error': $validation.name.invalid }">
                                <label>员工用户名</label>
                                <input class="form-control" v-validate:name="{ required: true }" v-model="form.name">
                            </div>
                            <div>
                                <button class="btn btn-warning btn-block" type="submit" :disabled="$validation.invalid" v-loading-button="isInProgress">拉入</button>
                            </div>
                        </form>
                    </validator>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import $ from 'jquery';
    import _ from 'lodash';

    import CurrentMerchantMixin from '../../../js/current-merchant-mixin';
    import RPC from '../../../../rest-json-rpc/js/rest-json-rpc';
    import failHandler from '../../../../fail-handler/js/fail-handler';

    export default {
        mixins: [CurrentMerchantMixin],

        data() {
            return {
                form: {
                    name: ''
                },
                isInProgress: false
            };
        },

        methods: {
            load() {
                $(this.$els.modal).modal('show');
            },

            pullInStaff() {
                const that = this;
                that.isInProgress = true;
                RPC.call('merchant.pull_in_staff', _.merge(_.pick(that.form, ['name']), {
                    merchantId: that.currentMerchant.id
                }))
                        .always(() => {
                            that.isInProgress = false;
                        })
                        .then(failHandler(that))
                        .then(() => {
                            that.$dispatch('alertOk', '已拉入');
                        });
            }
        }
    };
</script>