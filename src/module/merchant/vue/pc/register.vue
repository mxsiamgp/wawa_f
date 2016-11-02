<template>
    <div class="modal fade" v-el:modal>
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span><span class="sr-only">关闭</span></button>
                    <h3 class="modal-title">注册商家</h3>
                </div>
                <div class="modal-body">
                    <validator name="validation">
                        <form @submit.prevent="register">
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
                                <button class="btn btn-warning btn-block" type="submit" :disabled="$validation.invalid" v-loading-button="isInProgress">注册</button>
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

    import RPC from '../../../rest-json-rpc/js/rest-json-rpc';
    import failHandler from '../../../fail-handler/js/fail-handler';

    export default {
        data() {
            return {
                form: {
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
            load() {
                $(this.$els.modal).modal('show');
            },

            register() {
                const that = this;
                that.isInProgress = true;
                RPC.call('merchant.register', _.pick(that.form, ['name', 'itemsOfBusiness', 'contactsName', 'contactsMobile', 'contactsIdCard', 'contactsAddress']))
                        .always(() => {
                            that.isInProgress = false;
                        })
                        .then(failHandler(that))
                        .then(() => {
                            that.$dispatch('alertOk', '注册成功');
                        });
            }
        }
    }
</script>
