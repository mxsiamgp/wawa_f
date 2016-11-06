<template>
    <table class="table table-striped">
        <thead>
        <tr>
            <th>门票名</th>
            <th>描述</th>
            <th>价格</th>
            <th>操作</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="ticket in tickets">
            <td>{{ticket.name}}</td>
            <td>{{ticket.description}}</td>
            <td>{{`￥${new BigNumber(ticket.priceFee).dividedBy(100).toFormat(2)}`}}</td>
            <td>
                <button class="btn btn-primary" @click.prevent="edit(ticket)">编辑</button>
                <button class="btn btn-danger" @click.prevent="delete(ticket)">删除</button>
            </td>
        </tr>
        </tbody>
        <tfoot>
        <tr>
            <td colspan="4">
                <button class="btn btn-warning pull-right" @click.prevent="add">添加</button>
                <div class="clearfix"></div>
            </td>
        </tr>
        </tfoot>
    </table>
    <add :tickets.sync="tickets" v-ref:add></add>
    <edit v-ref:edit></edit>
</template>
<script>
    import BigNumber from 'bignumber.js';

    import Add from './add.vue';
    import Edit from './edit.vue';

    export default {
        props: ['tickets'],

        data() {
            return {
                BigNumber
            };
        },

        methods: {
            add() {
                this.$refs.add.load();
            },

            edit(ticket) {
                this.$refs.edit.load(ticket);
            },

            delete(ticket) {
                this.tickets.$remove(ticket);
            }
        },

        components: {
            Add,
            Edit
        }
    };
</script>