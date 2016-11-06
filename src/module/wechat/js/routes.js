'use strict';

import competitionRoutes from '../../competition/js/wechat/routes';
import orderRoutes from '../../order/js/wechat/routes';
import userRoutes from '../../user/js/wechat/routes';

/*
 所有模块路由

 模块路由规范：
 export default {
    // ? 路由
    routes: {},

    // ? 重定向路由
    redirectRoutes: {},

    // ? 控制台
    consoleSubRoutes: {}
 };
 */
export default [
    competitionRoutes,
    orderRoutes,
    userRoutes,
];
