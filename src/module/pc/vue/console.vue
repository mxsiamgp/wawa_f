<template>
    <!-- 导航 -->
    <nav class="navbar navbar-inverse" role="navigation">
        <div class="container-fluid">
            <div class="navbar-header">
                <a class="navbar-brand" href="#">控制台</a>
            </div>
            <div class="collapse navbar-collapse">
                <ul class="nav navbar-nav navbar-right">
                    <li><a v-link="{ path: '/console/user/pc/profile' }">{{currentUser.nickname}}</a></li>
                    <li><a href="#" @click.prevent="logout">注销</a></li>
                </ul>
            </div>
        </div>
    </nav>

    <div class="container-fluid">
        <div class="row">
            <div class="col-lg-2">
                <!-- 功能菜单 -->
                <nav class="menu" v-menu>
                    <ul class="nav nav-primary">
                        <li class="nav-parent" v-for="fnCls in functions">
                            <a href="#">{{fnCls.className}}</a>
                            <ul class="nav">
                                <li v-for="fn in fnCls.functions"><a v-link="{ path: fn.link.path }">{{fn.name}}</a></li>
                            </ul>
                        </li>
                    </ul>
                </nav>
            </div>
            <div class="col-lg-10">
                <!-- 内容区 -->
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>
<script>
    import $ from 'jquery';

    import CurrentUserMixin from '../../user/js/current-user-mixin';
    import RPC from '../../rest-json-rpc/js/rest-json-rpc';
    import StatusCode from '../../rest-json-rpc/js/status-code';
    import failHandler from '../../fail-handler/js/fail-handler';
    import functions from '../js/functions';

    export default {
        mixins: [CurrentUserMixin()],

        data() {
            return {
                functions
            };
        },

        methods: {
            logout() {
                const that = this;
                RPC.call('user.logout', {})
                        .then(failHandler(that))
                        .then(() => {
                            RPC.call('user.get_current_user', {})
                                    .then(failHandler(that));
                        });
            }
        }
    }
</script>
