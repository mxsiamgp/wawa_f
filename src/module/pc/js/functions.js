'use strict';

import _ from 'lodash';

import competitionFunctions from '../../competition/js/pc/functions';
import merchantFunctions from '../../merchant/js/pc/functions';
import userFunctions from '../../user/js/pc/functions';

/*
 所有模块功能

 模块功能规范：
 export default [
    {
        // + 分类名称
        className: '',

        // + 功能集
        functions: [
            {
                // + 功能名称
                name: '',

                // + 功能链接
                link: {
                    // + 功能链接路径
                    path: ''
                }
            }
        ]
    }
 ];
 */
export default _.flatten([
    merchantFunctions,
    competitionFunctions,
    userFunctions
]);
