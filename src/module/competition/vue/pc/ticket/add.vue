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
                                <label>价钱</label>
                                <div class="input-group">
                                    <input class="form-control" type="number" v-validate:price-yuan="{ required: true, min: 1 }" v-model="priceYuan">
                                    <span class="input-group-addon">.00</span>
                                </div>
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
                    priceFee: 100
                }
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
            load() {
                $(this.$els.modal).modal('show');
            },

            add() {
                this.tickets.push(_.cloneDeep(_.pick(this.form, ['name', 'description', 'priceFee'])));
                $(this.$els.modal).modal('hide');
            }
        }

    };
</script>