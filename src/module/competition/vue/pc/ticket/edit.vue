<template>
    <div class="modal fade" v-el:modal>
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span><span class="sr-only">关闭</span></button>
                    <h3 class="modal-title">编辑门票</h3>
                </div>
                <div class="modal-body">
                    <validator name="validation">
                        <form @submit.prevent="save">
                            <div class="form-group" :class="{ 'has-error': $validation.name.invalid }">
                                <label>门票名</label>
                                <input class="form-control" v-validate:name="{ required: true }" v-model="form.name">
                            </div>
                            <div class="form-group">
                                <label>描述</label>
                                <input class="form-control" v-model="form.description">
                            </div>
                            <div class="form-group" :class="{ 'has-error': $validation.priceYuan.invalid }">
                                <label>价钱</label>
                                <div class="input-group">
                                    <input class="form-control" type="number" v-validate:price-yuan="{ required: true, min: 1 }" v-model="priceYuan">
                                    <span class="input-group-addon">.00</span>
                                </div>
                            </div>
                            <div>
                                <button class="btn btn-primary btn-block" type="submit" :disabled="$validation.invalid">保存</button>
                            </div>
                        </form>
                    </validator>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import BigNumber from 'bignumber.js';
    import $ from 'jquery';
    import _ from 'lodash';

    export default {
        data() {
            return {
                form: {
                    name: '',
                    description: '',
                    priceFee: 100
                },
                ticket: null
            };
        },

        computed: {
            priceYuan: {
                get() {
                    return new BigNumber(this.form.priceFee).div(100).toString();
                },
                set(v) {
                    this.form.priceFee = parseInt(v) * 100;
                }
            }
        },

        methods: {
            load(ticket) {
                console.log(ticket);
                _.assign(this.form, _.pick(ticket, ['name', 'description', 'priceFee']));
                this.ticket = ticket;
                $(this.$els.modal).modal('show');
            },

            save() {
                _.assign(this.ticket, _.pick(this.form, ['name', 'description', 'priceFee']));
                $(this.$els.modal).modal('hide');
            }
        }

    };
</script>