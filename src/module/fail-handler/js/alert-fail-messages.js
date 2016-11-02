'use strict';

import MobileCaptchaFailCode from '../../mobile-captcha/js/fail-code';
import OrderFailCode from '../../order/js/fail-code';
import RestJsonRpcFailCode from '../../rest-json-rpc/js/fail-code';
import UserFailCode from '../../user/js/fail-code';

const M = module.exports;

M[MobileCaptchaFailCode.INCORRECT_MOBILE_CAPTCHA] = '发送验证码失败';
M[MobileCaptchaFailCode.SEND_MOBILE_CAPTCHA_FAIL] = '验证码错误';

M[OrderFailCode.FAIL_CD_CREATE_WECHAT_PAY_ORDER_FAIL] = '创建微信支付订单失败';
M[OrderFailCode.FAIL_CD_NO_SUCH_ORDER] = '订单不存在';
M[OrderFailCode.FAIL_CD_ORDER_STATUS_NOT_BE_UNPAID] = '订单不是未支付状态';

M[RestJsonRpcFailCode.NO_SUCH_PROCESS] = '过程不存在';
M[RestJsonRpcFailCode.NOT_SPECIFIED_PROCESS] = '没有指定过程名';

M[UserFailCode.CANNOT_DELETE_SPONSOR_MANAGER] = '不能删除主办方管理员';
M[UserFailCode.DUPLICATE_USER_NAME] = '用户名重复';
M[UserFailCode.GRANTER_NO_THESE_PERMISSIONS] = '授权人没有相应的权限';
M[UserFailCode.INCORRECT_PASSWORD] = '密码不正确';
M[UserFailCode.INVALID_USER_KIND] = '用户类型无效';
M[UserFailCode.NO_SUCH_USER] = '用户不存在';
M[UserFailCode.PERMISSION_DENIED] = '用户没有权限操作资源';
M[UserFailCode.RESOURCE_NOT_BELONG_TO_CURRENT_USER] = '资源不隶属该用户';
