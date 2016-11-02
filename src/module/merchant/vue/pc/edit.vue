<template>
    <div class="modal fade" v-el:modal>
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span><span class="sr-only">关闭</span></button>
                    <h3 class="modal-title">编辑商家</h3>
                </div>
                <div class="modal-body">
                    <validator name="validation">
                        <form @submit.prevent="save">
                            <div class="form-group" :class="{ 'has-error': $validation.name.invalid }">
                                <label>商家店名</label>
                                <input class="form-control" v-validate:name="{ required: true }" v-model="form.name">
                            </div>
                            <div class="form-group">
                                <label>经营项目</label>
                                <input class="form-control" v-model="form.itemsOfBusiness">
                            </div>
                            <div class="form-group">
                                <label>联系人姓名</label>
                                <input class="form-control" v-model="form.contactsName">
                            </div>
                            <div class="form-group">
                                <label>联系人手机号码</label>
                                <input class="form-control" v-model="form.contactsMobile">
                            </div>
                            <div class="form-group">
                                <label>联系人身份证号码</label>
                                <input class="form-control" v-model="form.contactsIdCard">
                            </div>
                            <div class="form-group">
                                <label>联系人地址</label>
                                <input class="form-control" v-model="form.contactsAddress">
                            </div>
                            <div>
                                <button class="btn btn-primary btn-block" type="submit" :disabled="$validation.invalid" v-loading-button="isInProgress">保存</button>
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

    import RPC from '../../../rest-json-rpc/js/rest-json-rpc';
    import failHandler from '../../../fail-handler/js/fail-handler';

    export default {
        data() {
            return {
                form: {
                    id: '',
                    name: '',
                    itemsOfBusiness: '',
                    contactsName: '',
                    contactsMobile: '',
                    contactsIdCard: '',
                    contactsAddress: ''
                },
                isInProgress: false
            };
        },

        methods: {
            load(id) {
                const that = this;
                RPC.call('merchant.get', {
                    id
                })
                        .then(failHandler(that))
                        .then((res) => {
                            _.assign(that.form, res.result);
                            $(that.$els.modal).modal('show');
                        });
            },

            save() {
                const that = this;
                that.isInProgress = true;
                RPC.call('merchant.update', _.pick(that.form, ['id', 'name', 'itemsOfBusiness', 'contactsName', 'contactsMobile', 'contactsIdCard', 'contactsAddress']))
                        .always(() => {
                            that.isInProgress = false;
                        })
                        .then(failHandler(that))
                        .then(() => {
                            that.$dispatch('alertOk', '已保存');
                        });
            }
        }
    }
</script>
