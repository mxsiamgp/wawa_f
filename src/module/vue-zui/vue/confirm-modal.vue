<template>
    <div class="modal fade" v-el:modal>
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span><span class="sr-only">关闭</span></button>
                    <h3 class="modal-title">{{title}}</h3>
                </div>
                <div class="modal-body">
                    {{content}}
                </div>
                <div class="modal-footer">
                    <button class="btn" data-dismiss="modal">取消</button>
                    <button class="btn btn-primary" @click.prevent="action(this)">确定</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import $ from 'jquery';

    export default {
        props: ['title', 'content'],

        data: () => {
            return {
                action: null
            };
        },

        methods: {
            confirm(act) {
                this.action = act;
                $(this.$els.modal).modal('show');
            },

            close() {
                $(this.$els.modal).modal('hide');
            }
        }
    }
</script>
