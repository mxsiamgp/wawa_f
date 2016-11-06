<template>
    <h1 class="header-dividing">编辑赛事</h1>
    <div class="container">
        <div class="row">
            <div class="col-lg-12">
                <validator name="validation">
                    <form @submit.prevent="save">
                        <div class="form-group" :class="{ 'has-error': $validation.name.invalid }">
                            <label>赛事名</label>
                            <input class="form-control" readonly v-validate:name="{ required: true }" v-model="form.name">
                        </div>
                        <div class="form-group" :class="{ 'has-error': form.tickets.length === 0 }">
                            <label>门票</label>
                            <ticket-table :tickets.sync="form.tickets"></ticket-table>
                        </div>
                        <div>
                            <button class="btn btn-primary btn-block" type="submit" :disabled="$validation.invalid || form.tickets.length === 0" v-loading-button="isInProgress">保存</button>
                        </div>
                    </form>
                </validator>
            </div>
        </div>
    </div>
</template>
<script>
    import _ from 'lodash';

    import RPC from '../../../rest-json-rpc/js/rest-json-rpc';
    import TicketTable from './ticket/table.vue';
    import failHandler from '../../../fail-handler/js/fail-handler';

    export default {
        data() {
            return {
                form: {
                    id: '',
                    name: '',
                    tickets: []
                },
                isInProgress: false
            };
        },

        methods: {
            save() {
                const that = this;
                that.isInProgress = true;
                RPC.call('competition.update_tickets', _.pick(that.form, ['id', 'tickets']))
                        .always(() => {
                            that.isInProgress = false;
                        })
                        .then(failHandler(that))
                        .then(() => {
                            that.$dispatch('alertOk', '已保存');
                        });
            }
        },

        ready() {
            const that = this;
            that.isInProgress = true;
            RPC.call('competition.get', {
                id: that.$route.params.id
            })
                    .always(() => {
                        that.isInProgress = false;
                    })
                    .then(failHandler(that))
                    .then((res) => {
                        _.assign(that.form, _.pick(res.result, ['id', 'name', 'tickets']));
                    });
        },

        components: {
            TicketTable
        }
    }
</script>
