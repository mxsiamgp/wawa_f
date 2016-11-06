<template>
    <h1 class="header-dividing">添加赛事</h1>
    <div class="container">
        <div class="row">
            <div class="col-lg-12">
                <validator name="validation">
                    <form @submit.prevent="add">
                        <div class="form-group" :class="{ 'has-error': $validation.name.invalid }">
                            <label>赛事名</label>
                            <input class="form-control" v-validate:name="{ required: true }" v-model="form.name">
                        </div>
                        <div class="form-group" :class="{ 'has-error': form.tickets.length === 0 }">
                            <label>门票</label>
                            <ticket-table :tickets.sync="form.tickets"></ticket-table>
                        </div>
                        <div>
                            <button class="btn btn-warning btn-block" type="submit" :disabled="$validation.invalid || form.tickets.length === 0" v-loading-button="isInProgress">添加</button>
                        </div>
                    </form>
                </validator>
            </div>
        </div>
    </div>
</template>
<script>
    import $ from 'jquery';

    import RPC from '../../../rest-json-rpc/js/rest-json-rpc';
    import TicketTable from './ticket/table.vue';
    import failHandler from '../../../fail-handler/js/fail-handler';

    export default {
        data() {
            return {
                form: {
                    name: '',
                    tickets: []
                },
                isInProgress: false
            };
        },

        methods: {
            add() {
                const that = this;
                that.isInProgress = true;
                RPC.call('competition.add', _.pick(that.form, ['name', 'tickets']))
                        .always(() => {
                            that.isInProgress = false;
                        })
                        .then(failHandler(that))
                        .then(() => {
                            that.$dispatch('alertOk', '已添加');
                        });
            }
        },

        components: {
            TicketTable
        }
    }
</script>
