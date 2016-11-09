<template>
    <div class="modal fade" v-el:modal>
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span><span class="sr-only">关闭</span></button>
                    <h3 class="modal-title">添加门票</h3>
                </div>
                <div class="modal-body">
                    <validator name="validation">
                        <form @submit.prevent="add">
                            <div class="form-group" :class="{ 'has-error': $validation.name.invalid }">
                                <label>门票名</label>
                                <input class="form-control" v-validate:name="{ required: true }" v-model="form.name">
                            </div>
                            <div class="form-group">
                                <label>描述</label>
                                <input class="form-control" v-model="form.description">
                            </div>
                            <div class="form-group" :class="{ 'has-error': $validation.priceYuan.invalid }">
                                <label>金额</label>
                                <input class="form-control" v-validate:price-yuan="{ required: true }" v-model="form.priceYuan">
                            </div>
                            <div>
                                <button class="btn btn-warning btn-block" type="submit" :disabled="$validation.invalid">添加</button>
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
        props: ['tickets'],

        data() {
            return {
                form: {
                    name: '',
                    description: '',
                    priceYuan: '0.00'
                }
            };
        },

        methods: {
            load() {
                $(this.$els.modal).modal('show');
            },

            add() {
                if (!/^\d+(\.\d{1,2})?$/.test(this.form.priceYuan)) {
                    this.$dispatch('alertFail', '请填写正确的金额');
                    return;
                }
                const priceFee = new BigNumber(this.form.priceYuan).mul(100);
                if (priceFee.isZero()) {
                    this.$dispatch('alertFail', '金额不能为0.00');
                    return;
                }

                this.tickets.push(_.merge(_.pick(this.form, ['name', 'description']), {
                    priceFee: priceFee.toNumber()
                }));
                $(this.$els.modal).modal('hide');
            }
        }

    };
</script>