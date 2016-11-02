'use strict';

import merchantRoutes from '../../merchant/js/pc/routes';
import userRoutes from '../../user/js/pc/routes';

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
    merchantRoutes,
    userRoutes
];
