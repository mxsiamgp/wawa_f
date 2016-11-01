<template>
    <group title="我的账户">
        <cell title="基本信息" is-link v-link="{ path: '/console/user/wechat/update' }"></cell>
        <cell title="修改密码" is-link v-link="{ path: '/console/user/wechat/update-password' }"></cell>
    </group>
</template>
<script>
    export default {};
</script>
